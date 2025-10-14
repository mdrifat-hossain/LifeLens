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
                user_id, job_type, preferred_working_country, preferred_industry, preferred_job_roles, career_goal, preferred_career, preferred_field_or_domain, preferred_work_activity, industry_to_work_for, skill_to_develop
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            user_id,
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
        
        #Update user table to mark career survey as completed
        update_sql = """
            UPDATE user
            SET career_survey_completed = 1
            WHERE user_ID = %s
        """
        await cursor.execute(update_sql, (user_id,))

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
            SELECT user_id, job_type, preferred_working_country, preferred_industry, preferred_job_roles, career_goal, preferred_career, preferred_field_or_domain, preferred_work_activity, industry_to_work_for, skill_to_develop
            FROM career_planning WHERE user_id = %s ORDER BY id DESC LIMIT 1
        """, (user_id,))
        
        row = await cursor.fetchone()

        if not row:
            return None

        # Convert from DB format to JSON/dict
        data = {
            # "user_id": row["user_id"],
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
    

# ✅ Get user career info (you already have a version of this)
# async def get_users_career_planning_info(cursor, user_id: str):
#     try:
#         await cursor.execute("""
#             SELECT user_id, current_user_location, job_type, preferred_working_country, preferred_industry, 
#                    preferred_job_roles, career_goal, preferred_career, preferred_field_or_domain, 
#                    preferred_work_activity, industry_to_work_for, skill_to_develop
#             FROM career_planning 
#             WHERE user_id = %s 
#             ORDER BY id DESC 
#             LIMIT 1
#         """, (user_id,))
        
#         row = await cursor.fetchone()
#         if not row:
#             return None

#         return {
#             "job_type": row["job_type"],
#             "preferred_industry": json.loads(row["preferred_industry"]) if row["preferred_industry"] else None,
#             "preferred_job_roles": json.loads(row["preferred_job_roles"]) if row["preferred_job_roles"] else None,
#             "career_goal": json.loads(row["career_goal"]) if row["career_goal"] else None,
#             "preferred_career": json.loads(row["preferred_career"]) if row["preferred_career"] else None,
#             "preferred_field_or_domain": json.loads(row["preferred_field_or_domain"]) if row["preferred_field_or_domain"] else None,
#             "preferred_work_activity": json.loads(row["preferred_work_activity"]) if row["preferred_work_activity"] else None,
#             "industry_to_work_for": json.loads(row["industry_to_work_for"]) if row["industry_to_work_for"] else None,
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database retrieval error: {str(e)}")


# ✅ Delete all existing suggestions for the user
async def delete_all_skill_suggestion(cursor, conn, user_id: str):
    try:
        await cursor.execute("DELETE FROM career_skill_suggestion WHERE user_id=%s", (user_id,))
        await conn.commit()
        return {"deleted": cursor.rowcount}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Insert a new suggestion
async def insert_skill_suggestion(cursor, conn, user_id: str, suggestion: dict, generated_date):
    try:
        suggestion_json = json.dumps(suggestion)
        await cursor.execute("""
            INSERT INTO career_skill_suggestion (user_id, suggestion, generated_date)
            VALUES (%s, %s, %s)
        """, (user_id, suggestion_json, generated_date))
        await conn.commit()
        return {"id": cursor.lastrowid}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Retrieve suggestion for the current month
async def get_skill_suggestions(cursor, user_id: str, today_user):
    first_of_month = today_user.replace(day=1)
    await cursor.execute("""
        SELECT suggestion 
        FROM career_skill_suggestion
        WHERE user_id = %s
        AND generated_date >= %s
    """, (user_id, first_of_month))
    return await cursor.fetchone()


# -----------------------------
#  INSERT NEW PROJECT IDEA
# -----------------------------
async def insert_project_idea(cursor, conn, user_id: str, project_data: dict):
    try:
        sql = """
            INSERT INTO project_ideas 
            (user_id, project_name, sector, short_description, requirements, duration, complexity, why_this_project, tags)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        requirements_json = json.dumps(project_data.get("requirements", []))
        tags_json = json.dumps(project_data.get("tags", []))

        await cursor.execute(sql, (
            user_id,
            project_data.get("project_name"),
            project_data.get("sector"),
            project_data.get("short_description"),
            requirements_json,
            project_data.get("duration"),
            str(project_data.get("complexity")),
            project_data.get("why_this_project"),
            tags_json
        ))
        await conn.commit()

        return {"status": "success", "id": cursor.lastrowid}

    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB insert error: {str(e)}")


# -----------------------------
#  GET ALL PROJECT IDEAS (SORTED BY TIME)
# -----------------------------
async def get_all_project_ideas(cursor, user_id: str):
    try:
        sql = """
            SELECT * FROM project_ideas
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        await cursor.execute(sql, (user_id,))
        rows = await cursor.fetchall()

        projects = []
        for row in rows:
            projects.append({
                "id": row["id"],
                "user_id": row["user_id"],
                "project_name": row["project_name"],
                "sector": row["sector"],
                "short_description": row["short_description"],
                "requirements": json.loads(row["requirements"]) if row["requirements"] else [],
                "duration": row["duration"],
                "complexity": row["complexity"],
                "why_this_project": row["why_this_project"],
                "tags": json.loads(row["tags"]) if row["tags"] else [],
                "status": row["status"],
                "created_at": row["created_at"],
                "started_at": row["started_at"],
                "completed_at": row["completed_at"]
            })
        return projects

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB fetch error: {str(e)}")


# -----------------------------
#  UPDATE PROJECT STATUS
# -----------------------------
async def update_project_status(cursor, conn, user_id: str, project_id: int, new_status: str):
    try:
        # Validate status
        if new_status not in ["not_started", "in_progress", "completed"]:
            raise HTTPException(status_code=400, detail="Invalid status value")

        timestamp_column = None
        if new_status == "in_progress":
            timestamp_column = "started_at"
        elif new_status == "completed":
            timestamp_column = "completed_at"

        # Update query
        if timestamp_column:
            sql = f"""
                UPDATE project_ideas
                SET status = %s, {timestamp_column} = CURRENT_TIMESTAMP
                WHERE user_id = %s AND id = %s
            """
        else:
            sql = """
                UPDATE project_ideas
                SET status = %s
                WHERE user_id = %s AND id = %s
            """

        await cursor.execute(sql, (new_status, user_id, project_id))
        await conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        return {"status": "success", "message": f"Project status updated to {new_status}"}

    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB update error: {str(e)}")


# -----------------------------
#  DELETE PROJECT
# -----------------------------
async def delete_project(cursor, conn, user_id: str, project_id: int):
    try:
        sql = "DELETE FROM project_ideas WHERE user_id = %s AND id = %s"
        await cursor.execute(sql, (user_id, project_id))
        await conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        return {"status": "success", "message": "Project deleted successfully"}

    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB delete error: {str(e)}")
