from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List, Literal, Optional
from pydantic import BaseModel
import traceback
import json
from ..ai_generator.ai_chat.ai_answer import build_rag_chain
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import chat_db
from ..database.redis_db import redis_db_services
from ..ai_generator.ai_chat.utils import ai_chat_manager

from ..ai_generator.ai_chat.vector_reranker import VectorReranker

router = APIRouter()

class Message(BaseModel):
    sender: Literal["user", "assistant"]
    message_content: str

class ConversationRequest(BaseModel):
    conversation: List[Message]

class ConversationResponse(BaseModel):
    ai_reply: str
    chat_id: int

class ConversationRequest(BaseModel):
    conversation: List[Message]
    new_chat: bool
    chat_id: Optional[int] = None



@router.post("/ai-chat-answer", response_model=ConversationResponse)
async def ai_chat_answer(req: ConversationRequest, request_obj: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]
        
        user_meal_plan = await redis_db_services.get_meal_plan(user_id, cursor)
        user_grocery_list = await redis_db_services.get_groceries_by_user(user_id, cursor)
        user_food_planning_info = await redis_db_services.get_user_food_planning_info(user_id, cursor)
        user_health_alert = await redis_db_services.get_health_alert(user_id, cursor)
        user_routines = await redis_db_services.get_user_routines(user_id, cursor)
        user_task = await redis_db_services.get_tasks(user_id, cursor)
        
        print("✅ meal>>",user_grocery_list)

        domains = [
            {"name": "user_meal_plan", "desc": user_meal_plan},
            {"name": "user_grocery_list", "desc": user_grocery_list},
            {"name": "user_food_planning_info", "desc": user_food_planning_info},
            {"name": "user_health_alert", "desc": user_health_alert},
            {"name": "user_routines", "desc": user_routines},
            {"name": "user_task", "desc": user_task}
        ]

        # Latest user query
        query = req.conversation[-1].message_content 

        # Keep last 20 messages
        messages = req.conversation[-20:]
        if(messages[0] == "Hi 👋 How can I help you today?"):
            messages.pop(0)

        ai_reply = await ai_chat_manager(domains=domains, query=query, message_context=messages)

        if(ai_reply == None):
            return

        # ✅ Messages to save
        new_messages = [
            {"sender": "user", "message_content": query},
            {"sender": "assistant", "message_content": ai_reply}
        ]

        # ✅ Case 1: new chat
        if req.new_chat:
            chat_id = await chat_db.create_chat_history(
                cursor, conn, user_id, chat_title=query  # first message as title
            )
            await chat_db.insert_messages(cursor, conn, chat_id, new_messages)

        # ✅ Case 2: continuing chat
        else:
            chat_id = req.chat_id
            if chat_id is None:
                raise HTTPException(status_code=400, detail="chat_id required when new_chat is false")
            await chat_db.insert_messages(cursor, conn, chat_id, new_messages)
        
        return {"ai_reply": ai_reply, "chat_id": chat_id}


    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# structured_context = (
    #     f"Meal Plan: {user_meal_plan}\n"
    #     f"Groceries: {user_grocery_list}\n"
    #     f"Food Records: {user_food_planning_info}\n"
    #     f"Health Alerts: {user_health_alert}"
    # )
    
    # vector_store = get_vector_store()
    
    # retriever = vector_store.as_retriever(
    #     search_kwargs={"k": 2, "filter": {"user_id": user_id}}
    # )
    
    # query = req.conversation[-1]
    # retrieved_docs = retriever.invoke(query)  # Updated method call
    # retrieved_context = "\n".join([doc.page_content for doc in retrieved_docs])
    
    # print(retrieved_context)

    # Take the last 20 messages (10 user + 10 ai)


# ✅ Route: Get all chats for logged-in user
@router.get("/get-chats")
async def get_chats(request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        chats = await chat_db.get_all_chat_history(cursor, user_id)
        return {"chats": chats}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_chats: {str(e)}")
    

# ✅ Route: Get all messages in a chat
@router.get("/get-chat-messages/{chat_id}")
async def get_chat_messages(chat_id: int, request_obj: Request, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        # Check ownership of chat
        sql = "SELECT user_id FROM chat_history WHERE chat_id = %s"
        await cursor.execute(sql, (chat_id,))
        row = await cursor.fetchone()
        if not row or row["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this chat")

        messages = await chat_db.get_chat_messages(cursor, chat_id)
        return {"chat_id": chat_id, "messages": messages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error in get_chat_messages: {str(e)}")