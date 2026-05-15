import json
import hashlib
from typing import Any, Optional
from redis.asyncio import Redis

def make_cache_key(prefix: str, **inputs: Any) -> str:
    """Create a unique cache key based on prefix and inputs."""
    serialized = json.dumps(inputs, sort_keys=True)
    hash_val = hashlib.sha256(serialized.encode()).hexdigest()
    return f"{prefix}:{hash_val}"

async def cache_get(redis: Redis, key: str) -> Optional[Any]:
    """Get a value from cache."""
    data = await redis.get(key)
    if data:
        return json.loads(data)
    return None

async def cache_set(redis: Redis, key: str, value: Any, ttl: int = 3600):
    """Set a value in cache with TTL (default 1 hour)."""
    await redis.set(key, json.dumps(value), ex=ttl)
