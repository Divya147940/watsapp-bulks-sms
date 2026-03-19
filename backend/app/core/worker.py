from celery import Celery
from app.core.config import settings
from typing import Optional
import httpx
import asyncio

celery_app = Celery(
    "whatsapp_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_time_limit=300,  # Prevent hanging tasks
    task_soft_time_limit=240,
)

# Async helper to send whatsapp message
async def send_whatsapp_async(phone_number: str, template_name: Optional[str] = None, language_code: Optional[str] = None, message_body: Optional[str] = None):
    url = f"https://graph.facebook.com/v19.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    if template_name:
        # Payload for Template Message
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {
                    "code": language_code or "en_US"
                }
            }
        }
    else:
        # Payload for Free Text Message (Note: Requires active session with user)
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phone_number,
            "type": "text",
            "text": {
                "body": message_body
            }
        }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.status_code, response.json()

@celery_app.task(bind=True, max_retries=3)
def send_whatsapp_message(self, phone_number: str, template_name: Optional[str] = None, language_code: Optional[str] = None, message_body: Optional[str] = None, campaign_id: str = None, message_id: str = None):
    """
    Celery task to send a message via Meta WhatsApp API.
    """
    try:
        # Run async function in sync context
        status_code, response = asyncio.run(send_whatsapp_async(phone_number, template_name, language_code, message_body))
        
        # In a real scenario, we'd update the DB message status here independently or 
        # emit an event. For MVP, we return the result.
        if status_code not in (200, 201):
            raise Exception(f"WhatsApp API Error: {response}")
            
        return {"status": "success", "message_id": message_id, "meta_response": response}
    except Exception as exc:
        # Retry with exponential backoff on failure
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
