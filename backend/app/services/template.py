from bson import ObjectId
from app.core.database import db
from app.schemas.template import TemplateCreate
from datetime import datetime
from typing import List

async def get_templates(user_id: str, skip: int = 0, limit: int = 100):
    cursor = db.templates.find({"user_id": user_id}).skip(skip).limit(limit)
    templates = await cursor.to_list(length=limit)
    for t in templates:
        t["id"] = str(t.pop("_id"))
    return templates

async def create_template(user_id: str, template: TemplateCreate):
    template_data = template.model_dump()
    template_data["user_id"] = user_id
    template_data["created_at"] = datetime.utcnow()
    
    # Check if a template with the same name exists for this user
    existing = await db.templates.find_one({
        "user_id": user_id,
        "name": template.name
    })
    if existing:
        return None
        
    result = await db.templates.insert_one(template_data)
    created = await db.templates.find_one({"_id": result.inserted_id})
    created["id"] = str(created.pop("_id"))
    return created

async def delete_template(user_id: str, template_id: str):
    result = await db.templates.delete_one({
        "_id": ObjectId(template_id),
        "user_id": user_id
    })
    return result.deleted_count > 0
