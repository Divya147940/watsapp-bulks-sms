from pydantic import BaseModel, Field
from typing import Optional, List

class ChatbotConfigBase(BaseModel):
    agent_name: str = "WhatsApp Assistant"
    business_description: str
    tone: str = "Professional"
    temperature: float = 0.7
    welcome_message: str = "Hi! How can I help you today?"
    custom_prompts: List[str] = []

class ChatbotConfigUpdate(ChatbotConfigBase):
    pass

class ChatbotConfigInDB(ChatbotConfigBase):
    user_id: str

class WhatsAppConfigBase(BaseModel):
    phone_number_id: str
    waba_id: str
    business_name: Optional[str] = None

class WhatsAppConfigCreate(WhatsAppConfigBase):
    access_token: str

class WhatsAppConfigInDB(WhatsAppConfigBase):
    user_id: str
    access_token: Optional[str] = None
    is_verified: bool = False
    api_key: Optional[str] = None
