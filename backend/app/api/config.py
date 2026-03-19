from fastapi import APIRouter, Depends, HTTPException
from app.schemas.config import ChatbotConfigBase, ChatbotConfigInDB, WhatsAppConfigCreate, WhatsAppConfigInDB
from app.services import config as config_service
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/chatbot", response_model=ChatbotConfigInDB)
async def get_chatbot(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user.get("_id") or current_user.get("id"))
    config = await config_service.get_chatbot_config(user_id)
    if not config:
        raise HTTPException(status_code=404, detail="Chatbot config not found")
    return config

@router.put("/chatbot")
async def update_chatbot(config: ChatbotConfigBase, current_user: dict = Depends(get_current_user)):
    return await config_service.update_chatbot_config(str(current_user["_id"]), config)

@router.get("/whatsapp", response_model=WhatsAppConfigInDB)
async def get_whatsapp(current_user: dict = Depends(get_current_user)):
    config = await config_service.get_whatsapp_config(str(current_user["_id"]))
    if not config:
        raise HTTPException(status_code=404, detail="WhatsApp config not found")
    return config

@router.post("/whatsapp")
async def save_whatsapp(config: WhatsAppConfigCreate, current_user: dict = Depends(get_current_user)):
    return await config_service.save_whatsapp_config(str(current_user["_id"]), config)
