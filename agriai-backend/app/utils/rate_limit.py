from fastapi import Request
from app.utils.errors import ApiError
from app.config import settings
import redis.asyncio as redis
import time

async def rate_limit(request: Request, limit: int, window: int, redis_client: redis.Redis, key_prefix: str = "rate_limit"):
    client_ip = request.client.host
    key = f"{key_prefix}:{client_ip}"
    
    current_time = int(time.time())
    window_start = current_time - window

    # Redis transaction
    async with redis_client.pipeline(transaction=True) as pipe:
        # Remove old requests
        pipe.zremrangebyscore(key, 0, window_start)
        # Count requests in window
        pipe.zcard(key)
        # Add current request
        pipe.zadd(key, {str(current_time): current_time})
        # Set expiry on the key
        pipe.expire(key, window)
        
        results = await pipe.execute()
        
    request_count = results[1]
    
    if request_count >= limit:
        raise ApiError(
            code="RATE_LIMIT_EXCEEDED",
            message="Too many requests, please try again later.",
            status_code=429
        )
