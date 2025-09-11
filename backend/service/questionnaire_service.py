from db.core import get_session
from db.models import Questionnaire
from schema.questionnaire_schema import QuestionnaireSchema
from schema.response_schema import APIResponse


class QuestionnaireService:
    @classmethod
    def create_questionnaire(cls, questionnaire: QuestionnaireSchema) -> APIResponse:
        with get_session() as session:
            db_qn = Questionnaire(**questionnaire.dict())
            session.add(db_qn)
            session.commit()
            session.refresh(db_qn)
            return APIResponse(success=True, message="Questionnaire saved successfully")

    @classmethod
    def update_questionnaire(
        cls, qn_id: int, questionnaire: QuestionnaireSchema
    ) -> APIResponse:
        with get_session() as session:
            db_qn = session.query(Questionnaire).filter_by(id=qn_id).first()

            if not db_qn:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find questionnaire with id: {qn_id}",
                )

            else:
                db_qn.question_id = questionnaire.question_id
                db_qn.question_text = questionnaire.question_text
                db_qn.question_topic = questionnaire.question_topic
                db_qn.multiple_choices = questionnaire.multiple_choices

                session.add(db_qn)
                session.commit()
                return APIResponse(
                    success=True, message="Questionnaire updated successfully"
                )

    @classmethod
    def delete_questionnaire(cls, q_id: int) -> APIResponse:
        with get_session() as session:
            db_qn = session.query(Questionnaire).filter_by(id=q_id).first()

            if not db_qn:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find questionnaire with id: {q_id}",
                )

            else:

                try:
                    session.delete(db_qn)
                    session.commit()
                    return APIResponse(
                        success=True,
                        message=f"Questionnaire with id: {q_id} deleted succesfully",
                    )
                except:
                    return APIResponse(
                        status_code=500,
                        success=False,
                        message=f"Failed to delete questionnaire with id: {q_id}",
                    )

    @classmethod
    def get_questionnaire_by_id(cls, q_id: int) -> APIResponse:
        with get_session() as session:
            db_qn = session.query(Questionnaire).filter_by(id=q_id).first()

            if not db_qn:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find quesitonnaire with id: {q_id}",
                )

            else:
                return APIResponse(
                    success=True, message="Found questionnaire", data=[db_qn]
                )

    @classmethod
    def get_questionnaires_all(cls) -> APIResponse:
        with get_session() as session:
            db_qns = session.query(Questionnaire).all()
            if not db_qns:
                db_qns = []
            return APIResponse(success=True, message="ALl good", data=db_qns)
