from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.template import TemplateCreate, TemplateInDB
from app.schemas.user import UserInDB
from app.services import template as template_service
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TemplateInDB])
async def read_templates(
    skip: int = 0, 
    limit: int = 100, 
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    templates = await template_service.get_templates(user_id=user_id, skip=skip, limit=limit)
    return templates

@router.post("/", response_model=TemplateInDB)
async def create_template(
    template: TemplateCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    created = await template_service.create_template(user_id=user_id, template=template)
    if not created:
        raise HTTPException(status_code=400, detail="Template with this name already exists")
    return created

@router.delete("/{template_id}")
async def delete_template(
    template_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    deleted = await template_service.delete_template(user_id=user_id, template_id=template_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}
