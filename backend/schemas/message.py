from pydantic import BaseModel
from datetime import datetime

class MessageResponse(BaseModel):
    id: int
    content: str
    username: str
    room_id: int
    created_at: datetime

    class Config:
        from_attributes = True