# Feature Spec: Fertilizer Suggestion

**Feature ID:** FEAT-002  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

The Fertilizer Suggestion feature takes a soil report and a target crop, then recommends the fertilizer type, dosage per hectare, and total dosage. It uses the `DNgigi/FertiliserApplication` HuggingFace model for classification, combined with a post-processing step that generates application method and notes from a curated lookup table.

---

## Capability Summary

| Input | Output |
|---|---|
| Soil report, crop name, farm area | Fertilizer type, dosage (kg/ha), total dosage, application method, notes |

---

## API Endpoint

### `POST /predict/fertilizer`

**Auth:** Bearer JWT required  
**Content-Type:** `application/json`

#### Request

```json
{
  "soil_report_id": "uuid",
  "crop_name": "Wheat",
  "area_hectares": 3.5
}
```

#### Response `200`

```json
{
  "prediction_id": "uuid",
  "fertilizer_type": "Urea",
  "dosage_kg_per_hectare": 50.0,
  "total_dosage_kg": 175.0,
  "application_method": "Broadcasting before sowing",
  "additional_notes": "Split application recommended — 50% at sowing, 50% at tillering.",
  "confidence": 0.91
}
```

### Response Field Generation

| Field | Source |
|---|---|
| `fertilizer_type` | Direct model output (text-classification label) |
| `dosage_kg_per_hectare` | Lookup table keyed by `fertilizer_type` + `crop_name` |
| `total_dosage_kg` | `dosage_kg_per_hectare × area_hectares` |
| `application_method` | Lookup table keyed by `fertilizer_type` |
| `additional_notes` | Lookup table with seasonal/crop-specific notes |
| `confidence` | Model confidence score |

The lookup table is stored in `app/data/fertilizer_guide.json` and loaded at startup.

---

## AI Model

| Property | Value |
|---|---|
| Model ID | `fertilizer` |
| HuggingFace Source | `DNgigi/FertiliserApplication` |
| Pipeline Type | `text-classification` |
| Runtime | HuggingFace Transformers (CPU; GPU optional) |
| Device | `device=-1` (CPU default), configurable via `DEVICE` env var |

Loaded at startup via `models/loader.py` under the key `"fertilizer"`.

---

## LangGraph Integration

This feature participates in the compound query LangGraph agent graph. When a user asks "Given my soil and weather, what crop and how much fertilizer?", the fertilizer node (`run_fertilizer_model_node`) runs in parallel with `crop_recommend` after `soil_analysis` completes.

```
fetch_soil → fetch_weather → soil_analysis → fertilizer → compose
```

---

## Database

Prediction is stored in the `predictions` table with `prediction_type = 'fertilizer'`. Linked to `soil_reports` via `soil_report_id`.

**Relevant Tables:** `soil_reports`, `predictions`

---

## Caching

Cached in Redis by input hash (soil_report_id + crop_name + area_hectares). TTL: **24 hours**.

Cache key pattern: `fertilizer:{sha256(soil_report_id|crop_name|area_hectares)}`

---

## Validation Rules

- `soil_report_id`: must reference an existing report belonging to the user's farm
- `crop_name`: non-empty string, max 100 characters
- `area_hectares`: positive number, max 10,000

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `SOIL_REPORT_NOT_FOUND` | 404 | Provided `soil_report_id` does not exist |
| `INVALID_AREA` | 400 | `area_hectares` is zero or negative |
| `MODEL_INFERENCE_ERROR` | 500 | Model runtime failure |
| `FARM_NOT_FOUND` | 404 | Associated farm does not exist or belongs to another user |

---

## Files Involved

```
app/api/v1/predictions.py         — POST /predict/fertilizer route
app/models/fertilizer.py          — Inference wrapper
app/models/loader.py              — Model registry (fertilizer key)
app/schemas/prediction.py         — FertilizerRequest / FertilizerResponse schemas
app/services/prediction_service.py — Business logic, caching, DB save
app/data/fertilizer_guide.json    — Lookup table for dosage, application method, notes
app/agents/nodes.py               — run_fertilizer_model_node
```
