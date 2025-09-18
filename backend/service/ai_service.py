from schema.user_profile_schema import UserProfileSchema
from schema.ai_response_schema import AIResponseSchema
from service.user_profile_service import UserProfileService
from schema.response_schema import APIResponse
from schema.ai_rec_payload_schema import AIRecPayloadSchema
from google import genai
from google.genai import types
from dotenv import load_dotenv
import requests
import os
import json


load_dotenv()


API_KEY = os.environ["AI_API_KEY"]


client = genai.Client(api_key=API_KEY)


class AIService:
    @classmethod
    def get_recommendation(cls, payload: AIRecPayloadSchema):

        # res = UserProfileService.get_user_profile_user_id(payload.user_id)

        # if not res.success:
        #     return APIResponse(success=False, message=res.message)
        data = [
            {
                "skin_type": "Dry",
                "skin_temperature": "Neutral",
                "skin_hydration": "Medium",
                "primary_climate": "Hot & Humid",
                "avg_temperature": "26-32",
                "typical_environment": "Outdoor",
                "preferred_families": ["Fruity", "Aromatic"],
                "disliked_families": ["Amber", "Spicy"],
                "preferred_intensity": "Strong",
                "longevity_target": "5",
                "gender_presentation": "Masculine",
                "preferred_character": "Fresh/Clean",
                "spray_location": "Skin & clothes",
                "budget_min": 30,
                "budget_max": 95,
            }
        ]
        try:
            user_profile = data[0]
            prompt = f"""
                        Recommend perfume based on user unique profile, current mood, activity and current weather condition
                        when you get the perfume now seach web to find perfume exact image and put its url in image_url
                        
                        mood: {payload.mood}
                        activity: {payload.activity}
                        primary_climate: {payload.primary_climate}
                        temperature: {payload.temperature}
                        humidity:{payload.humidity}
                        user_profile: {user_profile}
                        
                    """

            print("=================================================")
            # print("Prompt", prompt)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AIResponseSchema,
                },
            )

            response_data = json.loads(response.text)
            print(response_data)

            # web_res = AIService.get_perfume_image(response_data["perfume"])

            return APIResponse(
                success=True, message="Got recommendation", data=[response.text]
            )
        except Exception as e:
            print("something went wrong", e)
            return APIResponse(
                success=False, status_code=500, message="Something went wrong"
            )

    @classmethod
    def get_perfume_image(perfume_name: str):

        try:
            print("Searching the web....")

            search_query = f"{perfume_name} image"
            url = f"www.google.com/?q={perfume_name}"
            res = requests.get(url)

            print("=========================================")
            print("web search response: ", res)
        except:
            print("Error searching the web")
