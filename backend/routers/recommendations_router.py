from fastapi import APIRouter, Query

from service.recommendation_service import RecommendationService
from schema.recommendation_schema import RecommendationSchema


router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/")
def get_recommendations_all():
    return RecommendationService.get_recommendation_all()


@router.get("/my")
def get_user_recommendations(
    user_id: int = Query(..., description="User ID"),
    limit: int = Query(5, description="Number of recommendations to return")
):
    return RecommendationService.get_user_recommendations(user_id, limit)


@router.get("/my/latest")
def get_latest_ai_recommendation(
    user_id: int = Query(..., description="User ID")
):
    return RecommendationService.get_latest_ai_recommendation(user_id)


@router.get("/{rec_id}")
def get_recommendation_by_id(rec_id: int):
    return RecommendationService.get_recommendation_by_id(rec_id)


@router.post("/")
def create_recommendation(recommendation: RecommendationSchema):
    return RecommendationService.create_recommendation(recommendation)


@router.put("/{rec_id}")
def update_recommendation(rec_id: int, recommendation: RecommendationSchema):
    return RecommendationService.update_recommendation(rec_id, recommendation)


@router.delete("/{rec_id}")
def delete_recommendation(rec_id: int):
    return RecommendationService.delete_recommendation(rec_id)
