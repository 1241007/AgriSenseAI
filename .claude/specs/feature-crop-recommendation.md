# Feature Spec: Crop Recommendation

**Feature ID:** FEAT-004  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

The Crop Recommendation feature suggests the best crops to grow for a given farm based on soil readings, region, season, and crop rotation history. It uses a rule-based approach combined with a LangChain LLM chain and participates in the LangGraph compound query agent. Includes a rule-based fallback when the LLM is unavailable.

---

## Capability Summary

| Input | Output |
|---|---|
| Soil report, farm region, current season, previous crop | Ranked crop list with suitability scores (0.0–1.0) and rotation advice |

---

## API Endpoint

### `POST /predict/crop`

**Auth:** Bearer JWT required  
**Content-Type:** `application/json`

#### Request

```json
{
  "soil_report_id": "uuid",
  "farm_id": "uuid",
  "season": "Kharif",
  "previous_crop": "Soybean"
}
```

#### Response `200`

```json
{
  "prediction_id": "uuid",
  "recommended_crops": [
    {
      "crop_name": "Cotton",
      "suitability_score": 0.92,
      "reason": "High potassium soil, warm climate, good for Kharif"
    },
    {
      "crop_name": "Jowar",
      "suitability_score": 0.85,
      "reason": "Drought tolerant, low nitrogen requirement"
    }
  ],
  "rotation_advice": "Avoid Soybean again this season to reduce pest buildup.",
  "inference_mode": "llm"
}
```

`inference_mode`: `"llm"` when LangChain chain succeeds, `"rule_based"` when fallback is used.

---

## AI Model & Inference Strategy

| Property | Value |
|---|---|
| Model ID | `crop_recommend` |
| Primary Approach | LangChain LLM chain via `ChatOllama` |
| Fallback Approach | Rule-based engine using `app/data/crop_rules.json` |
| LLM Backend | Configurable: Ollama (default), OpenAI, or any LangChain-compatible provider |
| Input | Soil type, region, season, previous crops |
| Output | Ranked crop list with reasoning |

### LLM Provider Abstraction

The LLM is instantiated via a factory function in `app/models/llm_factory.py`:

```python
def get_llm(provider: str = None):
    provider = provider or settings.LLM_PROVIDER  # "ollama", "openai", etc.
    if provider == "ollama":
        return ChatOllama(model=settings.OLLAMA_MODEL)
    elif provider == "openai":
        return ChatOpenAI(model=settings.OPENAI_MODEL)
    # Add more providers as needed
```

### Rule-Based Fallback

If the LLM chain fails (timeout, connection error, etc.), the system falls back to a deterministic rule engine:

1. Load crop suitability rules from `app/data/crop_rules.json`
2. Score each crop against soil parameters + season
3. Apply rotation penalty if `previous_crop` matches
4. Return sorted list with scores

---

## Shared Schema: `PlantContext`

This endpoint shares `PlantContext` with `POST /predict/disease`. The `PlantContext` fields are used for metadata enrichment, not as direct request body fields.

```python
# schemas/shared.py
class PlantContext(BaseModel):
    crop_name: Optional[str] = None
    growth_stage: Optional[str] = None
    farm_id: Optional[str] = None
    region: Optional[str] = None
```

The crop recommendation request extends this with `soil_report_id`, `season`, and `previous_crop`.

---

## LangGraph Integration

Participates in the compound multi-step agent graph. The `crop_recommend` node runs in parallel with the `fertilizer` node, both after `soil_analysis` completes.

```
fetch_soil → fetch_weather → soil_analysis → crop_recommend → compose
                                           ↘ fertilizer    ↗
```

---

## Database

Stored in `predictions` table with `prediction_type = 'crop_recommendation'`. Pulls `crop_history` for the farm to inform rotation advice.

**Relevant Tables:** `predictions`, `crop_history`, `soil_reports`

---

## Caching

Cached in Redis by input hash (soil_report_id + farm_id + season + previous_crop). TTL: **24 hours**.

Cache key pattern: `crop_recommendation:{sha256(soil_report_id|farm_id|season|previous_crop)}`

---

## Validation Rules

- `soil_report_id`: must reference a report belonging to the user's farm
- `farm_id`: must belong to the authenticated user
- `season`: non-empty string, one of `"Kharif"`, `"Rabi"`, `"Zaid"` (case-insensitive)
- `previous_crop`: optional string; if provided, used for rotation advice
- `suitability_score` range: 0.0 to 1.0 (normalized)

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `SOIL_REPORT_NOT_FOUND` | 404 | Referenced report does not exist |
| `FARM_NOT_FOUND` | 404 | `farm_id` does not exist or belongs to another user |
| `MODEL_INFERENCE_ERROR` | 500 | Both LLM chain and rule-based fallback fail |
| `INVALID_SEASON` | 400 | Season value not in allowed set |

---

## Files Involved

```
app/api/v1/predictions.py         — POST /predict/crop route
app/models/crop.py                — LangChain chain wrapper
app/models/llm_factory.py         — LLM provider factory (Ollama/OpenAI/etc.)
app/schemas/shared.py             — PlantContext schema
app/schemas/prediction.py         — CropRequest / CropResponse schemas
app/services/prediction_service.py — Business logic, rotation lookup, DB save
app/services/crop_rules_engine.py — Rule-based fallback engine
app/data/crop_rules.json          — Crop suitability rules data
app/agents/nodes.py               — run_crop_model_node
app/agents/graph.py               — LangGraph graph definition
```
