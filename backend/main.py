from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from db.core import Base, db_engine
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Union

# routers
from routers.perfume_router import router as perfume_router
from routers.users_router import router as user_router
from routers.questionnaires_response_router import (
    router as questionnaire_response_router,
)
from routers.user_profiles_router import router as user_profile_router
from routers.recommendations_router import router as recommendation_router
from routers.questionnaire_router import router as questionnaire_router
from routers.auth_router import router as auth_router
from routers.log_router import router as log_router

from routers.ai_router import router as ai_router


from db.populate_db import insert_perfumes


class EntityException(Exception):
    def __init__(self, code: int, message: str, exception: str):
        self.code = code
        self.message = message
        self.exception = exception


# create lifespan to init db
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App is starting...")
    try:
        Base.metadata.create_all(bind=db_engine)
        yield
        print("App is shutting down...")
    finally:
        pass


# init main app
app = FastAPI(
    title="AI Powered Perfume Recommendation API",
    description="Recommend perfume based on unique user profile such as skin chemistry, mood, preferrences, budget and even environmental factors",
    version="1.0.0",
    contact={
        "name": "Awet Thon",
        "url": "htttps://x.com/awetthon",
    },
    lifespan=lifespan,
    redirect_slashes=False,  # ✅ Disable automatic slash redirects
)


allowed_origins = ["*"]


@app.exception_handler(Exception)
async def exception_handler(
    request: Request, exception: Union[Exception, RuntimeError]
):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }
    if isinstance(exception, EntityException):
        response = JSONResponse(
            jsonable_encoder(
                {
                    "code": exception.code,
                    "message": exception.message,
                    "exception": exception.exception,
                }
            ),
            headers=headers,
        )
    else:
        response = JSONResponse(
            jsonable_encoder(
                {
                    "exception": str(exception),
                    "code": 500,
                }
            ),
            headers=headers,
        )
    return response


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ai_router)
app.include_router(perfume_router)
app.include_router(user_router)
app.include_router(questionnaire_router)
app.include_router(questionnaire_response_router)
app.include_router(user_profile_router)
app.include_router(recommendation_router)
app.include_router(auth_router)
app.include_router(log_router)


@app.get("/")
def read_home():
    return {
        "name": "AI Powered Perfume Recommendation API",
        "description": "Recommend perfume based on unique user profile such as skin chemistry, mood, preferrences, budget and even environmental factors",
        "developed_by": "Awet & Abeny",
    }


# populate db
@app.get("/populate_db")
def populate_db():
    insert_perfumes()
    return {"success": True, "message": "Populate Perfume Table"}
