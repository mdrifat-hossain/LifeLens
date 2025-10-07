from fastapi import HTTPException
import json


# ✅ Delete old user meal info
async def delete_old_career_planning_info(cursor, conn, user_id: str):
    try:
        await cursor.execute("DELETE FROM career_planning WHERE user_id=%s", (user_id,))
        await conn.commit()
        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

# ✅ Store survey info in food_planning
async def store_users_career_planning_info(cursor, conn, user_id: str, survey_data: dict):
    try:
        await cursor.execute("""
            INSERT INTO career_planning (
                user_id, current_user_location, job_type, preferred_working_country, preferred_industry, preferred_job_roles, career_goal, preferred_career, preferred_field_or_domain, preferred_work_activity, industry_to_work_for, skill_to_develop
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            user_id,
            survey_data.get("current_user_location"),
            survey_data.get("job_type"),
            json.dumps(survey_data.get("preferred_working_country")) if survey_data.get("preferred_working_country") else None,
            json.dumps(survey_data.get("preferred_industry")) if survey_data.get("preferred_industry") else None,
            json.dumps(survey_data.get("preferred_job_roles")) if survey_data.get("preferred_job_roles") else None,
            json.dumps(survey_data.get("career_goal")) if survey_data.get("career_goal") else None,
            json.dumps(survey_data.get("preferred_career")) if survey_data.get("preferred_career") else None,
            json.dumps(survey_data.get("preferred_field_or_domain")) if survey_data.get("preferred_field_or_domain") else None,
            json.dumps(survey_data.get("preferred_work_activity")) if survey_data.get("preferred_work_activity") else None,
            json.dumps(survey_data.get("industry_to_work_for")) if survey_data.get("industry_to_work_for") else None,
            json.dumps(survey_data.get("skill_to_develop")) if survey_data.get("skill_to_develop") else None,
        ))
        await conn.commit()

        # await clear_user_cache(user_id, "get_user_food_planning_info")
        # await redis_db_services.get_user_food_planning_info(user_id, cursor)

        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

async def get_users_career_planning_info(cursor, user_id: str):
    try:
        await cursor.execute("""
            SELECT user_id, current_user_location, job_type, preferred_working_country, preferred_industry, preferred_job_roles, career_goal, preferred_career, preferred_field_or_domain, preferred_work_activity, industry_to_work_for, skill_to_develop
            FROM career_planning WHERE user_id = %s ORDER BY id DESC LIMIT 1
        """, (user_id,))
        
        row = await cursor.fetchone()

        if not row:
            return None

        # Convert from DB format to JSON/dict
        data = {
            # "user_id": row["user_id"],
            "current_user_location": row["current_user_location"],
            "job_type": row["job_type"],
            "preferred_working_country": json.loads(row["preferred_working_country"]) if row["preferred_working_country"] else None,
            "preferred_industry": json.loads(row["preferred_industry"]) if row["preferred_industry"] else None,
            "preferred_job_roles": json.loads(row["preferred_job_roles"]) if row["preferred_job_roles"] else None,
            "career_goal": json.loads(row["career_goal"]) if row["career_goal"] else None,
            "preferred_career": json.loads(row["preferred_career"]) if row["preferred_career"] else None,
            "preferred_field_or_domain": json.loads(row["preferred_field_or_domain"]) if row["preferred_field_or_domain"] else None,
            "preferred_work_activity": json.loads(row["preferred_work_activity"]) if row["preferred_work_activity"] else None,
            "industry_to_work_for": json.loads(row["industry_to_work_for"]) if row["industry_to_work_for"] else None,
            "skill_to_develop": json.loads(row["skill_to_develop"]) if row["skill_to_develop"] else None
        }

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database retrieval error: {str(e)}")


async def delete_old_industry_trends(cursor, conn, user_id: str):
    try:
        await cursor.execute("DELETE FROM industry_trends WHERE user_id=%s", (user_id,))
        await conn.commit()
        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# async def insert_industry_trends(cursor, conn, user_id: str, result: dict):
#     try:
#         # convert dict → json string
#         result_json = json.dumps(result, ensure_ascii=False)

#         await cursor.execute("""
#             INSERT INTO industry_trends (
#                 user_id, content
#             ) VALUES (%s, %s)
#         """, (
#             user_id,
#             result_json
#         ))
#         await conn.commit()

#         return {"id": cursor.lastrowid}
#     except Exception as e:
#         await conn.rollback()
#         raise HTTPException(status_code=500, detail=str(e))


# async def get_industry_trends(cursor, user_id: str):
#     try:
#         await cursor.execute("""
#             SELECT content 
#             FROM industry_trends
#             WHERE user_id = %s
#             ORDER BY id DESC
#             LIMIT 1
#         """, (user_id,))
#         record = await cursor.fetchone()
        
#         if not record:
#             return None
        
#         # Convert JSON string → dict
#         return json.loads(record["content"])
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


async def insert_industry_trends(cursor, conn, user_id: str, career_insights: dict):
    try:
        for career_field, content in career_insights.items():
            await cursor.execute("""
                INSERT INTO industry_trends (user_id, career_field, content)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE content = VALUES(content)
            """, (user_id, career_field, json.dumps(content)))
        
        await conn.commit()
        return {"status": "success"}
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def get_industry_trends_combined(cursor, user_id: str):
    try:
        await cursor.execute("""
            SELECT career_field, content
            FROM industry_trends
            WHERE user_id = %s
        """, (user_id,))
        
        rows = await cursor.fetchall()
        combined = {row["career_field"]: json.loads(row["content"]) for row in rows}
        
        return {"career_insights": combined}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    