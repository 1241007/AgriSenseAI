# Feature Spec: Yield Prediction

**Feature ID:** FEAT-005  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

The Yield Prediction feature estimates expected crop yield (kg/ha and total kg) for a given farm, crop, and season. It factors in soil data, weather forecast, farm area, and past crop performance. It uses a scikit-learn GradientBoostingRegressor model loaded from a serialized `.joblib` file.

---

## Capability Summary

| Input | Output |
|---|---|
| Farm, crop name, soil report, season | Expected yield kg/ha, total kg, yield range (80% confidence interval), key factors |

---

## API Endpoint

### `POST /predict/yield`

**Auth:** Bearer JWT required  
**Content-Type:** `application/json`

#### Request

```json
{
  "farm_id": "uuid",
  "crop_name": "Cotton",
  "soil_report_id": "uuid",
  "season": "Kharif 2026"
}
```

#### Response `200`

```json
{
  "prediction_id": "uuid",
  "crop_name": "Cotton",
  "area_hectares": 3.5,
  "predicted_yield_kg_per_hectare": 1200.0,
  "total_predicted_yield_kg": 4200.0,
  "yield_range": {
    "low": 3800.0,
    "high": 4600.0,
    "confidence_level": 0.80
  },
  "key_factors": [
    "Adequate potassium",
    "Moderate rainfall forecast",
    "Previous legume rotation"
  ]
}
```

### Yield Range Calculation

The yield range uses an 80% prediction interval derived from the ensemble model:

- `low` = 10th percentile of tree predictions
- `high` = 90th percentile of tree predictions
- `confidence_level` = 0.80 (fixed)

---

## AI Model

| Property | Value |
|---|---|
| Model ID | `yield_predict` |
| Type | scikit-learn `GradientBoostingRegressor` |
| Serialization | `.joblib` file in `app/data/models/yield_model.joblib` |
| Input Features | Crop name (encoded), area (ha), N, P, K, pH, moisture, avg temp, avg rainfall |
| Output | Yield kg/ha (point estimate), ensemble predictions for interval |

The model is loaded once at startup via `models/loader.py` under the key `"yield_predict"`.

---

## Input Data Aggregation

Before inference, the service layer assembles a feature vector by querying multiple sources. Uses batch queries to avoid N+1:

1. Farm area from `farms.area_hectares` — single query
2. Soil readings from the referenced `soil_reports` row — joined with farm query
3. Weather forecast from the weather service (uses farm lat/lon, cached in Redis) — async call
4. Crop history from `crop_history` for the same farm (for rotation context) — single query with farm_id filter

```python
# Aggregated in prediction_service.py
async def assemble_yield_features(farm_id, soil_report_id, crop_name, session, weather_service):
    farm, soil = await session.execute(
        select(Farm, SoilReport).join(...).where(...)
    )  # Single query, no N+1
    weather = await weather_service.get_forecast(farm.latitude, farm.longitude)
    history = await session.execute(select(CropHistory).where(...))
    return build_feature_vector(farm, soil, weather, history, crop_name)
```

---

## Database

Stored in `predictions` table with `prediction_type = 'yield'`. Linked to `soil_reports` and `farms`.

**Relevant Tables:** `predictions`, `farms`, `soil_reports`, `crop_history`

---

## Caching

Cached by input hash (farm_id + crop_name + soil_report_id + season). TTL: **24 hours**.

Cache key pattern: `yield:{sha256(farm_id|crop_name|soil_report_id|season)}`

---

## Validation Rules

- `farm_id`: must exist and belong to the authenticated user
- `soil_report_id`: must exist and belong to a farm owned by the authenticated user
- `crop_name`: non-empty string, max 100 characters
- `season`: non-empty string (e.g., `"Kharif 2026"`)

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `FARM_NOT_FOUND` | 404 | `farm_id` does not exist or belongs to another user |
| `SOIL_REPORT_NOT_FOUND` | 404 | Referenced soil report not found |
| `MODEL_INFERENCE_ERROR` | 500 | Regression model failure |
| `INSUFFICIENT_DATA` | 400 | Missing required soil parameters for feature vector |

---

## Files Involved

```
app/api/v1/predictions.py         — POST /predict/yield route
app/models/yield_model.py         — Regression model wrapper + interval calculation
app/models/loader.py              — Model registry (yield_predict key)
app/schemas/prediction.py         — YieldRequest / YieldResponse schemas
app/services/prediction_service.py — Data aggregation (batch query), inference, DB save
app/services/weather_service.py   — Fetches weather context for yield inputs
app/data/models/yield_model.joblib — Serialized sklearn model
```
