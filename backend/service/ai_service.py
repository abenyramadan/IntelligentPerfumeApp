from schema.user_profile_schema import UserProfileSchema, ProfilePayload
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

        res = UserProfileService.get_user_profile_user_id(payload.user_id)

        if not res.success:
            return APIResponse(success=False, message=res.message)

        try:
            user_profile = res.data[0].to_dict()

            print("user profile", user_profile)

            prompt = f"""
                        Recommend perfume based on user unique profile, current mood, activity and current weather condition
                        mood: {payload.mood}
                        activity: {payload.activity}
                        primary_climate: {payload.primary_climate}
                        temperature: {payload.temperature}
                        humidity:{payload.humidity}
                        user_profile: {user_profile} 
                    """

            print("=================================================")
            print("Prompt", prompt)

            print("Geting recommendation.............................")

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
