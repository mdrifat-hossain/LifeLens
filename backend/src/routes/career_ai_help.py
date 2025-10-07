from fastapi.responses import JSONResponse
import json
from fastapi import Depends, HTTPException, Request, APIRouter, Body
from ..database.database import get_db
from ..utils import authenticate_and_get_user_details
from ..database import learning_path_db
from ..database.redis_db import redis_db_services
from pydantic import BaseModel
from typing import List, Literal, Optional
from ..ai_generator.career_path_ai_help.utils import ai_chat_manager
from datetime import datetime


router = APIRouter()

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ConversationRequest(BaseModel):
    path_id: int
    conversation: List[Message]
    chat_id: Optional[int] = None

class ConversationResponse(BaseModel):
    ai_reply: str
    chat_id: int

@router.post("/career-ai-help", response_model=ConversationResponse)
async def career_ai_help(req: ConversationRequest, request_obj: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        
        users_learning_path_details = await learning_path_db.get_learning_path_details_for_ai( cursor, user_id, path_id=req.path_id)
        users_existing_routine_details = await learning_path_db.get_routine_details_for_ai( cursor, user_id)
        
        if not users_learning_path_details:
            print("❌ No learning path details found for user_id:", user_id)
            users_learning_path_details = await learning_path_db.get_learning_path_for_ai( cursor, user_id, path_id=req.path_id)
            
        domains = [
            {"name": "user_learning_plan", "desc": users_learning_path_details},
            {"name": "user_weekly_routine", "desc": users_existing_routine_details},
        ]

        # print("✅ users_learning_path_details:", users_learning_path_details)
        # print("✅ users_routine_details:", users_routine_details)

        # Extract last user query
        query = req.conversation[-1].content
        
        # Keep last 20 messages
        messages = req.conversation[-20:]
        if(messages[0] == "Hi 👋 How can I help you today?"):
            messages.pop(0)
        

            
        ai_reply = await ai_chat_manager(domains=domains, query=query, message_context=messages)
        print("✅ ai_reply:", ai_reply)
        
                # inside career_ai_help
        path_exists_in_routine = await learning_path_db.is_path_in_weekly_routines(cursor, user_id, req.path_id)

        if path_exists_in_routine and ai_reply.get("routines"):
            ai_reply["routines"] = []  # remove routines if path already exists

        return JSONResponse(content={"ai_reply": json.loads(json.dumps(ai_reply))})

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.post("/add-ai-learning-path/{path_id}")
async def add_learning_path(request_obj: Request, path_id: int, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        data = await request_obj.json()
        path = data["path"]

        # 1️⃣ Get current max sort_order for this path_id
        # await cursor.execute("SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM learningpathitems WHERE path_id = %s", (path_id,))
        # row = await cursor.fetchone()
        # last_order = row["max_order"] if row else 0
        # print("✅ Adding learning path for user_id:", user_id)
        # 2️⃣ Insert levels/items
        for idx, level in enumerate(path["levels"], start=1):
            await learning_path_db.create_path_item(
                cursor,
                conn,
                user_id=user_id,
                path_id=path_id,
                title=level["title"],
                item_type="level",
                description=level.get("description", ""),
                focus=level.get("focus", ""),                      # focus text
                skills=json.dumps(level.get("skills", [])),       # store as JSON string if DB can't handle arrays
                sources=level.get("sources", []),
                duration=level.get("duration", ""),               # duration string, e.g., "2 weeks"
            )

        # for idx, level in enumerate(path["levels"], start=1):
        #     await learning_path_db.create_path_item(
        #         cursor,
        #         conn,
        #         user_id=user_id,
        #         path_id=path_id,
        #         title=level["title"],
        #         item_type="level",
        #         description=level.get("description", ""),
        #         sources=level.get("sources", []),
        #     )
            
        # print("✅ Inserted levels/items for path_id:", path_id)

        DAY_SHORT = {
            "Monday": "Mon",
            "Tuesday": "Tue",
            "Wednesday": "Wed",
            "Thursday": "Thu",
            "Friday": "Fri",
            "Saturday": "Sat",
            "Sunday": "Sun",
        }
        # 3️⃣ Insert weekly routines
        path_title = path["path_title"]
        path_type = f"path_{path_id}"
        path_exists_in_routine = await learning_path_db.is_path_in_weekly_routines(cursor, user_id, path_id)

        # Only insert routines if not already exists
        if not path_exists_in_routine:
            for routine in path.get("routines", []):
                # Convert start/end time strings to time objects
                start_time = datetime.strptime(routine["start_time"], "%H:%M").time()
                end_time = datetime.strptime(routine["end_time"], "%H:%M").time()

                routine_id = await learning_path_db.create_weekly_routine(
                    cursor,
                    conn,
                    user_id=user_id,
                    routine_name=path_title,
                    start_time=start_time,
                    end_time=end_time,
                    color="#ccccff",
                    description=routine.get("description", ""),
                    path_type=path_type,
                    path_id=path_id
                )

                # Convert full day name to short form before inserting into routine_days
                day_short = DAY_SHORT.get(routine["day_of_week"], routine["day_of_week"][:3])
                
                await learning_path_db.create_routine_day(cursor, conn, user_id, routine_id, day_short)

            # print(f"✅ Inserted new weekly routines for path_id: {path_id}")
        # else:
        #     print(f"⚠️ Weekly routines already exist for path_id: {path_id} — skipping creation")

        return {"success": True, "path_id": path_id}

    except Exception as e:
        import traceback
        print("Error in add_learning_path:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
