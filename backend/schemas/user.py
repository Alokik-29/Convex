from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    username:str
    email:str
    is_active:bool
    created_at:datetime

    class Confing:
        from_attributes=True

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    user_id: int|None=None
    