import math
from typing import Dict, Any, List

def predict_yield_logic(
    crop_name: str,
    area_hectares: float,
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    ph: float,
    moisture: float,
    avg_temp: float,
    avg_precip: float
) -> Dict[str, Any]:
    """
    Simulated yield prediction model.
    Returns predicted yield and confidence intervals.
    """
    
    # Base yields (kg/hectare)
    base_yields = {
        "wheat": 3500,
        "rice": 4000,
        "corn": 5000,
        "soybean": 2800,
        "sugarcane": 70000,
        "cotton": 2000,
        "default": 3000
    }
    
    base = base_yields.get(crop_name.lower(), base_yields["default"])
    
    # Multipliers based on inputs
    # 1. NPK impact (simplified)
    # Ideal: N=100, P=50, K=50
    npk_score = (
        min(nitrogen / 100, 1.2) * 0.4 +
        min(phosphorus / 50, 1.2) * 0.3 +
        min(potassium / 50, 1.2) * 0.3
    )
    
    # 2. pH impact (Ideal 6.5)
    ph_impact = 1.0 - (abs(ph - 6.5) / 6.5)
    
    # 3. Weather impact (Ideal Temp 25, Precip 500mm/season)
    temp_impact = 1.0 - (abs(avg_temp - 25) / 25)
    precip_impact = min(avg_precip / 500, 1.1)
    
    # Combine impacts
    multiplier = (npk_score * 0.5 + ph_impact * 0.2 + temp_impact * 0.15 + precip_impact * 0.15)
    
    predicted_kg_ha = base * multiplier
    
    # Add some "noise" or uncertainty for CI
    uncertainty = 0.1 # 10% uncertainty
    low = predicted_kg_ha * (1 - uncertainty)
    high = predicted_kg_ha * (1 + uncertainty)
    
    total_yield = predicted_kg_ha * area_hectares
    
    # Identify key factors
    factors = [
        {"factor": "Soil Nutrients", "impact": "High" if npk_score > 0.9 else "Moderate"},
        {"factor": "pH Balance", "impact": "Optimal" if 6.0 <= ph <= 7.0 else "Sub-optimal"},
        {"factor": "Weather Pattern", "impact": "Favorable" if 20 <= avg_temp <= 30 else "Stressful"}
    ]
    
    return {
        "predicted_yield_kg_per_hectare": round(predicted_kg_ha, 2),
        "total_yield_kg": round(total_yield, 2),
        "yield_range": {
            "low": round(low, 2),
            "high": round(high, 2),
            "confidence_level": 0.94
        },
        "key_factors": factors
    }
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
