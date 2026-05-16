# AgriAI — claude.md

> This file is the primary context document for AI-assisted development on the AgriAI project (backend + frontend). Read it before touching any code.

---

## What This Project Is

AgriAI is a FastAPI-based agricultural advisory backend. It exposes a REST API that runs ML inference (HuggingFace models + scikit-learn), orchestrates multi-step workflows via LangChain/LangGraph agents, and stores all data in PostgreSQL.

This workspace also contains a Vite + React frontend bundle in `Frontend/`. The frontend has UI screens for 8 routes and a minimal API client (`src/app/api/client.ts`) wired for auth endpoints only. Five additional pages (Crop Recommendation, Yield Prediction, Weather, History, Feedback) need to be created.

> **Specs & Plans:** All feature specs live in `.claude/specs/` (v2.0). Implementation plans live in `.claude/plans/` — start with `master-plan.md`.

---

## Project Layout

```
EDI/
├── claude.md
├── agriai-frontend/
│   ├── index.html
│   ├── package.json               # Vite scripts + UI dependencies
│   ├── vite.config.ts             # Vite config + @ alias + figma:asset resolver
│   ├── src/
│   │   ├── main.tsx               # React entrypoint
│   │   ├── app/
│   │   │   ├── App.tsx            # Routes
│   │   │   └── components/        # Screens/pages + UI composition
│   │   │       └── ui/            # shadcn/ui-style primitives (Radix)
│   │   └── styles/                # Tailwind v4 + theme tokens (CSS variables)
│   └── ...
├── .claude/
│   ├── specs/                     # Feature specifications (v2.0)
│   └── plans/                     # Implementation plans + master-plan.md
└── (Backend to be created as `agriai-backend/` — see plans)
```

### Backend Layout (when present)

```
agriai-backend/
├── app/
│   ├── main.py                    # App factory + lifespan handler (model loading)
│   ├── config.py                  # Pydantic Settings (env vars)
│   ├── dependencies.py            # get_db, get_current_user, get_redis
│   ├── api/v1/                    # Route handlers (auth, farms, predictions, feedback, dashboard)
│   ├── models/                    # ML model wrappers + loader.py + llm_factory.py
│   ├── agents/                    # LangGraph graph, nodes, shared state
│   ├── db/                        # SQLAlchemy engine, session, ORM models
│   ├── schemas/                   # Pydantic request/response models
│   ├── services/                  # Business logic (auth, prediction, weather, crop_rules_engine)
│   ├── data/                      # Static data files (fertilizer_guide.json, crop_rules.json, disease_treatments.json)
│   ├── tasks/                     # Celery async tasks (prediction_tasks.py)
│   └── utils/                     # Image utils, Redis cache, rate limiter, circuit breaker, errors
├── migrations/                    # Alembic scripts
├── tests/
├── docker-compose.yml
├── Dockerfile
└── pyproject.toml
```

---

## Tech Stack at a Glance

| Layer | Tool |
|---|---|
| API | FastAPI 0.111+, Uvicorn ASGI |
| AI Orchestration | LangChain 0.2 + LangGraph 0.1 |
| ML Runtime | HuggingFace Transformers, scikit-learn, Torchvision/PIL |
| Database | PostgreSQL 16 (SQLAlchemy 2 async + asyncpg) |
| Cache / Queue | Redis 7 (cache + Celery broker + token blacklist) |
| Auth | python-jose (JWT HS256) + bcrypt (password hashing) |
| HTTP Client | httpx async (with circuit breaker for external APIs) |
| Migrations | Alembic |
| Logging | structlog → JSON stdout |
| LLM | Configurable via `llm_factory.py` — Ollama (default), OpenAI, or any LangChain provider |

### Frontend Stack (this workspace)

| Layer | Tool |
|---|---|
| UI | React 18 + TypeScript |
| Routing | React Router |
| Build | Vite |
| Styling | TailwindCSS v4 + CSS variables theme |
| UI Primitives | shadcn/ui-style components (Radix UI) |
| Charts | Recharts |
| Icons | lucide-react |

Frontend-specific notes:

- Vite supports `figma:asset/<filename>` imports via a custom resolver in `Frontend/vite.config.ts` (maps to `Frontend/src/assets/<filename>`)
- Third-party attributions live in `Frontend/ATTRIBUTIONS.md`

---

## Features

All specs are **v2.0** (revised 2026-05-14). Implementation plans are in `.claude/plans/`.

| ID | Feature | Spec File | Plan File |
|---|---|---|---|
| FEAT-001 | Soil Analysis | `specs/feature-soil-analysis.md` | `plans/plan-003-soil-analysis.md` |
| FEAT-002 | Fertilizer Suggestion | `specs/feature-fertilizer-suggestion.md` | `plans/plan-004-fertilizer-suggestion.md` |
| FEAT-003 | Plant Disease Detection | `specs/feature-plant-disease-detection.md` | `plans/plan-005-plant-disease-detection.md` |
| FEAT-004 | Crop Recommendation | `specs/feature-crop-recommendation.md` | `plans/plan-006-crop-recommendation.md` |
| FEAT-005 | Yield Prediction | `specs/feature-yield-prediction.md` | `plans/plan-007-yield-prediction.md` |
| FEAT-006 | Weather Forecast | `specs/feature-weather-forecast.md` | `plans/plan-008-weather-forecast.md` |
| FEAT-007 | Auth & User Management | `specs/feature-auth-user-management.md` | `plans/plan-001-auth-user-management.md` |
| FEAT-008 | Farm & Soil Management | `specs/feature-farm-soil-management.md` | `plans/plan-002-farm-soil-management.md` |
| FEAT-009 | Feedback & Dashboard | `specs/feature-feedback-dashboard.md` | `plans/plan-009-feedback-dashboard.md` |

---

## Key Conventions

### Always Use Async

All DB queries use `async with session` via SQLAlchemy async engine. All HTTP calls use `httpx.AsyncClient`. Never use synchronous I/O in route handlers.

### Pydantic v2

All request/response schemas are Pydantic v2 models. Validate at the schema layer — never in the route handler or service directly. The `PlantContext` schema in `schemas/shared.py` is reused across disease detection and crop recommendation. Use discriminated unions for endpoints accepting multiple input shapes (e.g., soil analysis: report_id vs inline values).

### Model Loading

All HuggingFace models are loaded **once** at startup in `models/loader.py` into `MODEL_REGISTRY`. Never load a model inside a route handler or service. Access them via `MODEL_REGISTRY["model_key"]`.

### Service Layer

Business logic lives in `services/`. Route handlers in `api/v1/` should only: validate input, call a service, return a response. No DB queries or inference calls directly in routes.

### Prediction Persistence

Every prediction (all six types) writes a row to the `predictions` table. Use `prediction_type` enum to distinguish. Always store `input_payload` and `output_payload` as JSONB.

### Caching Strategy

- Soil-based predictions: Redis TTL 24 hours
- Weather forecasts: Redis TTL 1 hour (coordinates rounded to 2dp for key normalization)
- Cache key pattern: `{feature}:{sha256(input_params)}`
- Image-based predictions (disease): not cached
- Refresh token blacklist: Redis with TTL matching token expiry

### Auth & RBAC

- JWT tokens: access (60min) + refresh (7 days) — see FEAT-007 spec
- Refresh token revocation via Redis blacklist on logout
- Roles: `user` (default), `admin` — stored in `users.role` column
- Account lockout: 5 failed login attempts → 15-minute lockout (Redis counter)
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char

### Resilience Patterns

- **Circuit breaker** for external APIs (Open-Meteo weather): 3 failures → 60s open → half-open test
- **LLM fallback**: Crop recommendation falls back to rule-based engine if LLM unavailable
- **Weather LLM fallback**: Returns raw forecast with `null` summary if LLM chain fails
- **Soft-delete** for farms (`is_deleted` flag, excluded from queries by default)

### Error Responses

All errors return:

```json
{
  "error": {
    "code": "SNAKE_CASE_ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}
```

Never expose stack traces. Map HTTP status codes consistently (400 = bad input, 401 = auth, 403 = forbidden, 404 = not found, 422 = validation, 429 = rate limit, 500 = server error).

---

## AI Models Quick Reference

| Key | Model / Source | Task | Fallback |
|---|---|---|---|
| `plant_disease` | `prof-freakenstein/plantnet-disease-detection` | Image classification | None |
| `fertilizer` | `DNgigi/FertiliserApplication` | Text classification | None |
| `soil_npk` | `GodfreyOwino/NPK_needs_mode2` | Text classification | None |
| `crop_recommend` | LangChain LLM chain (configurable provider) | Ranked crop suggestions | Rule-based engine (`crop_rules.json`) |
| `yield_predict` | scikit-learn `GradientBoostingRegressor` (.joblib) | Yield kg/ha + 80% CI | None |
| `weather_llm` | LangChain chain (configurable provider) | NL weather advisory | Returns `null` summary |

All Transformers pipelines default to `device=-1` (CPU). Set `DEVICE=0` env var for GPU.

### LLM Provider Configuration

LLM-based features (crop recommendation, weather advisory) use a factory in `models/llm_factory.py`:

```python
# Configured via LLM_PROVIDER env var: "ollama" (default), "openai", etc.
llm = get_llm()  # Returns ChatOllama, ChatOpenAI, etc.
```

### Static Data Files

| File | Purpose |
|---|---|
| `app/data/fertilizer_guide.json` | Dosage, application method, notes per fertilizer+crop |
| `app/data/crop_rules.json` | Crop suitability rules for rule-based fallback |
| `app/data/disease_treatments.json` | Treatment plans (chemical/biological/cultural) per disease |

---

## LangGraph Agent Graph

Handles compound queries (e.g., "What should I grow and how much fertilizer?"). Nodes run in this order:

```
fetch_soil → fetch_weather → soil_analysis → crop_recommend → compose
                                           ↘ fertilizer    ↗
```

State schema: `agents/state.py` (`AgriState`). Nodes: `agents/nodes.py`. Graph wiring: `agents/graph.py`.

---

## Database Overview

- **DB name:** `agriai_db`
- **Engine:** PostgreSQL 16
- **ORM:** SQLAlchemy 2.0 async declarative
- **Migrations:** Alembic (`alembic upgrade head`)

Core tables: `users`, `farms`, `crop_history`, `soil_reports`, `predictions`, `feedback`.

JSONB columns are used for `raw_data` (soil sensor payloads) and `input_payload`/`output_payload` (prediction I/O).

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql+asyncpg://agriai:password@db:5432/agriai_db
REDIS_URL=redis://redis:6379/0

# Auth
JWT_SECRET_KEY=your-secret-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# LLM
LLM_PROVIDER=ollama                # ollama | openai
OLLAMA_MODEL=llama3
OPENAI_MODEL=gpt-4o-mini           # only if LLM_PROVIDER=openai
OPENAI_API_KEY=                    # only if LLM_PROVIDER=openai

# External APIs
OPENWEATHERMAP_API_KEY=optional
WEATHER_CIRCUIT_BREAKER_THRESHOLD=3
WEATHER_CIRCUIT_BREAKER_TIMEOUT=60

# ML
HF_MODEL_CACHE=/models
DEVICE=-1                          # -1=CPU, 0=GPU

# CORS
ALLOWED_ORIGINS=https://agriai.com,http://localhost:3000,http://localhost:5173

# Celery
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2
```

Never hardcode secrets. Always read from environment via `config.py` (Pydantic Settings).

---

## Running Locally

```bash
# Start all services
docker compose up

# Apply DB migrations
alembic upgrade head

# Run tests
pytest tests/
```

### Frontend (Vite)

```bash
cd Frontend

# Install deps (works with npm/pnpm)
npm i

# Dev server
npm run dev

# Production build
npm run build
```

Note: `Frontend/package.json` declares `react` and `react-dom` as peer dependencies. If your install/build complains that React is missing, add them explicitly (matching the peer versions) before rerunning the dev server.

API docs available at `http://localhost:8000/docs` (Swagger) and `/redoc`.

---

## Frontend ↔ Backend Contract

- All datetimes: ISO 8601 UTC
- Pagination: `?page=1&limit=20`, `X-Total-Count` response header
- Image upload: `multipart/form-data` to `POST /predict/disease`
- Auth: Bearer token in `Authorization` header, auto-refresh on 401
- Heavy inference jobs: `?async=true` returns `task_id`, poll `GET /tasks/{task_id}`

### Frontend Routes

Client-side routes defined in `Frontend/src/app/App.tsx`:

**Existing (UI scaffolded):**
- `/` → Landing page
- `/login` → Login (wired to auth API)
- `/register` → Register (wired to auth API)
- `/dashboard` → Dashboard (static data — needs API wiring)
- `/farms` → Farm management (static data — needs API wiring)
- `/soil-analysis` → Soil analysis (static data — needs API wiring)
- `/fertilizer` → Fertilizer recommendation (static data — needs API wiring)
- `/disease-detection` → Plant disease detection (static data — needs API wiring)
- `/crop-recommendation` → Crop recommendation
- `/yield-prediction` → Yield prediction
- `/weather` → Weather forecast
- `/history & Feedback` → Prediction history&Feedback submission 

### Frontend Architecture Notes

- API client: `src/app/api/client.ts` — centralized fetch wrapper with error handling
- Token storage: `src/app/auth/token.ts` — localStorage-based
- **Known issue:** Sidebar + topbar code is duplicated across every page component — extract into shared `Layout.tsx`
- **Needed:** `AuthContext` provider, `ProtectedRoute` wrapper, error boundary

---

## What Not to Do

### Backend

- Do not add synchronous DB or HTTP calls in async routes
- Do not load ML models inside route handlers or services
- Do not store plaintext passwords or return `password_hash` in any response
- Do not skip Pydantic validation — no raw `dict` passing between layers
- Do not add new prediction types without updating the `prediction_type` enum in both the DB migration and `schemas/prediction.py`
- Do not hardcode LLM provider — always use `llm_factory.py`
- Do not call external APIs without circuit breaker / timeout
- Do not query farms without filtering by `is_deleted = false`

### Frontend

- Do keep shared UI primitives in `Frontend/src/app/components/ui/` (Radix + shadcn/ui patterns)
- Do use Tailwind utilities + the CSS variables in `Frontend/src/styles/theme.css` for theming
- Do use the centralized API client (`src/app/api/client.ts`) — never call `fetch()` directly in components
- Do wrap authenticated pages with `ProtectedRoute` (once created)
- Don't hardcode backend URLs — use `VITE_API_BASE_URL` env var
- Don't duplicate sidebar/topbar — use shared `Layout.tsx` (once extracted)
- Don't store sensitive data in localStorage beyond the access token
