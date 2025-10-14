# db.py

from fastapi import HTTPException

async def check_survey_status(cursor, user_id: str):
    """
    Check whether the user has completed meal and career surveys.
    Returns:
        {
            "meal_survey_completed": 0 or 1,
            "career_survey_completed": 0 or 1
        }
    """
    try:
        sql = """
            SELECT meal_survey_completed, career_survey_completed
            FROM user
            WHERE user_ID = %s
        """
        await cursor.execute(sql, (user_id,))
        row = await cursor.fetchone()
        if not row:
            # Optional: create the user if not exists
            insert_sql = """
                INSERT INTO user (user_ID, meal_survey_completed, career_survey_completed)
                VALUES (%s, 0, 0)
            """
            await cursor.execute(insert_sql, (user_id,))
            await cursor.connection.commit()
            return {"meal_survey_completed": 0, "career_survey_completed": 0}

        print("✅ row: ",row)
        return {
            "meal_survey_completed": row["meal_survey_completed"],
            "career_survey_completed": row["career_survey_completed"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in check_survey_status: {e}")
