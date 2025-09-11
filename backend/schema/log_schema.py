from pydantic import BaseModel


class LogSchema(BaseModel):
    operation_type: str
    description: str | None = None
    url: str | None = None
    user_id: int | None = None
