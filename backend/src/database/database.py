# import mysql.connector
# from mysql.connector import pooling

# # Configure MySQL connection
# dbconfig = {
#     "host": "localhost",
#     "user": "root",
#     "password": "",
#     "database": "lifelense"
# }

# # Connection pool
# connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **dbconfig)

# def get_db():
#     conn = connection_pool.get_connection()
#     cursor = conn.cursor(dictionary=True)
#     try:
#         yield cursor, conn
#     finally:
#         cursor.close()
#         conn.close()

# database.py
import aiomysql
import asyncio
from typing import Optional, Tuple
from fastapi import HTTPException

_pool: Optional[aiomysql.Pool] = None

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "db": "lifelens",
    "minsize": 1,
    "maxsize": 5,
    "autocommit": True,  # we'll explicitly commit/rollback
    "charset": "utf8mb4",
}

async def init_pool() -> None:
    global _pool
    if _pool is None:
        _pool = await aiomysql.create_pool(**DB_CONFIG)

async def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
        await _pool.wait_closed()
        _pool = None

async def get_db():
    """
    FastAPI async dependency that yields (cursor, conn).
    Cursor returns dict rows, e.g. {"col": value}
    """
    if _pool is None:
        # Safety net if startup hook wasn't called
        await init_pool()

    assert _pool is not None
    async with _pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            try:
                yield cursor, conn
            except Exception as e:
                # Generally callers handle rollback, but this is an extra guard.
                try:
                    await conn.rollback()
                except Exception:
                    pass
                raise HTTPException(status_code=500, detail=str(e))
