from fastapi import APIRouter, Request, Depends, HTTPException
from ..database.database import get_db
from ..utils import authenticate_and_get_user_details
from ..database import learning_path_db

router = APIRouter()

@router.post("/add-learning-path")
async def add_learning_path(request_obj: Request, body: dict, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        
        print("✅Request Body:", body)  # Debugging line

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
            "path_type": path_type,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in add_learning_path: {str(e)}")
