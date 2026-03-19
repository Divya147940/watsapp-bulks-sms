from bson import ObjectId
from app.core.database import db
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from datetime import datetime

async def get_user_by_email(email: str):
    return await db.users.find_one({"email": email})

async def create_user(user: UserCreate):
    user_data = user.model_dump()
    user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
    user_data["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_data)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user.pop("_id"))
    return created_user

async def get_user_by_id(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user["id"] = str(user.pop("_id"))
    return user
