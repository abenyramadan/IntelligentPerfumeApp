from passlib.context import CryptContext
from schema.login_schema import LoginSchema
from db.core import get_session
from db.models import User, AuthToken
from schema.response_schema import APIResponse


from db.core import get_session
from schema.auth_schema import AuthTokenSchema, TokenPayloadSchema
import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ["JWT_SECRET"]


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
    def login(cls, user: LoginSchema) -> APIResponse:
        with get_session() as db:
            db_user = db.query(User).filter(User.username == user.username).first()
            if db_user is None:
                return APIResponse(
                    success=False,
                    message=f"Cannot find user with username : {user.username}",
                )

            if not HashService.verify_password(user.password, db_user.password):  # type: ignore
                return APIResponse(
                    success=False, message=f"Incorrect username or password"
                )

            user_token = TokenService.generate_token(
                {
                    "user_id": db_user.id,
                    "exp": datetime.now(timezone.utc),
                    "type": "access_token",
                }
            )  # type: ignore
            print("===================================" * 5)
            print(user_token)
            print("===================================" * 5)
            db_token = TokenService.create_token(
                {
                    "token": user_token,
                    "user_id": db_user.id,
                    "expires_at": datetime.now(timezone.utc) + timedelta(days=3),
                }
            )  # type: ignore

            print("db token", db_token)
            return APIResponse(
                success=True, message="Login successful", data=[db_token]
            )

    @classmethod
    def logout(cls, token_id: int) -> APIResponse:
        try:
            TokenService.delete_token(token_id)
            return APIResponse(success=True, message="Logout succesful")
        except:
            return APIResponse(success=False, message="Failed to logout")

    @classmethod
    def reset_password(cls):
        pass


class TokenService:

    @classmethod
    def generate_token(cls, payload: TokenPayloadSchema) -> str:
        print("Generating token......", end="")
        payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=30)  # type: ignore
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")  # type: ignore
        print("done")
        return token

    # save token to db
    @classmethod
    def create_token(cls, token: AuthTokenSchema) -> AuthToken:
        with get_session() as db:

            if isinstance(token, AuthTokenSchema):
                db_token = AuthToken(**token.dict())
            elif isinstance(token, dict):
                db_token = AuthToken(**token)
            else:
                raise TypeError("token must be of type AuthTokenSchema or dict")

            db.add(db_token)
            db.commit()
            db.refresh(db_token)

            return db_token

    @classmethod
    def delete_token(cls, token_id: int):
        with get_session() as db:
            db_token = db.query(AuthToken).filter(AuthToken.id == token_id).first()
            if not db_token:
                return APIResponse(
                    success=False, message=f"Cannot find token with id: {token_id}"
                )

            try:

                db.delete(db_token)
                db.commit()
                return APIResponse(success=True, message="Token deleted successfully")
            except:
                return APIResponse(success=False, message=f"Failed to delete token")

    @classmethod
    def get_token_by_id(cls, token_id: int) -> AuthToken:
        with get_session() as db:
            db_token = db.query(AuthToken).filter(AuthToken.id == token_id).first()
            if not db_token:
                return APIResponse(
                    success=False, message=f"Cannot find token with id: {token_id}"
                )
            return db_token

    @classmethod
    def get_tokens_all(cls) -> list[AuthToken]:
        with get_session() as db:
            db_tokens = db.query(AuthToken).order_by(AuthToken.created_at.desc()).all()
            return db_tokens or []
