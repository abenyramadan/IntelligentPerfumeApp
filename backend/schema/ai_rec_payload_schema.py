from pydantic import BaseModel


class AIRecPayloadSchema(BaseModel):
    user_id: int
    mood: str | None = (
        None  # energetic, relaxed, playful, romantic, calm, professional etc
    )
    activity: str | None = (
        None  # office work, social event, casual day, formal event, meeting, etc
    )
    primary_climate: str | None = None  # hot & humid, cold etc
    temperature: float | None = None
    humidity: float | None = None
