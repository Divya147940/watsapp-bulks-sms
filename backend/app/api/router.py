from fastapi import APIRouter
from . import auth, contacts, templates, messages, onboarding, config

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["Onboarding"])
api_router.include_router(config.router, prefix="/config", tags=["Configuration"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])
api_router.include_router(templates.router, prefix="/templates", tags=["Templates"])
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
