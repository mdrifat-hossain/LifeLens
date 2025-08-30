from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import request_manager
from .database.database import init_pool, close_pool

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

@app.on_event("startup")
async def _startup():
    await init_pool()

@app.on_event("shutdown")
async def _shutdown():
    await close_pool()

app.include_router(request_manager.router, prefix="/api")
# app.include_router(webhooks.router, prefix="/webhooks")