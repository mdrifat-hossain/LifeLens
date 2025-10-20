from fastapi import APIRouter, Depends, HTTPException, Request
from ..database.database import get_db
from ..database import admin_db
from ..utils import authenticate_and_get_user_details
from ..ai_generator.ai_finance import ai_generator
from zoneinfo import ZoneInfo
from datetime import datetime, timedelta
import traceback

router = APIRouter()

@router.get("/check-role")
async def check_role(request: Request, role: str, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        # Authenticate and get logged-in user
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")
        print("✅>>",user_id)
        if not user_id:
            raise HTTPException(status_code=401, detail="User not authenticated")

        db_role = await admin_db.get_user_role(cursor, user_id)  # reuse db.py function

        if not db_role:
            return {"status": "error", "message": "User not found"}

        if db_role.lower() == role.lower():
            return {"status": "success", "role": db_role}
        else:
            return {"status": "success", "role": "not_found"}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
