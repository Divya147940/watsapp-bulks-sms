from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import db, close_db_connection
from app.api.router import api_router
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.logging import setup_logging, logger
from fastapi import Request
from fastapi.responses import JSONResponse
import time
import traceback

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    await db.create_indexes()
    logger.info("Connected to MongoDB and initialized indexes")
    yield
    # Shutdown
    await close_db_connection()
    print("Disconnected from MongoDB")

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to WhatsApp Bulk SMS API"}
