from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import food_planning_db
from ..ai_generator.foodPlanning.product_retriever.scrapper_root import fetch_all
from ..ai_generator.foodPlanning.mealGenerator import ai_meal_generator
from ..ai_generator.foodPlanning.mealGenerator.schema import GroceryList
import time, json
from ..database.redis_db import redis_db_services
from . import throttling
from ..ai_generator.groceryitem_store_ai.utils import ai_chat_manager
import re

router = APIRouter()

class SurveyAnswer(BaseModel):
    question: str
    answer: str | None = None
    
# Pydantic models
class GroceryItem(BaseModel):
    name: str
    quantity: int
    price: float

class GroceryListInput(BaseModel):
    list_name: str
    total_price: float
    items: List[GroceryItem]
    

@router.get("/test")
async def test():
    return {"status": "working"}

@router.post('/food_planning_survey')
async def storing_food_planning_survey(
    input: List[SurveyAnswer],
    request_obj: Request = None,
    db_dep=Depends(get_db)
):

    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        await food_planning_db.delete_old_user_meal_info(cursor, conn, user_id)

        # Convert list of Q/A → dict
        survey_data = {ans.question.lower().replace(" ", "_"): ans.answer for ans in input}

        record = await food_planning_db.store_users_foodPlanning_info(cursor, conn, user_id, survey_data)
        
        return {"status": "success"}

    except Exception as e:
        print("Error in storing information to database:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.post("/grocery-search")
async def grocery_search(query: str = Body(..., embed=False), request: Request = None, db_dep=Depends(get_db)):
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        products = [y.strip() for y in query.split(',') if y.strip()]

        all_results = {key: None for key in products}

        for product in products:
            res = await fetch_all(product)
            all_results[product] = res

        return {"status": "success", "results": all_results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/generate-grocery-product")
async def generate_grocery_product(
    query: str = Body(..., embed=False),
    request: Request = None,
):
    try:

        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        validation_result = await ai_meal_generator.grocery_product_validation(query)

        validation_dict = validation_result.dict()   # pydantic to Dict

        status = validation_dict["status"]
        reason = validation_dict["reason"]

        if status == "valid":

            result = await ai_meal_generator.grocery_product_generation(query)
            
            # Suppose your LLM output was parsed into Pydantic
            grocery_list: GroceryList = result  # result is already a GroceryList object

            # Get Python list
            products = grocery_list.items
            
            all_results = {key: None for key in products}

            for product in products:
                res = await fetch_all(product)
                all_results[product] = res

            return {"status": "success", "results": all_results}

        else:
            return {"status": "error", "message": "Meal change request is invalid.", "reason": reason}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/all-meal-generator")
async def all_meal_generator(request: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        await throttling.apply_rate_limit(user_id, cursor, conn)

        await food_planning_db.delete_all_meal(cursor, conn, user_id)

        user_records = await redis_db_services.get_user_food_planning_info(user_id, cursor)
        available_groceries_of_user = await redis_db_services.get_groceries_by_user(user_id, cursor)

        weekly_plan = await ai_meal_generator.all_meal_generator(user_records, available_groceries_of_user)  # Pydantic model

        # Minimal change: insert one by one (works fine)
        for day, day_plan in weekly_plan["meal_plan"].items():
            for meal_type, meal in day_plan.items():
                meal_data = {
                    "user_id": user_id,
                    "meal_day": day,
                    "meal_type": meal_type,
                    "meal_name": meal["name"],
                    "nutrition": meal["nutrition"],
                    "recipe": meal["steps"],
                    "ingredients_used": meal["ingredients_used"],
                }
                await food_planning_db.add_meal_plan(cursor, conn, meal_data)

        all_meal_plan = await redis_db_services.get_meal_plan(user_id, cursor)
        return {"status": "success", "data": all_meal_plan}

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Meal generator error:", traceback.format_exc())
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/get-all-meal")
async def get_all_meal(request: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        all_meal_plan = await redis_db_services.get_meal_plan(user_id, cursor)

        return {"status": "success", "data": all_meal_plan}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/change-meal-plan")
async def change_meal_plan(
    query: str = Body(..., embed=False),
    request: Request = None,
    db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        await throttling.apply_rate_limit(user_id, cursor, conn)

        validation_result = await ai_meal_generator.change_meal_plan_query_validator(query)

        validation_dict = validation_result.dict()   # pydantic to Dict

        status = validation_dict["status"]
        reason = validation_dict["reason"]

        if status == "valid":
            user_records = await redis_db_services.get_user_food_planning_info(user_id, cursor)
            available_groceries_of_user = await redis_db_services.get_groceries_by_user(user_id, cursor)

            new_meal = await ai_meal_generator.change_meal_plan(user_records, available_groceries_of_user, query)
            new_meal = new_meal.dict()

            await food_planning_db.change_meal(cursor, conn, user_id, new_meal)

            return {"status": "success", "message": "Meal change request is valid.", "data": new_meal}
        else:
            return {"status": "error", "message": "Meal change request is invalid.", "reason": reason}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print("Caught exception:", type(e), e)
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")



@router.post("/health-habit-alert")
async def health_habit_alert(
    request: Request = None, db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        await food_planning_db.delete_all_health_alert(cursor, conn, user_id)

        user_records = await redis_db_services.get_user_food_planning_info(user_id, cursor)

        result = await ai_meal_generator.health_habit_alert(user_records)

        result = result.dict()

        await food_planning_db.insert_health_alert(cursor, conn, user_id, result)

        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.get("/get-health-alert")
async def get_health_alert(request: Request = None, db_dep=Depends(get_db)):

    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        health_alerts = await redis_db_services.get_health_alert(user_id, cursor)

        return {"status": "success", "data": health_alerts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")




##Rifat Edits
@router.post("/add_grocery_list")
async def add_grocery_list(input: GroceryListInput, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep

        # ✅ Get logged-in user
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        # ✅ Get user's current grocery stock
        users_available_grocery = await food_planning_db.get_available_grocery_ai(cursor, user_id)
        print("✅ users_available_grocery:", users_available_grocery)
        print("✅ input items:", input)
        
                # ✅ Validate input
        if not input.items or len(input.items) == 0:
            raise HTTPException(status_code=400, detail="No grocery items provided.")
        # print("✅ input items count:", input)
        # ✅ Store grocery list and its items
        await food_planning_db.store_grocery_list(
            cursor=cursor,
            conn=conn,
            user_id=user_id,
            list_name=input.list_name,
            total_price=input.total_price,
            items=input.items
        )

        # ✅ Prepare grocery item names for AI comparison
        items = [
            GroceryItem(name=item.name, quantity=item.quantity, price=item.price)
            for item in input.items
        ]
        grocery_names = []

        # ✅ Extract details from each grocery item
        parsed_items = []  # will hold (product_name, unit_quantity_number, unit_unit, item_quantity)

        for item in items:
            full_name = item.name
            parts = full_name.split(" - ", 1)
            product_name = parts[0].strip()
            unit_quantity_text = parts[1].strip() if len(parts) > 1 else ""

            # Extract numeric unit quantity
            match = re.search(r"\d+(\.\d+)?", unit_quantity_text)
            unit_quantity_number = float(match.group()) if match else 1.0

            # Extract unit (kg, pcs, liter, etc.)
            unit_match = re.search(r"[a-zA-Z]+", unit_quantity_text)
            unit_unit = unit_match.group().strip() if unit_match else "unit"

            item_quantity = item.quantity
            grocery_names.append(product_name)

            parsed_items.append({
                "product_name": product_name,
                "unit_quantity_number": unit_quantity_number,
                "unit_unit": unit_unit,
                "item_quantity": item_quantity
            })

            print(f"🛒 Product: {product_name} | 🧮 {unit_quantity_number} {unit_unit} × {item_quantity}")

        # ✅ Send to AI for comparison
        domains = [
            {"name": "users_available_grocery_item", "desc": users_available_grocery},
            {"name": "new_grocery_item_name", "desc": grocery_names},  
        ]
        query = "Compare new grocery items with available groceries and tell which ones match or not."

        print("✅ processing ai_chat_manager...")
        ai_reply = await ai_chat_manager(domains=domains, query=query)
        ai_text = ai_reply["ai_text"]
        print("🤖 AI Response:\n", ai_text)

        # ✅ Parse AI response
        # Example: "Chinigura Rice Premium = Rice\nChicken Eggs (Layer) = Eggs\nMilk = no match"
        # ✅ Parse AI response
        mapping = {}
        for line in ai_text.strip().split("\n"):
            if "=" in line:
                new_item, mapped_item = [x.strip() for x in line.split("=", 1)]
                mapping[new_item] = mapped_item

        print("🗺️ Parsed AI mapping:", mapping)

        # ✅ Update or Insert each grocery item
        for item in parsed_items:
            name = item["product_name"]
            unit_quantity_number = item["unit_quantity_number"]
            unit_unit = item["unit_unit"]
            item_quantity = item["item_quantity"]

            # Get mapped/generic grocery name from AI (always a valid title now)
            matched_name = mapping.get(name, name)  # fallback to itself if missing

            print(f"🔄 Processing: {name} → {matched_name} | {unit_quantity_number} {unit_unit} × {item_quantity}")

            # ✅ Update or insert grocery
            await food_planning_db.update_or_insert_available_grocery(
                cursor=cursor,
                conn=conn,
                user_id=user_id,
                grocery_name=matched_name,
                item_quantity=item_quantity,
                unit_quantity_number=unit_quantity_number,
                unit_unit=unit_unit
            )

        return {
            "status": "success",
            "message": "Grocery list processed and inventory updated successfully"
        }


    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error saving grocery list: {str(e)}")
    
@router.get("/grocery_dashboard_stats")
async def get_grocery_dashboard_stats(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep

        # Get logged-in user
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        # Fetch dashboard stats from DB
        stats = await food_planning_db.get_grocery_dashboard_stats(cursor, user_id)
        return stats

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")
    
@router.get("/available_groceries")
async def get_available_groceries(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        groceries = await food_planning_db.get_available_groceries(cursor, user_id)
        return {"available_groceries": groceries}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching groceries: {str(e)}")


@router.post("/update_available_groceries")
async def update_available_groceries(input: dict, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        groceries = input.get("groceries", [])
        print("✅Updating groceries:", groceries)
        await food_planning_db.update_available_groceries(cursor, conn, user_id, groceries)
        return {"status": "success"}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        await conn.rollback()
        print(e)
        raise HTTPException(status_code=500, detail="Failed to update groceries")
    
@router.delete("/delete_available_grocery/{grocery_id}")
async def delete_available_grocery(grocery_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        await food_planning_db.delete_available_grocery(cursor, conn, user_id, grocery_id)
        return {"status": "success", "message": f"Grocery item {grocery_id} deleted"}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error deleting grocery: {str(e)}")

@router.get("/grocery-lists")
async def get_grocery_lists(request_obj: Request, filter: str = "all", db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        lists = await food_planning_db.fetch_grocery_lists(cursor, conn, user_id, filter)
        return lists
    except Exception as e:
        import traceback
        print("Error in get_grocery_lists:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/grocery-list/{list_id}")
async def get_grocery_list_details(list_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep

        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        grocery_list = await food_planning_db.fetch_grocery_list_details(cursor, conn, user_id, list_id)

        if not grocery_list:
            raise HTTPException(status_code=404, detail="Grocery list not found")

        return grocery_list

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching grocery list details: {str(e)}")
