from db.core import get_session
from db.models import Recommendation
from schema.recommendation_schema import RecommendationSchema
from schema.response_schema import APIResponse


class RecommendationService:
    @classmethod
    def create_recommendation(
        cls, recommendation: RecommendationSchema
    ) -> Recommendation | dict:
        with get_session() as session:
            db_rec = Recommendation(**recommendation.dict())

            session.add(db_rec)
            session.commit()
            session.refresh(db_rec)
            return APIResponse(
                success=True, message="Recommendation created successfully"
            )

    @classmethod
    def update_recommendation(
        cls, rec_id: int, recommendation: RecommendationSchema
    ) -> Recommendation | dict:
        with get_session() as session:
            db_rec = session.query(Recommendation).filter_by(id=rec_id).first()

            if not db_rec:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find recommendation with id: {rec_id}",
                )
            else:
                db_rec.user_id = recommendation.user_id
                db_rec.perfume_id = recommendation.perfume_id

                # recommendation context
                db_rec.recommendation_date = recommendation.recommendation_date
                db_rec.context_mood = recommendation.context_mood
                db_rec.context_activity = recommendation.context_activity
                db_rec.context_weather = recommendation.context_weather
                db_rec.context_temperature = recommendation.context_temperature
                db_rec.context_humidity = recommendation.context_humidity
                db_rec.predicted_longevity = recommendation.predicted_longevity
                db_rec.predicted_projection = recommendation.predicted_projection
                db_rec.predicted_sillage = recommendation.predicted_sillage
                db_rec.predicted_pleasantness = recommendation.predicted_pleasantness
                db_rec.utility_score = recommendation.utility_score

                # user feedback
                db_rec.user_rating = recommendation.user_rating
                db_rec.actual_longevity = recommendation.actual_longevity
                db_rec.actual_projection = recommendation.actual_projection
                db_rec.actual_sillage = recommendation.actual_sillage
                db_rec.user_notes = recommendation.user_notes
                db_rec.feedback_date = recommendation.feedback_date

                return APIResponse(
                    success=True, message="Recommendation updated successfully"
                )

    @classmethod
    def delete_recommendation(cls, rec_id: int) -> dict:
        with get_session() as session:
            db_rec = session.query(Recommendation).filter_by(id=rec_id).first()

            if not db_rec:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find recommendaiton with id: {rec_id}",
                )
            else:
                try:

                    session.delete(db_rec)
                    session.commit()
                    return APIResponse(
                        success=True,
                        message=f"Recommendation with id: {rec_id} deleted successfully",
                    )
                except:
                    return APIResponse(
                        status_code=500,
                        success=False,
                        message="Failed to delete recommendation",
                    )

    @classmethod
    def get_recommendation_by_id(cls, rec_id: int) -> Recommendation | dict:
        with get_session() as session:
            db_rec = session.query(Recommendation).filter_by(id=rec_id).first()
            if not db_rec:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find recommendation with id: {rec_id}",
                )
            else:
                return APIResponse(
                    success=True, message="Found recommendaiton", data=[db_rec]
                )

    @classmethod
    def get_recommendation_all(cls) -> list[Recommendation]:
        with get_session() as session:
            db_recs = session.query(Recommendation).all()
            if not db_recs:
                db_recs = []
            return APIResponse(success=True, message="All good", data=db_recs)
