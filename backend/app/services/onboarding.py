from bson import ObjectId
from app.core.database import db
from app.schemas.onboarding import OnboardingBase, LeadCreate
from datetime import datetime

async def get_onboarding_by_user(user_id: str):
    onboarding = await db.onboarding.find_one({"user_id": user_id})
    if onboarding:
        onboarding["id"] = str(onboarding.pop("_id"))
    return onboarding

async def create_onboarding(user_id: str, method: str):
    onboarding_data = {
        "user_id": user_id,
        "method": method,
        "steps_completed": [],
        "last_updated": datetime.utcnow()
    }
    result = await db.onboarding.insert_one(onboarding_data)
    return await get_onboarding_by_user(user_id)

async def update_onboarding_step(user_id: str, step_id: str):
    await db.onboarding.update_one(
        {"user_id": user_id},
        {
            "$addToSet": {"steps_completed": step_id},
            "$set": {"last_updated": datetime.utcnow()}
        }
    )
    return await get_onboarding_by_user(user_id)

async def create_lead(user_id: str, lead: LeadCreate):
    lead_data = lead.model_dump()
    lead_data["user_id"] = user_id
    lead_data["status"] = "new"
    lead_data["created_at"] = datetime.utcnow()
    
    result = await db.leads.insert_one(lead_data)
    created_lead = await db.leads.find_one({"_id": result.inserted_id})
    created_lead["id"] = str(created_lead.pop("_id"))
    return created_lead
