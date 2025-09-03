from fastapi_cache import FastAPICache


async def clear_user_cache(user_id: str, func_name: str):
    backend = FastAPICache.get_backend()
    namespace = FastAPICache.get_prefix() 
    key = f"{namespace}::{func_name}:{user_id}"  # note double colon
    await backend.redis.delete(key)
    print(f"[CACHE CLEAR] Cleared {func_name} cache for user {user_id} ({key})")
    