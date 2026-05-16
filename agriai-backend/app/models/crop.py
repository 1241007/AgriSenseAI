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
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

from app.models.llm_factory import get_llm

class RecommendedCrop(BaseModel):
    crop_name: str = Field(description="Name of the recommended crop")
    suitability_score: float = Field(description="Suitability score between 0 and 1")
    reason: str = Field(default="Suitable based on soil and seasonal conditions", description="Reason for recommending this crop")

class CropRecommendationResponse(BaseModel):
    recommended_crops: List[RecommendedCrop]
    rotation_advice: str
    inference_mode: str = "llm"

def get_crop_recommendation_chain():
    """
    Creates a LangChain chain for crop recommendation.
    """
    llm = get_llm()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are an expert agronomist. Based on the provided soil data, region, "
            "season, and crop history, recommend the most suitable crops. "
            "Consider NPK levels, pH, moisture, and local climate patterns. "
            "Provide a list of recommendations with suitability scores (0.0 to 1.0) "
            "and detailed reasoning for each. Also provide general rotation advice."
        )),
        ("user", (
            "Soil Data: {soil_data}\n"
            "Region: {region}\n"
            "Season: {season}\n"
            "Previous Crops: {previous_crops}\n\n"
            "Respond ONLY with a valid JSON object matching this schema:\n"
            "{{\n"
            "  \"recommended_crops\": [\n"
            "    {{\n"
            "      \"crop_name\": \"string\",\n"
            "      \"suitability_score\": 0.0,\n"
            "      \"reason\": \"string\"\n"
            "    }}\n"
            "  ],\n"
            "  \"rotation_advice\": \"string\"\n"
            "}}\n"
            "Ensure 'reason' is always included for every crop."
        ))
    ])
    
    parser = JsonOutputParser(pydantic_object=CropRecommendationResponse)
    
    chain = prompt | llm | parser
    
    return chain

async def predict_crop_llm(soil_data: dict, region: str, season: str, previous_crops: List[str]):
    """
    Runs the LLM chain to get crop recommendations.
    """
    chain = get_crop_recommendation_chain()
    try:
        result = await chain.ainvoke({
            "soil_data": soil_data,
            "region": region,
            "season": season,
            "previous_crops": previous_crops
        })
        return result
    except Exception as e:
        # Fallback will be handled by the service layer
        raise e
