from fastapi import APIRouter
from service.questionnaire_response_service import QuestionnaireResponseService
from schema.questionnaire_response_schema import QuestionnaireResponseSchema

router = APIRouter(prefix="/questionnaires/responses", tags=["Questionnaire Responses"])


@router.get("/")
def get_questionnaire_responses_all():
    return QuestionnaireResponseService.get_questionnaire_respones_all()


# get single qn response


@router.get("/{qr_id}")
def get_single_questionnaire_response(qr_id):
    return QuestionnaireResponseService.get_questionnaire_response_by_id(qr_id)


@router.post("/")
def create_questionnaire_response(questionnaire_response: QuestionnaireResponseSchema):
    return QuestionnaireResponseService.create_questionnaire_response(
        questionnaire_response
    )


# update qn response


@router.put("/{qr_id}")
def update_questionnaire_response(
    qr_id: int, questionnaire_response: QuestionnaireResponseSchema
):
    return QuestionnaireResponseService.update_questionnaire_response(
        qr_id, questionnaire_response
    )


@router.delete("/{qr_id}")
def delete_questionnaire_response(qr_id: int):
    return QuestionnaireResponseService.delete_questionnaire_response(qr_id)
