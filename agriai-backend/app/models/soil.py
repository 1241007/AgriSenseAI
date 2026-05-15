import pandas as pd
from typing import Dict, List, Any
from app.models.loader import MODEL_REGISTRY

def analyze_soil(n: float, p: float, k: float, ph: float, moisture: float, crop_name: str = "maize (corn)", target_yield: float = 5.0, field_size: float = 1.0, organic_carbon: float = 1.5) -> Dict[str, Any]:
    """Run model inference for soil analysis using the Random Forest Regressor."""
    model = MODEL_REGISTRY.get_model("soil")
    if not model:
        raise RuntimeError("Soil model not loaded")
    
    # Construct input data for the model
    # Based on the model card, it expects: 
    # [crop_name, target_yield, field_size, ph, organic_carbon, nitrogen, phosphorus, potassium, soil_moisture]
    # Note: crop_name might need encoding if the model was trained with encoded values.
    # Assuming the model can handle a DataFrame or a specific list format.
    
    input_data = {
        'crop_name': [crop_name],
        'target_yield': [target_yield],
        'field_size': [field_size],
        'ph': [ph],
        'organic_carbon': [organic_carbon],
        'nitrogen': [n],
        'phosphorus': [p],
        'potassium': [k],
        'soil_moisture': [moisture]
    }
    
    df = pd.DataFrame(input_data)
    
    try:
        # The model is a Regressor, so it returns numerical needs
        prediction = model.predict(df)[0]
        
        # Mapping prediction array to human readable format
        # [nitrogen_need, phosphorus_need, potassium_need, organic_matter_need, lime_need]
        res = {
            "nitrogen_need": float(prediction[0]),
            "phosphorus_need": float(prediction[1]),
            "potassium_need": float(prediction[2]),
            "organic_matter_need": float(prediction[3]),
            "lime_need": float(prediction[4])
        }
        
        deficiencies = []
        if res["nitrogen_need"] > 0: deficiencies.append("Nitrogen")
        if res["phosphorus_need"] > 0: deficiencies.append("Phosphorus")
        if res["potassium_need"] > 0: deficiencies.append("Potassium")

        return {
            "soil_type": "Analyzed via Random Forest",
            "confidence": 1.0, # RF Regressors don't give "score" in the same way as HF pipelines
            "deficiencies": deficiencies,
            "recommendations": f"Detected needs: N={res['nitrogen_need']:.2f}, P={res['phosphorus_need']:.2f}, K={res['potassium_need']:.2f} kg/ha.",
            "raw_predictions": res
        }
    except Exception as e:
        # Fallback for classification-like output if the model is different than expected
        return {
            "soil_type": "Error in Analysis",
            "confidence": 0.0,
            "deficiencies": [],
            "recommendations": f"Inference error: {str(e)}"
        }
