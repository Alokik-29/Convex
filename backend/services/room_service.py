from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models.room import Room, generate_invite_code
from schemas.room import RoomCreate
from services.auth_service import hash_password, verify_password

async def create_room(room_data: RoomCreate, db: AsyncSession):
    result = await db.execute(select(Room).where(Room.name == room_data.name))
    existing_room = result.scalar_one_or_none()
    if existing_room:
        raise HTTPException(status_code=400, detail="Room already exists")

    hashed_room_password = None
    invite_code = None

    if room_data.is_private:
        if not room_data.password:
            raise HTTPException(status_code=400, detail="Private rooms need a password")
        hashed_room_password = hash_password(room_data.password)
        invite_code = generate_invite_code()

    new_room = Room(
        name=room_data.name,
        description=room_data.description,
        is_private=room_data.is_private,
        password=hashed_room_password,
        invite_code=invite_code
    )
    db.add(new_room)
    await db.commit()
    await db.refresh(new_room)
    return new_room

async def get_public_rooms(db: AsyncSession):
    result = await db.execute(select(Room).where(Room.is_private == False))
    return result.scalars().all()

async def get_room_by_id(room_id: int, db: AsyncSession):
    result = await db.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

async def join_private_room(room_name: str, password: str, db: AsyncSession):
    result = await db.execute(select(Room).where(Room.name == room_name, Room.is_private == True))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Private room not found")
    if not verify_password(password, room.password):
        raise HTTPException(status_code=403, detail="Wrong password")
    return room                      