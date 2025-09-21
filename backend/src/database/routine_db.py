from fastapi import HTTPException
import json
from datetime import timedelta, datetime
from .redis_db.redis_cache_clear import clear_user_cache
from .redis_db import redis_db_services
from ..database import routine_db


# ✅ Store weekly routine
async def store_weekly_routine(cursor, conn, user_id, routine_data):
    query = """
        INSERT INTO weekly_routines (user_id, routine_name, start_time, end_time, color, description)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    await cursor.execute(
        query,
        (
            user_id,
            routine_data["routine_name"],
            routine_data["startTime"],
            routine_data["endTime"],
            routine_data["color"],
            routine_data["description"],
        ),
    )
    routine_id = cursor.lastrowid
    await conn.commit()

    await clear_user_cache(user_id, "get_user_routines")
    await redis_db_services.get_user_routines(user_id, cursor)

    return routine_id


# ✅ Store routine days
async def store_routine_days(cursor, conn, routine_id, selected_days, user_id):
    query = "INSERT INTO routine_days (routine_id, day_of_week) VALUES (%s, %s)"
    for day in selected_days:
        await cursor.execute(query, (routine_id, day))
    await conn.commit()

    await clear_user_cache(user_id, "get_user_routines")
    await redis_db_services.get_user_routines(user_id, cursor)


async def get_user_routines(cursor, user_id):
    query = """
            SELECT r.routine_id, r.routine_name, r.start_time, r.end_time, r.color, r.description,
                   GROUP_CONCAT(d.day_of_week) as days
            FROM weekly_routines r
            LEFT JOIN routine_days d ON r.routine_id = d.routine_id
            WHERE r.user_id = %s
            GROUP BY r.routine_id
    """
    await cursor.execute(query, (user_id,))
    rows = await cursor.fetchall()

    routines = []
    for row in rows:

        def format_time(value):
            if value is None:
                return None
            if isinstance(value, timedelta):
                # Convert timedelta to HH:MM format
                total_seconds = value.seconds
                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60
                return f"{hours:02}:{minutes:02}"
            return str(value)

        routines.append(
            {
                "routine_id": row["routine_id"],
                "routine_name": row["routine_name"],
                "start_time": format_time(row["start_time"]),
                "end_time": format_time(row["end_time"]),
                "color": row["color"],
                "description": row["description"],
                "days": row["days"].split(",") if row["days"] else [],
            }
        )
    return routines


# ✅ To-Do List Functions
async def store_task(cursor, conn, user_id, task_name):
    try:
        query = "INSERT INTO todo_list (user_id, task_name) VALUES (%s, %s)"
        await cursor.execute(query, (user_id, task_name))
        await conn.commit()
        task_id = cursor.lastrowid

        await clear_user_cache(user_id, "get_tasks")
        await redis_db_services.get_tasks(user_id, cursor)

        return task_id
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_chats: {e}")


async def get_tasks(cursor, user_id):
    query = "SELECT task_id, task_name, completed FROM todo_list WHERE user_id=%s ORDER BY created_at DESC"
    await cursor.execute(query, (user_id,))
    tasks = await cursor.fetchall()
    return tasks


async def toggle_task(cursor, conn, task_id, user_id):
    try:
        query = "UPDATE todo_list SET completed = NOT completed WHERE task_id = %s"
        await cursor.execute(query, (task_id,))
        await conn.commit()

        await clear_user_cache(user_id, "get_tasks")
        await redis_db_services.get_tasks(user_id, cursor)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_chats: {e}")


async def delete_task(cursor, conn, task_id, user_id):
    try:
        query = "DELETE FROM todo_list WHERE task_id = %s"
        await cursor.execute(query, (task_id,))
        await conn.commit()

        await clear_user_cache(user_id, "get_tasks")
        await redis_db_services.get_tasks(user_id, cursor)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_chats: {e}")
