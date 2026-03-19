from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "WhatsApp Bulk SMS API"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "watsap_bulk_sms"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "your-secret-key-here"  # TODO: Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Security
    ENCRYPTION_KEY: str = ""
    CORS_ORIGINS: list[str] = ["*"] # Default to all, but allow override
    
    # Meta WhatsApp API
    WHATSAPP_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
