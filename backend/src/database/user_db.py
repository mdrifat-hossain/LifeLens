from fastapi import HTTPException

async def count_user_request_log(cursor, user_id: str, one_hour_ago):
    await cursor.execute("""
    SELECT COUNT(*) AS cnt 
    FROM user_request_log 
    WHERE user_id = %s AND request_time > %s
    """, (user_id, one_hour_ago))

    row = await cursor.fetchone()
    count = row["cnt"] if row else 0

    return count


async def insert_user_request_log(cursor, conn, user_id: str, time):
    try:
        await cursor.execute("""
            INSERT INTO user_request_log (user_id, request_time) VALUES (%s, %s)
        """, (user_id, time))
        await conn.commit()

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

async def get_user_account_type(cursor, user_id):
    try:
        await cursor.execute("SELECT account_type FROM user WHERE user_id = %s", (user_id,))
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return row["account_type"]  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

