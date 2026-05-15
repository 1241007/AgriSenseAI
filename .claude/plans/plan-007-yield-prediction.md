# Implementation Plan: Yield Prediction (FEAT-005)

**Priority:** P2  
**Estimated Effort:** 2 days  
**Depends On:** FEAT-001 (Soil), FEAT-006 (Weather), FEAT-008 (Farm)

---

## Phase 1: Backend (Day 1)

### Step 1.1: Model Setup
- [ ] Create/source `app/data/models/yield_model.joblib` — trained GradientBoostingRegressor
- [ ] Create `app/models/yield_model.py`:
  - `load_model()` — load .joblib at startup
  - `predict(features)` → point estimate + ensemble predictions
  - `calculate_interval(predictions)` → 10th/90th percentile for 80% CI
- [ ] Register in `models/loader.py` under key `yield_predict`

### Step 1.2: Feature Aggregation
- [ ] Add `assemble_yield_features()` to `prediction_service.py`:
  - Batch query: farm + soil report in single join
  - Async weather fetch (reuse weather_service, cached)
  - Crop history query with farm_id filter
  - Build feature vector: crop_encoded, area, N, P, K, pH, moisture, avg_temp, avg_rain

### Step 1.3: Schemas & Route
- [ ] `YieldRequest` — farm_id, crop_name, soil_report_id, season
- [ ] `YieldResponse` — predicted_yield_kg_per_hectare, total, yield_range (low/high/confidence_level), key_factors
- [ ] `POST /predict/yield` with cache + DB save

---

## Phase 2: Frontend (Day 2)

### Step 2.1: New Page
- [ ] Create `Frontend/src/app/components/YieldPrediction.tsx`
- [ ] Add `/yield-prediction` route to App.tsx
- [ ] Fix sidebar: "Yield Prediction" → link to `/yield-prediction`
- [ ] UI: form (select farm, crop, soil report, season) → results with gauge chart, range visualization, key factors list

---

## Acceptance Criteria

- [ ] Yield prediction returns point estimate + confidence interval
- [ ] Feature vector aggregated without N+1 queries
- [ ] Weather data integrated into prediction
- [ ] New frontend page at `/yield-prediction`
