from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import routine_db
import time, json
from ..database.redis_db import redis_db_services

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

        routines = await redis_db_services.get_user_routines(user_id, cursor)

        return {"status": "success", "routines": routines}

    except Exception as e:
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
