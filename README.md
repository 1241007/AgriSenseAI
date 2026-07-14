# AgriAI

A full-stack agricultural advisory platform.

## Project Overview

AgriAI is a full-stack agricultural advisory platform. The backend is built with FastAPI, PostgreSQL, and Redis. The frontend uses Vite, React, and TypeScript. Machine learning inference is powered by Hugging Face Transformers and scikit-learn, orchestrated through LangChain/LangGraph agents.

## Project Layout

```
/ (root)
├── claude.md                  # This file (primary context for AI-assisted development)
├── .gitignore
├── .gitmodules
├── .claude/
│   ├── plans/                 # Implementation plans (start with master-plan.md)
│   ├── specs/                 # Feature specifications (v2.0)
│   └── settings.local.json
├── agriai-backend/            # Backend source code
│   ├── app/
│   │   ├── main.py            # App factory + lifespan (Redis init, router registration)
│   │   ├── config.py          # Pydantic Settings (reads from .env)
│   │   ├── state.py           # Global Redis client holder
│   │   ├── dependencies.py    # get_db, get_current_user, get_redis
│   │   ├── agents/            # LangGraph graph + nodes
│   │   ├── api/v1/
│   │   │   ├── auth.py                # /auth/* — register, login, refresh, logout, me
│   │   │   ├── farms.py               # /farms/* — CRUD + soft-delete + pagination
│   │   │   ├── soil_reports.py        # /farms/{id}/soil-reports — CRUD + pagination
│   │   │   │   ├── crop_history.py        │   ├── crop_history.py      # /farms/{id}/crop-history — CRUD + pagination
│   │   │   ├── predictions.py         # /predict/* — soil, crop, fertilizer, disease, weather, yield
│   │   │   ├── feedback.py            # /feedback/* — submit + list
│   │   │   └── dashboard.py           # /dashboard/summary + /predictions/history
│   │   ├── data/                  # JSON lookup data + model artifacts
│   │   ├── db/
│   │   │   ├── engine.py          # SQLAlchemy async engine + Base
│   │   │   └── models/
│   │   │       ├── user.py            # User ORM
        │   │       ├── farm.py            # Farm ORM (is_deleted soft-delete)
        │   │       ├── soil_report.py     # SoilReport ORM
        │   │       ├── crop_history.py    # CropHistory ORM
        │   │       ├── prediction.py      # Prediction ORM
        │   │       └── feedback.py        # Feedback ORM
        │   ├── models/                # ML/LLM wrappers + loaders
        │   ├── schemas/
        │   │   ├── auth.py                # Register/Login/Token/UserResponse schemas
        │   │   ├── farm.py                # FarmCreate/Update/Response
        │   │   ├── soil.py                # SoilReportCreate/Response
        │   │   ├── crop_history.py        # CropHistoryCreate/Response
        │   │   ├── prediction.py          # Prediction request/response schemas
        │   │   ├── feedback.py            # Feedback schemas
        │   │   └── dashboard.py           # Dashboard summary schema
        │   ├── services/
        │   │   ├── auth_service.py        # JWT creation/verification, bcrypt, Redis blacklist
        │   │   ├── prediction_service.py  # Prediction logic + persistence + caching
        │   │   ├── weather_service.py     # Weather API + advisory + cache
        │   │   └── crop_rules_engine.py   # Rule-based crop recommendations
        │   └── utils/
        │       ├── errors.py              # ApiError exception + handler
        │   │   ├── rate_limit.py          # Rate limiting dependency
        │   │   ├── ownership.py           # verify_farm_owner(farm_id, user_id, session)
        │   │   ├── cache.py               # Redis cache helpers
        │   │   ├── circuit_breaker.py     # Redis-backed circuit breaker
        │   │   └── image_utils.py         # Image validation/preprocess
        │   ├── alembic/
        │   │   ├── env.py                 # Async Alembic runner (imports all models)
        │   │   └── versions/
        │   │       ├── 0001_create_users_table.py
        │   │       ├── 0002_create_farms_soil_crop_tables.py
        │   │       ├── 1710475a7cce_add_predictions.py
        │   │       └── 726b7bccd485_add_feedback_table.py
        │   ├── alembic.ini
        │   ├── docker-compose.yml         # Postgres 16 + Redis 7 + API service
        │   ├── Dockerfile
        │   ├── pyproject.toml             # Hatchling build + pinned deps
        │   └── .env.example
        └── agriai-frontend/               # Frontend source code
            ├── index.html
            ├── package.json               # Vite + React + Tailwind + Radix + Recharts
            ├── src/
            │   ├── main.tsx
            │   └── app/
            │       ├── App.tsx            # React Router routes
            │       ├── api/
            │   │   └── client.ts          # Centralized fetch wrapper + all API methods + types
            │   ├── auth/
            │   │   ├── AuthContext.tsx
            │   │   └── ProtectedRoute.tsx
            │   └── components/
            │       ├── Sidebar.tsx
            │       ├── Layout.tsx
            │       ├── LandingPage.tsx
            │       ├── Login.tsx          # Wired to auth API
            │       ├── Register.tsx       # Wired to auth API
            │       ├── Dashboard.tsx      # Wired to dashboard + history + weather
            │       ├── FarmManagement.tsx # Fully wired — real API, add/delete/soil reports
            │       ├── SoilAnalysis.tsx   # Calls /predict/soil
            │       ├── FertilizerRecommendation.tsx
            │       ├── DiseaseDetection.tsx
            │       ├── CropRecommendation.tsx
            │       ├── YieldPrediction.tsx
            │       ├── Weather.tsx
            │       ├── PredictionHistory.tsx
            │       ├── Feedback.tsx
            │       ├── ProfileSettings.tsx
            │       └── ui/                # shadcn/ui-style Radix primitives
            └── .env.example
```

## Implemented Features

| ID | Feature | Backend | Frontend |
|----|---------|---------|----------|
| FEAT-007 | Auth & User Management | ✅ Complete | ✅ Wired |
| FEAT-008 | Farm & Soil Management | ✅ Complete | ✅ Wired |
| FEAT-001 | Soil Analysis | ✅ Complete | ✅ Wired |
| FEAT-002 | Fertilizer Suggestion | ✅ Complete | ✅ Wired |
| FEAT-003 | Plant Disease Detection | ✅ Complete | ✅ Wired |
| FEAT-004 | Crop Recommendation | ✅ Complete | ✅ Wired |
| FEAT-005 | Yield Prediction | ✅ Complete | ✅ Wired |
| FEAT-006 | Weather Forecast | ✅ Complete | ✅ Wired |
| FEAT-009 | Feedback & Dashboard | ✅ Complete | ✅ Wired |

## Tech Stack

### Backend
| Layer | Tool |
|-------|------|
| API | FastAPI 0.115, Uvicorn ASGI |
| DB | PostgreSQL 16, SQLAlchemy 2.0 async + asyncpg |
| Cache / Blacklist | Redis 7 |
| Auth | python-jose (JWT HS256) + bcrypt |
| Migrations | Alembic (async runner) |
| AI Orchestration | LangChain 0.2 + LangGraph 0.1 |
| ML Runtime | HuggingFace Transformers, scikit-learn, joblib |
| Build | Hatchling (pyproject.toml) |

### Frontend
| Layer | Tool |
|-------|------|
| UI | React 18 + TypeScript |
| Routing | React Router 7 |
| Build | Vite 6 |
| Styling | TailwindCSS v4 + CSS variables |
| UI Primitives | Radix UI (shadcn/ui-style) |
| Charts | Recharts |
| Icons | lucide-react |

## Key Conventions

### Async everywhere
All DB queries use SQLAlchemy async session. All HTTP calls use `httpx.AsyncClient`. Never use sync I/O in route handlers.

### Pydantic v2
All schemas are Pydantic v2. Validate at the schema layer — never in route handlers or services directly.

### Service layer
Route handlers only: validate input → call service → return response. No DB queries or inference in routes.

### Ownership checks
Always use `verify_farm_owner(farm_id, user_id, session)` from `app/utils/ownership.py` before accessing farm-scoped resources. It raises `ApiError(404)` if not found and `ApiError(403)` if wrong owner.

### Soft-delete
Farms use `is_deleted` flag. Always filter `Farm.is_deleted == False` in queries. `verify_farm_owner` handles this automatically.

### Pagination
All list endpoints accept `?page=1&page_size=20` and return `X-Total-Count` header.

### Error responses
```json
{
  "error": {
    "code": "SNAKE_CASE_CODE",
    "message": "Human readable"
  }
}
```
Use `ApiError(code, message, status_code)` — never raise raw `HTTPException` with string details.

### Prediction persistence
Every prediction writes a row to `predictions` table with `prediction_type` enum, `input_data` JSONB, `result` JSONB.

### Caching strategy
- Prediction cache TTL defaults to 1 hour (see `cache_set` default)
- Weather forecasts: Redis TTL 1h (coords rounded to 2dp)
- Cache key: `{feature}:{sha256(input_params)}`
- Image predictions (disease): not cached

### Model loading
All HuggingFace models loaded once at startup in `models/loader.py` into `MODEL_REGISTRY`. Never load inside a route or service.

### LLM provider
Always use `models/llm_factory.py` — never hardcode provider. Configured via `LLM_PROVIDER` env var (`ollama` default, `openai` optional).

## Database

Core tables: `users`, `farms`, `soil_reports`, `crop_history`, `predictions`, `feedback`

Migrations: `alembic upgrade head` — runs `0001` (users), `0002` (farms, soil_reports, crop_history), `1710475a7cce` (predictions), `726b7bccd485` (feedback).

## Environment Variables

### Backend (`.env` in `agriai-backend/`)
```env
DATABASE_URL=postgresql+asyncpg://agriai:agriai@localhost:5432/agriai
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=change-me-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]
RATE_LIMIT_PER_MINUTE=10

# ML / LLM
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_API_KEY=
OPENAI_MODEL=gpt-3.5-turbo
OPENWEATHERMAP_API_KEY=
```

### Frontend (`.env` in `agriai-frontend/`)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Running Locally

### Backend
```bash
# 1. Start Postgres + Redis
cd agriai-backend
docker-compose up -d db redis

# 2. Install backend deps
pip install -e .

# 3. Copy and fill env
cp .env.example .env

# 4. Run migrations
alembic upgrade head

# 5. Start API
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger)
```

### Frontend
```bash
# Frontend
cd agriai-frontend
npm install        # or pnpm install
npm run dev
# → http://localhost:5173
```

## Frontend API Client

All API calls go through `src/app/api/client.ts`. It handles:
- Bearer token injection from localStorage
- Auto-refresh on 401 (token rotation)
- Typed request/response interfaces for all endpoints

Currently implemented methods: `register`, `login`, `refresh`, `logout`, `me`, `updateProfile`, `changePassword`, `createFarm`, `getFarms`, `getFarm`, `updateFarm`, `deleteFarm`, `createSoilReport`, `getSoilReports`, `deleteSoilReport`, `addCropHistory`, `getCropHistory`, `predictSoil`, `predictCrop`, `predictFertilizer`, `predictDisease`, `predictYield`, `getWeather`, `getPredictionHistory`, `submitFeedback`, `getMyFeedback`, `getDashboardSummary`.

## What Not to Do

### Backend
- No sync DB/HTTP calls in async routes
- No model loading inside route handlers
- No plaintext passwords; never return `password_hash`
- No raw `dict` passing between layers — use Pydantic schemas
- No direct `HTTPException` with string detail — use `ApiError`
- No farm queries without `is_deleted == False` filter
- No hardcoded LLM provider — use `llm_factory.py`
- No external API calls without circuit breaker / timeout

### Frontend
- No direct `fetch()` in components — use `api.*` from `client.ts`
- No hardcoded backend URLs — use `VITE_API_URL` env var
- No sensitive data in localStorage beyond the access token
- No duplicating sidebar/topbar — use shared `Layout.tsx`
- Wrap all authenticated pages with `ProtectedRoute`