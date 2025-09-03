from fastapi import HTTPException
import json
from .redis_db.redis_cache_clear import clear_user_cache
from .redis_db import redis_db_services

# ✅ Delete old user meal info
async def delete_old_user_meal_info(cursor, conn, user_id: str):
    try:
        await cursor.execute("DELETE FROM food_planning WHERE user_id=%s", (user_id,))
        await conn.commit()
        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Store survey info in food_planning
async def store_users_foodPlanning_info(cursor, conn, user_id: str, survey_data: dict):
    try:
        await cursor.execute("""
            INSERT INTO food_planning (
                user_id, age, gender, height, weight, dietary_pattern, food_allergies,
                meals_per_day, snacks_per_day, breakfast_time, cuisines, caffeine_consumption,
                activity_level, exercises, sleep_duration, water_intake, medical_conditions,
                specific_diets, meal_plan
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            user_id, survey_data.get("age"), survey_data.get("gender"),
            survey_data.get("height"), survey_data.get("weight"),
            survey_data.get("dietary_pattern"), survey_data.get("food_allergies"),
            survey_data.get("meals_per_day"), survey_data.get("snacks_per_day"),
            survey_data.get("breakfast_time"), survey_data.get("cuisines"),
            survey_data.get("caffeine_consumption"), survey_data.get("activity_level"),
            survey_data.get("exercises"), survey_data.get("sleep_duration"),
            survey_data.get("water_intake"), survey_data.get("medical_conditions"),
            survey_data.get("specific_diets"), survey_data.get("meal_plan")
        ))
        await conn.commit()

        await clear_user_cache(user_id, "get_user_food_planning_info")
        await redis_db_services.get_user_food_planning_info(user_id, cursor)

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Get food planning info by user
async def get_user_food_planning_info(cursor, user_id: str):
    await cursor.execute("SELECT * FROM food_planning WHERE user_id = %s", (user_id,))
    return await cursor.fetchall()


# ✅ Get groceries by user
async def get_groceries_by_user(cursor, user_id: str):
    await cursor.execute("SELECT * FROM available_groceries WHERE user_id = %s", (user_id,))
    return await cursor.fetchall()


# ✅ Insert a new grocery
async def add_grocery(cursor, conn, grocery_data: dict, user_id: str):
    try:
        await cursor.execute("""
            INSERT INTO available_groceries (user_id, grocery_name, available_amount, category, store_link, img_link)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (
            grocery_data["user_id"], grocery_data["grocery_name"],
            grocery_data["available_amount"], grocery_data["category"],
            grocery_data.get("store_link", ""), grocery_data.get("img_link", "")
        ))
        await conn.commit()

        await clear_user_cache(user_id, "get_groceries_by_user")
        await redis_db_services.get_groceries_by_user(user_id, cursor)

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Update grocery
async def update_grocery(cursor, conn, grocery_id: int, updates: dict, user_id:str):
    if not updates:
        return {"updated": 0}
    fields = ", ".join([f"{k}=%s" for k in updates.keys()])
    values = list(updates.values()) + [grocery_id]
    try:
        await cursor.execute(f"UPDATE available_groceries SET {fields} WHERE ID=%s", tuple(values))
        await conn.commit()

        await clear_user_cache(user_id, "get_groceries_by_user")
        await redis_db_services.get_groceries_by_user(user_id, cursor)

        return {"updated": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Delete grocery
async def delete_grocery(cursor, conn, grocery_id: int, user_id: str):
    try:
        await cursor.execute("DELETE FROM available_groceries WHERE ID=%s", (grocery_id,))
        await conn.commit()

        await clear_user_cache(user_id, "get_groceries_by_user")
        await redis_db_services.get_groceries_by_user(user_id, cursor)

        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Add meal plan
async def add_meal_plan(cursor, conn, meal_data: dict):
    try:
        await cursor.execute("""
            INSERT INTO meal_plan (user_id, meal_day, meal_type, meal_name, nutrition, recipe, ingredients_used)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            meal_data["user_id"], 
            meal_data["meal_day"], 
            meal_data["meal_type"],
            json.dumps(meal_data['meal_name']),
            json.dumps(meal_data["nutrition"]),
            json.dumps(meal_data["recipe"]),
            json.dumps(meal_data["ingredients_used"])
        ))
        await conn.commit()

        user_id = meal_data["user_id"]
        await clear_user_cache(user_id, "get_meal_plan")
        await redis_db_services.get_meal_plan(user_id, cursor)

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# (Optional) Batch insert meal plans in a single transaction for speed
async def add_meal_plan_many(cursor, conn, rows: list[dict]):
    try:
        values = []
        for m in rows:
            values.append((
                m["user_id"], m["meal_day"], m["meal_type"],
                json.dumps(m["meal_name"]),
                json.dumps(m["nutrition"]),
                json.dumps(m["recipe"]),
                json.dumps(m["ingredients_used"])
            ))
        await cursor.executemany("""
            INSERT INTO meal_plan (user_id, meal_day, meal_type, meal_name, nutrition, recipe, ingredients_used)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, values)
        await conn.commit()

        user_id = m["user_id"]
        await clear_user_cache(user_id, "get_meal_plan")
        await redis_db_services.get_meal_plan(user_id, cursor)

        return {"inserted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Change meal by user id and day
async def change_meal(cursor, conn, user_id: str, meal_data: dict):
    try:
        await cursor.execute("""
            UPDATE meal_plan 
            SET meal_name=%s, 
                nutrition=%s, 
                recipe=%s, 
                ingredients_used=%s 
            WHERE user_id=%s AND meal_day=%s AND meal_type=%s
        """, (
            meal_data['name'],
            json.dumps(meal_data["nutrition"]),
            json.dumps(meal_data["recipe"]),
            json.dumps(meal_data["ingredients_used"]),
            user_id, 
            meal_data["day"], 
            meal_data["meal_type"]
        ))
        await conn.commit()

        await clear_user_cache(user_id, "get_meal_plan")
        await redis_db_services.get_meal_plan(user_id, cursor)

        return {"status": "updated"}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Delete all meal plan by user
async def delete_all_meal(cursor, conn, user_id: str):
    try:
        await cursor.execute("DELETE FROM meal_plan WHERE user_id=%s", (user_id,))
        await conn.commit()

        await clear_user_cache(user_id, "get_meal_plan")

        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Get meal plan by user
async def get_meal_plan(cursor, user_id: str):
    print("🤖")
    await cursor.execute("SELECT * FROM meal_plan WHERE user_id = %s", (user_id,))
    return await cursor.fetchall()


# ✅ Delete all health alert by user
async def delete_all_health_alert(cursor, conn, user_id: str):
    try:
        await cursor.execute("DELETE FROM health_alert WHERE user_id=%s", (user_id,))
        await conn.commit()

        await clear_user_cache(user_id, "get_health_alert")

        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

# ✅ Insert health alert by user
async def insert_health_alert(cursor, conn, user_id: str, alert: dict):
    try:
        alert_json = json.dumps(alert)  # ✅ convert dict → JSON string
        await cursor.execute("""
            INSERT INTO health_alert (user_id, alert)
            VALUES (%s, %s)
        """, (user_id, alert_json))
        await conn.commit()

        await clear_user_cache(user_id, "get_health_alert")
        await redis_db_services.get_health_alert(user_id, cursor)

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

# ✅ Get health alert by user
async def get_health_alert(cursor, user_id: str):
    await cursor.execute("SELECT * FROM health_alert WHERE user_id = %s", (user_id,))
    return await cursor.fetchall()



##Rifat Edits
async def store_grocery_list(cursor, conn, user_id, list_name, total_price, items):
    try:
        # Insert grocery list
        query = "INSERT INTO grocery_list (user_id, list_name, total_price) VALUES (%s, %s, %s)"
        await cursor.execute(query, (user_id, list_name, total_price))
        list_id = cursor.lastrowid

        # Insert grocery items
        item_query = "INSERT INTO grocery_items (list_id, name, quantity, price) VALUES (%s, %s, %s, %s)"
        for item in items:
            await cursor.execute(item_query, (list_id, item.name, item.quantity, item.price))

        await conn.commit()
        return list_id
    except Exception as e:
        await conn.rollback()
        raise e