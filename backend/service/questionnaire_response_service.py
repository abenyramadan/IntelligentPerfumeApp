from db.core import get_session
from db.models import QuestionnaireResponse
from schema.questionnaire_response_schema import QuestionnaireResponseSchema
from schema.response_schema import APIResponse


class QuestionnaireResponseService:
    @classmethod
    def create_questionnaire_response(
        cls,
        questionnaire_response: QuestionnaireResponseSchema,
    ) -> QuestionnaireResponse:
        with get_session() as session:
            questionnaire_item = QuestionnaireResponse(**questionnaire_response.dict())
            session.add(questionnaire_item)
            session.commit()
            session.refresh(questionnaire_item)

            return APIResponse(
                success=True, message="Questionnaire response saved successfully"
            )

    @classmethod
    def update_questionnaire_response(
        cls, qr_id, questionnaire_response: QuestionnaireResponseSchema
    ) -> QuestionnaireResponse | dict:
        with get_session() as session:
            db_qn_response = (
                session.query(QuestionnaireResponse).filter_by(id=qr_id).first()
            )

            if not db_qn_response:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find questionnaire response with id {qr_id}",
                )

            db_qn_response.question_id = questionnaire_response.question_id
            db_qn_response.answer_text = questionnaire_response.answer_text
            db_qn_response.answer_number = questionnaire_response.answer_number
            db_qn_response.answer_json = questionnaire_response.answer_json
            db_qn_response.user_id = questionnaire_response.user_id

            session.add(db_qn_response)
            session.commit()

            return APIResponse(
                success=True, message="Updated questionnaire response successfully"
            )

    @classmethod
    def delete_questionnaire_response(cls, qr_id) -> dict:

        with get_session() as session:
            db_qn_response = (
                session.query(QuestionnaireResponse).filter_by(id=qr_id).first()
            )

            if not db_qn_response:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find quesitonnaire response with id: {qr_id}",
                )

            else:
                session.delete(db_qn_response)
                session.commit()
                return APIResponse(
                    success=True,
                    message=f"Questionnaire response with id: {qr_id} deleted successfully",
                )

    @classmethod
    def get_questionnaire_response_by_id(
        cls, qr_id: int
    ) -> QuestionnaireResponse | dict:

        with get_session() as session:
            db_qn_response = (
                session.query(QuestionnaireResponse).filter_by(id=qr_id).first()
            )

            if not db_qn_response:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find question with id: {qr_id}",
                )

            else:
                return APIResponse(
                    success=True, message="Found response", data=[db_qn_response]
                )

    @classmethod
    def get_questionnaire_respones_all(cls) -> list[QuestionnaireResponse]:
        with get_session() as session:
            db_qn_responses = session.query(QuestionnaireResponse).all()

            if not db_qn_responses:
                db_qn_responses = []
            return APIResponse(success=True, message="All good", data=db_qn_responses)
