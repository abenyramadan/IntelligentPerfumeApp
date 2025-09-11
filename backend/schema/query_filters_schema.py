from pydantic import BaseModel
from datetime import date


# used to filter logs e.g you can filter logs by operation type e.g get all CREATE operation logs
class LogFilter(BaseModel):
    opertion_type: str | None = None
    url: str | None = None
    user_id: int | None = None
    created_at: date | None = None


class UserFilter(BaseModel):
    role: str | None = None
    created_at: date | None = None
