from sqlalchemy import Column, Float, DateTime, text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.engine import Base

class SoilReport(Base):
    __tablename__ = "soil_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    ph = Column(Float, nullable=False)
    moisture = Column(Float, nullable=False)
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    organic_matter = Column(Float, nullable=True)
    reported_at = Column(DateTime(timezone=True), server_default=text("now()"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    farm = relationship("Farm", backref="soil_reports")

# Index for quick retrieval of farm's soil reports
Index("idx_soil_reports_farm", SoilReport.farm_id)
