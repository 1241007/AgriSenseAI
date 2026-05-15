# Feature Spec: Auth & User Management

**Feature ID:** FEAT-007  
**Version:** 2.0  
**Status:** Revised  

---

## Overview

Handles user registration, authentication, profile management, and token lifecycle using JWT-based auth with bcrypt password hashing. All other API features depend on a valid access token from this system. Supports optional OAuth2 providers (Google) for social login.

---

## API Endpoints

### `POST /auth/register`

Register a new user account.

#### Request

```json
{
  "full_name": "Ramesh Patil",
  "email": "ramesh@example.com",
  "phone": "+919876543210",
  "password": "securePassword123!"
}
```

#### Validation

- `full_name`: 2–120 characters, non-empty
- `email`: valid email format, unique
- `phone`: optional, E.164 format
- `password`: min 8 characters, at least one uppercase, one lowercase, one digit, one special character

#### Response `201`

```json
{
  "user_id": "uuid",
  "email": "ramesh@example.com",
  "full_name": "Ramesh Patil",
  "created_at": "2026-05-14T10:00:00Z"
}
```

---

### `POST /auth/login`

Authenticate and receive a JWT access token + refresh token.

#### Request

```json
{
  "email": "ramesh@example.com",
  "password": "securePassword123!"
}
```

#### Response `200`

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### `POST /auth/refresh`

Exchange a valid refresh token for a new access token.

#### Request

```json
{
  "refresh_token": "<jwt>"
}
```

#### Response `200`

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### `POST /auth/logout`

Revoke the current refresh token (server-side blacklist in Redis).

#### Request

```json
{
  "refresh_token": "<jwt>"
}
```

#### Response `200`

```json
{
  "message": "Logged out successfully"
}
```

---

### `GET /auth/me`

Return the authenticated user's profile (requires Bearer token).

#### Response `200`

```json
{
  "user_id": "uuid",
  "full_name": "Ramesh Patil",
  "email": "ramesh@example.com",
  "phone": "+919876543210",
  "role": "user",
  "created_at": "2026-05-14T10:00:00Z"
}
```

---

### `PUT /auth/me`

Update the authenticated user's profile fields (name, phone).

#### Request

```json
{
  "full_name": "Ramesh K. Patil",
  "phone": "+919876543211"
}
```

#### Response `200`

Updated user object.

---

## JWT Configuration

| Setting | Value |
|---|---|
| Algorithm | HS256 |
| Access Token TTL | 60 minutes |
| Refresh Token TTL | 7 days |
| Secret | `JWT_SECRET_KEY` (env var, never hardcoded) |
| Refresh Token Storage | Redis blacklist for revoked tokens |

---

## Password Security

- Hashed with `bcrypt` (cost factor 12) via the `bcrypt` package directly
- Plaintext passwords are never stored or returned in any API response
- Library: `python-jose[cryptography]` for token creation and verification
- Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
- Account lockout: 5 failed login attempts → 15-minute lockout (tracked in Redis)

---

## Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| `user` | Own data CRUD, predictions, feedback |
| `admin` | All user permissions + user management, system dashboard |

Default role on registration: `user`. Role stored in `users.role` column.

---

## Rate Limiting

| Endpoint Group | Limit |
|---|---|
| Auth endpoints (login/register) | 10 requests/minute per IP |
| Auth endpoints (refresh/logout) | 30 requests/minute per user |
| Prediction endpoints | 30 requests/minute per user |

Implemented using a Redis sliding window counter with `aioredis`.

---

## Database

All user records are stored in the `users` table.

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(120) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(20),
    password_hash   TEXT NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'user',
    failed_login_attempts INT DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),
    is_active       BOOLEAN DEFAULT TRUE
);
```

---

## CORS

Allowed origins are configured via the `ALLOWED_ORIGINS` environment variable:

```env
ALLOWED_ORIGINS=https://agriai.com,http://localhost:3000,http://localhost:5173
```

---

## Input Validation

All inputs pass through Pydantic v2 schemas before reaching the DB or any downstream logic. The `password` field is write-only and never included in response schemas.

---

## Error Cases

| Code | HTTP | Condition |
|---|---|---|
| `EMAIL_ALREADY_REGISTERED` | 400 | Duplicate email on register |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `TOKEN_EXPIRED` | 401 | JWT past expiry |
| `TOKEN_REVOKED` | 401 | Refresh token was blacklisted |
| `INACTIVE_USER` | 403 | `is_active = false` |
| `ACCOUNT_LOCKED` | 403 | Too many failed login attempts |
| `WEAK_PASSWORD` | 400 | Password doesn't meet complexity requirements |

---

## Files Involved

```
app/api/v1/auth.py              — Register, login, refresh, logout, /me routes
app/schemas/auth.py             — RegisterRequest, LoginRequest, RefreshRequest, UserResponse
app/services/auth_service.py    — Password hashing, JWT creation/verification, token blacklist
app/db/models/user.py           — SQLAlchemy User ORM model
app/dependencies.py             — get_current_user dependency injection
app/utils/rate_limit.py         — Redis-based rate limiting middleware
```
