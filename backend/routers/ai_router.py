from service.ai_service import AIService
from schema.ai_rec_payload_schema import AIRecPayloadSchema
from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["AI API"])


@router.post("/")
def get_recommendation(payload: AIRecPayloadSchema):
    return AIService.get_recommendation(payload)
