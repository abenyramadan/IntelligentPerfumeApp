from schema.user_profile_schema import UserProfileSchema
from schema.ai_response_schema import AIResponseSchema
from service.user_profile_service import UserProfileService
from schema.response_schema import APIResponse
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os


load_dotenv()


API_KEY = os.environ["AI_API_KEY"]


client = genai.Client(api_key=API_KEY)


class AIService:
    @classmethod
    def get_recommendation(cls, user_id: int):

        # res = UserProfileService.get_user_profile_user_id(user_id)

        # if not res.success:
        #     return APIResponse(success=False, message=res.message)

        try:
            user_profile = {
                "skin_type": "Balanced",
                "skin_temperature": "Neutral",
                "skin_hydration": "Medium",
                "primary_climate": "Hot & Humid",
                "avg_temperature": "26-32",
                "typical_environment": "Outdoor",
                "preferred_families": ["Spicy"],
                "disliked_families": [],
                "preferred_intensity": "Strong",
                "longevity_target": "5",
                "gender_presentation": "Masculine",
                "preferred_character": "Fresh/Clean",
                "spray_location": "Skin & clothes",
                "budget_min": 30,
                "budget_max": 150,
            }
            prompt = f"""
                        Recommend perfume based on user unique profile.
                        user_profile: {user_profile}
                    """

            print("=================================================")
            print("Prompt", prompt)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AIResponseSchema,
                },
            )

            print(response.text)
            return APIResponse(
                success=True, message="Got recommendation", data=[response.text]
            )
        except:
            print("something went wrong")
            return APIResponse(
                success=False, status_code=500, message="Something went wrong"
            )
