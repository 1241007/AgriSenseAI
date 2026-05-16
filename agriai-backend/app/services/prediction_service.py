from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.prediction import SoilRequest, SoilResponse, CropRequest, CropResponse, RecommendedCrop
from app.db.models.prediction import Prediction, PredictionType
from app.db.models.soil_report import SoilReport
from app.db.models.farm import Farm
from app.models.soil import run_soil_prediction
from app.models.crop import predict_crop_llm
from app.services.crop_rules_engine import get_rule_based_recommendations
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


async def predict_crop(request: CropRequest, user_id: UUID, session: AsyncSession) -> CropResponse:
    # 1. Fetch Soil Data
    if request.soil_report_id:
        query = select(SoilReport).options(joinedload(SoilReport.farm)).where(SoilReport.report_id == request.soil_report_id)
        result = await session.execute(query)
        report = result.scalar_one_or_none()
        if not report:
            raise HTTPException(status_code=404, detail="Soil report not found")
        if report.farm.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this report")
        
        soil_data = {
            "N": report.nitrogen_ppm or 0.0,
            "P": report.phosphorus_ppm or 0.0,
            "K": report.potassium_ppm or 0.0,
            "ph": report.ph_level or 7.0,
            "moisture": report.moisture_percent or 50.0
        }
    else:
        # For now, we require a soil report for crop recommendation
        raise HTTPException(status_code=400, detail="soil_report_id is required for crop recommendation")

    # 2. Get Farm/Region context
    region = "Unknown"
    if request.farm_id:
        query = select(Farm).where(Farm.farm_id == request.farm_id, Farm.user_id == user_id)
        result = await session.execute(query)
        farm = result.scalar_one_or_none()
        if farm:
            region = farm.region or "Unknown"

    # 3. Cache Check
    previous_crops = [request.previous_crop] if request.previous_crop else []
    cache_key = make_cache_key("crop_pred", soil=soil_data, season=request.season, pc=previous_crops)
    cached = await cache_get(cache_key)

    if cached:
        result_dict = cached
        is_cached = True
    else:
        try:
            # Try LLM-based recommendation
            result_dict = await predict_crop_llm(
                soil_data=soil_data,
                region=region,
                season=request.season,
                previous_crops=previous_crops
            )
            is_cached = False
        except Exception:
            # Fallback to Rule-based recommendation
            result_dict = get_rule_based_recommendations(
                soil_data=soil_data,
                season=request.season,
                previous_crops=previous_crops
            )
            is_cached = False
        
        await cache_set(cache_key, result_dict)

    # 4. Save Prediction to DB
    prediction = Prediction(
        user_id=user_id,
        prediction_type=PredictionType.crop,
        input_data={
            "soil_report_id": str(request.soil_report_id),
            "farm_id": str(request.farm_id) if request.farm_id else None,
            "season": request.season,
            "previous_crop": request.previous_crop
        },
        result=result_dict
    )
    session.add(prediction)
    await session.commit()
    await session.refresh(prediction)

    return CropResponse(
        recommended_crops=[RecommendedCrop(**c) for c in result_dict["recommended_crops"]],
        rotation_advice=result_dict["rotation_advice"],
        inference_mode=result_dict.get("inference_mode", "llm"),
        prediction_id=prediction.prediction_id,
        cached=is_cached
    )
