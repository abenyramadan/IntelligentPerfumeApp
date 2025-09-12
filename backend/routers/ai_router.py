from service.ai_service import AIService
from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["AI API"])


@router.get("/")
def get_recommendation(user_id: int):
    return AIService.get_recommendation(user_id)
