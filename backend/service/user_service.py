from db.core import get_session
from db.models import User
from sqlalchemy import or_
from schema.response_schema import ResponseSchema
from schema.user_schema import UserSchema

from service.auth_service import HashService


class UserService:
    @classmethod
    def create_user(cls, user: UserSchema) -> User | dict:
        with get_session() as session:

            # check if user with same email or username already exists
            db_user = (
                session.query(User)
                .filter(or_(User.email == user.email, User.username == user.username))
                .first()
            )

            if db_user:
                return ResponseSchema(
                    success=False,
                    message="User with same email or username already exists",
                )

            else:
                new_user = User(**user.dict())
                new_user.password = HashService.hash_password(new_user.password)
                session.add(new_user)
                session.commit()
                return new_user

    @classmethod
    def update_user(cls, user_id: int, user: UserSchema) -> User | dict:

        with get_session() as session:
            db_user = session.query(User).filter_by(id=user_id).first()

            # check if user with given id exists
            if not db_user:
                return ResponseSchema(
                    success=False, message=f"Cannot find user with id: {user_id}"
                )
            else:
                db_user.username = user.name
                db_user.email = user.email
                db_user.password = HashService.hash_password(user.password)

                session.add(db_user)
                session.commit()
                return db_user

    @classmethod
    def delete_user(cls, user_id: int) -> dict:
        with get_session() as session:

            db_user = session.query(User).filter_by(id=user_id).first()

            if not db_user:
                return ResponseSchema(
                    success=False, message=f"Cannot find user with id: {user_id}"
                )

            else:
                session.delete(db_user)
                session.commit()
                return ResponseSchema(
                    success=True,
                    message=f"User with id: {user_id} deleted successfully",
                )

    @classmethod
    def get_user_by_id(cls, user_id: int) -> User | dict:

        with get_session() as session:
            db_user = session.query(User).filter(User.id == user_id).first()

            if not db_user:
                return ResponseSchema(
                    success=False, message=f"Cannot find user with id: {user_id}"
                )
            else:
                return db_user

    @classmethod
    def get_users_all(cls) -> list[User]:
        with get_session() as session:
            db_users = session.query(User).all()
            return db_users or []
