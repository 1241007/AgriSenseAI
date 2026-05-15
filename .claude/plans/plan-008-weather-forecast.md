# Implementation Plan: Weather Forecast (FEAT-006)

**Priority:** P2  
**Estimated Effort:** 2 days  
**Depends On:** FEAT-007 (Auth), FEAT-008 (Farm), LLM Factory (from FEAT-004)

---

## Phase 1: Backend (Day 1)

### Step 1.1: Weather Service
- [ ] Create `app/services/weather_service.py`:
  - `fetch_from_open_meteo(lat, lon, days)` — httpx async GET
  - `fetch_from_openweathermap(lat, lon, days)` — fallback
  - `get_forecast(lat, lon, days)` — tries primary, falls back via circuit breaker
  - Parse response into standardized forecast objects

### Step 1.2: Circuit Breaker
- [ ] Create `app/utils/circuit_breaker.py`:
  - Redis-backed state: CLOSED → OPEN (after 3 failures) → HALF_OPEN (after 60s)
  - Decorator: `@circuit_breaker("weather_api")`

### Step 1.3: LangChain Weather Chain
- [ ] Create `app/models/weather_chain.py`:
  - Prompt: system agricultural weather advisor + user forecast JSON
  - Chain: prompt | llm (from llm_factory) | StrOutputParser
  - Fallback: return null summary/advisory if LLM fails

### Step 1.4: Schemas & Route
- [ ] `WeatherResponse` — location, summary, forecast list, agricultural_advisory
- [ ] `GET /predict/weather` with query params (farm_id or lat/lon + days)
- [ ] Cache: `weather:{lat_2dp}:{lon_2dp}:{days}` TTL 1h

---

## Phase 2: Frontend (Day 2)

### Step 2.1: New Page
- [ ] Create `Frontend/src/app/components/WeatherForecast.tsx`
- [ ] Add `/weather` route to App.tsx
- [ ] Fix sidebar: "Weather" → link to `/weather`
- [ ] UI: farm selector or manual lat/lon → 7-day forecast cards, temperature chart, advisory banner

### Step 2.2: Dashboard Widget
- [ ] Wire dashboard weather widget to real API (use user's first farm)

---

## Acceptance Criteria

- [ ] Open-Meteo fetches 7-day forecast successfully
- [ ] Circuit breaker triggers fallback to OpenWeatherMap after failures
- [ ] LLM generates agricultural advisory from raw forecast
- [ ] Graceful degradation: forecast shown even if LLM fails
- [ ] New frontend page at `/weather`
