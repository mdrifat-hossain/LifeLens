from fastapi import HTTPException
import json
from datetime import timedelta, datetime
from .redis_db.redis_cache_clear import clear_user_cache
from .redis_db import redis_db_services
from ..database import routine_db
from datetime import datetime


async def create_learning_path(cursor, conn, user_id, title, description, created_by):
    try:
        print("✅ Creating path for:", user_id, title)

        # 1️⃣ Find the current highest sort_order for this user
        sql_max_order = """
            SELECT COALESCE(MAX(sort_order), 0) AS max_order
            FROM LearningPathList
            WHERE user_id = %s
        """
        await cursor.execute(sql_max_order, (user_id,))
        row = await cursor.fetchone()
        next_sort_order = row['max_order'] + 1  # next order

        # 2️⃣ Insert the new path with the calculated sort_order
        sql_insert = """
            INSERT INTO LearningPathList 
                (user_id, title, description, created_by, created_at, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        await cursor.execute(
            sql_insert,
            (user_id, title, description, created_by, datetime.now(), next_sort_order)
        )

        path_id = cursor.lastrowid
        await conn.commit()
        return path_id

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in create_learning_path: {e}"
        )



# ✅ Get all learning paths for a user
async def get_learning_paths(cursor, user_id):
    try:
        sql = """
            SELECT path_id, user_id, title, description, created_by, created_at, is_running, sort_order
            FROM LearningPathList
            WHERE user_id = %s
            ORDER BY sort_order
        """
        await cursor.execute(sql, (user_id,))
        rows = await cursor.fetchall()
        return rows
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_learning_paths: {e}"
        )


# ✅ Get single learning path
async def get_learning_path(cursor, user_id, path_id):
    try:
        sql = """
            SELECT path_id, title, description, created_by, created_at
            FROM LearningPathList
            WHERE user_id = %s AND path_id = %s
        """
        await cursor.execute(sql, (user_id, path_id))
        row = await cursor.fetchone()
        return row
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_learning_path: {e}"
        )


async def get_learning_path_for_ai(cursor, user_id, path_id):
    try:
        sql = """
            SELECT title, description
            FROM LearningPathList
            WHERE user_id = %s AND path_id = %s
        """
        await cursor.execute(sql, (user_id, path_id))
        row = await cursor.fetchone()
        return row
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_learning_path: {e}"
        )


async def get_learning_path_details_for_ai(cursor, user_id, path_id):
    try:
        sql = """
            SELECT 
                l.title AS path_title,
                l.description AS path_description,
                i.title AS item_title,
                i.description AS item_description
            FROM learningpathlist l
            JOIN learningpathitems i 
                ON l.path_id = i.path_id
            WHERE l.path_id = %s AND l.user_id = %s
            ORDER BY i.sort_order ASC
        """
        await cursor.execute(sql, (path_id, user_id))
        rows = await cursor.fetchall()  # fetch all rows, not just one
        return rows
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_learning_path: {e}"
        )


async def get_routine_details_for_ai(cursor, user_id):
    try:
        sql = """
            SELECT 
                d.day_of_week,
                GROUP_CONCAT(
                    CONCAT(
                        TIME_FORMAT(r.start_time, '%%H:%%i'), '-', 
                        TIME_FORMAT(r.end_time, '%%H:%%i')
                    ) ORDER BY r.start_time SEPARATOR ', '
                ) AS time_slots
            FROM routine_days d
            JOIN weekly_routines r ON d.routine_id = r.routine_id
            WHERE r.user_id = %s
            GROUP BY d.day_of_week
            ORDER BY FIELD(d.day_of_week, 'Sun','Mon','Tue','Wed','Thu','Fri','Sat');
        """
        await cursor.execute(sql, (user_id,))
        rows = await cursor.fetchall()

        return rows
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_routine_details_for_ai: {e}"
        )
        
async def is_path_in_weekly_routines(cursor, user_id: int, path_id: int) -> bool:
    """
    Checks if a given path_id exists in weekly_routines for the user.
    Returns True if exists, False otherwise.
    """
    sql = "SELECT COUNT(*) AS count FROM weekly_routines WHERE path_id = %s AND user_id = %s"
    await cursor.execute(sql, (path_id, user_id))
    row = await cursor.fetchone()
    return row['count'] > 0



# async def create_path_item(
#     cursor, conn, user_id, path_id, title, item_type, description
# ):
#     try:
#         # print("✅ ", user_id, path_id, title)
#         sql = """
#             INSERT INTO LearningPathItems (path_id, user_id, title, type, description, created_at)
#             VALUES (%s, %s, %s, %s, %s, %s)
#         """
#         await cursor.execute(
#             sql, (path_id, user_id, title, item_type, description, datetime.now())
#         )
#         item_id = cursor.lastrowid
#         await conn.commit()
#         return item_id
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"DB error in create_path_item: {e}"
#         )


async def get_path_items(cursor, path_id, user_id):
    try:
        sql = """
            SELECT item_id, title, type, description, created_at, focus, skills, sort_order, sources, duration
            FROM LearningPathItems
            WHERE path_id = %s AND user_id = %s
            ORDER BY sort_order ASC
        """
        await cursor.execute(sql, (path_id, user_id))
        rows = await cursor.fetchall()

        items = []
        for row in rows:
            # Handle dictionary or tuple
            get = lambda key, idx: row[key] if isinstance(row, dict) else row[idx]

            created_val = get("created_at", 4)
            if created_val:
                if isinstance(created_val, str):
                    created_val = datetime.strptime(created_val, "%Y-%m-%d %H:%M:%S").isoformat()
                elif isinstance(created_val, datetime):
                    created_val = created_val.isoformat()

            # Parse JSON fields safely
            skills = []
            sources = []
            try:
                skills = json.loads(get("skills", 6) or "[]")
            except:
                pass
            try:
                sources = json.loads(get("sources", 8) or "[]")
            except:
                pass

            items.append(
                {
                    "item_id": get("item_id", 0),
                    "title": get("title", 1),
                    "type": get("type", 2),
                    "description": get("description", 3),
                    "created_at": created_val,
                    "focus": get("focus", 5),
                    "skills": skills,
                    "sources": sources,
                    "sort_order": get("sort_order", 7),
                    "duration": get("duration", 9),
                }
            )
        return items

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_path_items: {e}")



async def update_order(cursor, conn, path_id, user_id, items):
    """
    items = [
        {"item_id": 10, "order_index": 0},
        {"item_id": 12, "order_index": 1},
        ...
    ]
    """
    try:
        # print(f"✅ Updating order for path_id: {path_id}, user_id: {user_id}, items: {items}")
        for item in items:
            sql = """
                UPDATE LearningPathItems
                SET sort_order = %s
                WHERE item_id = %s AND path_id = %s AND user_id = %s
            """
            await cursor.execute(
                sql, (item["order_index"], item["item_id"], path_id, user_id)
            )
        await conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in update_order: {e}")


async def update_learning_path_order(cursor, conn, user_id, items):
    """
    items = [
        {"path_id": 5, "sort_order": 0, "is_running": 1},
        {"path_id": 7, "sort_order": 1, "is_running": 0},
        ...
    ]
    """
    try:
        print(f"✅ Updating path order for user_id: {user_id}, items: {items}")
        for item in items:
            sql = """
                UPDATE LearningPathList
                SET sort_order = %s, is_running = %s
                WHERE path_id = %s AND user_id = %s
            """
            await cursor.execute(sql, (
                item["sort_order"], 
                item.get("is_running", 0),  # default 0 if not passed
                item["path_id"], 
                user_id
            ))
        await conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in update_order: {e}")



async def update_learning_path_running(
    cursor, conn, user_id, path_id, is_running, sort_order=None
):
    """
    Updates:
    - is_running: 1 or 0
    - optionally sort_order if provided
    """
    try:
        if sort_order is not None:
            sql = """
                UPDATE LearningPathList
                SET is_running = %s, sort_order = %s
                WHERE path_id = %s AND user_id = %s
            """
            await cursor.execute(sql, (is_running, sort_order, path_id, user_id))
        else:
            sql = """
                UPDATE LearningPathList
                SET is_running = %s
                WHERE path_id = %s AND user_id = %s
            """
            await cursor.execute(sql, (is_running, path_id, user_id))

        await conn.commit()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in update_running: {e}")


async def update_learning_path(cursor, conn, user_id, path_id, title, description):
    """
    Updates the title and description of a learning path for a specific user.
    """
    try:
        sql = """
            UPDATE LearningPathList
            SET title = %s, description = %s
            WHERE path_id = %s AND user_id = %s
        """
        await cursor.execute(sql, (title, description, path_id, user_id))
        await conn.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in update_learning_path: {e}"
        )


async def delete_learning_path(cursor, conn, user_id, path_id):
    """
    Deletes a learning path and all its items for the given user.
    """
    try:
        weekly_routines = "DELETE FROM weekly_routines WHERE path_id = %s AND user_id = %s"
        await cursor.execute(weekly_routines, (path_id, user_id))
        
        # 1️⃣ Delete all items associated with this path
        sql_items = "DELETE FROM LearningPathItems WHERE path_id = %s AND user_id = %s"
        await cursor.execute(sql_items, (path_id, user_id))


        # 2️⃣ Delete the path itself
        sql_path = "DELETE FROM LearningPathList WHERE path_id = %s AND user_id = %s"
        await cursor.execute(sql_path, (path_id, user_id))

        await conn.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in delete_learning_path: {e}"
        )


async def update_path_item(
    cursor, conn, item_id, user_id, title, item_type, description
):
    try:
        print(
            f"✅ Updating_db item_id: {item_id}, user_id: {user_id}, title: {title}, type: {item_type}, description: {description}"
        )
        sql = """
            UPDATE LearningPathItems
            SET title=%s, type=%s, description=%s
            WHERE item_id=%s AND user_id=%s
        """
        await cursor.execute(sql, (title, item_type, description, item_id, user_id))
        await conn.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in update_path_item: {e}"
        )


async def delete_path_item(cursor, conn, item_id, user_id):
    try:
        sql = "DELETE FROM LearningPathItems WHERE item_id=%s AND user_id=%s"
        await cursor.execute(sql, (item_id, user_id))
        await conn.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in delete_path_item: {e}"
        )


async def save_learning_path(cursor, user_id, path_title, path_description, levels):
    created_at = datetime.now()
    # Insert into learningpathlist
    await cursor.execute(
        """
        INSERT INTO learningpathlist (user_id, title, description, created_by, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """,
        (user_id, path_title, path_description, user_id, created_at),
    )
    path_id = cursor.lastrowid

    # Insert levels into learningpathitems
    for lvl in levels:
        await cursor.execute(
            """
            INSERT INTO learningpathitems (path_id, user_id, title, type, description, created_at, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
            (
                path_id,
                user_id,
                lvl["title"],
                "level",
                lvl["description"],
                created_at,
                lvl["level_num"],
            ),
        )

    return path_id


async def save_weekly_routine(cursor, user_id, routines):
    created_at = datetime.now()
    for r in routines:
        routine_name = "Learning Session"
        start_time = r["start_time"]
        end_time = r["end_time"]
        color = "#34D399"
        description = r["description"]

        # Insert into weekly_routines
        await cursor.execute(
            """
            INSERT INTO weekly_routines (user_id, routine_name, start_time, end_time, color, description)
            VALUES (%s, %s, %s, %s, %s, %s)
        """,
            (user_id, routine_name, start_time, end_time, color, description),
        )
        routine_id = cursor.lastrowid

        # Insert into routine_days
        await cursor.execute(
            """
            INSERT INTO routine_days (routine_id, day_of_week)
            VALUES (%s, %s)
        """,
            (routine_id, r["day_of_week"]),
        )


#
# Clear user cache after updates
#
# 1️⃣ Create learning path (list)
# async def create_learning_path(cursor, conn, user_id, title, description, created_by, created_at):
#     try:
#         sql = """
#             INSERT INTO learningpathlist (user_id, title, description, created_by, created_at)
#             VALUES (%s, %s, %s, %s, %s)
#         """
#         await cursor.execute(sql, (user_id, title, description, created_by, created_at))
#         await conn.commit()
#         return cursor.lastrowid
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB error in create_learning_path: {e}")


# 2️⃣ Create path item (level)
async def create_path_item(
    cursor,
    conn,
    user_id,
    path_id,
    title,
    item_type,
    description,
    focus=None,
    skills=None,
    sources=None,
    duration=None,
):
    try:
        # 1️⃣ Calculate next sort_order
        await cursor.execute(
            "SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM learningpathitems WHERE path_id = %s",
            (path_id,),
        )
        row = await cursor.fetchone()
        last_order = row["max_order"] if row else 0
        new_order = last_order + 1

        # 2️⃣ Prepare JSON/text fields
        skills_json = json.dumps(skills or [])
        sources_json = json.dumps(sources or [])
        focus = focus or ""
        duration = duration or ""

        # 3️⃣ Insert item
        sql = """
            INSERT INTO learningpathitems
            (path_id, user_id, title, type, description, created_at, sort_order, focus, skills, sources, duration)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        await cursor.execute(
            sql,
            (
                path_id,
                user_id,
                title,
                item_type,
                description,
                datetime.now(),
                new_order,
                focus,
                skills_json,
                sources_json,
                duration,
            ),
        )
        item_id = cursor.lastrowid
        await conn.commit()
        return item_id, new_order

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in create_path_item: {e}"
        )


# 2a️⃣ Optional: store item sources
async def create_path_item_source(cursor, conn, item_id, name, url):
    try:
        sql = "INSERT INTO learningpathitem_sources (item_id, name, url) VALUES (%s, %s, %s)"
        await cursor.execute(sql, (item_id, name, url))
        await conn.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in create_path_item_source: {e}"
        )


# 3️⃣ Create weekly routine
async def create_weekly_routine(
    cursor,
    conn,
    user_id,
    routine_name,
    start_time,
    end_time,
    color,
    description,
    path_type,
    path_id
):
    try:
        print("✅ ", user_id, routine_name, start_time, end_time, color, description)
        sql = """
            INSERT INTO weekly_routines
            (user_id, routine_name, start_time, end_time, color, description, routine_type, path_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        await cursor.execute(
            sql,
            (
                user_id,
                routine_name,
                start_time,
                end_time,
                color,
                description,
                path_type,
                path_id
            ),
        )
        await conn.commit()

        # await clear_user_cache(user_id, "get_user_routines")
        # await redis_db_services.get_user_routines(user_id, cursor)

        return cursor.lastrowid
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in create_weekly_routine: {e}"
        )


# 4️⃣ Create routine day
async def create_routine_day(cursor, conn, user_id, routine_id, day_of_week):
    try:
        sql = "INSERT INTO routine_days (routine_id, day_of_week) VALUES (%s, %s)"
        await cursor.execute(sql, (routine_id, day_of_week))
        await conn.commit()
        await clear_user_cache(user_id, "get_user_routines")
        await redis_db_services.get_user_routines(user_id, cursor)
        return cursor.lastrowid
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in create_routine_day: {e}"
        )


async def get_learning_path_progress(cursor, conn, user_id):
    try:
        print(f"✅ Calculating learning path progress for user_id: {user_id}")
        # 1. Get active learning paths
        await cursor.execute("""
            SELECT path_id, title, description
            FROM learningpathlist
            WHERE user_id = %s AND is_running = 1
            ORDER BY sort_order
        """, (user_id,))
        paths = await cursor.fetchall()
        print(f"✅ Found {len(paths)} active learning paths for user_id: {user_id}")

        result = []

        for path in paths:
            path_id = path["path_id"]
            path_title = path["title"]  # Learning path title

            # 2. Get completed days
            await cursor.execute("""
                SELECT COALESCE(SUM(completed_days), 0) AS total_completed_days
                FROM weekly_routines
                WHERE path_id = %s AND user_id = %s
            """, (path_id, user_id))
            row = await cursor.fetchone()
            completed_days = row["total_completed_days"] or 0
            completed_weeks = completed_days // 7

            # 3. Get levels (items)
            await cursor.execute("""
                SELECT 
                    l.title AS path_title,
                    i.item_id,
                    i.title AS item_title,
                    i.description,
                    i.duration,
                    CAST(SUBSTRING_INDEX(i.duration, ' ', 1) AS UNSIGNED) AS weeks
                FROM learningpathitems i
                JOIN learningpathlist l 
                    ON i.path_id = l.path_id
                WHERE i.path_id = %s 
                AND l.user_id = %s
                ORDER BY i.sort_order;
            """, (path_id,user_id))
            items = await cursor.fetchall()

            prev_weeks = 0
            for item in items:
                weeks_required = item["weeks"]
                status = "Locked"
                progress = 0

                if completed_weeks >= weeks_required:
                    status = "Completed"
                    progress = 100
                elif completed_weeks >= prev_weeks and completed_weeks < weeks_required:
                    status = "In Progress"
                    total_level_days = (weeks_required - prev_weeks) * 7
                    current_level_days = (completed_weeks - prev_weeks) * 7 + (completed_days % 7)
                    progress = int((current_level_days / total_level_days) * 100)
                else:
                    status = "Locked"

                result.append({
                    "path_title": path_title,          # Added learning path title
                    "title": item["item_title"],       # Level/item title
                    "description": item["description"],
                    "duration_weeks": weeks_required,
                    "status": status,
                    "progress": progress,
                })

                prev_weeks = weeks_required

        print(f"✅ Learning path progress for user_id {user_id}: {result}")
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_learning_path_progress: {e}")
