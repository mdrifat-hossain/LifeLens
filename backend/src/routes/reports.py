from fastapi import APIRouter, Depends, HTTPException, Request
from ..database.database import get_db
from ..database import reports_db
from ..utils import authenticate_and_get_user_details
from ..ai_generator.ai_finance import ai_generator
from zoneinfo import ZoneInfo
from datetime import datetime, timedelta
import traceback
from pydantic import BaseModel

router = APIRouter()

class ReportRequest(BaseModel):
    subject: str
    section: str
    description: str

@router.post("/submit-report")
async def submit_report(request_obj: Request, report: ReportRequest, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        
        print("✅>> ",report)

        report_id = await reports_db.create_report(cursor, conn, user_id, report.subject, report.section, report.description)
        return {"message": "Report submitted successfully", "report_id": report_id}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error in submit_report: {str(e)}")

# Fetch all past reports for the user
@router.get("/my-reports")
async def fetch_reports(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        reports = await reports_db.get_user_reports(cursor, user_id)
        return {"reports": reports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in fetch_reports: {str(e)}")
    
@router.delete("/delete-report/{report_id}")
async def delete_report(report_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        # Call DB function to delete
        deleted = await reports_db.delete_report(cursor, conn, report_id, user_id)
        if deleted:
            return {"message": "Report deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Report not found or not authorized")
    except Exception as e:
        print("Route Exception:", e)
        raise HTTPException(status_code=500, detail=f"Internal error in delete_report: {str(e)}")
