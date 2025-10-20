from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import food_planning, chat, routine, account, learning_path, gmail_api, career_ai_help, ai_for_grocerylist, career, user_survey, reports, admin
from .database.database import init_pool, close_pool
from .database.redis_db.redis_initialization import init_cache


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

@app.on_event("startup")
async def startup():
    await init_pool()
    await init_cache()  # initialize Redis

@app.on_event("shutdown")
async def shutdown():
    await close_pool()


app.include_router(food_planning.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(routine.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(learning_path.router, prefix="/api")
app.include_router(gmail_api.router, prefix="/api")
app.include_router(career_ai_help.router, prefix="/api")
app.include_router(career.router, prefix="/api")
app.include_router(ai_for_grocerylist.router, prefix="/api")
app.include_router(user_survey.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
# app.include_router(webhooks.router, prefix="/webhooks")