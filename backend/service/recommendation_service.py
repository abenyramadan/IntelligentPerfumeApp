from db.core import get_session
from db.models import Recommendation
from schema.recommendation_schema import RecommendationSchema
from schema.response_schema import APIResponse
import json
from datetime import datetime


class RecommendationService:
    @classmethod
    def create_ai_recommendation(cls, user_id: int, recommendation_data: dict) -> APIResponse:
        """Create a new AI-generated recommendation with enhanced validation and duplicate prevention"""
        with get_session() as session:
            try:
                # Validate required fields
                required_fields = ['perfume', 'reason']
                for field in required_fields:
                    if not recommendation_data.get(field):
                        return APIResponse(
                            status_code=400,
                            success=False,
                            message=f"Missing required field: {field}"
                        )

                # Check for duplicate recommendations (same perfume, same user, recent creation)
                duplicate_check = (
                    session.query(Recommendation)
                    .filter(
                        Recommendation.user_id == user_id,
                        Recommendation.ai_perfume_name == recommendation_data.get("perfume"),
                        Recommendation.created_at > datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)  # Today
                    )
                    .first()
                )

                if duplicate_check:
                    return APIResponse(
                        success=True,
                        message="Similar recommendation already exists for today",
                        data=[duplicate_check]
                    )

                # Create new recommendation for AI-generated content
                db_rec = Recommendation(
                    user_id=user_id,
                    ai_perfume_name=recommendation_data.get("perfume"),
                    reason=recommendation_data.get("reason"),
                    price=recommendation_data.get("price"),
                    image_url=recommendation_data.get("image_url"),
                    predicted_longevity=recommendation_data.get("predicted_longevity"),
                    predicted_projection=recommendation_data.get("predicted_projection"),
                    predicted_sillage=recommendation_data.get("predicted_sillage"),
                    predicted_pleasantness=recommendation_data.get("predicted_pleasantness"),
                    utility_score=recommendation_data.get("utility_score"),
                    other_perfumes_to_try=recommendation_data.get("other_perfumes_to_try"),
                    context_mood=recommendation_data.get("context_mood"),
                    context_activity=recommendation_data.get("context_activity"),
                    context_temperature=recommendation_data.get("context_temperature"),
                    context_humidity=recommendation_data.get("context_humidity")
                )

                session.add(db_rec)
                session.commit()
                session.refresh(db_rec)

                # Log successful creation
                print(f"✅ AI Recommendation saved successfully for user {user_id}: {db_rec.ai_perfume_name}")

                return APIResponse(
                    success=True,
                    message="AI Recommendation created successfully",
                    data=[db_rec]
                )
            except Exception as e:
                session.rollback()
                print(f"❌ Failed to create AI recommendation for user {user_id}: {str(e)}")
                return APIResponse(
                    status_code=500,
                    success=False,
                    message=f"Failed to create AI recommendation: {str(e)}"
                )

    @classmethod
    def get_user_recommendations(cls, user_id: int, limit: int = 10) -> APIResponse:
        """Get user's recommendation history"""
        with get_session() as session:
            try:
                recommendations = (
                    session.query(Recommendation)
                    .filter(Recommendation.user_id == user_id)
                    .order_by(Recommendation.created_at.desc())
                    .limit(limit)
                    .all()
                )

                return APIResponse(
                    success=True,
                    message="Recommendations retrieved successfully",
                    data=recommendations
                )
            except Exception as e:
                return APIResponse(
                    success=False,
                    message=f"Failed to get recommendations: {str(e)}"
                )

    @classmethod
    def get_latest_ai_recommendation(cls, user_id: int) -> APIResponse:
        """Get user's latest AI recommendation"""
        with get_session() as session:
            try:
                recommendation = (
                    session.query(Recommendation)
                    .filter(
                        Recommendation.user_id == user_id,
                        Recommendation.ai_perfume_name.isnot(None)  # Only AI recommendations
                    )
                    .order_by(Recommendation.created_at.desc())
                    .first()
                )

                if recommendation:
                    return APIResponse(
                        success=True,
                        message="Latest AI recommendation retrieved successfully",
                        data=[recommendation]
                    )
                else:
                    return APIResponse(
                        success=False,
                        message="No AI recommendations found for this user"
                    )
            except Exception as e:
                return APIResponse(
                    success=False,
                    message=f"Failed to get latest AI recommendation: {str(e)}"
                )

    @classmethod
    def create_recommendation(cls, recommendation: RecommendationSchema) -> APIResponse:
        """Create a recommendation for database perfumes (legacy method)"""
        with get_session() as session:
            try:
                db_rec = Recommendation(**recommendation.dict())

                session.add(db_rec)
                session.commit()
                session.refresh(db_rec)
                return APIResponse(
                    success=True, message="Recommendation created successfully"
                )
            except:
                return APIResponse(
                    status_code=500,
                    success=False,
                    message="Failed to create recommendation",
                )

    @classmethod
    def update_recommendation(
        cls, rec_id: int, recommendation: RecommendationSchema
    ) -> APIResponse:
        """Update an existing recommendation"""
        with get_session() as session:
            db_rec = session.query(Recommendation).filter_by(id=rec_id).first()

            if not db_rec:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find recommendation with id: {rec_id}",
                )
            else:
                # Update fields from schema
                for field, value in recommendation.dict().items():
                    if hasattr(db_rec, field) and value is not None:
                        setattr(db_rec, field, value)

                session.commit()
                return APIResponse(
                    success=True, message="Recommendation updated successfully"
                )

    @classmethod
    def delete_recommendation(cls, rec_id: int) -> APIResponse:
        """Delete a recommendation"""
        with get_session() as session:
            db_rec = session.query(Recommendation).filter_by(id=rec_id).first()

            if not db_rec:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find recommendation with id: {rec_id}",
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
    def get_recommendation_by_id(cls, rec_id: int) -> APIResponse:
        """Get recommendation by ID"""
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
                    success=True, message="Found recommendation", data=[db_rec]
                )

    @classmethod
    def get_recommendation_all(cls) -> APIResponse:
        """Get all recommendations"""
        with get_session() as session:
            db_recs = session.query(Recommendation).all()
            if not db_recs:
                db_recs = []
            return APIResponse(success=True, message="All good", data=db_recs)
