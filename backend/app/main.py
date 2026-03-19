from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import db, close_db_connection
from app.api.router import api_router
from motor.motor_asyncio import AsyncIOMotorClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB")
    yield
    # Shutdown
    await close_db_connection()
    print("Disconnected from MongoDB")

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to WhatsApp Bulk SMS API"}
