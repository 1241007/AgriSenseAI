from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from uuid import UUID

from app.dependencies import get_current_user, get_db
from app.schemas.prediction import SoilRequest, SoilResponse, CropRequest, CropResponse
from app.services.prediction_service import predict_soil, predict_crop
from app.db.models.user import User

router = APIRouter(prefix="/predict", tags=["Predictions"])


@router.post("/soil", response_model=SoilResponse)
async def predict_soil_route(
    request: SoilRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
    async_req: bool = Query(False, alias="async", description="Run asynchronously via Celery (not yet implemented)"),
):
    return await predict_soil(request, current_user.user_id, session)


@router.post("/crop", response_model=CropResponse)
async def predict_crop_route(
    request: CropRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
):
    return await predict_crop(request, current_user.user_id, session)
