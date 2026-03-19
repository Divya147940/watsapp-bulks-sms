from bson import ObjectId
from app.core.database import db
from app.core.worker import send_whatsapp_message
from datetime import datetime
import asyncio

async def create_campaign(user_id: str, template_id: str, contact_ids: list):
    campaign_data = {
        "user_id": user_id,
        "template_id": template_id,
        "total_messages": len(contact_ids),
        "status": "processing",
        "created_at": datetime.utcnow()
    }
    result = await db.campaigns.insert_one(campaign_data)
    campaign_id = str(result.inserted_id)
    
    # Store individual message statuses
    messages = []
    for cid in contact_ids:
        msg = {
            "campaign_id": campaign_id,
            "user_id": user_id,
            "contact_id": cid,
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        messages.append(msg)
    
    if messages:
        await db.messages.insert_many(messages)
        
    return campaign_id

async def create_quick_campaign(user_id: str, message_body: str, recipients: list):
    """
    recipients: List of dicts like {"phone": "...", "name": "..."}
    """
    campaign_data = {
        "user_id": user_id,
        "message_body": message_body,
        "total_messages": len(recipients),
        "status": "processing",
        "created_at": datetime.utcnow()
    }
    result = await db.campaigns.insert_one(campaign_data)
    campaign_id = str(result.inserted_id)
    
    # Store individual message statuses with phone numbers and names
    messages = []
    for r in recipients:
        msg = {
            "campaign_id": campaign_id,
            "user_id": user_id,
            "phone_number": r["phone"],
            "recipient_name": r.get("name") or "Customer",
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        messages.append(msg)
    
    if messages:
        await db.messages.insert_many(messages)
        
    return campaign_id

async def dispatch_campaign(campaign_id: str, user_id: str):
    campaign = await db.campaigns.find_one({"_id": ObjectId(campaign_id), "user_id": user_id})
    if not campaign:
        return
        
    # Check if template or free text
    template = None
    if campaign.get("template_id"):
        template = await db.templates.find_one({"_id": ObjectId(campaign["template_id"])})
        
    messages_cursor = db.messages.find({"campaign_id": campaign_id})
    messages = await messages_cursor.to_list(length=None)
    
    for msg in messages:
        phone = msg.get("phone_number")
        if not phone and msg.get("contact_id"):
            contact = await db.contacts.find_one({"_id": ObjectId(msg["contact_id"])})
            if contact:
                phone = contact.get("phone_number")
                msg["recipient_name"] = contact.get("name", "Customer")
        
        if phone:
            clean_phone = ''.join(filter(str.isdigit, str(phone)))
            recipient_name = msg.get("recipient_name", "Customer").strip()
            first_name = recipient_name.split(' ')[0]
            
            # Send to Celery Queue
            if template:
                send_whatsapp_message.delay(
                    phone_number=clean_phone,
                    template_name=template["name"],
                    language_code=template["language"],
                    campaign_id=campaign_id,
                    message_id=str(msg["_id"])
                    # Variable substitution for templates usually handled by Meta variables, 
                    # but simple text substitution is what we use for BODY messages below
                )
            else:
                # Free text send with body replacement
                body = campaign.get("message_body", "")
                # Personalization: replace {name}, {firstname} etc
                final_body = body.replace("{name}", recipient_name).replace("{firstname}", first_name)
                
                send_whatsapp_message.delay(
                    phone_number=clean_phone,
                    message_body=final_body,
                    campaign_id=campaign_id,
                    message_id=str(msg["_id"])
                )
            
            # Update DB status to queued
            await db.messages.update_one(
                {"_id": msg["_id"]},
                {"$set": {"status": "queued", "updated_at": datetime.utcnow()}}
            )

async def get_campaigns(user_id: str):
    cursor = db.campaigns.find({"user_id": user_id}).sort("created_at", -1)
    campaigns = await cursor.to_list(length=100)
    for c in campaigns:
        c["id"] = str(c.pop("_id"))
    return campaigns

async def get_campaign_messages(campaign_id: str, user_id: str):
    cursor = db.messages.find({"campaign_id": campaign_id, "user_id": user_id})
    messages = await cursor.to_list(length=1000)
    for m in messages:
        m["id"] = str(m.pop("_id"))
    return messages
