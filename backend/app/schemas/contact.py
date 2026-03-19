from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone_number: str = Field(..., pattern=r"^\+?[1-9]\d{1,14}$")
    tags: Optional[List[str]] = []
    metadata: Optional[Dict[str, str]] = {}

class ContactCreate(ContactBase):
    pass

class BulkContactCreate(BaseModel):
    contacts: List[ContactCreate]

class ContactInDB(ContactBase):
    id: str
    user_id: str
    created_at: datetime
    
class ContactUploadResponse(BaseModel):
    success_count: int
    error_count: int
    errors: List[Dict[str, str]]
