# Feature Spec: Farm & Soil Management

**Feature ID:** FEAT-008  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

Allows authenticated users to create, update, delete, and manage multiple farm plots, submit soil sensor reports, and record seasonal crop history. This data is the foundation for all prediction features.

---

## Farm Endpoints

### `POST /farms`

Create a new farm. Request:
```json
{
  "name": "North Field",
  "area_hectares": 3.5,
  "latitude": 17.2913,
  "longitude": 74.1847,
  "region": "Karad, Maharashtra"
}
```
Response `201`: Farm object with `farm_id`.

### `GET /farms`

List all farms for the authenticated user. **Paginated:** `?page=1&limit=20`. Response includes `X-Total-Count` header.

### `GET /farms/{farm_id}`

Single farm by ID. Returns `403` if wrong user.

### `PUT /farms/{farm_id}`

Update farm details (name, area, coordinates, region).

### `DELETE /farms/{farm_id}`

Soft-delete a farm (`is_deleted = true`). Cascades to hide soil reports and crop history. Returns `204`.

---

## Soil Report Endpoints

### `POST /farms/{farm_id}/soil-reports`

```json
{
  "nitrogen": 42.5, "phosphorus": 18.0, "potassium": 205.0,
  "ph": 6.8, "moisture_pct": 35.0, "organic_carbon": 0.72,
  "raw_data": { "sensor_id": "S001", "timestamp": "2026-05-14T08:00:00Z" }
}
```
Response `201`: Soil report with `soil_report_id`.

### `GET /farms/{farm_id}/soil-reports`

Paginated, ordered by `reported_at` descending. `?page=1&limit=20`.

### `DELETE /farms/{farm_id}/soil-reports/{report_id}`

Delete a soil report. Returns `204`.

---

## Crop History Endpoints

### `POST /farms/{farm_id}/crop-history`

```json
{
  "crop_name": "Soybean", "season": "Kharif 2025",
  "sown_date": "2025-06-15", "harvest_date": "2025-10-20",
  "actual_yield_kg": 1840.0, "notes": "Moderate drought stress in August"
}
```
Response `201`.

### `GET /farms/{farm_id}/crop-history`

All crop records for a farm, paginated.

---

## Database Schema

### `farms` Table

```sql
CREATE TABLE farms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(120),
    area_hectares   NUMERIC(10, 3) NOT NULL,
    latitude        NUMERIC(10, 7),
    longitude       NUMERIC(10, 7),
    region          VARCHAR(100),
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_farms_user ON farms(user_id) WHERE NOT is_deleted;
```

### `soil_reports` Table

```sql
CREATE TABLE soil_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    reported_at     TIMESTAMPTZ DEFAULT now(),
    nitrogen        NUMERIC(8, 2),
    phosphorus      NUMERIC(8, 2),
    potassium       NUMERIC(8, 2),
    ph              NUMERIC(4, 2),
    moisture_pct    NUMERIC(5, 2),
    organic_carbon  NUMERIC(6, 3),
    raw_data        JSONB
);
CREATE INDEX idx_soil_reports_farm ON soil_reports(farm_id);
```

### `crop_history` Table

```sql
CREATE TABLE crop_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_name       VARCHAR(100) NOT NULL,
    season          VARCHAR(50),
    sown_date       DATE,
    harvest_date    DATE,
    actual_yield_kg NUMERIC(12, 2),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## Validation Rules

- `area_hectares`: positive, max 10,000
- `ph`: 0.0–14.0
- `moisture_pct`: 0.0–100.0
- `latitude`: −90 to 90, `longitude`: −180 to 180
- `harvest_date` ≥ `sown_date` if both provided
- `region`: required, max 100 characters

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `FARM_NOT_FOUND` | 404 | Farm does not exist |
| `ACCESS_DENIED` | 403 | Farm belongs to another user |
| `INVALID_COORDINATES` | 400 | lat/lon out of range |
| `SOIL_REPORT_NOT_FOUND` | 404 | Referenced soil report not found |

---

## Files Involved

```
app/api/v1/farms.py, app/api/v1/soil_reports.py, app/api/v1/crop_history.py,
app/schemas/farm.py, app/schemas/soil.py, app/db/models/farm.py,
app/db/models/soil_report.py, app/db/models/crop_history.py
```
