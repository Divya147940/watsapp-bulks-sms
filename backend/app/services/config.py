from bson import ObjectId
from app.core.database import db
from app.schemas.config import ChatbotConfigUpdate, WhatsAppConfigCreate
from app.core.security import encrypt_token, decrypt_token
from datetime import datetime
import secrets

async def get_chatbot_config(user_id: str):
    config = await db.chatbot_configs.find_one({"user_id": user_id})
    if config:
        config["id"] = str(config.pop("_id"))
    return config

async def update_chatbot_config(user_id: str, config: ChatbotConfigUpdate):
    config_data = config.model_dump()
    await db.chatbot_configs.update_one(
        {"user_id": user_id},
        {"$set": config_data},
        upsert=True
    )
    return await get_chatbot_config(user_id)

async def get_whatsapp_config(user_id: str):
    config = await db.whatsapp_configs.find_one({"user_id": user_id})
    if config:
        config["id"] = str(config.pop("_id"))
        if "access_token" in config:
            config["access_token"] = decrypt_token(config["access_token"])
    return config

async def save_whatsapp_config(user_id: str, config: WhatsAppConfigCreate):
    config_data = config.model_dump()
    config_data["user_id"] = user_id
    config_data["is_verified"] = True # Mocking auto-verify
    config_data["api_key"] = f"sk_live_{secrets.token_hex(8)}"
    
    # Encrypt sensitive token
    if "access_token" in config_data:
        config_data["access_token"] = encrypt_token(config_data["access_token"])
        
    await db.whatsapp_configs.update_one(
        {"user_id": user_id},
        {"$set": config_data},
        upsert=True
    )
    return await get_whatsapp_config(user_id)
