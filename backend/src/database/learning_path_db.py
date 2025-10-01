from fastapi import HTTPException
import json
from datetime import timedelta, datetime
from .redis_db.redis_cache_clear import clear_user_cache
from .redis_db import redis_db_services
from ..database import routine_db
from datetime import datetime


async def create_learning_path(cursor, conn, user_id, title, description, created_by):
    try:
        print("✅ ", user_id, title)  # Debugging line
        sql = """
            INSERT INTO LearningPathList (user_id, title, description, created_by, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """
        await cursor.execute(
            sql, (user_id, title, description, created_by, datetime.now())
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
            SELECT path_id, user_id, title, description, created_by, created_at
            FROM LearningPathList
            WHERE user_id = %s
            ORDER BY created_at DESC
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
            r.routine_name,
            CAST(r.start_time AS CHAR) AS start_time,
            CAST(r.end_time AS CHAR) AS end_time,
            r.description,
            d.day_of_week
        FROM weekly_routines r
        JOIN routine_days d 
            ON r.routine_id = d.routine_id
        WHERE r.user_id = %s
        ORDER BY r.routine_id DESC, d.day_of_week
        """
        await cursor.execute(sql, (user_id,))
        rows = await cursor.fetchall()  # returns list of dicts if DictCursor

        return rows
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"DB error in get_routine_details_for_ai: {e}"
        )



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
            SELECT item_id, title, type, description, created_at, sort_order
            FROM LearningPathItems
            WHERE path_id = %s AND user_id = %s
            ORDER BY sort_order ASC
        """
        await cursor.execute(sql, (path_id, user_id))
        rows = await cursor.fetchall()
        # print(f"✅Data fetched: {rows}")

        items = []
        for row in rows:
            created_val = row["created_at"] if isinstance(row, dict) else row[4]

            if created_val:
                if isinstance(created_val, str):
                    created_val = datetime.strptime(
                        created_val, "%Y-%m-%d %H:%M:%S"
                    ).isoformat()
                elif isinstance(created_val, datetime):
                    created_val = created_val.isoformat()

            items.append(
                {
                    "item_id": row["item_id"] if isinstance(row, dict) else row[0],
                    "title": row["title"] if isinstance(row, dict) else row[1],
                    "type": row["type"] if isinstance(row, dict) else row[2],
                    "description": (
                        row["description"] if isinstance(row, dict) else row[3]
                    ),
                    "created_at": created_val,
                }
            )

        return items  # ✅ return after finishing the loop

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
    await cursor.execute("""
        INSERT INTO learningpathlist (user_id, title, description, created_by, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, path_title, path_description, user_id, created_at))
    path_id = cursor.lastrowid

    # Insert levels into learningpathitems
    for lvl in levels:
        await cursor.execute("""
            INSERT INTO learningpathitems (path_id, user_id, title, type, description, created_at, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            path_id,
            user_id,
            lvl["title"],
            "level",
            lvl["description"],
            created_at,
            lvl["level_num"]
        ))

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
        await cursor.execute("""
            INSERT INTO weekly_routines (user_id, routine_name, start_time, end_time, color, description)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_id, routine_name, start_time, end_time, color, description))
        routine_id = cursor.lastrowid

        # Insert into routine_days
        await cursor.execute("""
            INSERT INTO routine_days (routine_id, day_of_week)
            VALUES (%s, %s)
        """, (routine_id, r["day_of_week"]))


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
    cursor, conn, user_id, path_id, title, item_type, description,
    focus=None, skills=None, sources=None, duration=None
):
    try:
        # 1️⃣ Find the current max sort_order for this path_id
        await cursor.execute(
            "SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM learningpathitems WHERE path_id = %s",
            (path_id,)
        )
        row = await cursor.fetchone()
        last_order = row["max_order"] if row else 0
        new_order = last_order + 1

        # 2️⃣ Ensure JSON fields are valid
        skills_json = json.dumps(skills or [])
        sources_json = json.dumps(sources or [])

        # 3️⃣ Insert the new item with incremented sort_order
        sql = """
            INSERT INTO learningpathitems
            (path_id, user_id, title, type, description, created_at, sort_order, focus, skills, sources, duration)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        await cursor.execute(
            sql,
            (path_id,user_id,title,item_type,description,datetime.now(),new_order,focus,skills_json,sources_json,duration)
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
        raise HTTPException(status_code=500, detail=f"DB error in create_path_item_source: {e}")


# 3️⃣ Create weekly routine
async def create_weekly_routine(cursor, conn, user_id, routine_name, start_time, end_time, color, description):
    try:
        print("✅ ", user_id, routine_name, start_time, end_time, color, description) 
        sql = """
            INSERT INTO weekly_routines (user_id, routine_name, start_time, end_time, color, description)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        await cursor.execute(sql, (user_id, routine_name, start_time, end_time, color, description))
        await conn.commit()
        
        await clear_user_cache(user_id, "get_user_routines")
        await redis_db_services.get_user_routines(user_id, cursor)
        
        return cursor.lastrowid
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in create_weekly_routine: {e}")



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
        raise HTTPException(status_code=500, detail=f"DB error in create_routine_day: {e}")