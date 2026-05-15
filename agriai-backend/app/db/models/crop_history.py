from sqlalchemy import Column, String, Float, DateTime, text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.engine import Base

class CropHistory(Base):
    __tablename__ = "crop_history"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    crop_name = Column(String(255), nullable=False)
    sown_at = Column(DateTime(timezone=True), nullable=False)
    harvested_at = Column(DateTime(timezone=True), nullable=True)
    yield_amount = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    farm = relationship("Farm", backref="crop_history")
