from fastapi import HTTPException
from datetime import datetime
import json


async def get_user_role(cursor, user_id: str):
    try:
        query = "SELECT role FROM user WHERE user_id = %s"
        await cursor.execute(query, (user_id,))
        result = await cursor.fetchone()
        if not result:
            return None
        # Access role by column name
        return result['role']  # or result.get('role') depending on cursor type
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_user_role: {e}")
