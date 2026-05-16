import json
import logging
from typing import Any, List, Dict
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from app.models.llm_factory import get_llm

logger = logging.getLogger(__name__)

class RecommendedCrop(BaseModel):
    crop_name: str = Field(description="Name of the recommended crop")
    suitability_score: float = Field(description="Score between 0 and 1 indicating how suitable the crop is")
    reason: str = Field(description="Short explanation why this crop is recommended")

class CropRecommendationResponse(BaseModel):
    recommended_crops: List[RecommendedCrop]
    rotation_advice: str = Field(description="Advice on crop rotation based on previous crops")

CROP_PROMPT = """
You are an expert agricultural consultant. Based on the provided soil data and context, recommend the top 3 most suitable crops for the next season.

Context:
- Soil Data: {soil_data}
- Region: {region}
- Season: {season}
- Previous Crops: {previous_crops}

Instructions:
1. Analyze the soil parameters (NPK, pH, Moisture) against common crop requirements.
2. Consider the current season ({season}) and the geographic region ({region}).
3. Account for crop rotation principles to maintain soil health.
4. Provide a score between 0 and 1 for each recommendation.
5. Provide a short piece of rotation advice.

Your output MUST be a valid JSON object matching this structure:
{{
  "recommended_crops": [
    {{ "crop_name": "...", "suitability_score": 0.95, "reason": "..." }},
    ...
  ],
  "rotation_advice": "..."
}}
"""

async def predict_crop_llm(
    soil_data: Dict[str, Any],
    region: str,
    season: str,
    previous_crops: List[str]
) -> Dict[str, Any]:
    """
    Generate crop recommendations using an LLM.
    """
    try:
        llm = get_llm()
        parser = JsonOutputParser(pydantic_object=CropRecommendationResponse)
        prompt = ChatPromptTemplate.from_template(CROP_PROMPT)
        
        chain = prompt | llm | parser
        
        result = await chain.ainvoke({
            "soil_data": json.dumps(soil_data),
            "region": region,
            "season": season,
            "previous_crops": ", ".join(previous_crops) if previous_crops else "None"
        })
        
        # Ensure it's in the expected format for the service layer
        result["inference_mode"] = "llm"
        return result
        
    except Exception as e:
        logger.error(f"Error in predict_crop_llm: {e}")
        raise e
