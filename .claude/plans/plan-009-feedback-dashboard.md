# Implementation Plan: Feedback & Dashboard (FEAT-009)

**Priority:** P2  
**Estimated Effort:** 2 days  
**Depends On:** All prediction features (FEAT-001 through FEAT-006)

---

## Phase 1: Backend (Day 1)

### Step 1.1: Database
- [ ] Create `app/db/models/feedback.py` — Feedback ORM with UNIQUE(prediction_id, user_id)
- [ ] Create Alembic migration for `feedback` table + `feedback_rating` enum
- [ ] Add indexes: `idx_feedback_user`

### Step 1.2: Schemas
- [ ] Create `app/schemas/feedback.py`:
  - `FeedbackCreate` — prediction_id, rating (enum), comment, actual_outcome (JSONB)
  - `FeedbackResponse` — feedback_id, rating, comment, submitted_at

### Step 1.3: Feedback Routes
- [ ] Create `app/api/v1/feedback.py`:
  - `POST /feedback` — validate prediction exists + owned by user, check no duplicate, insert
  - `GET /feedback/my` — paginated, user's feedback

### Step 1.4: Dashboard & History Routes
- [ ] Create `app/api/v1/dashboard.py`:
  - `GET /predictions/history` — paginated, filterable by type + farm_id
  - `GET /dashboard/summary` — aggregate query:
    - COUNT farms, SUM area_hectares
    - COUNT predictions this month
    - Most recent prediction
    - Feedback stats: total, correct, partially_correct, incorrect, weighted_accuracy_pct

---

## Phase 2: Frontend (Day 2)

### Step 2.1: Feedback Page
- [ ] Create `Frontend/src/app/components/Feedback.tsx`
- [ ] Add `/feedback` route to App.tsx
- [ ] UI: list of past predictions with rating buttons (correct/partial/incorrect), comment box

### Step 2.2: History Page
- [ ] Create `Frontend/src/app/components/PredictionHistory.tsx`
- [ ] Add `/history` route to App.tsx
- [ ] UI: filterable table with prediction type, date, confidence, farm, feedback status

### Step 2.3: Wire Dashboard
- [ ] Replace hardcoded data in Dashboard.tsx with `GET /dashboard/summary`
- [ ] Wire analytics cards to real counts
- [ ] Wire recent predictions list to `GET /predictions/history?limit=5`

### Step 2.4: Sidebar Fix
- [ ] Fix sidebar links: "History" → `/history`, "Feedback" → `/feedback`

---

## Acceptance Criteria

- [ ] Users can rate predictions (correct/partial/incorrect)
- [ ] Duplicate feedback prevented (409 Conflict)
- [ ] Dashboard shows real aggregated data
- [ ] Prediction history filterable by type and farm
- [ ] Weighted accuracy calculation is correct
