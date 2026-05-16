import uuid
from pydantic import BaseModel, Field


class SoilInlineValues(BaseModel):
    nitrogen: float = Field(..., ge=0)
    phosphorus: float = Field(..., ge=0)
    potassium: float = Field(..., ge=0)
    ph: float = Field(..., ge=0, le=14)
    moisture: float = Field(..., ge=0, le=100)


class SoilRequest(BaseModel):
    report_id: uuid.UUID | None = None
    inline_values: SoilInlineValues | None = None


class SoilResponse(BaseModel):
    soil_type: str
    confidence: float
    deficiencies: list[str]
    recommendations: list[str]
    prediction_id: uuid.UUID
    cached: bool = False


class RecommendedCrop(BaseModel):
    crop_name: str
    suitability_score: float
    reason: str = "Suitable based on soil and seasonal conditions"


class CropRequest(BaseModel):
    soil_report_id: uuid.UUID | None = None
    farm_id: uuid.UUID | None = None
    season: str
    previous_crop: str | None = None


class CropResponse(BaseModel):
    recommended_crops: list[RecommendedCrop]
    rotation_advice: str
    inference_mode: str
    prediction_id: uuid.UUID
    cached: bool = False
