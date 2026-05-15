from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import uuid

class SoilInlineValues(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    moisture: float
    organic_carbon: Optional[float] = 1.5
    crop_name: Optional[str] = "maize (corn)"
    target_yield: Optional[float] = 5.0
    field_size: Optional[float] = 1.0

class SoilRequest(BaseModel):
    report_id: Optional[uuid.UUID] = None
    inline_values: Optional[SoilInlineValues] = None

class SoilResponse(BaseModel):
    soil_type: str
    confidence: float
    deficiencies: List[str]
    recommendations: str
    raw_predictions: Optional[Dict[str, float]] = None
