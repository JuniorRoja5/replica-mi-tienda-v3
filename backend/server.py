from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Test route to debug API router
@api_router.get("/test")
async def test_route():
    return {"message": "API router is working"}

# Include the router in the main app
app.include_router(api_router)

# Serve dashboard directly from backend
@app.get("/dashboard")
async def serve_dashboard():
    dashboard_path = Path(__file__).parent.parent / "frontend" / "public" / "dashboard.html"
    return FileResponse(dashboard_path, media_type="text/html")

# Serve ingresos (income) page directly from backend
@app.get("/ingresos")
async def serve_ingresos():
    ingresos_path = Path(__file__).parent.parent / "frontend" / "public" / "ingresos.html"
    return FileResponse(ingresos_path, media_type="text/html")

# Serve diseno (design) page directly from backend
@app.get("/diseno")
async def serve_diseno():
    diseno_path = Path(__file__).parent.parent / "frontend" / "public" / "diseno.html"
    return FileResponse(diseno_path, media_type="text/html")

# Serve diseno (design) page via API route for Design-Mi Tienda integration
@api_router.get("/diseno")
async def serve_diseno_api():
    try:
        diseno_path = Path(__file__).parent.parent / "frontend" / "public" / "diseno.html"
        logger.info(f"Serving diseno from: {diseno_path}")
        if not diseno_path.exists():
            logger.error(f"Diseno file not found at: {diseno_path}")
            return {"error": "File not found"}
        return FileResponse(diseno_path, media_type="text/html")
    except Exception as e:
        logger.error(f"Error serving diseno: {e}")
        return {"error": str(e)}

# Serve mi-tienda page via API route for Design-Mi Tienda integration
@api_router.get("/mi-tienda")
async def serve_mi_tienda_api():
    try:
        mi_tienda_path = Path(__file__).parent.parent / "frontend" / "public" / "mi-tienda.html"
        logger.info(f"Serving mi-tienda from: {mi_tienda_path}")
        if not mi_tienda_path.exists():
            logger.error(f"Mi-tienda file not found at: {mi_tienda_path}")
            return {"error": "File not found"}
        return FileResponse(mi_tienda_path, media_type="text/html")
    except Exception as e:
        logger.error(f"Error serving mi-tienda: {e}")
        return {"error": str(e)}

# Mount static files for dashboard and ingresos assets
app.mount("/dashboard-assets", StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "public"), name="dashboard-assets")
app.mount("/ingresos-assets", StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "public"), name="ingresos-assets")
app.mount("/diseno-assets", StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "public"), name="diseno-assets")
app.mount("/mi-tienda-assets", StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "public"), name="mi-tienda-assets")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
