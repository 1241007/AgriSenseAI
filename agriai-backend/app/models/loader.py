import logging
import joblib
import os
from huggingface_hub import hf_hub_download
from app.config import settings

logger = logging.getLogger(__name__)

class ModelRegistry:
    def __init__(self):
        self._models = {}

    def load_soil_model(self):
        logger.info(f"Loading soil model: {settings.SOIL_MODEL_ID}")
        try:
            # For this specific model, we download the joblib file
            # Based on HuggingFace, it's likely 'model.joblib' or 'random_forest_model.joblib'
            # Let's try downloading the common filename. 
            # Note: In a real scenario, you'd check the repo first.
            model_path = hf_hub_download(
                repo_id=settings.SOIL_MODEL_ID,
                filename="model.joblib" 
            )
            self._models["soil"] = joblib.load(model_path)
            logger.info("Soil model loaded successfully using joblib")
        except Exception as e:
            logger.warning(f"Failed to load 'model.joblib', trying 'random_forest_model.joblib': {e}")
            try:
                model_path = hf_hub_download(
                    repo_id=settings.SOIL_MODEL_ID,
                    filename="random_forest_model.joblib"
                )
                self._models["soil"] = joblib.load(model_path)
                logger.info("Soil model loaded successfully using joblib")
            except Exception as e2:
                logger.error(f"Failed to load soil model from HuggingFace: {e2}")
                # Fallback to a mock or raise
                raise e2

    def get_model(self, name: str):
        return self._models.get(name)

MODEL_REGISTRY = ModelRegistry()
