from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog
from app.config import settings
from app.utils.errors import ApiError, api_error_handler
from app.api.v1.auth import router as auth_router
from app.api.v1.farms import router as farms_router
from app.api.v1.soil_reports import router as soil_reports_router
from app.api.v1.crop_history import router as crop_history_router
from app.api.v1.predictions import router as predictions_router
from app.models.loader import MODEL_REGISTRY
logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize things here like Redis
    logger.info("Starting up AgriAI Backend")
    MODEL_REGISTRY.load_soil_model()
    yield
    logger.info("Shutting down AgriAI Backend")

app = FastAPI(
    title="AgriAI API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(ApiError, api_error_handler)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(farms_router, prefix="/api/v1")
app.include_router(soil_reports_router, prefix="/api/v1")
app.include_router(crop_history_router, prefix="/api/v1")
app.include_router(predictions_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
