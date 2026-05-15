# Implementation Plan: Crop Recommendation (FEAT-004)

**Priority:** P2  
**Estimated Effort:** 2.5 days  
**Depends On:** FEAT-001 (Soil), FEAT-008 (Farm), LangChain/Ollama setup

---

## Phase 1: LLM Infrastructure (Day 1)

### Step 1.1: LLM Factory
- [ ] Create `app/models/llm_factory.py`:
  - `get_llm(provider=None)` — returns ChatOllama, ChatOpenAI, etc.
  - Read `LLM_PROVIDER`, `OLLAMA_MODEL`, `OPENAI_MODEL` from config
  - Add env vars to `config.py`

### Step 1.2: Crop LangChain Chain
- [ ] Create `app/models/crop.py`:
  - Define prompt template: system message + user context (soil data, region, season, previous crops)
  - Chain: prompt | llm | StrOutputParser | JSON parser
  - Output: list of { crop_name, suitability_score, reason }

### Step 1.3: Rule-Based Fallback
- [ ] Create `app/data/crop_rules.json` — crop suitability rules per soil type + season
- [ ] Create `app/services/crop_rules_engine.py`:
  - Score crops against soil NPK ranges, pH, moisture
  - Apply season filter (Kharif/Rabi/Zaid)
  - Apply rotation penalty for previous_crop
  - Return sorted list with scores 0.0–1.0

---

## Phase 2: API + Integration (Day 2)

### Step 2.1: Schemas & Route
- [ ] `CropRequest` — soil_report_id, farm_id, season, previous_crop
- [ ] `CropResponse` — recommended_crops list, rotation_advice, inference_mode
- [ ] `POST /predict/crop` route with cache + DB save

### Step 2.2: LangGraph Node
- [ ] Create `app/agents/nodes.py` — `run_crop_model_node(state)`
- [ ] Create `app/agents/state.py` — `AgriState` TypedDict
- [ ] Create `app/agents/graph.py` — initial graph skeleton

---

## Phase 3: Frontend (Day 3 — half day)

### Step 3.1: New Page
- [ ] Create `Frontend/src/app/components/CropRecommendation.tsx`
- [ ] Add `/crop-recommendation` route to App.tsx
- [ ] Fix sidebar: "Crop Recommendation" → `/crop-recommendation`
- [ ] UI: form (select farm, season, previous crop) → results cards with scores

---

## Acceptance Criteria

- [ ] LLM chain returns ranked crop list with reasoning
- [ ] Rule-based fallback activates when LLM is unavailable
- [ ] Response includes `inference_mode` field
- [ ] Rotation advice accounts for crop history
- [ ] New frontend page exists at `/crop-recommendation`
