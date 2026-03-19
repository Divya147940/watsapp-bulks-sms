from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ContactBase(BaseModel):
    name: str
    phone_number: str
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
