# Implementation Plan: Auth & User Management (FEAT-007)

**Priority:** P0 — Must be implemented first (all other features depend on auth)  
**Estimated Effort:** 3 days  

---

## Phase 1: Backend Auth Foundation (Day 1)

### Step 1.1: Project Scaffolding
- [ ] Create `agriai-backend/` directory with FastAPI project structure
- [ ] Create `pyproject.toml` with dependencies: fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, python-jose, bcrypt, pydantic-settings, redis, alembic
- [ ] Create `app/main.py` — FastAPI app factory with lifespan handler
- [ ] Create `app/config.py` — Pydantic Settings class reading env vars
- [ ] Create `Dockerfile` + `docker-compose.yml` (FastAPI + PostgreSQL + Redis)

### Step 1.2: Database Setup
- [ ] Create `app/db/engine.py` — async SQLAlchemy engine + session factory
- [ ] Create `app/db/models/user.py` — User ORM model (all columns per spec)
- [ ] Init Alembic, create initial migration for `users` table
- [ ] Test: `alembic upgrade head` succeeds

### Step 1.3: Auth Schemas
- [ ] Create `app/schemas/auth.py`:
  - `RegisterRequest` (with password complexity validator)
  - `LoginRequest`
  - `RefreshRequest`
  - `UserResponse` (excludes password_hash)
  - `TokenResponse` (access_token + refresh_token)

### Step 1.4: Auth Service
- [ ] Create `app/services/auth_service.py`:
  - `hash_password(plain)` → bcrypt hash
  - `verify_password(plain, hashed)` → bool
  - `create_access_token(user_id, role)` → JWT
  - `create_refresh_token(user_id)` → JWT
  - `verify_token(token)` → payload dict
  - `blacklist_refresh_token(token, redis)` → store in Redis
  - `is_token_blacklisted(token, redis)` → bool

### Step 1.5: Dependencies
- [ ] Create `app/dependencies.py`:
  - `get_db()` → async session
  - `get_redis()` → aioredis connection
  - `get_current_user(token)` → User object (validates JWT, checks active/locked)

---

## Phase 2: Auth Routes (Day 2)

### Step 2.1: Route Handlers
- [ ] Create `app/api/v1/auth.py`:
  - `POST /auth/register` — validate, check duplicate, hash password, insert, return user
  - `POST /auth/login` — verify credentials, check lockout, issue tokens, reset failed attempts
  - `POST /auth/refresh` — verify refresh token, check blacklist, issue new access token
  - `POST /auth/logout` — blacklist refresh token in Redis
  - `GET /auth/me` — return current user profile
  - `PUT /auth/me` — update name/phone

### Step 2.2: Rate Limiting
- [ ] Create `app/utils/rate_limit.py` — Redis sliding window middleware
- [ ] Apply to auth endpoints (10/min per IP)

### Step 2.3: Error Handling
- [ ] Create `app/utils/errors.py` — `ApiError` exception class + exception handler
- [ ] Register exception handler in `main.py`
- [ ] All errors return `{ "error": { "code": "...", "message": "..." } }`

### Step 2.4: CORS
- [ ] Configure CORSMiddleware in `main.py` reading `ALLOWED_ORIGINS`

---

## Phase 3: Frontend Integration (Day 3)

### Step 3.1: API Client Extension
- [ ] Update `Frontend/src/app/api/client.ts`:
  - Add `refresh()`, `logout()`, `updateProfile()` methods
  - Add automatic token refresh on 401 responses (interceptor pattern)
  - Add `Authorization` header injection for all authenticated requests

### Step 3.2: Auth Context
- [ ] Create `Frontend/src/app/auth/AuthContext.tsx` — React context for auth state
- [ ] Create `Frontend/src/app/auth/ProtectedRoute.tsx` — redirect to /login if no token

### Step 3.3: Wire Login/Register Pages
- [ ] Verify Login.tsx works with real API (already partially wired)
- [ ] Wire Register.tsx to `api.register()`, navigate to /login on success
- [ ] Add form validation matching spec password complexity rules

### Step 3.4: Shared Layout
- [ ] Extract sidebar + topbar into `Frontend/src/app/components/Layout.tsx`
- [ ] Wrap all authenticated routes with Layout + ProtectedRoute

---

## Acceptance Criteria

- [ ] User can register with email/password validation
- [ ] User can login and receive access + refresh tokens
- [ ] Protected routes reject unauthenticated requests (401)
- [ ] Token refresh works without re-login
- [ ] Account locks after 5 failed login attempts
- [ ] Rate limiting blocks excessive requests
- [ ] Frontend auth flow works end-to-end
