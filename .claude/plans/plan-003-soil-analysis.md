# Implementation Plan: Soil Analysis (FEAT-001)

**Priority:** P1 — First prediction feature, validates ML pipeline  
**Estimated Effort:** 2 days  
**Depends On:** FEAT-007 (Auth), FEAT-008 (Farm/Soil)

---

## Phase 1: ML Pipeline Foundation (Day 1)

### Step 1.1: Model Loader
- [ ] Create `app/models/loader.py` — singleton `MODEL_REGISTRY` dict
- [ ] Implement startup loading: download/cache HuggingFace models
- [ ] Load `GodfreyOwino/NPK_needs_mode2` as `text-classification` pipeline
- [ ] Register in FastAPI lifespan handler
- [ ] Add `DEVICE` env var support (-1=CPU, 0=GPU)

### Step 1.2: Predictions Table
- [ ] Create `app/db/models/prediction.py` — Prediction ORM model
- [ ] Create Alembic migration for `predictions` table with `prediction_type` enum
- [ ] Add indexes on `user_id` and `prediction_type`

### Step 1.3: Redis Cache Layer
- [ ] Create `app/utils/cache.py`:
  - `cache_get(key)` → cached result or None
  - `cache_set(key, value, ttl)` → store result
  - `make_cache_key(prefix, **inputs)` → sha256 hash key

### Step 1.4: Prediction Service
- [ ] Create `app/services/prediction_service.py`:
  - `predict_soil(request, user, session, redis)`:
    1. Resolve soil values (from report_id or inline)
    2. Check cache
    3. Run model inference
    4. Save to predictions table
    5. Cache result
    6. Return response

### Step 1.5: Soil Model Wrapper
- [ ] Create `app/models/soil.py` — wraps HF pipeline, formats input/output
- [ ] Input: NPK + pH + moisture → formatted text for classification
- [ ] Output: soil type label + confidence + deficiency flags

---

## Phase 2: API Route + Frontend (Day 2)

### Step 2.1: Schemas
- [ ] Create/update `app/schemas/prediction.py`:
  - `SoilRequest` — discriminated union (report_id vs inline values)
  - `SoilResponse` — soil_type, deficiencies, recommendations, confidence

### Step 2.2: Route Handler
- [ ] Add to `app/api/v1/predictions.py`:
  - `POST /predict/soil` — validate, call service, return response
  - Support `?async=true` query param for Celery task path

### Step 2.3: Frontend Wiring
- [ ] Add `predictSoil()` to API client
- [ ] Wire SoilAnalysis.tsx form to API
- [ ] Display real prediction results
- [ ] Add loading state during inference

---

## Acceptance Criteria

- [ ] Soil analysis returns real model predictions
- [ ] Cache hit avoids re-inference
- [ ] Both soil_report_id and inline value modes work
- [ ] Prediction saved to DB with correct type
- [ ] Frontend shows real results
