from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SetupMethod(str, Enum):
    SELF_SERVICE = "self-service"
    ASSISTED = "assisted"
    SELECTION = "selection"

class OnboardingStatus(str, Enum):
    PENDING = "pending"
    CHOICE = "choice"
    SELF = "self"
    ASSISTED = "assisted"
    COMPLETED = "completed"

class OnboardingBase(BaseModel):
    method: Optional[SetupMethod] = None
    steps_completed: List[str] = []

class OnboardingUpdate(OnboardingBase):
    pass

class OnboardingInDB(OnboardingBase):
    user_id: str
    last_updated: datetime

class LeadCreate(BaseModel):
    business_name: str
    website: HttpUrl
    email: EmailStr
    use_case: str

class LeadInDB(LeadCreate):
    id: str
    user_id: str
    status: str = "new"
    assigned_expert_id: Optional[str] = None
    created_at: datetime
