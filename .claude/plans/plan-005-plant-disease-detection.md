# Implementation Plan: Plant Disease Detection (FEAT-003)

**Priority:** P1  
**Estimated Effort:** 2 days  
**Depends On:** FEAT-001 (Soil Analysis — shares model loader + prediction service)

---

## Phase 1: Backend (Day 1)

### Step 1.1: Image Utilities
- [ ] Create `app/utils/image_utils.py`:
  - `validate_image(file)` — check MIME type + magic bytes (JPEG/PNG only)
  - `validate_size(file, max_mb=10)` — reject files > 10MB
  - `strip_exif(image)` — remove metadata
  - `preprocess_for_inference(image)` — resize 224×224, convert RGB, tensor

### Step 1.2: Model & Data
- [ ] Add `prof-freakenstein/plantnet-disease-detection` to loader (key: `plant_disease`)
- [ ] Create `app/data/disease_treatments.json` — lookup table: disease_name → { chemical, biological, cultural, scientific_name }
- [ ] Create `app/models/disease.py` — inference wrapper:
  - Input: preprocessed image tensor
  - Output: disease_name, confidence, severity (derived), treatment (from lookup)

### Step 1.3: Schemas
- [ ] Add to `app/schemas/prediction.py`:
  - `DiseaseResponse` — disease_name, scientific_name, confidence, severity, affected_area_pct, treatment, is_healthy
- [ ] Create `app/schemas/shared.py`:
  - `PlantContext` — crop_name, growth_stage, farm_id, region

### Step 1.4: Service & Route
- [ ] Add `predict_disease()` to `prediction_service.py`
- [ ] Add `POST /predict/disease` (multipart/form-data) to `predictions.py`
- [ ] Handle file upload with `UploadFile` parameter
- [ ] No caching (image-based)

---

## Phase 2: Frontend (Day 2)

### Step 2.1: API Client
- [ ] Add `predictDisease(formData: FormData)` to `client.ts`
- [ ] Use `fetch` with multipart/form-data (no JSON content-type header)

### Step 2.2: Wire DiseaseDetection.tsx
- [ ] Wire image upload to API
- [ ] Display results: disease name, severity badge, treatment plan cards
- [ ] Show confidence meter
- [ ] Add image preview before submission

---

## Acceptance Criteria

- [ ] Image validation rejects non-JPEG/PNG and files > 10MB
- [ ] Model classifies disease with confidence
- [ ] Treatment plan populated from lookup table
- [ ] Healthy plants identified correctly (is_healthy = true)
- [ ] EXIF stripped from uploaded images
