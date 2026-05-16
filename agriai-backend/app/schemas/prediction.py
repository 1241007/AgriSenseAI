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


class FertilizerRequest(BaseModel):
    soil_report_id: uuid.UUID | None = None
    inline_values: SoilInlineValues | None = None
    crop_name: str = Field(..., min_length=2, max_length=50)
    area_hectares: float = Field(..., gt=0)


class FertilizerResponse(BaseModel):
    fertilizer_type: str
    dosage_kg_per_hectare: float
    total_dosage_kg: float
    application_method: str
    additional_notes: str
    confidence: float
    cached: bool = False
    prediction_id: uuid.UUID | None = None


class TreatmentInfo(BaseModel):
    chemical: str
    biological: str
    cultural: str


class DiseaseResponse(BaseModel):
    disease_name: str
    scientific_name: str
    confidence: float
    severity: str
    affected_area_pct: float
    treatment: TreatmentInfo
    is_healthy: bool
    prediction_id: uuid.UUID | None = None
