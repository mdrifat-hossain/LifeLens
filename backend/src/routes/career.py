from fastapi import Depends, HTTPException, Request, APIRouter, Body, Query
from typing import List, Union
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import career_planning_db
import time, json
from ..database.redis_db import redis_db_services
from ..ai_generator.industry_trend import ai_generator
import aiohttp

router = APIRouter()

class SurveyAnswer(BaseModel):
    question: str
    answer: Union[str, List[str], None] = None

    

@router.post('/career_survey')
async def storing_career_survey(
    input: List[SurveyAnswer],
    request_obj: Request = None,
    db_dep=Depends(get_db)
):

    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        await career_planning_db.delete_old_career_planning_info(cursor, conn, user_id)

        # Convert list of Q/A → dict
        survey_data = {ans.question.lower().replace(" ", "_"): ans.answer for ans in input}

        await career_planning_db.store_users_career_planning_info(cursor, conn, user_id, survey_data)
        
        return {"status": "success"}

    except Exception as e:
        print("Error in storing information to database:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.post("/industry-trend-generator")
async def industry_trend_generator(
    request: Request = None, db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        await career_planning_db.delete_old_industry_trends(cursor, conn, user_id)

        record = await career_planning_db.get_users_career_planning_info(cursor, user_id)

        result = await ai_generator.generate_career_insights(record)

        # await career_planning_db.insert_industry_trends(cursor, conn, user_id, result)
        await career_planning_db.insert_industry_trends(cursor, conn, user_id, result["career_insights"])

        return {"status": "success", "result":result}
    
    except Exception as e:
        print(str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.get("/get-industry-trends")
async def fetch_industry_trends(
    request: Request, db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        record = await career_planning_db.get_industry_trends_combined(cursor, user_id)

        if not record:
            return {"status": "empty", "message": "No industry trends found for this user"}

        return {"status": "success", "result": record}
    
    except Exception as e:
        print(str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    



NEWS_API_KEY = "pub_c9fd0cd14c2144babbe20edc0842e4a0"
NEWS_API_URL = "https://newsdata.io/api/1/news"

async def fetch_news_from_api(career_field: str):
    query = career_field.replace(" ", "+")  # encode spaces for URL
    url = f"{NEWS_API_URL}?apikey={NEWS_API_KEY}&q={query}&language=en"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=500, detail="Error fetching news")
            data = await resp.json()
            # Return only top 5
            return [
                {
                    "title": article.get("title"),
                    "description": article.get("description"),
                    "url": article.get("link"),
                    "published_at": article.get("pubDate")
                }
                for article in data.get("results", [])[:5]
            ]

@router.get("/news")
async def get_industry_news(request: Request, career_field: str  = Query(..., description="Career field to fetch news for"), db=Depends(get_db)):
    cursor, conn = db
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    # 1. Check if news is fresh in DB (last 24 hours)
    await cursor.execute("""
        SELECT title, description, url, published_at
        FROM industry_news
        WHERE career_field = %s
        AND stored_at >= NOW() - INTERVAL 1 DAY
        LIMIT 5
    """, (career_field,))
    existing_news = await cursor.fetchall()

    if existing_news and len(existing_news) > 0:
        return {"source": "database", "news": existing_news}

    # 2. Otherwise, fetch from API
    fresh_news = await fetch_news_from_api(career_field)

    # 3. Delete old news for this career field
    await cursor.execute("DELETE FROM industry_news WHERE career_field = %s", (career_field,))
    await conn.commit()

    # 4. Insert new ones
    for article in fresh_news:
        await cursor.execute("""
            INSERT INTO industry_news (career_field, title, description, url, published_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            career_field,
            article["title"],
            article["description"],
            article["url"],
            article["published_at"]
        ))
    await conn.commit()

    return {"source": "api", "news": fresh_news}
