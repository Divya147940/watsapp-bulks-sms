from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

    def __getattr__(self, name):
        return self.client[settings.DATABASE_NAME][name]

    async def create_indexes(self):
        # Users collection indexes
        await self.client[settings.DATABASE_NAME].users.create_index("email", unique=True)
        await self.client[settings.DATABASE_NAME].users.create_index("mobile_number", unique=True)
        
        # Onboarding collection indexes
        await self.client[settings.DATABASE_NAME].onboarding_progress.create_index("user_id", unique=True)
        
        # WhatsApp Config indexes
        await self.client[settings.DATABASE_NAME].whatsapp_configs.create_index("user_id", unique=True)

db = Database()

async def close_db_connection():
    if db.client:
        db.client.close()
