from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.prediction import SoilRequest, SoilResponse, FertilizerRequest, FertilizerResponse, DiseaseResponse
from app.db.models.prediction import Prediction, PredictionType
from app.db.models.soil_report import SoilReport
from app.models.soil import run_soil_prediction
from app.models.fertilizer import predict_fertilizer_type
from app.models.disease import predict_disease_model
from app.utils.cache import cache_get, cache_set, make_cache_key
from app.utils.image_utils import preprocess_for_inference
from fastapi import UploadFile

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


async def predict_fertilizer(request: FertilizerRequest, user_id: UUID, session: AsyncSession) -> FertilizerResponse:
    if request.soil_report_id:
        query = select(SoilReport).options(joinedload(SoilReport.farm)).where(SoilReport.report_id == request.soil_report_id)
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
        raise HTTPException(status_code=400, detail="Must provide soil_report_id or inline_values")

    cache_key = make_cache_key("fertilizer", n=n, p=p, k=k, ph=ph, m=m, c=request.crop_name, a=request.area_hectares)
    cached = await cache_get(cache_key)

    if not cached:
        prediction_result = predict_fertilizer_type(
            nitrogen=n, phosphorus=p, potassium=k, ph=ph, moisture=m, crop_name=request.crop_name
        )
        total_dosage = prediction_result.base_dosage_kg_per_hectare * request.area_hectares
        
        result_dict = {
            "fertilizer_type": prediction_result.fertilizer_type,
            "confidence": prediction_result.confidence,
            "dosage_kg_per_hectare": prediction_result.base_dosage_kg_per_hectare,
            "total_dosage_kg": total_dosage,
            "application_method": prediction_result.application_method,
            "additional_notes": prediction_result.notes
        }
        await cache_set(cache_key, result_dict)
        is_cached = False
    else:
        result_dict = cached
        is_cached = True

    prediction = Prediction(
        user_id=user_id,
        prediction_type=PredictionType.fertilizer,
        input_data={
            "nitrogen": n, "phosphorus": p, "potassium": k, "ph": ph, "moisture": m, 
            "crop_name": request.crop_name, "area_hectares": request.area_hectares
        },
        result=result_dict
    )
    session.add(prediction)
    await session.commit()
    await session.refresh(prediction)

    return FertilizerResponse(
        fertilizer_type=result_dict["fertilizer_type"],
        dosage_kg_per_hectare=result_dict["dosage_kg_per_hectare"],
        total_dosage_kg=result_dict["total_dosage_kg"],
        application_method=result_dict["application_method"],
        additional_notes=result_dict["additional_notes"],
        confidence=result_dict["confidence"],
        cached=is_cached,
        prediction_id=prediction.prediction_id
    )


async def predict_disease(
    image_file: UploadFile, 
    user_id: UUID, 
    session: AsyncSession
) -> DiseaseResponse:
    # Read image
    content = await image_file.read()
    
    # Preprocess
    image_obj = preprocess_for_inference(content)
    
    # Predict
    result_dict = predict_disease_model(image_obj)
    
    # Save to db (without storing the image itself in this simplified version)
    prediction = Prediction(
        user_id=user_id,
        prediction_type=PredictionType.disease,
        input_data={"filename": image_file.filename, "content_type": image_file.content_type},
        result=result_dict
    )
    session.add(prediction)
    await session.commit()
    await session.refresh(prediction)
    
    return DiseaseResponse(
        disease_name=result_dict["disease_name"],
        scientific_name=result_dict["scientific_name"],
        confidence=result_dict["confidence"],
        severity=result_dict["severity"],
        affected_area_pct=result_dict["affected_area_pct"],
        treatment=result_dict["treatment"],
        is_healthy=result_dict["is_healthy"],
        prediction_id=prediction.prediction_id
    )
