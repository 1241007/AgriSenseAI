# Implementation Plan: Cross-Cutting Frontend Improvements

**Priority:** P0–P1 (runs in parallel with backend work)  
**Estimated Effort:** 2 days  
**Depends On:** None (can start immediately)

---

## Phase 1: Architecture Fixes (Day 1)

### Step 1.1: Shared Layout Component
- [ ] Create `Frontend/src/app/components/Layout.tsx`:
  - Extract sidebar + topbar from Dashboard.tsx
  - Accept `activeTab` prop to highlight current page
  - Use `useLocation()` to auto-detect active route
  - Include mobile hamburger + overlay
- [ ] Refactor ALL page components to use `<Layout>` wrapper
- [ ] Remove duplicated sidebar/topbar code from every page (~500 lines saved)

### Step 1.2: Auth Guard
- [ ] Create `Frontend/src/app/auth/AuthContext.tsx`:
  - `AuthProvider` wrapping app with user state
  - `useAuth()` hook returning `{ user, token, login, logout, isLoading }`
  - Auto-fetch `/auth/me` on mount if token exists
- [ ] Create `Frontend/src/app/auth/ProtectedRoute.tsx`:
  - Redirects to `/login` if no token
  - Shows loading spinner while checking auth
- [ ] Wrap all authenticated routes (`/dashboard`, `/farms`, etc.)

### Step 1.3: Error Boundary
- [ ] Create `Frontend/src/app/components/ErrorBoundary.tsx`
- [ ] Wrap app in error boundary with user-friendly fallback UI

### Step 1.4: Loading States
- [ ] Create `Frontend/src/app/components/ui/skeleton-card.tsx` — reusable skeleton
- [ ] Add loading skeletons to Dashboard, FarmManagement, SoilAnalysis

---

## Phase 2: Missing Pages + Route Fixes (Day 2)

### Step 2.1: New Page Stubs
- [ ] Create `CropRecommendation.tsx` — form + results layout
- [ ] Create `YieldPrediction.tsx` — form + results layout
- [ ] Create `WeatherForecast.tsx` — farm selector + forecast cards
- [ ] Create `PredictionHistory.tsx` — filterable table
- [ ] Create `Feedback.tsx` — prediction list with rating UI

### Step 2.2: Route Registration
- [ ] Update `App.tsx` to add all routes:
  - `/crop-recommendation` → CropRecommendation
  - `/yield-prediction` → YieldPrediction
  - `/weather` → WeatherForecast
  - `/history` → PredictionHistory
  - `/feedback` → Feedback

### Step 2.3: Sidebar Fix
- [ ] Update sidebar `menuItems` in Layout.tsx:
  - "Crop Recommendation" → `/crop-recommendation` (not `/fertilizer`)
  - "Yield Prediction" → `/yield-prediction`
  - "Weather" → `/weather`
  - "History" → `/history`
  - "Feedback" → `/feedback`
  - "Settings" → `/settings` (placeholder)
  - All items should have `path` property (no dead buttons)

### Step 2.4: API Client Expansion
- [ ] Extend `client.ts` with authenticated request helper:
  - Auto-inject Bearer token from localStorage
  - Auto-refresh on 401
  - Methods for all endpoints (farms, predictions, feedback, dashboard)

---

## Acceptance Criteria

- [ ] Sidebar/topbar code exists in ONE place (Layout.tsx)
- [ ] Unauthenticated users redirected to /login
- [ ] All 5 missing pages exist as stubs (ready for API wiring)
- [ ] All sidebar links point to correct routes
- [ ] Error boundary catches component crashes gracefully
