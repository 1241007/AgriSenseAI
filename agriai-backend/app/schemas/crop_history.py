from pydantic import BaseModel, Field, confloat, model_validator
from typing import Optional
from datetime import datetime
from uuid import UUID

class CropHistoryBase(BaseModel):
    crop_name: str = Field(..., min_length=1, max_length=255)
    sown_at: datetime
    harvested_at: Optional[datetime] = None
    yield_amount: Optional[confloat(ge=0)] = None

    @model_validator(mode='after')
    def check_dates(self) -> 'CropHistoryBase':
        if self.harvested_at and self.sown_at:
            if self.harvested_at < self.sown_at:
                raise ValueError('harvested_at must be greater than or equal to sown_at')
        return self

class CropHistoryCreate(CropHistoryBase):
    pass

class CropHistoryResponse(CropHistoryBase):
    id: UUID
    farm_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
