from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from app.dependencies import get_current_user, get_db
from app.db.redis import get_redis
from app.db.models.user import User
from app.schemas.prediction import SoilRequest, SoilResponse
from app.services.prediction_service import predict_soil_service

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/soil", response_model=SoilResponse)
async def predict_soil(
    request: SoilRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    try:
        inline_dict = request.inline_values.model_dump() if request.inline_values else None
        result = await predict_soil_service(
            user_id=current_user.id,
            session=db,
            redis=redis,
            report_id=request.report_id,
            inline_values=inline_dict
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Prediction failed")
