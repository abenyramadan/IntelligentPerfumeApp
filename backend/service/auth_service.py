from passlib.context import CryptContext
from schema.login_schema import LoginSchema
from db.core import get_session
from db.models import User


crypto_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class HashService:
    @classmethod
    def hash_password(cls, password: str) -> str:
        return crypto_context.hash(password)

    @classmethod
    def verify_password(cls, password: str, hash: str) -> bool:
        return crypto_context.verify(password, hash)


class AuthService:
    @classmethod
    def login(cls, login_details: LoginSchema):
        pass

    @classmethod
    def logout(cls):
        pass

    @classmethod
    def reset_password(cls):
        pass
