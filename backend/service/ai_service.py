from schema.user_profile_schema import UserProfileSchema
from google import genai
from google.genai import types

client = genai.Client()


class AIService:
    @classmethod
    def get_recommendation(cls, user_profile: UserProfileSchema):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents="Explain how AI works in a few words",
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(
                        thinking_budget=0
                    )  # Disables thinking
                ),
            )
        except:
            print("something went wrong")

    @classmethod
    def make_request(cls, url: str):
        pass
