import random
from typing import Dict, Any

class WeatherService:
    @staticmethod
    async def get_seasonal_forecast(region: str, season: str) -> Dict[str, float]:
        """
        Mock weather service returning average temperature and rainfall for a season.
        In a real app, this would call a weather API.
        """
        # Mock logic based on season
        if season.lower() == "kharif":
            return {"avg_temp": 28.0 + random.uniform(-2, 2), "avg_rain": 1000.0 + random.uniform(-100, 100)}
        elif season.lower() == "rabi":
            return {"avg_temp": 20.0 + random.uniform(-2, 2), "avg_rain": 100.0 + random.uniform(-20, 20)}
        elif season.lower() == "zaid":
            return {"avg_temp": 32.0 + random.uniform(-2, 2), "avg_rain": 50.0 + random.uniform(-10, 10)}
        else:
            return {"avg_temp": 25.0, "avg_rain": 500.0}

weather_service = WeatherService()
