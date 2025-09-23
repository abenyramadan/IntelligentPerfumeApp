from fastapi import APIRouter, HTTPException, Depends
from service.recommendation_service import RecommendationService
from schema.response_schema import APIResponse
from typing import List

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/user/{user_id}")
def get_user_recommendations(user_id: int, limit: int = 10):
    """Get recommendation history for a user"""
    result = RecommendationService.get_user_recommendations(user_id, limit)
    if not result.success:
        raise HTTPException(status_code=400, detail=result.message)
    return result

@router.get("/latest/{user_id}")
def get_latest_ai_recommendation(user_id: int):
    """Get the latest AI recommendation for a user"""
    result = RecommendationService.get_latest_ai_recommendation(user_id)
    if not result.success:
        raise HTTPException(status_code=404, detail=result.message)
    return result

@router.get("/my")
def get_my_recommendations(limit: int = 10):
    """Get current user's recommendation history (using user_id from query param)"""
    # For demo purposes, we'll use a fixed user ID or get it from query params
    # In a real app, this would come from JWT authentication
    try:
        # Try to get user_id from query params as fallback
        from fastapi import Request
        import inspect
        frame = inspect.currentframe()
        args, _, _, values = inspect.getargvalues(frame)
        request = values.get('request')
        if request and hasattr(request, 'query_params'):
            user_id = request.query_params.get('user_id')
            if user_id:
                user_id = int(user_id)
                result = RecommendationService.get_user_recommendations(user_id, limit)
                if not result.success:
                    raise HTTPException(status_code=400, detail=result.message)
                return result
    except:
        pass

    # Default to user ID 1 for demo purposes
    result = RecommendationService.get_user_recommendations(1, limit)
    if not result.success:
        raise HTTPException(status_code=400, detail=result.message)
    return result

@router.get("/my/latest")
def get_my_latest_recommendation():
    """Get current user's latest AI recommendation (using user_id from query param)"""
    try:
        # Try to get user_id from query params as fallback
        from fastapi import Request
        import inspect
        frame = inspect.currentframe()
        args, _, _, values = inspect.getargvalues(frame)
        request = values.get('request')
        if request and hasattr(request, 'query_params'):
            user_id = request.query_params.get('user_id')
            if user_id:
                user_id = int(user_id)
                result = RecommendationService.get_latest_ai_recommendation(user_id)
                if not result.success:
                    # Return empty response instead of 404 for no recommendations
                    if "No AI recommendations found" in result.message:
                        return APIResponse(success=True, message="No recommendations yet", data=[])
                    raise HTTPException(status_code=404, detail=result.message)
                return result
    except:
        pass

    # Default to user ID 1 for demo purposes
    result = RecommendationService.get_latest_ai_recommendation(1)
    if not result.success:
        raise HTTPException(status_code=404, detail=result.message)
    return result

@router.delete("/{recommendation_id}")
def delete_recommendation(recommendation_id: int):
    """Delete a specific recommendation"""
    # For demo purposes, we'll use user ID 1
    # In a real app, this would check if the user owns the recommendation
    result = RecommendationService.delete_recommendation(recommendation_id)
    if not result.success:
        raise HTTPException(status_code=400, detail=result.message)
    return result
