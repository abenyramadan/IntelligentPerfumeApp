from schema.user_profile_schema import UserProfileSchema
from schema.ai_response_schema import AIResponseSchema
from google import genai
from google.genai import types

client = genai.Client()


prompt = """
You are an LLM model trained on 
"""


class AIService:
    @classmethod
    def get_recommendation(cls, user_profile: UserProfileSchema):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AIResponseSchema,
                },
            )

            print(response.text)
        except:
            print("something went wrong")

    @classmethod
    def make_request(cls, url: str):
        pass
