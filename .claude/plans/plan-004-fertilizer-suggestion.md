# Implementation Plan: Fertilizer Suggestion (FEAT-002)

**Priority:** P1  
**Estimated Effort:** 1.5 days  
**Depends On:** FEAT-001 (Soil Analysis — shares prediction service + model loader)

---

## Phase 1: Backend (Day 1)

### Step 1.1: Model & Data
- [ ] Add `DNgigi/FertiliserApplicaiont` to `models/loader.py` startup (key: `fertilizer`)
- [ ] Create `app/data/fertilizer_guide.json` — lookup table with dosage, application methods, notes per fertilizer type + crop combination
- [ ] Create `app/models/fertilizer.py` — inference wrapper:
  - Input: soil NPK + pH + moisture + crop_name → text for classification
  - Output: fertilizer_type label + confidence
  - Post-process: lookup dosage, method, notes from guide.json

### Step 1.2: Schemas
- [ ] Add to `app/schemas/prediction.py`:
  - `FertilizerRequest` — soil_report_id, crop_name, area_hectares
  - `FertilizerResponse` — fertilizer_type, dosage_kg_per_hectare, total_dosage_kg, application_method, additional_notes, confidence

### Step 1.3: Service & Route
- [ ] Add `predict_fertilizer()` to `prediction_service.py`
- [ ] Add `POST /predict/fertilizer` to `predictions.py` router
- [ ] Cache key: `fertilizer:{hash(soil_report_id|crop_name|area_hectares)}`

---

## Phase 2: Frontend (Day 2 — half day)

### Step 2.1: API Client & Wiring
- [ ] Add `predictFertilizer()` to `client.ts`
- [ ] Wire FertilizerRecommendation.tsx form to API
- [ ] Display real results: fertilizer type, dosage chart, application instructions
- [ ] Add loading/error states

---

## Acceptance Criteria

- [ ] Model predicts fertilizer type with confidence score
- [ ] Dosage calculated correctly (per hectare × area)
- [ ] Application method and notes populated from lookup table
- [ ] Result cached and saved to predictions table
