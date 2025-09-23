from schema.user_profile_schema import UserProfileSchema, ProfilePayload
from schema.ai_response_schema import AIResponseSchema
from schema.ai_rec_payload_schema import AIRecPayloadSchema
from service.recommendation_service import RecommendationService
from service.user_profile_service import UserProfileService
from schema.response_schema import APIResponse
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import json
import requests


load_dotenv()


API_KEY = os.environ["AI_API_KEY"]


client = genai.Client(api_key=API_KEY)


class AIService:
    @classmethod
    def get_recommendation(cls, payload: AIRecPayloadSchema):

        res = UserProfileService.get_user_profile_user_id(payload.user_id)

        if not res.success:
            return APIResponse(success=False, message="Please complete your profile first to get personalized recommendations. Visit the questionnaire page to create your unique scent profile.")

        try:
            user_profile = res.data[0].to_dict()

            print("user profile", user_profile)

            # Handle optional parameters with defaults
            mood = payload.mood or "neutral"
            activity = payload.activity or "general"
            primary_climate = payload.primary_climate or user_profile.get("primary_climate", "moderate")
            temperature = payload.temperature or 20  # Default room temperature
            humidity = payload.humidity or 50  # Default moderate humidity

            prompt = f"""
                        Recommend perfume based on user unique profile, current mood, activity and current weather condition
                        mood: {mood}
                        activity: {activity}
                        primary_climate: {primary_climate}
                        temperature: {temperature}
                        humidity: {humidity}
                        user_profile: {user_profile}

                        Please provide your response in the following JSON format:

                        {{
                          "perfume": "Name of the main recommended perfume",
                          "reason": "Detailed explanation of why this perfume matches the user's profile",
                          "other_perfumes_to_try": [
                            {{
                              "name": "Alternative perfume name 1",
                              "image_url": "https://example.com/image1.jpg",
                              "price": 85.50
                            }},
                            {{
                              "name": "Alternative perfume name 2",
                              "image_url": "https://example.com/image2.jpg",
                              "price": 120.00
                            }},
                            {{
                              "name": "Alternative perfume name 3",
                              "image_url": "https://example.com/image3.jpg",
                              "price": 95.25
                            }}
                          ],
                          "predicted_longevity": 8.5,
                          "predicted_projection": 7.2,
                          "predicted_sillage": 6.8,
                          "predicted_pleasantness": 8.9,
                          "utility_score": 0.85,
                          "image_url": "https://example.com/main-image.jpg",
                          "price": 110.00,
                          "context_mood": "{mood}",
                          "context_activity": "{activity}",
                          "context_temperature": {temperature},
                          "context_humidity": {humidity}
                        }}

                        Guidelines:
                        - Provide 2-3 alternative perfumes in other_perfumes_to_try
                        - Each alternative should have name, image_url, and price
                        - Prices should be realistic for luxury perfumes (typically $50-$300)
                        - Make sure alternatives are suitable for the user's profile
                        - Focus on different perfume families or price ranges for variety
                        """

            print("=================================================")
            print("Prompt", prompt)

            print("Getting recommendation.............................")

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

            # Save the recommendation to database
            save_result = RecommendationService.create_ai_recommendation(payload.user_id, response_data)
            if not save_result.success:
                print(f"Warning: Failed to save recommendation: {save_result.message}")

            return APIResponse(
                success=True, message="Got recommendation", data=[response_data]
            )
        except Exception as e:
            print("something went wrong", e)
            return APIResponse(
                success=False, status_code=500, message="Something went wrong on server"
            )

    @classmethod
    def build_user_profile(cls, payload: ProfilePayload):

        prompt = f"""
        Use answers to the following questions to build user profile. 
        questions:{payload.questions}
        answer: {payload.answers}
        """
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": UserProfileSchema,
            },
        )

        response_data = json.loads(response.text)
        print(response_data)

        # ✅ Ensure user_id is included in the response data
        response_data["user_id"] = payload.user_id

        return APIResponse(
            success=True, message="Built user profile", data=[response_data]
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
