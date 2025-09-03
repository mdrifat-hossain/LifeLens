# chat_db.py
from datetime import datetime
from fastapi import HTTPException

# Create a new chat session
async def create_chat_history(cursor, conn, user_id, chat_title):
    try:
        sql = """
            INSERT INTO chat_history (user_id, chat_title, last_modified_datetime)
            VALUES (%s, %s, %s)
        """
        await cursor.execute(sql, (user_id, chat_title, datetime.now()))
        chat_id = cursor.lastrowid  
        await conn.commit()
        return chat_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in create_chat_history: {e}")
      
    

async def insert_messages(cursor, conn, chat_id: int, messages: list):
    try:
        query = """
        INSERT INTO chat_messages (chat_id, sender, message_content, time_date)
        VALUES (%s, %s, %s, %s)
        """
        for msg in messages:
            await cursor.execute(query, (chat_id, msg["sender"], msg["message_content"], datetime.now()))
        await conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in insert_message: {e}")  
    finally:
        await update_chat_history_timestamp(cursor, conn, chat_id)



# Update chat history timestamp (on new messages)
async def update_chat_history_timestamp(cursor, conn, chat_id: int):
    try:
        sql = """
            UPDATE chat_history
            SET last_modified_datetime = %s
            WHERE chat_id = %s
        """
        await cursor.execute(sql, (datetime.now(), chat_id))
        await conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in update_chat_history_timestamp: {e}")


# Get all chats for a user
async def get_all_chat_history(cursor, user_id: int):
    try:
        sql = """
            SELECT chat_id, chat_title, last_modified_datetime
            FROM chat_history
            WHERE user_id = %s
            ORDER BY last_modified_datetime DESC
        """
        await cursor.execute(sql, (user_id,))
        return await cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_chats: {e}")


# Get all messages in a chat
async def get_chat_messages(cursor, chat_id: int):
    try:
        sql = """
            SELECT message_id, sender, message_content, time_date
            FROM chat_messages
            WHERE chat_id = %s
            ORDER BY time_date ASC
        """
        await cursor.execute(sql, (chat_id,))
        return await cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_chat_messages: {e}")
