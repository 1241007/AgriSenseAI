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
