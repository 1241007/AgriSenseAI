from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.prediction import SoilRequest, SoilResponse
from app.db.models.prediction import Prediction, PredictionType
from app.db.models.soil_report import SoilReport
from app.models.soil import run_soil_prediction
from app.utils.cache import cache_get, cache_set, make_cache_key


from sqlalchemy import select
from sqlalchemy.orm import joinedload

async def predict_soil(request: SoilRequest, user_id: UUID, session: AsyncSession) -> SoilResponse:
    if request.report_id:
        query = select(SoilReport).options(joinedload(SoilReport.farm)).where(SoilReport.report_id == request.report_id)
        result = await session.execute(query)
        report = result.scalar_one_or_none()
        if not report:
            raise HTTPException(status_code=404, detail="Soil report not found")
        if report.farm.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this report")
        n = report.nitrogen_ppm or 0.0
        p = report.phosphorus_ppm or 0.0
        k = report.potassium_ppm or 0.0
        ph = report.ph_level or 7.0
        m = report.moisture_percent or 50.0
    elif request.inline_values:
        n = request.inline_values.nitrogen
        p = request.inline_values.phosphorus
        k = request.inline_values.potassium
        ph = request.inline_values.ph
        m = request.inline_values.moisture
    else:
        raise HTTPException(status_code=400, detail="Must provide report_id or inline_values")

    cache_key = make_cache_key("soil_pred", n=n, p=p, k=k, ph=ph, m=m)
    cached = await cache_get(cache_key)

    if not cached:
        prediction_result = run_soil_prediction(nitrogen=n, phosphorus=p, potassium=k, ph=ph, moisture=m)
        result_dict = {
            "soil_type": prediction_result.soil_type,
            "confidence": prediction_result.confidence,
            "deficiencies": prediction_result.deficiencies,
            "recommendations": prediction_result.recommendations
        }
        await cache_set(cache_key, result_dict)
        is_cached = False
    else:
        result_dict = cached
        is_cached = True
    
    # Save to db
    prediction = Prediction(
        user_id=user_id,
        prediction_type=PredictionType.soil,
        input_data={"nitrogen": n, "phosphorus": p, "potassium": k, "ph": ph, "moisture": m},
        result=result_dict
    )
    session.add(prediction)
    await session.commit()
    await session.refresh(prediction)

    return SoilResponse(
        soil_type=result_dict["soil_type"],
        confidence=result_dict["confidence"],
        deficiencies=result_dict["deficiencies"],
        recommendations=result_dict["recommendations"],
        prediction_id=prediction.prediction_id,
        cached=is_cached
    )
