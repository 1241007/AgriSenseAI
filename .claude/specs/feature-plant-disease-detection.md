# Feature Spec: Plant Disease Detection

**Feature ID:** FEAT-003  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

The Plant Disease Detection feature accepts a leaf image (JPEG/PNG) and optionally the crop name and growth stage. It returns the disease name, severity, affected area percentage, and a structured treatment plan. It uses the `prof-freakenstein/plantnet-disease-detection` HuggingFace model for classification, combined with a treatment lookup table for structured remedies.

---

## Capability Summary

| Input | Output |
|---|---|
| Leaf image (RGB), optional crop name & growth stage | Disease name, confidence, severity, treatment plan |

---

## API Endpoint

### `POST /predict/disease`

**Auth:** Bearer JWT required  
**Content-Type:** `multipart/form-data`

#### Form Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | file | Yes | JPEG/PNG leaf photo, max 10MB |
| `crop_name` | string | No | Helps narrow disease classification |
| `growth_stage` | string | No | `vegetative`, `flowering`, or `maturity` |
| `farm_id` | UUID | No | Links result to a farm record |

#### Response `200`

```json
{
  "prediction_id": "uuid",
  "disease_name": "Leaf Blight",
  "scientific_name": "Helminthosporium oryzae",
  "confidence": 0.93,
  "severity": "moderate",
  "affected_area_pct": 35,
  "treatment": {
    "chemical": "Mancozeb 75% WP @ 2g/L water",
    "biological": "Trichoderma viride application",
    "cultural": "Remove and destroy infected leaves"
  },
  "is_healthy": false
}
```

### Response Field Generation

| Field | Source |
|---|---|
| `disease_name` | Model output label (mapped to display name) |
| `scientific_name` | Lookup table keyed by `disease_name` |
| `confidence` | Model confidence score |
| `severity` | Derived from confidence thresholds: `>0.85` = severe, `>0.6` = moderate, else mild |
| `affected_area_pct` | Estimated from model confidence + growth_stage heuristic |
| `treatment` | Lookup table in `app/data/disease_treatments.json` keyed by `disease_name` |
| `is_healthy` | `true` if top label is "Healthy" class |

---

## AI Model

| Property | Value |
|---|---|
| Model ID | `plant_disease` |
| HuggingFace Source | `prof-freakenstein/plantnet-disease-detection` |
| Pipeline Type | `image-classification` |
| Input Size | RGB image resized to 224×224 |
| Runtime | HuggingFace Transformers + Torchvision / PIL |
| Device | `device=-1` (CPU default), configurable via `DEVICE` env var |

Loaded at startup via `models/loader.py` under the key `"plant_disease"`.

---

## Shared Schema: `PlantContext`

This endpoint shares `PlantContext` with `POST /predict/crop`. Both accept optional `crop_name`, `growth_stage`, `farm_id`, and `region`.

```python
# schemas/shared.py
class PlantContext(BaseModel):
    crop_name: Optional[str] = None
    growth_stage: Optional[str] = None   # vegetative, flowering, maturity
    farm_id: Optional[str] = None
    region: Optional[str] = None
```

---

## Image Pre-processing

Handled in `utils/image_utils.py`:

1. Validate MIME type (must be `image/jpeg` or `image/png`)
2. Validate magic bytes (not just Content-Type header)
3. Strip EXIF metadata
4. Enforce max file size: **10MB**
5. Resize to 224×224 using PIL
6. Convert to RGB tensor for inference

---

## Database

Result stored in `predictions` table with `prediction_type = 'plant_disease'`. The uploaded image is **not** stored in the DB; only the inference output and input metadata are persisted as JSON.

**Relevant Tables:** `predictions`

---

## Caching

Image-based predictions are **not cached by default** (images are large and unique). Future iteration may use perceptual hashing (pHash) for deduplication.

---

## Validation Rules

- File must be JPEG or PNG (validated by MIME type + magic bytes)
- Max file size: 10MB
- `growth_stage`, if provided, must be one of: `vegetative`, `flowering`, `maturity`
- `farm_id`, if provided, must belong to the authenticated user

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `INVALID_IMAGE_FORMAT` | 400 | Non-JPEG/PNG file uploaded |
| `IMAGE_TOO_LARGE` | 413 | File exceeds 10MB |
| `MODEL_INFERENCE_ERROR` | 500 | Model runtime failure |
| `FARM_NOT_FOUND` | 404 | `farm_id` does not exist or belongs to another user |

---

## Files Involved

```
app/api/v1/predictions.py       — POST /predict/disease route
app/models/disease.py           — Inference wrapper
app/models/loader.py            — Model registry (plant_disease key)
app/schemas/shared.py           — PlantContext base schema
app/schemas/prediction.py       — DiseaseResponse schema
app/utils/image_utils.py        — PIL pre-processing, EXIF strip, validation
app/services/prediction_service.py — Business logic, DB save
app/data/disease_treatments.json — Treatment lookup table
```
