from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base
import random
import string

def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    is_private = Column(Boolean, default=False)
    password = Column(String, nullable=True)
    invite_code = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())