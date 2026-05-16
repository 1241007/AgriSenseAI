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
