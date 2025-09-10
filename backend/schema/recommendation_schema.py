from pydantic import BaseModel
from datetime import date


class RecommendationSchema(BaseModel):
    user_id: int
    perfume_id: int

    # recommendation context
    recommendation_date: date | None = None
    context_mood: str | None = None
    context_activity: str | None = None
    context_weather: str | None = None
    context_temperature: float | None = None
    context_humidity: float | None = None

    # AI prediction scores
    predicted_longevity: float | None = None  # in hours
    predicted_projection: float | None = None  # scale 1-10
    predicted_sillage: float | None = None  # scale 1-10
    predicted_pleasantness: float | None = None  # scale 1-10
    utility_score: float | None = None  # overall score

    # user feedback
    user_rating: int | None = None  # 1-5 stars
    actual_longevity: float | None = None  # hours reported by user
    actual_projection: int | None = None  # 1-10
    actual_sillage: int | None = None  # scale 1-10
    user_notes: str | None = None  # user written feedback
    feedback_date: date | None = None
