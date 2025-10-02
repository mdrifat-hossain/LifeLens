from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import routine_db
import time, json
from ..database.redis_db import redis_db_services
from datetime import datetime

router = APIRouter()


class RoutineInput(BaseModel):
    routine_name: str
    selectedDays: List[str]
    startTime: str
    endTime: str
    color: str
    description: str | None = None


class TaskInput(BaseModel):
    task_name: str


@router.post("/add_routine")
async def add_routine(
    input: RoutineInput, request_obj: Request = None, db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        print("Received routine input:", input)

        # Store routine
        routine_id = await routine_db.store_weekly_routine(
            cursor, conn, user_id, input.dict()
        )

        # Store selected days
        await routine_db.store_routine_days(
            cursor, conn, routine_id, input.selectedDays, user_id
        )

        return {"status": "success", "routine_id": routine_id}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        print("Error is storing routine ", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/get_routines")
async def get_routines(request_obj: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        # routines = await redis_db_services.get_user_routines(user_id, cursor)
        routines = await routine_db.get_user_routines(cursor, user_id)


        return {"status": "success", "routines": routines}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        print("Error retrieving routines:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/add_task")
async def add_task(input: TaskInput, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        task_id = await routine_db.store_task(cursor, conn, user_id, input.task_name)
        return {"status": "success", "task_id": task_id, "task_name": input.task_name}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error adding task: {str(e)}")


@router.get("/get_tasks")
async def get_tasks(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        tasks = await redis_db_services.get_tasks(user_id, cursor)
        return {"tasks": tasks}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")


@router.patch("/toggle_task/{task_id}")
async def toggle_task(request_obj: Request, task_id: int, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        await routine_db.toggle_task(cursor, conn, task_id, user_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error toggling task: {str(e)}")


@router.delete("/delete_task/{task_id}")
async def delete_task(request_obj: Request, task_id: int, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        await routine_db.delete_task(cursor, conn, task_id, user_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")


@router.put("/update-routine")
async def update_routine_route(data: dict, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        # print("✅Update routine data received in routin:", data)
        result = await routine_db.update_routine(cursor, conn, user_id, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in update_routine: {str(e)}")


@router.delete("/delete-routine/{routine_id}")
async def delete_routine_route(routine_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        print("✅ Deleting routine_id:", routine_id, "for user:", user_id)
        result = await routine_db.delete_routine(cursor, conn, user_id, routine_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in delete_routine: {str(e)}")


# routes.py

@router.post("/update_routine_progress/{routine_id}")
async def update_routine_progress(routine_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        # Increment progress (change increment=-1 if you want to "undo")
        new_count = await routine_db.update_completed_days(cursor, conn, user_id, routine_id, increment=1)

        if new_count is None:
            raise HTTPException(status_code=404, detail="Routine not found")

        return {"status": "success", "routine_id": routine_id, "completed_days": new_count}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error updating routine progress: {str(e)}")

# routes.py

@router.post("/routines/toggle")
async def toggle_routine(input: dict, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        routine_id = input.get("routine_id")
        if not routine_id:
            raise HTTPException(status_code=400, detail="routine_id is required")

        # Toggle routine in DB and get new state
        new_state = await routine_db.toggle_routine(cursor, conn, user_id, routine_id)

        print(f"✅Toggled routine {routine_id} for user {user_id} to {'completed' if new_state else 'not completed'}")

        return {"status": "success", "routine_id": routine_id, "is_completed_today": new_state}

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error toggling routine: {str(e)}")


@router.get("/get_today_progress")
async def get_today_progress_api(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        today_short = datetime.now().strftime("%a")  # Mon, Tue, Wed
        progress_data = await routine_db.get_today_progress(cursor, user_id, today_short)

        return progress_data

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching today progress: {str(e)}")
