from pydantic import BaseModel, Field, confloat
from typing import Optional
from datetime import datetime
from uuid import UUID

class SoilReportBase(BaseModel):
    ph: confloat(ge=0, le=14)
    moisture: confloat(ge=0, le=100)
    nitrogen: confloat(ge=0)
    phosphorus: confloat(ge=0)
    potassium: confloat(ge=0)
    organic_matter: Optional[confloat(ge=0, le=100)] = None

class SoilReportCreate(SoilReportBase):
    pass

class SoilReportResponse(SoilReportBase):
    id: UUID
    farm_id: UUID
    reported_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
