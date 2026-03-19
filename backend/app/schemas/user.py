from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenPayload(BaseModel):
    sub: Optional[str] = None
