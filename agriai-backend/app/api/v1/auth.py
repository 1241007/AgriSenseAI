from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.engine import get_db
from app.db.redis import get_redis
from app.db.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest, LogoutRequest, UserResponse, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, create_refresh_token, blacklist_refresh_token, verify_token, is_token_blacklisted
from app.dependencies import get_current_user
from app.utils.errors import ApiError
from app.utils.rate_limit import rate_limit
import redis.asyncio as redis
import re
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/auth", tags=["auth"])

def check_password_complexity(password: str):
    if len(password) < 8:
        raise ApiError(code="WEAK_PASSWORD", message="Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise ApiError(code="WEAK_PASSWORD", message="Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise ApiError(code="WEAK_PASSWORD", message="Password must contain at least one lowercase letter")
    if not re.search(r"[0-9]", password):
        raise ApiError(code="WEAK_PASSWORD", message="Password must contain at least one digit")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ApiError(code="WEAK_PASSWORD", message="Password must contain at least one special character")

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(request: Request, payload: RegisterRequest, db: AsyncSession = Depends(get_db), redis_client: redis.Redis = Depends(get_redis)):
    await rate_limit(request, limit=10, window=60, redis_client=redis_client, key_prefix="rate_limit:auth")
    
    check_password_complexity(payload.password)
    
    result = await db.execute(select(User).where(User.email == payload.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise ApiError(code="EMAIL_ALREADY_REGISTERED", message="Email already registered")
        
    hashed_pwd = hash_password(payload.password)
    new_user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        password_hash=hashed_pwd
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return UserResponse(
        user_id=str(new_user.id),
        full_name=new_user.full_name,
        email=new_user.email,
        phone=new_user.phone,
        role=new_user.role,
        created_at=new_user.created_at.isoformat()
    )

@router.post("/login", response_model=TokenResponse)
async def login(request: Request, payload: LoginRequest, db: AsyncSession = Depends(get_db), redis_client: redis.Redis = Depends(get_redis)):
    await rate_limit(request, limit=10, window=60, redis_client=redis_client, key_prefix="rate_limit:auth")
    
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalars().first()
    
    if not user:
        raise ApiError(code="INVALID_CREDENTIALS", message="Invalid email or password", status_code=401)
        
    if user.locked_until and user.locked_until > datetime.now(timezone.utc):
        raise ApiError(code="ACCOUNT_LOCKED", message="Account locked due to too many failed attempts. Try again later.", status_code=403)
        
    if not verify_password(payload.password, user.password_hash):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
        await db.commit()
        raise ApiError(code="INVALID_CREDENTIALS", message="Invalid email or password", status_code=401)
        
    # Reset attempts on success
    if user.failed_login_attempts > 0 or user.locked_until:
        user.failed_login_attempts = 0
        user.locked_until = None
        await db.commit()
        
    if not user.is_active:
        raise ApiError(code="INACTIVE_USER", message="User account is disabled", status_code=403)
        
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=3600
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: Request, payload: RefreshRequest, db: AsyncSession = Depends(get_db), redis_client: redis.Redis = Depends(get_redis)):
    await rate_limit(request, limit=30, window=60, redis_client=redis_client, key_prefix="rate_limit:auth:refresh")
    
    is_blacklisted = await is_token_blacklisted(payload.refresh_token, redis_client)
    if is_blacklisted:
        raise ApiError(code="TOKEN_REVOKED", message="Refresh token has been revoked", status_code=401)
        
    token_payload = verify_token(payload.refresh_token)
    if not token_payload:
        raise ApiError(code="TOKEN_EXPIRED", message="Invalid or expired refresh token", status_code=401)
        
    user_id = token_payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user or not user.is_active:
        raise ApiError(code="INACTIVE_USER", message="User not found or inactive", status_code=403)
        
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=payload.refresh_token,
        expires_in=3600
    )

@router.post("/logout")
async def logout(request: Request, payload: LogoutRequest, redis_client: redis.Redis = Depends(get_redis)):
    await rate_limit(request, limit=30, window=60, redis_client=redis_client, key_prefix="rate_limit:auth:logout")
    await blacklist_refresh_token(payload.refresh_token, redis_client)
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return UserResponse(
        user_id=str(user.id),
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        created_at=user.created_at.isoformat()
    )

@router.put("/me", response_model=UserResponse)
async def update_me(request: Request, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    payload = await request.json()
    if "full_name" in payload:
        user.full_name = payload["full_name"]
    if "phone" in payload:
        user.phone = payload["phone"]
        
    await db.commit()
    await db.refresh(user)
    
    return UserResponse(
        user_id=str(user.id),
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        created_at=user.created_at.isoformat()
    )
