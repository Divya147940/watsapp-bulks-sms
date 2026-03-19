from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserInDB, Token
from app.services import user as user_service
from app.core import security
from app.core.config import settings
from datetime import timedelta

router = APIRouter()

@router.post("/signup", response_model=UserInDB)
async def signup(user: UserCreate):
    existing_user = await user_service.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return await user_service.create_user(user)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_service.get_user_by_email(form_data.username)
    if not user or not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    user_id = str(user["_id"])
    access_token = security.create_access_token(
        subject=user_id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
