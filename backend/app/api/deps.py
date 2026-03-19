from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.services.user import get_user_by_id
from app.schemas.user import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/auth/login")

async def get_current_user():
    # Auth disabled for simplicity as requested by user
    return {"id": "default_user", "email": "admin@example.com", "is_active": True}