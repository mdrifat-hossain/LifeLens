from fastapi import HTTPException
import json
from datetime import datetime, date, timedelta
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
    # ✅ Step 1: Reset routines not completed today
    reset_query = """
        UPDATE weekly_routines
        SET is_completed_today = 0
        WHERE user_id = %s 
        AND (last_completed_date IS NULL OR last_completed_date <> CURDATE());
    """
    await cursor.execute(reset_query, (user_id,))

    query = """
        SELECT 
            r.routine_id, 
            r.routine_name, 
            r.start_time, 
            r.end_time, 
            r.color, 
            r.description,
            r.is_completed_today,
            GROUP_CONCAT(d.day_of_week ORDER BY d.id) AS days,
            COALESCE(lp.is_running, 0) AS is_running
        FROM weekly_routines r
        LEFT JOIN routine_days d 
            ON r.routine_id = d.routine_id
        LEFT JOIN learningpathlist lp
            ON r.path_id = lp.path_id
        WHERE r.user_id = %s
        AND (r.path_id IS NULL OR lp.is_running = 1)
        GROUP BY r.routine_id
        ORDER BY r.start_time;

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
                "is_completed_today": bool(row["is_completed_today"]),
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


async def update_routine(cursor, conn, user_id: int, data: dict):
    try:
        routine_id = data.get("routine_id")  # extract routine_id from data
        if not routine_id:
            raise HTTPException(status_code=400, detail="routine_id is required")

        # print("✅Updating routine in db:", data)

        # Check routine ownership
        await cursor.execute(
            "SELECT user_id FROM weekly_routines WHERE routine_id=%s", (routine_id,)
        )
        routine = await cursor.fetchone()
        if not routine:
            raise HTTPException(status_code=404, detail="Routine not found")
        if routine["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        # Update weekly_routines table
        await cursor.execute(
            """
            UPDATE weekly_routines
            SET routine_name=%s, start_time=%s, end_time=%s, color=%s, description=%s
            WHERE routine_id=%s
            """,
            (
                data["routine_name"],
                data["start_time"],
                data["end_time"],
                data["color"],
                data["description"],
                routine_id,
            ),
        )

        # Delete old routine_days
        await cursor.execute(
            "DELETE FROM routine_days WHERE routine_id=%s", (routine_id,)
        )

        # Insert new selected days
        for day in data["selected_days"]:
            await cursor.execute(
                "INSERT INTO routine_days (routine_id, day_of_week) VALUES (%s, %s)",
                (routine_id, day),
            )

        await conn.commit()
        await clear_user_cache(user_id, "get_user_routines")
        await redis_db_services.get_user_routines(user_id, cursor)

        return {"message": "Routine updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in update_routine: {e}")


async def delete_routine(cursor, conn, user_id: int, routine_id: int):
    try:
        # Check routine ownership
        await cursor.execute(
            "SELECT user_id FROM weekly_routines WHERE routine_id=%s", (routine_id,)
        )
        routine = await cursor.fetchone()
        if not routine:
            raise HTTPException(status_code=404, detail="Routine not found")
        if routine["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        # Delete routine_days first
        await cursor.execute(
            "DELETE FROM routine_days WHERE routine_id=%s", (routine_id,)
        )
        # Delete routine
        await cursor.execute(
            "DELETE FROM weekly_routines WHERE routine_id=%s", (routine_id,)
        )

        await conn.commit()
        await clear_user_cache(user_id, "get_user_routines")
        await redis_db_services.get_user_routines(user_id, cursor)
        return {"message": "Routine deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in delete_routine: {e}")


# db.py


async def update_completed_days(cursor, conn, user_id, routine_id, increment=1):
    try:
        # Get current completed_days
        query = "SELECT completed_days FROM weekly_routines WHERE user_id=%s AND routine_id=%s"
        await cursor.execute(query, (user_id, routine_id))
        row = await cursor.fetchone()
        if not row:
            return None

        current_count = row["completed_days"] if "completed_days" in row else 0
        new_count = max(0, current_count + increment)  # prevent negative

        # Update value
        query = "UPDATE weekly_routines SET completed_days=%s WHERE user_id=%s AND routine_id=%s"
        await cursor.execute(query, (new_count, user_id, routine_id))
        await conn.commit()

        return new_count

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in update_completed_days: {e}"
        )


# db.py

# async def update_routine_completion(cursor, conn, user_id, routine_id, is_completed_today):
#     """
#     Update routine completion for today and adjust completed_days count.
#     """
#     try:
#         # Fetch current state
#         query = """
#             SELECT is_completed_today
#             FROM weekly_routines
#             WHERE user_id=%s AND routine_id=%s
#         """
#         await cursor.execute(query, (user_id, routine_id))
#         row = await cursor.fetchone()

#         if not row:
#             return None

#         current_state = row["is_completed_today"]

#         # Only toggle if different from requested state
#         if current_state != is_completed_today:
#             # Update is_completed_today
#             query = """
#                 UPDATE weekly_routines
#                 SET is_completed_today=%s
#                 WHERE user_id=%s AND routine_id=%s
#             """
#             await cursor.execute(query, (is_completed_today, user_id, routine_id))
#             await conn.commit()

#             # Adjust completed_days accordingly
#             increment = 1 if is_completed_today else -1
#             await update_completed_days(cursor, conn, user_id, routine_id, increment=increment)

#         return is_completed_today

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB error in update_routine_completion: {e}")


async def update_completed_days(cursor, conn, user_id, routine_id, increment=1):
    try:
        query = "SELECT completed_days FROM weekly_routines WHERE user_id=%s AND routine_id=%s"
        await cursor.execute(query, (user_id, routine_id))
        row = await cursor.fetchone()
        if not row:
            return None

        current_count = row.get("completed_days", 0)
        new_count = max(0, current_count + increment)

        query = "UPDATE weekly_routines SET completed_days=%s WHERE user_id=%s AND routine_id=%s"
        await cursor.execute(query, (new_count, user_id, routine_id))
        await conn.commit()

        return new_count

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in update_completed_days: {e}"
        )


# Toggle routine completion
async def toggle_routine(cursor, conn, user_id, routine_id):
    try:
        # Get current state and last_completed_date
        query = "SELECT is_completed_today, last_completed_date FROM weekly_routines WHERE user_id=%s AND routine_id=%s"
        await cursor.execute(query, (user_id, routine_id))
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Routine not found")

        today = date.today()
        last_completed = row.get("last_completed_date")
        current_state = row.get("is_completed_today", False)

        # Reset daily completion if the stored date is not today
        if last_completed != today:
            current_state = False

        # Toggle completion state
        new_state = not current_state
        print(
            f"✅ Toggling routine {routine_id} for user {user_id} from {current_state} to {new_state}"
        )

        # If toggled to True → mark completed for today and increment
        if new_state:
            query = """
                UPDATE weekly_routines
                SET is_completed_today=%s, last_completed_date=%s
                WHERE user_id=%s AND routine_id=%s
            """
            await cursor.execute(query, (True, today, user_id, routine_id))
            await conn.commit()

            # Increment completed_days
            await update_completed_days(cursor, conn, user_id, routine_id, increment=1)

        # If toggled to False → unmark completion and decrement (only if last_completed_date == today)
        else:
            query = """
                UPDATE weekly_routines
                SET is_completed_today=%s, last_completed_date=%s
                WHERE user_id=%s AND routine_id=%s
            """
            await cursor.execute(query, (False, None, user_id, routine_id))
            await conn.commit()

            # Decrement only if previously completed today
            if last_completed == today:
                await update_completed_days(
                    cursor, conn, user_id, routine_id, increment=-1
                )

        return new_state

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in toggle_routine: {e}")


# Get today's progress
async def get_today_progress(cursor, user_id, today_short):
    try:
        # print(f"✅ Fetching today's progress for user {user_id} on {today_short}")
        query = """
            SELECT 
                COUNT(DISTINCT r.routine_id) AS total,
                SUM(CASE WHEN r.is_completed_today=1 THEN 1 ELSE 0 END) AS completed
            FROM weekly_routines r
            JOIN routine_days d ON r.routine_id = d.routine_id
            LEFT JOIN learningpathlist lp ON r.path_id = lp.path_id
            WHERE r.user_id = %s
            AND d.day_of_week = %s
            AND (r.path_id IS NULL OR lp.is_running = 1)
        """
        await cursor.execute(query, (user_id, today_short))
        row = await cursor.fetchone()

        total = row.get("total", 0)
        completed = row.get("completed", 0)
        progress = (completed / total * 100) if total > 0 else 0

        # print(f"✅ Today's progress: {completed}/{total} routines completed ({progress:.2f}%)")

        return {
            "progress": progress,
            "completed_routines": completed,
            "total_routines": total,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_today_progress: {e}"
        )


# get todays routine for free time suggestion
async def get_user_routines_by_days(cursor, user_id):

    query = """
        SELECT
        r.routine_name,
        r.start_time,
        r.end_time,
        r.description,
        (SELECT GROUP_CONCAT(d2.day_of_week ORDER BY d2.id)
            FROM routine_days d2
            WHERE d2.routine_id = r.routine_id) AS days,
        COALESCE(lp.is_running, 0) AS is_running
        FROM weekly_routines r
        LEFT JOIN learningpathlist lp
        ON r.path_id = lp.path_id
        WHERE r.user_id = %s
        AND (r.path_id IS NULL OR lp.is_running = 1)
        AND EXISTS (
            SELECT 1
            FROM routine_days d
            WHERE d.routine_id = r.routine_id
            AND d.day_of_week = ELT(
                DAYOFWEEK(UTC_TIMESTAMP() + INTERVAL 6 HOUR),
                'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
            )
        )
        ORDER BY r.start_time;


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
                "task_name": row["routine_name"],
                "start_time": format_time(row["start_time"]),
                "end_time": format_time(row["end_time"]),
                "description": row["description"],
                "days": row["days"]
            }
        )
    return routines


# ✅ Delete all health alert by user
async def delete_all_free_time_suggestion(cursor, conn, user_id: str):
    try:
        await cursor.execute(
            "DELETE FROM free_time_suggestion WHERE user_id=%s", (user_id,)
        )
        await conn.commit()

        # await clear_user_cache(user_id, "get_health_alert")

        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Insert health alert by user
async def insert_free_time_suggestion(cursor, conn, user_id: str, suggestion: dict, today_user):
    try:
        suggestion_json = json.dumps(suggestion)
        await cursor.execute(
            """
            INSERT INTO free_time_suggestion (user_id, suggestion, generated_date)
            VALUES (%s, %s, %s)
            """,
            (user_id, suggestion_json, today_user),
        )
        await conn.commit()

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Get free time suggestion by user
async def get_free_time_suggestion(cursor, user_id: str, today_user):
    await cursor.execute(
            """
            SELECT suggestion 
            FROM free_time_suggestion 
            WHERE user_id = %s AND generated_date = %s
            """,
            (user_id, today_user),
        )
    existing_record = await cursor.fetchone()
    return existing_record
