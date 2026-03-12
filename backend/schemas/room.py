from pydantic import BaseModel
from datetime import datetime

class RoomCreate(BaseModel):
    name: str
    description: str | None = None
    is_private: bool = False
    password: str | None = None

class RoomJoin(BaseModel):
    room_name: str
    password: str

class RoomResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_private: bool
    invite_code: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True