# Feature Spec: Soil Analysis

**Feature ID:** FEAT-001  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

The Soil Analysis feature accepts NPK values, pH, moisture, and organic carbon readings from a farm and returns soil type classification along with nutrient deficiency flags. It uses the `GodfreyOwino/NPK_needs_mode2` HuggingFace model. Supports both referencing an existing soil report and providing inline values.

---

## Capability Summary

| Input | Output |
|---|---|
| NPK values, pH, moisture percentage, organic carbon | Soil type, N/P/K deficiency flags, recommendations |

---

## API Endpoint

### `POST /predict/soil`

**Auth:** Bearer JWT required  
**Content-Type:** `application/json`

#### Request — Option A (reference existing report)

```json
{
  "soil_report_id": "uuid",
  "farm_id": "uuid"
}
```

#### Request — Option B (inline values)

```json
{
  "nitrogen": 42.5,
  "phosphorus": 18.0,
  "potassium": 205.0,
  "ph": 6.8,
  "moisture_pct": 35.0,
  "organic_carbon": 0.72,
  "farm_id": "uuid"
}
```

> If both `soil_report_id` and inline values are provided, inline values take precedence. The Pydantic schema uses a discriminated union with a custom validator.

#### Response `200`

```json
{
  "prediction_id": "uuid",
  "soil_type": "Sandy Loam",
  "deficiencies": {
    "nitrogen": true,
    "phosphorus": false,
    "potassium": false
  },
  "recommendations": "Nitrogen is below threshold. Consider urea application.",
  "confidence": 0.87,
  "model_version": "GodfreyOwino/NPK_needs_mode2@main"
}
```

---

## AI Model

| Property | Value |
|---|---|
| Model ID | `soil_npk` |
| HuggingFace Source | `GodfreyOwino/NPK_needs_mode2` |
| Pipeline Type | `text-classification` |
| Runtime | HuggingFace Transformers (CPU; GPU optional) |
| Device | `device=-1` (CPU default), configurable via `DEVICE` env var |

The model is loaded once at server startup via the singleton model registry in `models/loader.py`.

---

## Async Inference

For heavy inference loads, predictions are submitted as background tasks:

1. **Sync path** (default): Model runs in-request for low-latency responses
2. **Async path** (when `async=true` query param): Returns `task_id`, client polls `GET /tasks/{task_id}`

The async path uses Celery with Redis as broker.

---

## Database

Soil inputs are stored in the `soil_reports` table. Prediction results are persisted in the `predictions` table with `prediction_type = 'soil_analysis'`.

**Relevant Tables:** `soil_reports`, `predictions`

---

## Caching

Results are cached in Redis by input hash. TTL: **24 hours** (soil-based predictions are stable over short periods).

Cache key pattern: `soil_analysis:{sha256(nitrogen|phosphorus|potassium|ph|moisture_pct)}`

---

## Validation Rules

- `nitrogen`, `phosphorus`, `potassium`: positive numeric, mg/kg, max 1000
- `ph`: range 0.0 – 14.0
- `moisture_pct`: range 0.0 – 100.0
- `organic_carbon`: range 0.0 – 100.0 (optional)
- Either `soil_report_id` OR inline values must be provided; both is allowed (inline values take precedence)
- `farm_id`: optional, but if provided must belong to the authenticated user

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `SOIL_REPORT_NOT_FOUND` | 404 | `soil_report_id` provided but not found |
| `INVALID_SOIL_VALUES` | 400 | Values out of expected range |
| `MODEL_INFERENCE_ERROR` | 500 | Model runtime failure |
| `FARM_NOT_FOUND` | 404 | `farm_id` does not exist or belongs to another user |

---

## Files Involved

```
app/api/v1/predictions.py       — POST /predict/soil route
app/models/soil.py              — Inference wrapper
app/models/loader.py            — Model registry (soil_npk key)
app/schemas/prediction.py       — SoilRequest / SoilResponse schemas (discriminated union)
app/services/prediction_service.py — Business logic, caching, DB save
app/tasks/prediction_tasks.py   — Celery async inference task
```
