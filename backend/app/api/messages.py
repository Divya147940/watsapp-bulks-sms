from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from typing import List, Optional, Dict, Any
from app.schemas.message import BulkMessageRequest, MessageCampaign, QuickSendResponse
from app.schemas.user import UserInDB
from app.services import message as message_service
from app.services import contact as contact_service
from app.api.deps import get_current_user
import pandas as pd
import io
import json

router = APIRouter()

@router.post("/send-bulk")
async def send_bulk_messages(
    request: BulkMessageRequest,
    background_tasks: BackgroundTasks,
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    
    # Create campaign in DB
    campaign_id = await message_service.create_campaign(
        user_id=user_id,
        template_id=request.template_id,
        contact_ids=request.contact_ids
    )
    
    # Dispatch to queue in background
    background_tasks.add_task(message_service.dispatch_campaign, campaign_id, user_id)
    
    return {"message": "Campaign started successfully", "campaign_id": campaign_id}

@router.post("/quick-send", response_model=QuickSendResponse)
async def quick_send_messages(
    background_tasks: BackgroundTasks,
    message: str = Form(...),
    manual_numbers: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    recipients = [] # List of {"phone": "...", "name": "..."}
    seen_phones = set()

    def add_recipient(phone, name="Customer"):
        clean_num = "".join(filter(str.isdigit, str(phone)))
        if clean_num and clean_num not in seen_phones:
            recipients.append({"phone": clean_num, "name": name or "Customer"})
            seen_phones.add(clean_num)
    
    # 1. Process Manual Numbers (Format: Name, Phone OR just Phone)
    if manual_numbers:
        lines = [n.strip() for n in manual_numbers.replace('\n', '|').split('|') if n.strip()]
        for line in lines:
            if ',' in line:
                parts = [p.strip() for p in line.split(',')]
                name = parts[0]
                phone = parts[1]
                add_recipient(phone, name)
            else:
                add_recipient(line)
                
    # 2. Process File
    if file:
        filename = file.filename.lower()
        content = await file.read()
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            elif filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(content))
            elif filename.endswith('.json'):
                data = json.loads(content.decode('utf-8'))
                df = pd.DataFrame(data)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format")
            
            df.columns = [c.lower().replace(' ', '_') for c in df.columns]
            
            # Find phone and name columns
            phone_col = next((c for c in ['phone_number', 'phone', 'mobile', 'number', 'tel'] if c in df.columns), None)
            name_col = next((c for c in ['name', 'recipient_name', 'customer_name', 'full_name', 'first_name'] if c in df.columns), None)
            
            if phone_col:
                for _, row in df.iterrows():
                    add_recipient(row[phone_col], row[name_col] if name_col else "Customer")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

    if not recipients:
        raise HTTPException(status_code=400, detail="No valid recipient numbers found")

    # 3. Create Quick Campaign
    campaign_id = await message_service.create_quick_campaign(
        user_id=user_id,
        message_body=message,
        recipients=recipients
    )
    
    # 4. Dispatch to queue
    background_tasks.add_task(message_service.dispatch_campaign, campaign_id, user_id)
    
    return QuickSendResponse(
        message="Quick campaign started",
        campaign_id=campaign_id,
        success_count=len(recipients),
        error_count=0
    )


@router.get("/campaigns")
async def get_user_campaigns(current_user: UserInDB = Depends(get_current_user)):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    campaigns = await message_service.get_campaigns(user_id=user_id)
    return campaigns

@router.get("/campaigns/{campaign_id}/messages")
async def get_campaign_details(
    campaign_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    messages = await message_service.get_campaign_messages(campaign_id=campaign_id, user_id=user_id)
    return messages
