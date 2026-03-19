from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from app.schemas.template import TemplateVariable

class MessageStatus(BaseModel):
    message_id: str
    recipient: str
    status: str # e.g., 'pending', 'sent', 'delivered', 'failed'
    error: Optional[str] = None
    updated_at: datetime = datetime.utcnow()

class BulkMessageRequest(BaseModel):
    template_id: str
    contact_ids: List[str]
    # Optional dynamic variables passed per contact or globally
    # simplified for MVP: global template variables mapped to contact data if needed
    
class MessageCampaign(BaseModel):
    id: str
    user_id: str
    template_id: Optional[str] = None
    message_body: Optional[str] = None
    total_messages: int
    status: str # 'pending', 'processing', 'completed'
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuickSendResponse(BaseModel):
    message: str
    campaign_id: str
    success_count: int
    error_count: int

