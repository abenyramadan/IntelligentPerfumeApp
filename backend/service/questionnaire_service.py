from db.core import get_session
from db.models import QuestionnaireResponse
from schema.questionnaire_schema import QuestionnaireSchema
from schema.response_schema import ResponseSchema


class QuestionnaireService:
    @classmethod
    def create_questionnaire(
        cls,
        questionnaire: QuestionnaireSchema,
    ) -> QuestionnaireResponse:
        with get_session() as session:
            questionnaire_item = QuestionnaireResponse(**questionnaire.dict())
            session.add(questionnaire_item)
            session.commit()
            session.refresh(questionnaire_item)

            return questionnaire_item

    @classmethod
    def update_questionnaire(
        cls, q_id, questionnaire: QuestionnaireSchema
    ) -> QuestionnaireResponse | dict:
        with get_session() as session:
            db_qn = session.query(QuestionnaireResponse).filter_by(id=q_id).first()

            if not db_qn:
                return ResponseSchema(
                    success=False,
                    message=f"Cannot find questionnaire response with id {q_id}",
                )

            db_qn.question_id = questionnaire.question_id
            db_qn.answer_text = questionnaire.answer_text
            db_qn.answer_number = questionnaire.answer_number
            db_qn.answer_json = questionnaire.answer_json
            db_qn.user_id = questionnaire.user_id

            session.add(db_qn)
            session.commit()

            return db_qn

    @classmethod
    def delete_qn(cls, q_id) -> dict:

        with get_session() as session:
            db_qn = session.query(QuestionnaireResponse).filter_by(id=q_id).first()

            if not db_qn:
                return ResponseSchema(
                    success=False,
                    message=f"Cannot find quesitonnaire response with id: {q_id}",
                )

            else:
                session.delete(db_qn)
                session.commit()
                return ResponseSchema(
                    success=True,
                    message=f"Questionnaire response with id: {q_id} deleted successfully",
                )

    @classmethod
    def get_qn_by_id(cls, q_id: int) -> QuestionnaireResponse | dict:

        with get_session() as session:
            db_qn = session.query(QuestionnaireResponse).filter_by(id=q_id).first()

            if not db_qn:
                return ResponseSchema(
                    success=False, message=f"Cannot find question with id: {q_id}"
                )

            else:
                return db_qn

    @classmethod
    def get_qn_all(cls) -> list[QuestionnaireResponse]:
        with get_session() as session:
            db_qns = session.query(QuestionnaireResponse).all()

            return db_qns or []
