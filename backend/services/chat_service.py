from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.message import Message

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}
        self.typing_users: dict = {}

    async def connect(self, websocket, room_id: int, username: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append({
            "websocket": websocket,
            "username": username
        })

    def disconnect(self, websocket, room_id: int):
        if room_id in self.active_connections:
            self.active_connections[room_id] = [
                conn for conn in self.active_connections[room_id]
                if conn["websocket"] != websocket
            ]

    async def broadcast(self, message: dict, room_id: int):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection["websocket"].send_json(message)



    async def save_message(self, content: str, user_id: int, username: str, room_id: int, db: AsyncSession):
        message = Message(
            content=content,
            user_id=user_id,
            username=username,
            room_id=room_id
        )
        db.add(message)
        await db.commit()
        await db.refresh(message)
        return message

    async def get_message_history(self, room_id: int, db: AsyncSession):
        result = await db.execute(
            select(Message)
            .where(Message.room_id == room_id)
            .order_by(Message.created_at.asc())
        )
        return result.scalars().all()

manager = ConnectionManager()                