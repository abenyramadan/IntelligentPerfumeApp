from fastapi import APIRouter

from service.user_profile_service import UserProfileService
from schema.user_profile_schema import UserProfileSchema

router = APIRouter(prefix="/profiles", tags=["User Profiles"])


@router.get("/")
def get_user_profiles_all():
    return UserProfileService.get_user_profile_all()


@router.get("/{profile_id}")
def get_user_profile_by(profile_id: int):
    return UserProfileService.get_user_profile_by_id(profile_id)


# create profile
@router.post("/")
def create_user_profile(data: dict):
    user_id = data["user_id"]

    # Dummy implementation for get_all_responses_for_user
    def get_all_responses_for_user(user_id):
        # Replace this with actual logic to fetch responses for the user
        return {}

    # Dummy implementation for map_responses_to_profile_fields
    def map_responses_to_profile_fields(responses):
        # Replace this with actual logic to map responses to profile fields
        return {}

    responses = get_all_responses_for_user(user_id)  # implement this
    profile_fields = map_responses_to_profile_fields(responses)  # implement this
    profile = UserProfileSchema(user_id=user_id, **profile_fields)
    UserProfileService.save_profile(profile)
    return {"success": True, "profile": profile}


# update profile
@router.put("/{profile_id}")
def update_profile(profile_id: int, profile: UserProfileSchema):
    return UserProfileService.update_user_profile(profile_id, profile)


# delete profile
@router.delete("/{profile_id}")
def delete_profile(profile_id: int):
    return UserProfileService.delete_user_profile(profile_id)
