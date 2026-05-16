from fastapi import APIRouter, Depends, Query, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from uuid import UUID

from app.dependencies import get_current_user, get_db
from app.schemas.prediction import SoilRequest, SoilResponse, FertilizerRequest, FertilizerResponse, DiseaseResponse
from app.services.prediction_service import predict_soil, predict_fertilizer, predict_disease
from app.db.models.user import User
from app.utils.image_utils import validate_image, validate_size

router = APIRouter(prefix="/predict", tags=["Predictions"])


@router.post("/soil", response_model=SoilResponse)
async def predict_soil_route(
    request: SoilRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
    async_req: bool = Query(False, alias="async", description="Run asynchronously via Celery (not yet implemented)"),
):
    return await predict_soil(request, current_user.user_id, session)


@router.post("/fertilizer", response_model=FertilizerResponse)
async def predict_fertilizer_route(
    request: FertilizerRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    return await predict_fertilizer(request, current_user.user_id, session)


@router.post("/disease", response_model=DiseaseResponse)
async def predict_disease_route(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
    file: UploadFile = File(...),
):
    # Validation
    validate_image(file)
    validate_size(file, max_mb=10)
    
    return await predict_disease(file, current_user.user_id, session)
