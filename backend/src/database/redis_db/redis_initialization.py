import redis.asyncio as redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

async def init_cache():
    redis_client = redis.from_url("redis://localhost:6379")
    FastAPICache.init(RedisBackend(redis_client), prefix="myapp-cache")
    return redis_client