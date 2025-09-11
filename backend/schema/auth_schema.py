from pydantic import BaseModel
from datetime import datetime


class AuthTokenSchema(BaseModel):
    token: str
    user_id: int
    type: str | None = "access_token"
    expires_at: datetime | None = None


class TokenPayloadSchema(BaseModel):
    exp: datetime
    user_id: int
    type: str | None = "access_token"
