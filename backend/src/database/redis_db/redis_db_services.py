from fastapi_cache.decorator import cache
from .. import food_planning_db, routine_db


def user_key_builder(func, namespace, request, response, *args, **kwargs):
    # FastAPICache sometimes wraps args in kwargs['args']
    actual_args = kwargs.get("args", args)

    if actual_args and len(actual_args) > 0:
        user_id = actual_args[0]  # first argument is always user_id
        func_name = func.__name__  # function name like get_meal_plan
        key = f"{namespace}:{func_name}:{user_id}"
        print(f"[CACHE KEY] {key}")
        return key
    else:
        raise ValueError(f"user_id is required for caching. args: {args}, kwargs: {kwargs}")



# ------------------- Cached functions -------------------

@cache(expire=600, key_builder=user_key_builder)
async def get_meal_plan(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    return await food_planning_db.get_meal_plan(cursor, user_id)


@cache(expire=600, key_builder=user_key_builder)
async def get_user_food_planning_info(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    return await food_planning_db.get_user_food_planning_info(cursor, user_id)


@cache(expire=600, key_builder=user_key_builder)
async def get_groceries_by_user(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    return await food_planning_db.get_groceries_by_user(cursor, user_id)


@cache(expire=600, key_builder=user_key_builder)
async def get_health_alert(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    return await food_planning_db.get_health_alert(cursor, user_id)

@cache(expire=600, key_builder=user_key_builder)
async def get_user_routines(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    return await routine_db.get_user_routines(cursor, user_id)

@cache(expire=600, key_builder=user_key_builder)
async def get_tasks(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    return await routine_db.get_tasks(cursor, user_id)