from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.chat_service import manager
from jose import jwt, JWTError
from config import settings
from models.user import User
from models.message import Message
from sqlalchemy.future import select

router = APIRouter()

async def get_user_from_token(token: str, db: AsyncSession):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        result = await db.execute(select(User).where(User.id == int(user_id)))
        return result.scalar_one_or_none()
    except JWTError:
        return None

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: int,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_token(token, db)
    if not user:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, room_id, user.username)

    history = await manager.get_message_history(room_id, db)
    for msg in history:
        await websocket.send_json({
            "type": "message",
            "id": msg.id,
            "username": msg.username,
            "content": msg.content,
            "created_at": msg.created_at.isoformat()
        })

    await manager.broadcast({
        "type": "system",
        "content": f"{user.username} joined the room"
    }, room_id)

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "message":
                msg = await manager.save_message(
                    content=data["content"],
                    user_id=user.id,
                    username=user.username,
                    room_id=room_id,
                    db=db
                )
                await manager.broadcast({
                    "type": "message",
                    "id": msg.id,
                    "username": user.username,
                    "content": data["content"],
                    "created_at": msg.created_at.isoformat()
                }, room_id)

            elif data["type"] == "typing":
                await manager.broadcast({
                    "type": "typing",
                    "username": user.username
                }, room_id)

            elif data["type"] == "reaction":
                await manager.broadcast({
                    "type": "reaction",
                    "username": user.username,
                    "message_id": data["message_id"],
                    "emoji": data["emoji"]
                }, room_id)

            elif data["type"] == "delete_message":
                result = await db.execute(
                    select(Message).where(
                        Message.id == data["message_id"],
                        Message.user_id == user.id
                    )
                )
                message = result.scalar_one_or_none()
                if message:
                    await db.delete(message)
                    await db.commit()
                    await manager.broadcast({
                        "type": "delete_message",
                        "message_id": data["message_id"]
                    }, room_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast({
            "type": "system",
            "content": f"{user.username} left the room"
        }, room_id)