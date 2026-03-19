from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from typing import List
from app.schemas.contact import ContactCreate, ContactInDB, ContactUploadResponse, BulkContactCreate
from app.schemas.user import UserInDB
from app.services import contact as contact_service
from app.api.deps import get_current_user
import io
import pandas as pd
import json

router = APIRouter()

@router.get("/", response_model=List[ContactInDB])
async def read_contacts(
    skip: int = 0, 
    limit: int = 100, 
    current_user: UserInDB = Depends(get_current_user)
):
    # Ensure current_user is a dictionary since deps.py returns a dict from MongoDB
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    contacts = await contact_service.get_contacts(user_id=user_id, skip=skip, limit=limit)
    return contacts

@router.post("/", response_model=ContactInDB)
async def create_contact(
    contact: ContactCreate, 
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    created_contact = await contact_service.create_contact(user_id=user_id, contact=contact)
    if not created_contact:
        raise HTTPException(status_code=400, detail="Contact with this phone number already exists")
    return created_contact

@router.post("/batch", response_model=ContactUploadResponse)
async def create_contacts_batch(
    batch: BulkContactCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    success_count = 0
    error_count = 0
    errors = []
    
    for contact in batch.contacts:
        result = await contact_service.create_contact(user_id=user_id, contact=contact)
        if result:
            success_count += 1
        else:
            error_count += 1
            errors.append({"phone": contact.phone_number, "error": "Duplicate or invalid"})
            
    return ContactUploadResponse(
        success_count=success_count,
        error_count=error_count,
        errors=errors
    )

@router.post("/upload", response_model=ContactUploadResponse)
async def upload_contacts_file(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_user)
):
    import pandas as pd
    import json
    
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
            raise HTTPException(status_code=400, detail="Unsupported file format. Use CSV, Excel, or JSON.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")
        
    # Standardize columns: look for 'name' and 'phone_number' (case insensitive)
    df.columns = [c.lower().replace(' ', '_') for c in df.columns]
    
    if 'phone_number' not in df.columns:
        # Try to find common alternatives
        for alt in ['phone', 'mobile', 'number', 'tel']:
            if alt in df.columns:
                df.rename(columns={alt: 'phone_number'}, inplace=True)
                break
        else:
            raise HTTPException(status_code=400, detail="Missing 'phone_number' column")
            
    if 'name' not in df.columns:
        df['name'] = 'Unknown'
        
    success_count = 0
    error_count = 0
    errors = []
    
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    
    # Convert to numeric/string clean phone numbers
    df['phone_number'] = df['phone_number'].astype(str).str.replace(r'\D', '', regex=True)
    
    for _, row in df.iterrows():
        try:
            contact_in = ContactCreate(
                name=str(row.get('name', 'Unknown')),
                phone_number=str(row['phone_number']),
                tags=[t.strip() for t in str(row.get('tags', '')).split(',')] if pd.notna(row.get('tags')) else []
            )
            
            result = await contact_service.create_contact(user_id=user_id, contact=contact_in)
            if result:
                success_count += 1
            else:
                error_count += 1
                errors.append({"phone": str(row['phone_number']), "error": "Duplicate or invalid"})
        except Exception as e:
            error_count += 1
            errors.append({"row": str(row.to_dict()), "error": str(e)})
            
    return ContactUploadResponse(
        success_count=success_count,
        error_count=error_count,
        errors=errors
    )

@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user.id
    deleted = await contact_service.delete_contact(user_id=user_id, contact_id=contact_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}
