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

        return JSONResponse(content={"ai_reply": json.loads(json.dumps(ai_reply))})

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")