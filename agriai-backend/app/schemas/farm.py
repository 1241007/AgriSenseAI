from pydantic import BaseModel, Field, conint, confloat
from typing import Optional
from datetime import datetime
from uuid import UUID

class FarmBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    location_lat: Optional[confloat(ge=-90, le=90)] = None
    location_lng: Optional[confloat(ge=-180, le=180)] = None
    region: Optional[str] = Field(None, max_length=255)
    area: confloat(gt=0, le=10000)

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    location_lat: Optional[confloat(ge=-90, le=90)] = None
    location_lng: Optional[confloat(ge=-180, le=180)] = None
    region: Optional[str] = Field(None, max_length=255)
    area: Optional[confloat(gt=0, le=10000)] = None

class FarmResponse(FarmBase):
    id: UUID
    user_id: UUID
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
