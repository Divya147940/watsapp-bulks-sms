from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TemplateVariable(BaseModel):
    name: str # e.g. "body_1"

class TemplateBase(BaseModel):
    name: str
    language: str # e.g., "en_US"
    category: str # e.g., "MARKETING"
    body: str

class TemplateCreate(TemplateBase):
    variables: Optional[List[TemplateVariable]] = []

class TemplateInDB(TemplateBase):
    id: str
    user_id: str
    created_at: datetime
    variables: List[TemplateVariable]
