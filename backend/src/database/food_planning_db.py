from fastapi import HTTPException
import json
import re
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
            INSERT INTO meal_plan (user_id, meal_day, meal_type, meal_name, nutrition, recipe, ingredients_used, img_link)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            meal_data["user_id"], 
            meal_data["meal_day"], 
            meal_data["meal_type"],
            json.dumps(meal_data['meal_name']),
            json.dumps(meal_data["nutrition"]),
            json.dumps(meal_data["recipe"]),
            json.dumps(meal_data["ingredients_used"]),
            meal_data["img_link"]
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
                ingredients_used=%s,
                img_link=%s
            WHERE user_id=%s AND meal_day=%s AND meal_type=%s
        """, (
            meal_data['name'],
            json.dumps(meal_data["nutrition"]),
            json.dumps(meal_data["recipe"]),
            json.dumps(meal_data["ingredients_used"]),
            meal_data['img_link'],
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
# async def store_grocery_list(cursor, conn, user_id, list_name, total_price, items):
#     try:
#         # Insert grocery list
#         query = "INSERT INTO grocery_list (user_id, list_name, total_price) VALUES (%s, %s, %s)"
#         await cursor.execute(query, (user_id, list_name, total_price))
#         list_id = cursor.lastrowid

#         # Insert grocery items
#         item_query = "INSERT INTO grocery_items (list_id, name, quantity, price) VALUES (%s, %s, %s, %s)"
#         for item in items:
#             await cursor.execute(item_query, (list_id, item.name, item.quantity, item.price))

#         await conn.commit()
#         return list_id
#     except Exception as e:
#         await conn.rollback()
#         raise e
    
async def get_available_grocery_ai(cursor, user_id: str):
    print("🤖")
    await cursor.execute("SELECT grocery_name,available_amount FROM `available_groceries` WHERE user_id=%s", (user_id,))
    return await cursor.fetchall()


# ✅ Define unit conversions and normalization helpers
UNIT_CONVERSIONS = {
    # Weight
    ("kg", "g"): 1000,
    ("g", "kg"): 1 / 1000,
    # Volume
    ("ltr", "ml"): 1000,
    ("ml", "ltr"): 1 / 1000,
    # Quantity
    ("dozen", "pcs"): 12,
    ("pcs", "dozen"): 1 / 12,
}

def normalize_unit(unit: str) -> str:
    """Normalize unit variations into consistent short forms."""
    if not unit:
        return "unit"
    unit = unit.lower().strip()
    mapping = {
        "liter": "ltr", "litre": "ltr", "liters": "ltr", "litres": "ltr", "l": "ltr",
        "gram": "g", "grams": "g", "gm": "g",
        "kgs": "kg", "kilogram": "kg", "kilograms": "kg",
        "mls": "ml", "milliliter": "ml", "milliliters": "ml",
        "piece": "pcs", "pieces": "pcs", "pc": "pcs"
    }
    return mapping.get(unit, unit)

async def update_or_insert_available_grocery(
    cursor, conn, user_id, grocery_name,
    item_quantity, unit_quantity_number, unit_unit
):
    """
    ✅ If grocery exists → update available_amount (replace old unit with AI unit if mismatch).
    ✅ If not → insert new grocery.
    Example stored format: "5 kg", "12 pcs", "2 ltr"
    """
    try:
        unit_unit = normalize_unit(unit_unit)
        added_amount = item_quantity * unit_quantity_number  # e.g. 2 × 1.5 = 3 kg

        # 🔍 Check if grocery already exists for the user
        await cursor.execute("""
            SELECT available_amount 
            FROM available_groceries 
            WHERE user_id = %s AND grocery_name = %s
        """, (user_id, grocery_name))
        row = await cursor.fetchone()

        if row:
            existing_text = row["available_amount"]
            match = re.search(r"([\d\.]+)", existing_text)
            existing_amount = float(match.group(1)) if match else 0.0

            # Extract and normalize existing unit
            unit_match = re.search(r"[a-zA-Z]+", existing_text)
            existing_unit = normalize_unit(unit_match.group() if unit_match else unit_unit)

            # ⚖️ Handle units
            if existing_unit == unit_unit:
                # ✅ Same unit → simple addition
                new_total = existing_amount + added_amount
                new_text = f"{new_total} {unit_unit}"

            elif (existing_unit, unit_unit) in UNIT_CONVERSIONS:
                # ✅ Convertible units (e.g. kg ↔ g, L ↔ ml)
                conversion = UNIT_CONVERSIONS[(existing_unit, unit_unit)]
                converted_existing = existing_amount * conversion
                total = converted_existing + added_amount
                new_text = f"{total:.2f} {unit_unit}"
                print(f"🔁 Converted {existing_amount}{existing_unit} → {converted_existing}{unit_unit}")

            elif (unit_unit, existing_unit) in UNIT_CONVERSIONS:
                # ✅ Convertible in opposite direction
                conversion = UNIT_CONVERSIONS[(unit_unit, existing_unit)]
                converted_ai = added_amount * conversion
                total = existing_amount + converted_ai
                new_text = f"{total:.2f} {existing_unit}"
                print(f"🔁 Converted {added_amount}{unit_unit} → {converted_ai}{existing_unit}")

            else:
                # ⚠️ Different & non-convertible → replace with AI's unit
                print(f"⚠️ Unit mismatch for {grocery_name}: replacing {existing_unit} → {unit_unit}")
                new_total = existing_amount + added_amount
                new_text = f"{new_total} {unit_unit}"

            # ✅ Update grocery record
            await cursor.execute("""
                UPDATE available_groceries
                SET available_amount = %s
                WHERE user_id = %s AND grocery_name = %s
            """, (new_text, user_id, grocery_name))
            await conn.commit()

            print(f"✅ Updated {grocery_name}: {existing_text} → {new_text}")

        else:
            # 🆕 Insert new grocery
            new_text = f"{added_amount} {unit_unit}"
            await cursor.execute("""
                INSERT INTO available_groceries (user_id, grocery_name, available_amount)
                VALUES (%s, %s, %s)
            """, (user_id, grocery_name, new_text))
            await conn.commit()

            print(f"🆕 Added new grocery: {grocery_name} = {new_text}")

    except Exception as e:
        await conn.rollback()
        print(f"❌ Error updating or inserting grocery '{grocery_name}': {e}")
        raise e
# ✅ Store grocery list and its items
async def store_grocery_list(cursor, conn, user_id, list_name, total_price, items):
    """
    Stores a grocery list and its related items into the database.
    - Inserts one row into grocery_list
    - Inserts multiple rows into grocery_list_items
    """
    try:
        if not items or len(items) == 0:
            raise ValueError("No grocery items provided.")

        # 1️⃣ Insert grocery list
        await cursor.execute("""
            INSERT INTO grocery_list (user_id, list_name, total_price, created_at)
            VALUES (%s, %s, %s, NOW())
        """, (user_id, list_name, total_price))
        await conn.commit()

        # Get inserted list_id
        list_id = cursor.lastrowid
        print(f"🆕 Grocery list created with ID: {list_id}")

        # 2️⃣ Insert each item
        for item in items:
            full_name = item.name.strip()
            quantity = item.quantity
            price_per_unit = item.price
            total_item_price = quantity * price_per_unit
            category = "Uncategorized"

            await cursor.execute("""
                INSERT INTO grocery_list_items 
                (list_id, grocery_name, quantity, price_per_unit, total_price, category)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (list_id, full_name, quantity, price_per_unit, total_item_price, category))
        
        await conn.commit()
        print(f"✅ Stored {len(items)} items under grocery list ID {list_id}")

        return list_id

    except Exception as e:
        await conn.rollback()
        print(f"❌ Error storing grocery list: {e}")
        raise e


async def get_grocery_dashboard_stats(cursor, user_id):
    """
    Returns:
    {
        "total_lists": int,
        "this_month_total": float,
        "avg_per_trip": float,
        "success_goal": int
    }
    """
    try:
        # Total lists
        await cursor.execute(
            "SELECT COUNT(*) AS total_lists FROM available_groceries WHERE user_id=%s",
            (user_id,)
        )
        total_lists = (await cursor.fetchone())["total_lists"]
        
        await cursor.execute(
            "SELECT COUNT(*) AS total_lists FROM grocery_list WHERE user_id=%s",
            (user_id,)
        )
        total_title_lists = (await cursor.fetchone())["total_lists"]

        # This month total price
        await cursor.execute("""
            SELECT COALESCE(SUM(total_price), 0) AS this_month_total
            FROM grocery_list
            WHERE user_id=%s AND MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())
        """, (user_id,))
        this_month_total = (await cursor.fetchone())["this_month_total"]

        # Average per trip
        avg_per_trip = this_month_total / total_title_lists  if total_title_lists  > 0 else 0

        # Success goal: percentage of lists with total_price > 0
        await cursor.execute("""
            SELECT COALESCE(SUM(total_price), 0) AS food_expense
            FROM grocery_list
            WHERE user_id=%s
              AND MONTH(created_at)=MONTH(CURDATE())
              AND YEAR(created_at)=YEAR(CURDATE())
        """, (user_id,))
        food_expense = (await cursor.fetchone())["food_expense"]
                # Food budget limit
        await cursor.execute("""
            SELECT limit_amount
            FROM budgets
            WHERE user_id=%s AND category_id=1
        """, (user_id,))
        row = await cursor.fetchone()
        food_budget = row["limit_amount"] if row else 0

        # Calculate percentage
        percentage = (food_expense / food_budget * 100) if food_budget > 0 else 0

        return {
            "total_lists": total_lists,
            "this_month_total": this_month_total,
            "avg_per_trip": avg_per_trip,
            "food_expense": percentage
        }

    except Exception as e:
        print(f"❌ Error fetching dashboard stats: {e}")
        raise e

async def get_available_groceries(cursor, user_id):
    query = """
        SELECT ID, grocery_name, available_amount
        FROM available_groceries
        WHERE user_id=%s
    """
    await cursor.execute(query, (user_id,))
    return await cursor.fetchall()


async def update_available_groceries(cursor, conn, user_id, groceries):
    for item in groceries:
        ID = item.get("ID")
        name = item.get("grocery_name")
        amount = item.get("available_amount")

        # Check if record exists
        await cursor.execute("""
            SELECT COUNT(*) AS count 
            FROM available_groceries 
            WHERE user_id=%s AND ID=%s
        """, (user_id, ID))
        row = await cursor.fetchone()
        exists = row["count"] if row else 0

        if exists:
            await cursor.execute("""
                UPDATE available_groceries
                SET grocery_name=%s, available_amount=%s
                WHERE user_id=%s AND ID=%s
            """, (name, amount, user_id, ID))
        else:
            await cursor.execute("""
                INSERT INTO available_groceries (user_id, grocery_name, available_amount)
                VALUES (%s, %s, %s)
            """, (user_id, name, amount))

    await conn.commit()
    return True

async def delete_available_grocery(cursor, conn, user_id, grocery_id):
    try:
        await cursor.execute("""
            DELETE FROM available_groceries
            WHERE user_id = %s AND ID = %s
        """, (user_id, grocery_id))
        await conn.commit()
        return True
    except Exception as e:
        await conn.rollback()
        print(f"❌ Error deleting grocery: {e}")
        raise e
    
# db.py
async def fetch_grocery_lists(cursor, conn, user_id: int, filter: str = "all"):
    try:
        from datetime import datetime, timedelta

        today = datetime.today()
        filter_query = ""

        if filter == "this_month":
            filter_query = f"AND MONTH(gl.created_at) = {today.month} AND YEAR(gl.created_at) = {today.year}"
        elif filter == "last_month":
            last_month = today.replace(day=1) - timedelta(days=1)
            filter_query = f"AND MONTH(gl.created_at) = {last_month.month} AND YEAR(gl.created_at) = {last_month.year}"

        sql = f"""
            SELECT gl.list_id,
                   gl.list_name,
                   gl.created_at,
                   IFNULL(SUM(gli.quantity * gli.price_per_unit), 0) AS total_price,
                   COUNT(gli.item_id) AS items_count,
                   IFNULL(MAX(b.limit_amount) - SUM(gli.quantity * gli.price_per_unit), 0) AS money_saved
            FROM grocery_list gl
            LEFT JOIN grocery_list_items gli ON gl.list_id = gli.list_id
            LEFT JOIN budgets b ON b.user_id = gl.user_id AND b.category_id = 1
            WHERE gl.user_id = %s
            {filter_query}
            GROUP BY gl.list_id
            ORDER BY gl.created_at DESC
        """
        await cursor.execute(sql, (user_id,))
        result = await cursor.fetchall()
        return result if result else []

    except Exception as e:
        print(f"❌ Error fetching grocery lists: {e}")
        raise e

async def fetch_grocery_list_details(cursor, conn, user_id: int, list_id: int):
    """
    Fetches a specific grocery list with its items.
    """
    try:
        await cursor.execute("""
            SELECT gl.list_id, gl.list_name, gl.total_price, gl.created_at,
                   gli.item_id, gli.grocery_name, gli.quantity, gli.price_per_unit, gli.total_price AS item_total
            FROM grocery_list gl
            LEFT JOIN grocery_list_items gli ON gl.list_id = gli.list_id
            WHERE gl.user_id = %s AND gl.list_id = %s
        """, (user_id, list_id))

        rows = await cursor.fetchall()
        if not rows:
            return None

        # Combine data into structured object
        first = rows[0]
        list_data = {
            "list_id": first["list_id"],
            "list_name": first["list_name"],
            "total_price": first["total_price"],
            "created_at": first["created_at"],
            "items": [
                {
                    "item_id": row["item_id"],
                    "grocery_name": row["grocery_name"],
                    "quantity": row["quantity"],
                    "price_per_unit": row["price_per_unit"],
                    "item_total": row["item_total"],
                }
                for row in rows if row["item_id"] is not None
            ],
        }
        return list_data

    except Exception as e:
        print(f"❌ Error fetching grocery list details: {e}")
        raise e
