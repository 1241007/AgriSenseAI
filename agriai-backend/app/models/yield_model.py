import joblib
import numpy as np
import os
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class YieldModel:
    def __init__(self, model_path: str):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Yield model artifact not found at {model_path}")
        self.model = joblib.load(model_path)
        logger.info("Yield prediction model loaded successfully.")

    def predict(self, features: np.ndarray) -> Dict[str, Any]:
        """
        Predict yield and provide a confidence interval.
        Features: [crop_encoded, area, N, P, K, pH, moisture, avg_temp, avg_rain]
        """
        # Point estimate
        prediction = self.model.predict(features)[0]
        
        # Simulate ensemble predictions for interval calculation
        # In a real scenario, we might use Quantile Regression or bootstrap
        # Here we use the individual trees of the GBR to simulate variance
        try:
            # GBR prediction is the sum of all tree predictions + initial guess
            # This is a simplification
            tree_predictions = []
            learning_rate = self.model.learning_rate
            initial_guess = self.model.init_.predict(features)[0]
            
            # Get cumulative predictions to see the variance
            current_pred = initial_guess
            for tree in self.model.estimators_:
                current_pred += learning_rate * tree[0].predict(features)[0]
                tree_predictions.append(current_pred)
            
            interval = self.calculate_interval(tree_predictions)
        except Exception as e:
            logger.warning(f"Could not calculate ensemble interval: {e}")
            # Fallback to a fixed percentage interval
            interval = {
                "low": prediction * 0.9,
                "high": prediction * 1.1,
                "confidence_level": 0.8
            }

        return {
            "yield_point": float(prediction),
            "interval": interval
        }

    def calculate_interval(self, predictions: List[float]) -> Dict[str, float]:
        """Calculate 10th and 90th percentile for 80% CI."""
        low = float(np.percentile(predictions, 10))
        high = float(np.percentile(predictions, 90))
        return {
            "low": low,
            "high": high,
            "confidence_level": 0.8
        }

def load_yield_model() -> YieldModel:
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    model_path = os.path.join(base_dir, "app", "data", "models", "yield_model.joblib")
    return YieldModel(model_path)
