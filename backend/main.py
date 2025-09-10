from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.core import Base, db_engine

# routers
from routers.perfume_router import router as perfume_router
from routers.users_router import router as user_router
from routers.questionnaires_router import router as questionnaire_router
from routers.user_profiles_router import router as user_profile_router


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
    title="Perfume Recommendation API",
    description="Recommend perfumes based on user profile",
    version="1.0.0",
    contact={
        "name": "Awet Thon",
        "url": "htttps://x.com/awetthon",
    },
    lifespan=lifespan,
)


app.include_router(perfume_router)
app.include_router(user_router)
app.include_router(questionnaire_router)
app.include_router(user_profile_router)


@app.get("/")
def read_home():
    return "hello from fastapi"
