from fastapi import Depends, HTTPException, Request, APIRouter, Body
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import user_survey_db

router = APIRouter()

@router.get("/user-survey-status")
async def get_user_survey_status(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        survey_status = await user_survey_db.check_survey_status(cursor, user_id)
        return survey_status

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_user_survey_status: {str(e)}")