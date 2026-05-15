from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, Enum as SQLAlchemyEnum, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.db.engine import Base

class PredictionType(str, enum.Enum):
    SOIL = "soil"
    CROP = "crop"
    DISEASE = "disease"

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    prediction_type = Column(SQLAlchemyEnum(PredictionType), nullable=False, index=True)
    
    # Inputs used for the prediction (serialized JSON)
    inputs = Column(JSON, nullable=False)
    
    # Result of the prediction (serialized JSON)
    result = Column(JSON, nullable=False)
    
    # Metadata
    model_id = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
