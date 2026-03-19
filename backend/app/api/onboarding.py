from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.onboarding import OnboardingInDB, LeadCreate, LeadInDB
from app.services import onboarding as onboarding_service
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/status", response_model=OnboardingInDB)
async def get_status(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user.get("_id") or current_user.get("id"))
    status = await onboarding_service.get_onboarding_by_user(user_id)
    if not status:
        # Initialize default status if not exists
        return await onboarding_service.create_onboarding(user_id, "selection")
    return status

@router.post("/choice")
async def set_choice(method: str, current_user: dict = Depends(get_current_user)):
    return await onboarding_service.create_onboarding(str(current_user["_id"]), method)

@router.post("/lead", response_model=LeadInDB)
async def submit_lead(lead: LeadCreate, current_user: dict = Depends(get_current_user)):
    return await onboarding_service.create_lead(str(current_user["_id"]), lead)

@router.patch("/step/{step_id}")
async def update_step(step_id: str, current_user: dict = Depends(get_current_user)):
    return await onboarding_service.update_onboarding_step(str(current_user["_id"]), step_id)
