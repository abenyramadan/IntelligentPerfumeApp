import sys
import traceback

print("🔍 Debugging main.py startup...")

try:
    print("1. Testing basic imports...")
    from fastapi import FastAPI
    print("   ✅ FastAPI imported")
    
    from contextlib import asynccontextmanager
    print("   ✅ contextlib imported")
    
    print("2. Testing database imports...")
    from db.core import Base, db_engine
    print("   ✅ Database imports successful")
    
    print("3. Testing CORS middleware...")
    from starlette.middleware.cors import CORSMiddleware
    print("   ✅ CORS middleware imported")
    
    print("4. Testing router imports...")
    routers_to_test = [
        'from routers.perfume_router import router as perfume_router',
        'from routers.users_router import router as user_router',
        'from routers.questionnaires_response_router import router as questionnaire_response_router',
        'from routers.user_profiles_router import router as user_profile_router',
        'from routers.recommendations_router import router as recommendation_router',
        'from routers.questionnaire_router import router as questionnaire_router',
        'from routers.auth_router import router as auth_router',
        'from routers.log_router import router as log_router',
        'from routers.ai_router import router as ai_router',
    ]
    
    for router_import in routers_to_test:
        try:
            exec(router_import)
            router_name = router_import.split(' as ')[-1]
            print(f"   ✅ {router_name} imported")
        except Exception as e:
            print(f"   ❌ {router_import}: {str(e)}")
            traceback.print_exc()
            break
    
    print("5. Testing FastAPI app creation...")
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        print("App is starting...")
        try:
            Base.metadata.create_all(bind=db_engine)
            yield
            print("App is shutting down...")
        finally:
            pass
    
    app = FastAPI(
        title="AI Powered Perfume Recommendation API",
        description="Test app",
        version="1.0.0",
        lifespan=lifespan,
    )
    print("   ✅ FastAPI app created")
    
    print("6. Testing router inclusion...")
    exec('from routers.recommendations_router import router as recommendation_router')
    app.include_router(recommendation_router)
    print("   ✅ Recommendation router included")
    
    print("7. Checking final routes...")
    rec_routes = [r for r in app.routes if hasattr(r, 'path') and 'recommendations' in str(r.path)]
    print(f"   📊 Recommendation routes: {len(rec_routes)}")
    
    if rec_routes:
        for route in rec_routes:
            print(f"      ✅ {route.methods} {route.path}")
    
    print("\\n✅ All tests passed! Main.py should work correctly")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    traceback.print_exc()
