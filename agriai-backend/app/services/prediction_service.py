from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from redis.asyncio import Redis
from app.db.models.prediction import Prediction, PredictionType
from app.db.models.soil_report import SoilReport
from app.models.soil import analyze_soil
from app.utils.cache import make_cache_key, cache_get, cache_set
from app.config import settings
from typing import Optional, Dict, Any
import uuid

async def predict_soil_service(
    user_id: uuid.UUID,
    session: AsyncSession,
    redis: Redis,
    report_id: Optional[uuid.UUID] = None,
    inline_values: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    # 1. Resolve soil values
    if report_id:
        result = await session.execute(select(SoilReport).where(SoilReport.id == report_id))
        report = result.scalar_one_or_none()
        if not report:
            raise ValueError("Soil report not found")
        inputs = {
            "n": report.nitrogen,
            "p": report.phosphorus,
            "k": report.potassium,
            "ph": report.ph,
            "moisture": report.moisture
        }
    elif inline_values:
        inputs = inline_values
    else:
        raise ValueError("Either report_id or inline_values must be provided")

    # 2. Check cache
    cache_key = make_cache_key("soil_predict", **inputs)
    cached_res = await cache_get(redis, cache_key)
    if cached_res:
        return cached_res

    # 3. Run model inference
    analysis = analyze_soil(**inputs)

    # 4. Save to predictions table
    prediction = Prediction(
        user_id=user_id,
        prediction_type=PredictionType.SOIL,
        inputs=inputs,
        result=analysis,
        model_id=settings.SOIL_MODEL_ID,
        confidence=analysis["confidence"]
    )
    session.add(prediction)
    await session.commit()

    # 5. Cache result
    await cache_set(redis, cache_key, analysis)

    return analysis
