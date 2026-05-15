# Implementation Plan: Farm & Soil Management (FEAT-008)

**Priority:** P0 — Foundation data for all prediction features  
**Estimated Effort:** 2 days  
**Depends On:** FEAT-007 (Auth)

---

## Phase 1: Backend (Day 1)

### Step 1.1: Database Models & Migrations
- [ ] Create `app/db/models/farm.py` — Farm ORM (with `is_deleted` soft-delete)
- [ ] Create `app/db/models/soil_report.py` — SoilReport ORM
- [ ] Create `app/db/models/crop_history.py` — CropHistory ORM
- [ ] Create Alembic migration for `farms`, `soil_reports`, `crop_history` tables
- [ ] Add indexes: `idx_farms_user`, `idx_soil_reports_farm`

### Step 1.2: Schemas
- [ ] Create `app/schemas/farm.py`: `FarmCreate`, `FarmUpdate`, `FarmResponse`
- [ ] Create `app/schemas/soil.py`: `SoilReportCreate`, `SoilReportResponse`
- [ ] Create `app/schemas/crop_history.py`: `CropHistoryCreate`, `CropHistoryResponse`
- [ ] Add validators: area > 0 & ≤ 10000, pH 0-14, moisture 0-100, coordinates range, harvest ≥ sown

### Step 1.3: Route Handlers
- [ ] Create `app/api/v1/farms.py`:
  - `POST /farms` — create farm, link to current user
  - `GET /farms` — list user's farms (paginated, exclude deleted)
  - `GET /farms/{farm_id}` — single farm with ownership check
  - `PUT /farms/{farm_id}` — update with ownership check
  - `DELETE /farms/{farm_id}` — soft-delete
- [ ] Create `app/api/v1/soil_reports.py`:
  - `POST /farms/{farm_id}/soil-reports` — create, verify farm ownership
  - `GET /farms/{farm_id}/soil-reports` — paginated, desc by reported_at
  - `DELETE /farms/{farm_id}/soil-reports/{report_id}`
- [ ] Create `app/api/v1/crop_history.py`:
  - `POST /farms/{farm_id}/crop-history`
  - `GET /farms/{farm_id}/crop-history` — paginated

### Step 1.4: Ownership Middleware
- [ ] Create `app/utils/ownership.py` — reusable helper: `verify_farm_owner(farm_id, user_id, session)`

---

## Phase 2: Frontend Wiring (Day 2)

### Step 2.1: API Client
- [ ] Add to `client.ts`: `createFarm()`, `getFarms()`, `getFarm()`, `updateFarm()`, `deleteFarm()`
- [ ] Add soil report methods: `createSoilReport()`, `getSoilReports()`, `deleteSoilReport()`
- [ ] Add crop history methods: `addCropHistory()`, `getCropHistory()`

### Step 2.2: Wire FarmManagement.tsx
- [ ] Replace hardcoded farm data with API calls
- [ ] Wire "Add Farm" modal form to `createFarm()` — add `region` field
- [ ] Add delete confirmation dialog
- [ ] Add loading skeletons and error states

### Step 2.3: Farm Detail Soil Reports
- [ ] When farm selected, fetch and display real soil reports
- [ ] Add "Submit Soil Report" form in farm detail view

---

## Acceptance Criteria

- [ ] CRUD operations work for farms, soil reports, crop history
- [ ] Ownership enforcement — users can only access their own farms
- [ ] Soft-delete works correctly (deleted farms hidden from lists)
- [ ] Pagination works with correct X-Total-Count header
- [ ] Frontend displays real data from API
