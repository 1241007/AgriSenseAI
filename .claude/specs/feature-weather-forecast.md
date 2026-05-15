# Feature Spec: Weather Forecast

**Feature ID:** FEAT-006  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

Retrieves a 7-day (up to 14-day) forecast for a farm's location. Converts raw data into an agricultural advisory using LangChain LLM chain. Includes circuit breaker for external API resilience.

---

## API Endpoint

### `GET /predict/weather`

**Auth:** Bearer JWT required

| Param | Type | Required | Description |
|---|---|---|---|
| `farm_id` | UUID | No | Uses farm's stored lat/lon |
| `lat` | float | No | Latitude |
| `lon` | float | No | Longitude |
| `days` | int | No | Default `7`, max `14` |

> Either `farm_id` or both `lat`/`lon` must be provided.

#### Response `200`

```json
{
  "prediction_id": "uuid",
  "location": "Karad, Maharashtra",
  "summary": "Moderate rainfall next 3 days then clear skies.",
  "forecast": [
    { "date": "2026-05-14", "temp_max_c": 34, "temp_min_c": 24, "rainfall_mm": 0, "humidity_pct": 60, "condition": "Sunny" }
  ],
  "agricultural_advisory": "Delay fertilizer application by 2 days due to expected rain."
}
```

---

## Weather Data Provider

**Primary:** Open-Meteo (free, no API key). **Fallback:** OpenWeatherMap.

### Circuit Breaker

| State | Behavior |
|---|---|
| Closed | Requests go to Open-Meteo |
| Open (after 3 failures) | Fallback to OpenWeatherMap for 60s |
| Half-Open | Test request; success→Closed, fail→Open |

HTTP client: `httpx.AsyncClient` with 10s timeout.

---

## LangChain Summary

LLM via `llm_factory.py`. Fallback: if LLM unavailable, `summary`/`advisory` = `null`.

---

## Caching

- Key: `weather:{lat_2dp}:{lon_2dp}:{days}` — TTL: **1 hour**

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `FARM_NOT_FOUND` | 404 | Farm not found or wrong user |
| `MISSING_LOCATION` | 400 | No farm_id or lat/lon |
| `WEATHER_API_ERROR` | 502 | Both providers failed |
| `LLM_CHAIN_ERROR` | 500 | Summary chain failure |

---

## Files Involved

```
app/api/v1/predictions.py, app/models/weather_chain.py, app/models/llm_factory.py,
app/services/weather_service.py, app/utils/cache.py, app/utils/circuit_breaker.py,
app/agents/nodes.py, app/agents/graph.py
```
