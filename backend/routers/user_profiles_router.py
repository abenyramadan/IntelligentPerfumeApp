from fastapi import APIRouter

from service.user_profile_service import UserProfileService
from schema.user_profile_schema import UserProfileSchema, ProfilePayload
from service.ai_service import AIService
from schema.response_schema import APIResponse

router = APIRouter(prefix="/profiles", tags=["User Profiles"])


@router.post("/create/profile")
def create_user_profile_ai(payload: ProfilePayload):
    res = AIService.build_user_profile(payload)
    if res.success:
        print("response ", res.data[0])
        return UserProfileService.create_user_profile(dict(res.data[0]))
    return APIResponse(success=False, message="Failed to create user profile")


@router.get("/")
def get_user_profiles_all():
    return UserProfileService.get_user_profile_all()


@router.get("/{profile_id}")
def get_user_profile_by(profile_id: int):
    return UserProfileService.get_user_profile_by_id(profile_id)


# create profile
@router.post("/")
def create_user_profile(profile: UserProfileSchema):
    return UserProfileService.create_user_profile(profile)


# update profile
@router.put("/{profile_id}")
def update_profile(profile_id: int, profile: UserProfileSchema):
    return UserProfileService.update_user_profile(profile_id, profile)


# delete profile
@router.delete("/{profile_id}")
def delete_profile(profile_id: int):
    return UserProfileService.delete_user_profile(profile_id)
