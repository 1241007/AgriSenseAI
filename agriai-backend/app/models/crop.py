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
