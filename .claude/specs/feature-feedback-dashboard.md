# Feature Spec: Feedback & Dashboard

**Feature ID:** FEAT-009  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

Feedback lets users rate prediction accuracy. Dashboard provides aggregated activity summary. Together they support model improvement loops and user insights.

---

## Feedback Endpoints

### `POST /feedback`

```json
{
  "prediction_id": "uuid",
  "rating": "correct",
  "comment": "The disease diagnosis was spot on.",
  "actual_outcome": { "disease_name": "Leaf Blight", "confirmed_by": "local agronomist" }
}
```

**`rating` values:** `correct` | `partially_correct` | `incorrect`

Response `201`: `{ "feedback_id": "uuid", "submitted_at": "..." }`

### `GET /feedback/my`

Paginated: `?page=1&limit=20`. Returns all feedback by the authenticated user.

---

## Prediction History & Dashboard Endpoints

### `GET /predictions/history`

Paginated list of all predictions by the authenticated user.

| Param | Description |
|---|---|
| `type` | Filter by prediction type |
| `farm_id` | Filter by farm |
| `page` / `limit` | Pagination (default 1/20) |

### `GET /dashboard/summary`

```json
{
  "total_farms": 2,
  "total_area_hectares": 7.2,
  "predictions_this_month": 14,
  "most_recent_prediction": { "type": "plant_disease", "date": "2026-05-13" },
  "feedback_stats": {
    "total": 20,
    "correct": 15,
    "partially_correct": 3,
    "incorrect": 2,
    "accuracy_pct": 75.0,
    "weighted_accuracy_pct": 82.5
  }
}
```

### Accuracy Calculation

- `accuracy_pct`: `correct / total × 100`
- `weighted_accuracy_pct`: `(correct × 1.0 + partially_correct × 0.5) / total × 100`

---

## Database Schema

```sql
CREATE TYPE feedback_rating AS ENUM ('correct', 'partially_correct', 'incorrect');

CREATE TABLE feedback (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id   UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    rating          feedback_rating NOT NULL,
    comment         TEXT,
    actual_outcome  JSONB,
    submitted_at    TIMESTAMPTZ DEFAULT now(),
    UNIQUE(prediction_id, user_id)
);
CREATE INDEX idx_feedback_user ON feedback(user_id);
```

### `predictions` Table (reference)

```sql
CREATE TYPE prediction_type AS ENUM (
    'soil_analysis', 'fertilizer', 'plant_disease',
    'crop_recommendation', 'yield', 'weather'
);

CREATE TABLE predictions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id),
    farm_id          UUID REFERENCES farms(id),
    soil_report_id   UUID REFERENCES soil_reports(id),
    prediction_type  prediction_type NOT NULL,
    input_payload    JSONB NOT NULL,
    output_payload   JSONB NOT NULL,
    confidence       NUMERIC(5, 4),
    model_version    VARCHAR(80),
    created_at       TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_type ON predictions(prediction_type);
```

---

## Pagination Convention

All list endpoints: `?page=1&limit=20`. Response includes `X-Total-Count` header.

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `PREDICTION_NOT_FOUND` | 404 | `prediction_id` not found |
| `FEEDBACK_ALREADY_SUBMITTED` | 409 | User already rated this prediction |
| `ACCESS_DENIED` | 403 | Prediction belongs to another user |

---

## Files Involved

```
app/api/v1/feedback.py, app/api/v1/dashboard.py,
app/schemas/feedback.py, app/db/models/feedback.py, app/db/models/prediction.py
```
