from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis
from app.db.engine import get_db
from app.db.redis import get_redis
from app.db.models.user import User
from app.services.auth_service import verify_token
from app.utils.errors import ApiError
from sqlalchemy import select

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise ApiError(code="TOKEN_EXPIRED", message="Invalid or expired token", status_code=401)
    
    user_id = payload.get("sub")
    if not user_id:
        raise ApiError(code="INVALID_CREDENTIALS", message="Invalid token payload", status_code=401)
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise ApiError(code="INVALID_CREDENTIALS", message="User not found", status_code=401)
        
    if not user.is_active:
        raise ApiError(code="INACTIVE_USER", message="User account is disabled", status_code=403)
        
    return user
