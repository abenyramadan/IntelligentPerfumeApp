from fastapi import APIRouter
from service.questionnaire_service import QuestionnaireService
from schema.questionnaire_schema import QuestionnaireSchema


router = APIRouter(prefix="/questionnaires/questions", tags=["Questionnaires"])


@router.get("/")
def get_questionnaires_all():
    return QuestionnaireService.get_questionnaires_all()


@router.get("/{q_id}")
def get_questionnaire_by_id(q_id: int):
    return QuestionnaireService.get_questionnaire_by_id(q_id)


@router.post("/")
def create_questionnaire(questionnaire: QuestionnaireSchema):
    return QuestionnaireService.create_questionnaire(questionnaire)


@router.put("/{q_id}")
def update_questionnaire(q_id: int, questionnaire: QuestionnaireSchema):
    return QuestionnaireService.update_questionnaire(q_id, questionnaire)


@router.delete("/{q_id}")
def delete_questionnaire(q_id: int):
    return QuestionnaireService.delete_questionnaire(q_id)
