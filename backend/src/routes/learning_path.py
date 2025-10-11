from fastapi import Depends, HTTPException, Request, APIRouter, Body
from ..database.database import get_db
from ..utils import authenticate_and_get_user_details
from ..database import learning_path_db
from ..database.redis_db import redis_db_services
from pydantic import BaseModel

router = APIRouter()


class PathItemCreate(BaseModel):
    title: str
    type: str = "Course"
    description: str = ""


@router.post("/add-learning-path")
async def add_learning_path(request_obj: Request, body: dict, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        # print("✅Request Body:", body)

        title = body.get("title")
        description = body.get("description", "")
        path_type = body.get("pathType")  # "AI" or "Manual"

        if not title:
            raise HTTPException(status_code=400, detail="Title is required")

        path_id = await learning_path_db.create_learning_path(
            cursor, conn, user_id, title, description, path_type
        )

        return {
            "path_id": path_id,
            "user_id": user_id,
            "title": title,
            "description": description,
            "created_by": path_type,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal error in add_learning_path: {str(e)}"
        )


# ✅ Get all learning paths for logged-in user
@router.get("/get-learning-paths")
async def get_learning_paths(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        paths = await learning_path_db.get_learning_paths(cursor, user_id)
        return {"learning_paths": paths}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal error in get_learning_paths: {str(e)}"
        )


# ✅ Get single learning path by ID
@router.get("/get-learning-path/{path_id}")
async def get_learning_path(path_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        path = await learning_path_db.get_learning_path(cursor, user_id, path_id)
        if not path:
            raise HTTPException(status_code=404, detail="Learning path not found")

        return path

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal error in get_learning_path: {str(e)}"
        )


@router.get("/get-learning-path-items/{path_id}")
async def fetch_path_items(path_id: int, request: Request, db_dep=Depends(get_db)):
    try:
        # print(f"✅Fetching items for path_id: {path_id}")
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]
        # print(f"✅Authenticated user_id: {user_id}")
        items = await learning_path_db.get_path_items(cursor, path_id, user_id)

        return {"items": items}

    except HTTPException as e:
        # Re-raise FastAPI HTTP errors directly
        raise e
    except Exception as e:
        import traceback

        print("Error in fetch_path_items:", traceback.format_exc())
        raise HTTPException(
            status_code=500, detail=f"Internal error in fetch_path_items: {str(e)}"
        )


@router.post("/reorder-learning-path-items/{path_id}")
async def reorder_items(path_id: int, body: dict, request: Request, db_dep=Depends(get_db)):
    cursor, conn = db_dep
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]
        # print(f"✅Reordering items for path_id: {path_id}, user_id: {user_id}, body: {body}")

        items = body.get("items", [])
        await learning_path_db.update_order(cursor, conn, path_id, user_id, items)

        return {"message": "Order updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {e}")
    
@router.post("/reorder-learning-paths")
async def reorder_items(body: dict, request: Request, db_dep=Depends(get_db)):
    cursor, conn = db_dep
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]
        # print(f"✅ Reordering user_id: {user_id}, body: {body}")

        items = body.get("items", [])
        await learning_path_db.update_learning_path_order(cursor, conn, user_id, items)

        return {"message": "Order updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {e}")
    
@router.post("/update-learning-path-running/{path_id}")
async def update_running_path(
    path_id: int, body: dict, request: Request, db_dep=Depends(get_db)
):
    """
    body = {
        "is_running": 1 or 0,
        "sort_order": <int>  # optional if starting running path
    }
    """
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]

        is_running = body.get("is_running", 0)
        sort_order = body.get("sort_order", None)

        await learning_path_db.update_learning_path_running(
            cursor, conn, user_id, path_id, is_running, sort_order
        )

        return {"message": "Path running state updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating running path: {e}")


@router.put("/update-learning-path/{path_id}")
async def update_learning_path(path_id: int, body: dict, request: Request, db_dep=Depends(get_db)):
    """
    Updates a learning path's title and description for the logged-in user.
    body = {
        "title": "New Title",
        "description": "New Description"
    }
    """
    cursor, conn = db_dep
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]

        title = body.get("title")
        description = body.get("description")

        if not title:
            raise HTTPException(status_code=400, detail="Title is required")

        await learning_path_db.update_learning_path(cursor, conn, user_id, path_id, title, description)
        return {"message": "Learning path updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating learning path: {e}")
    
@router.delete("/delete-learning-path/{path_id}")
async def delete_learning_path(path_id: int, request: Request, db_dep=Depends(get_db)):
    """
    Deletes a learning path and all associated items for the logged-in user.
    """
    cursor, conn = db_dep
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]

        await learning_path_db.delete_learning_path(cursor, conn, user_id, path_id)
        return {"message": "Learning path and its items deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting learning path: {e}")

# Add new item
@router.post("/add-learning-path-items/{path_id}")
async def add_path_item(
    request_obj: Request, path_id: int, body: PathItemCreate, db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        # print("✅Request Body for adding item:", user_id, path_id, body)

        item_id = await learning_path_db.create_path_item(
            cursor, conn, user_id, path_id, body.title, body.type, body.description
        )
        return {
            "item_id": item_id,
            "title": body.title,
            "type": body.type,
            "description": body.description,
        }

    except Exception as e:
        import traceback

        print("Error in add_path_item:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Update item
@router.put("/update-learning-path-items/{item_id}")
async def edit_path_item(
    item_id: int, body: dict, request: Request, db_dep=Depends(get_db)
):
    try:
        # print("✅ Edit Path Item Body:", body)
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details["user_id"]

        title = body.get("title")
        item_type = body.get("type")
        description = body.get("description")

        # print(f"✅ Updating item_id: {item_id}, user_id: {user_id}, title: {title}, type: {item_type}, description: {description}")
        await learning_path_db.update_path_item(
            cursor, conn, item_id, user_id, title, item_type, description
        )
        return {"success": True}
    except Exception as e:
        import traceback
        print("Error in update-learning-path-items:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Delete item
@router.delete("/learning-path-items/{item_id}")
async def remove_path_item(item_id: int, request: Request, db_dep=Depends(get_db)):
    cursor, conn = db_dep
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details["user_id"]

    await learning_path_db.delete_path_item(cursor, conn, item_id, user_id)
    return {"success": True}

@router.get("/get_learning_path_progress")
async def get_learning_path_progress_route(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")
        
        # print(f"✅ Fetching learning path progress for user_id: {user_id}")

        progress = await learning_path_db.get_learning_path_progress(cursor, conn, user_id)
        return progress

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error fetching learning path progress: {str(e)}")
