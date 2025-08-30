from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import db
from ..ai_generator.foodPlanning.product_retriever.scrapper_root import fetch_all
from ..ai_generator.foodPlanning.mealGenerator import ai_meal_generator
from ..ai_generator.foodPlanning.mealGenerator.schema import GroceryList
import time, json

router = APIRouter()

class SurveyAnswer(BaseModel):
    question: str
    answer: str | None = None
    
class RoutineInput(BaseModel):
    routine_name: str
    selectedDays: List[str]
    startTime: str
    endTime: str
    color: str
    description: str | None = None

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

        await db.delete_old_user_meal_info(cursor, conn, user_id)

        # Convert list of Q/A → dict
        survey_data = {ans.question.lower().replace(" ", "_"): ans.answer for ans in input}

        record = await db.store_users_foodPlanning_info(cursor, conn, user_id, survey_data)
        
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

        await db.delete_all_meal(cursor, conn, user_id)

        user_records = await db.get_user_food_planning_info(cursor, user_id)
        available_groceries_of_user = await db.get_groceries_by_user(cursor, user_id)

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
                await db.add_meal_plan(cursor, conn, meal_data)

        all_meal_plan = await db.get_meal_plan(cursor, user_id)
        return {"status": "success", "data": all_meal_plan}

    except Exception as e:
        print("Meal generator error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Meal generator failed: {str(e)}")


@router.get("/get-all-meal")
async def get_all_meal(request: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        all_meal_plan = await db.get_meal_plan(cursor, user_id)

        return {"status": "success", "data": all_meal_plan}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


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

        validation_result = await ai_meal_generator.change_meal_plan_query_validator(query)

        validation_dict = validation_result.dict()   # pydantic to Dict

        status = validation_dict["status"]
        reason = validation_dict["reason"]

        if status == "valid":
            user_records = await db.get_user_food_planning_info(cursor, user_id)
            available_groceries_of_user = await db.get_groceries_by_user(cursor, user_id)

            new_meal = await ai_meal_generator.change_meal_plan(user_records, available_groceries_of_user, query)
            new_meal = new_meal.dict()

            await db.change_meal(cursor, conn, user_id, new_meal)

            return {"status": "success", "message": "Meal change request is valid.", "data": new_meal}
        else:
            return {"status": "error", "message": "Meal change request is invalid.", "reason": reason}

    except Exception as e:
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

        await db.delete_all_health_alert(cursor, conn, user_id)

        user_records = await db.get_user_food_planning_info(cursor, user_id)

        result = await ai_meal_generator.health_habit_alert(user_records)

        result = result.dict()

        await db.insert_health_alert(cursor, conn, user_id, result)

        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.get("/get-health-alert")
async def get_health_alert(request: Request = None, db_dep=Depends(get_db)):

    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        health_alerts = await db.get_health_alert(cursor, user_id)

        return {"status": "success", "data": health_alerts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


##### Rifat
@router.post('/add_routine')
async def add_routine(
    input: RoutineInput,
    request_obj: Request = None,
    db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")
        
        print("Received routine input:", input)

        # Store routine
        routine_id = await db.store_weekly_routine(cursor, conn, user_id, input.dict())

        # Store selected days
        await db.store_routine_days(cursor, conn, routine_id, input.selectedDays)

        return {"status": "success", "routine_id": routine_id}

    except Exception as e:
        print("Error in storing routine:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    
@router.get('/get_routines')
async def get_routines(request_obj: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        routines = await db.get_user_routines(cursor, user_id)
        

        return {"status": "success", "routines": routines}

    except Exception as e:
        print("Error retrieving routines:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
