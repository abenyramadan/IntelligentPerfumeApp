from pydantic import BaseModel


class QuestionnaireSchema(BaseModel):
    question_id: str | None = None
    question_text: str
    question_topic: str | None = None  # e.g skin chemistry, enviroment etx
    multiple_choices: str
    type: str
    can_select_multiple: bool | None = False
