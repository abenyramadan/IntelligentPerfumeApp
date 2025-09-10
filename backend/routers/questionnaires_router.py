from fastapi import APIRouter
from service.questionnaire_service import QuestionnaireService
from schema.questionnaire_schema import QuestionnaireSchema

router = APIRouter(prefix="/questionnaire", tags=["Questionnaire"])


@router.get("/")
def get_questionnaire_all():
    return QuestionnaireService.get_qn_all()


# get single qn response


@router.get("/{q_id}")
def get_single_questionnaire(q_id):
    return QuestionnaireService.get_qn_by_id(q_id)


@router.post("/")
def create_questionnaire(questionnaire: QuestionnaireSchema):
    return QuestionnaireService.create_questionnaire(questionnaire)


# update qn response


@router.put("/{q_id}")
def update_questionnaire(q_id: int, questionnaire: QuestionnaireSchema):
    return QuestionnaireService.update_questionnaire(q_id, questionnaire)


@router.delete("/{q_id}")
def delete_questionnaire(q_id: int):
    return QuestionnaireService.delete_qn(q_id)
