from db.core import get_session
from db.models import UserProfile
from schema.user_profile_schema import UserProfileSchema
from schema.response_schema import APIResponse


class UserProfileService:
    @classmethod
    def create_user_profile(cls, profile: UserProfileSchema) -> APIResponse:
        with get_session() as session:

            # one user cannot have more than one profile
            db_user_profile = (
                session.query(UserProfile).filter_by(user_id=profile.user_id).first()
            )

            if db_user_profile:
                return APIResponse(
                    success=False,
                    message=f"User with id: {profile.user_id} already has a profile",
                )

            else:

                try:
                    new_profile = UserProfile(**profile.dict())
                    session.add(new_profile)
                    session.commit()
                    return new_profile
                except:
                    return APIResponse(
                        success=False, message="Failed to create profile"
                    )

    @classmethod
    def update_user_profile(
        cls, profile_id: int, profile: UserProfileSchema
    ) -> APIResponse:
        with get_session() as session:
            db_profile = session.query(UserProfile).filter_by(id=profile_id).first()

            if not db_profile:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find profile with id: {profile_id}",
                )
            else:
                db_profile.user_id = profile.user_id
                db_profile.skin_type = profile.skin_type
                db_profile.skin_temperature = profile.skin_temperature
                db_profile.skin_hydration = profile.skin_hydration
                db_profile.skin_ph = profile.skin_ph
                db_profile.recent_body_state = profile.recent_body_state
                db_profile.primary_climate = profile.primary_climate
                db_profile.avg_temperature = profile.avg_temperature
                db_profile.avg_humidity = profile.avg_humidity
                db_profile.typical_environment = profile.typical_environment
                db_profile.ventilation = profile.ventilation
                db_profile.airflow = profile.airflow
                db_profile.preferred_families = profile.preferred_families
                db_profile.disliked_families = profile.disliked_families
                db_profile.preferred_intensity = profile.preferred_instensity
                db_profile.longevity_target = profile.longevity_target
                db_profile.gender_presentation = profile.gender_presentation
                db_profile.preferred_character = profile.preferred_character
                db_profile.projection_goal = profile.projection_goal
                db_profile.sillage_tolerance_hot = profile.sillage_tolerance_hot
                db_profile.seasonal_focus = profile.seasonal_focus
                db_profile.budget_min = profile.budget_min
                db_profile.budget_max = profile.budget_max
                db_profile.allergies = profile.allergies
                db_profile.headache_triggers = profile.headache_triggers
                db_profile.self_anosmia_musks = profile.self_anosmia_musks
                db_profile.sensitivity_sweetness = profile.sensitivity_sweetness
                db_profile.sensitivity_projection = profile.sensitivity_projection
                db_profile.spray_location = profile.spray_location
                db_profile.fabric_type = profile.fabric_type
                db_profile.time_window_start = profile.time_window_start
                db_profile.time_window_end = profile.time_window_end
                db_profile.projection_weight = profile.projection_weight

                session.add(db_profile)
                session.commit()
                return APIResponse(
                    success=True, message="User profile updated successfully"
                )

    @classmethod
    def delete_user_profile(cls, profile_id) -> APIResponse:
        with get_session() as session:
            db_profile = session.query(UserProfile).filter_by(id=profile_id).first()

            if not db_profile:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find profile with id: {profile_id}",
                )

            else:
                session.delete(db_profile)
                session.commit()
                return APIResponse(
                    success=True,
                    message=f"User profile with id: {profile_id} deleted successfully",
                )

    @classmethod
    def get_user_profile_by_id(cls, profile_id) -> APIResponse:
        with get_session() as session:
            db_profile = session.query(UserProfile).filter_by(id=profile_id).first()
            if not db_profile:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find user profile with id: {profile_id}",
                )
            else:
                return APIResponse(
                    success=True, message="Found user", data=[db_profile.to_dict()]
                )

    @classmethod
    def get_user_profile_all(cls) -> APIResponse:
        with get_session() as session:

            db_profiles = session.query(UserProfile).all()
            return APIResponse(success=True, message="All good", data=[db_profiles])

    @classmethod
    def get_user_profile_user_id(cls, user_id: int) -> APIResponse:
        with get_session() as session:
            profile = session.query(UserProfile).filter_by(user_id=user_id).first()

            if not profile:
                return APIResponse(
                    success=False, message="Cannot find user profile for given user"
                )

            return APIResponse(
                success=True, message="Found user profile", data=[profile]
            )
