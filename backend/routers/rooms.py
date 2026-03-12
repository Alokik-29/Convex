from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.room import RoomCreate, RoomResponse, RoomJoin
from services import room_service
from services.auth_service import get_current_user
from models.user import User
from models.message import Message
from sqlalchemy.future import select
from typing import List

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post("/", response_model=RoomResponse)
async def create_room(
    room_data: RoomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await room_service.create_room(room_data, db)

@router.get("/", response_model=List[RoomResponse])
async def get_rooms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await room_service.get_public_rooms(db)

@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await room_service.get_room_by_id(room_id, db)

@router.post("/join-private", response_model=RoomResponse)
async def join_private_room(
    join_data: RoomJoin,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await room_service.join_private_room(join_data.room_name, join_data.password, db)

@router.delete("/messages/{message_id}")
async def delete_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Message).where(Message.id == message_id))
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own messages")
    await db.delete(message)
    await db.commit()
    return {"success": True}