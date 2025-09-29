from fastapi import HTTPException
import json
from datetime import timedelta, datetime
from .redis_db.redis_cache_clear import clear_user_cache
from .redis_db import redis_db_services
from ..database import routine_db

async def create_learning_path(cursor, conn, user_id, title, description, path_type):
    try:
        print("✅ ",user_id, title)  # Debugging line
        sql = """
            INSERT INTO LearningPathList (user_id, title, description, path_type, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """
        await cursor.execute(sql, (user_id, title, description, path_type, datetime.now()))
        path_id = cursor.lastrowid
        await conn.commit()
        return path_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in create_learning_path: {e}")

