from bson import ObjectId
from app.core.database import db
from app.schemas.contact import ContactCreate
from typing import List
from datetime import datetime

async def get_contacts(user_id: str, skip: int = 0, limit: int = 100):
    cursor = db.contacts.find({"user_id": user_id}).skip(skip).limit(limit)
    contacts = await cursor.to_list(length=limit)
    for c in contacts:
        c["id"] = str(c.pop("_id"))
    return contacts

async def create_contact(user_id: str, contact: ContactCreate):
    contact_data = contact.model_dump()
    contact_data["user_id"] = user_id
    contact_data["created_at"] = datetime.utcnow()
    
    # Check for existing contact with same phone number for this user
    existing = await db.contacts.find_one({
        "user_id": user_id, 
        "phone_number": contact.phone_number
    })
    
    if existing:
        return None # Indicate duplicate
        
    result = await db.contacts.insert_one(contact_data)
    created = await db.contacts.find_one({"_id": result.inserted_id})
    created["id"] = str(created.pop("_id"))
    return created

async def delete_contact(user_id: str, contact_id: str):
    result = await db.contacts.delete_one({
        "_id": ObjectId(contact_id),
        "user_id": user_id
    })
    return result.deleted_count > 0
