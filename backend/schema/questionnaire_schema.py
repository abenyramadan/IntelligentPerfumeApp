from pydantic import BaseModel


class QuestionnaireSchema(BaseModel):
    user_id: int
    question_id: str
    answer_text: str | None = None
    answer_number: float | None = None
    answer_json: str | None = None
