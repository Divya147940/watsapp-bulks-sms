from fastapi import APIRouter
from app.api import auth, contacts, templates, messages

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])
api_router.include_router(templates.router, prefix="/templates", tags=["Templates"])
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
