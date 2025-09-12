from pydantic import BaseModel


class UserSchema(BaseModel):
    username: str
    email: str
    password: str
    role: str | None = "USER"

    # personal info
    first_name: str | None = None
    last_name: str | None = None
    gender: str | None = None
    age_group: str | None = None
    # country_of_origin: str | None = None
    country_of_residence: str | None = None
    country_grew_up: str | None = None
