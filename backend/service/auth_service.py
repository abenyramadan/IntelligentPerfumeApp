from passlib.context import CryptContext

crypto_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class HashService:
    @classmethod
    def hash_password(cls, password: str) -> str:
        return crypto_context.hash(password)

    @classmethod
    def verify_password(cls, password: str, hash: str) -> bool:
        return crypto_context.verify(password, hash)
