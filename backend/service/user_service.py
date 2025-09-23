from db.core import get_session
from db.models import User
from sqlalchemy import or_
from schema.response_schema import APIResponse
from schema.user_schema import UserSchema
from service.auth_service import HashService


class UserService:
    @classmethod
    def create_user(cls, user: UserSchema) -> APIResponse:
        with get_session() as session:

            # check if user with same email or username already exists
            db_user = (
                session.query(User)
                .filter(or_(User.email == user.email, User.username == user.username))
                .first()
            )

            if db_user:
                return APIResponse(
                    success=False,
                    message="User with same email or username already exists",
                )

            else:

                try:

                    new_user = User(**user.dict())
                    new_user.password = HashService.hash_password(new_user.password)
                    session.add(new_user)
                    session.commit()
                    return APIResponse(
                        success=True,
                        message=f"User with username: {user.username} created successfully",
                    )
                except:
                    return APIResponse(
                        status_code=500, success=False, message="Failed to create user"
                    )

    @classmethod
    def update_user(cls, user_id: int, user: UserSchema) -> APIResponse:

        with get_session() as session:
            db_user = session.query(User).filter_by(id=user_id).first()

            # check if user with given id exists
            if not db_user:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find user with id: {user_id}",
                )
            else:
                db_user.username = user.username
                db_user.email = user.email
                db_user.password = HashService.hash_password(user.password)

                session.add(db_user)
                session.commit()
                return APIResponse(
                    success=True, message=f"User detail updated successfully"
                )

    @classmethod
    def delete_user(cls, user_id: int) -> APIResponse:
        with get_session() as session:

            db_user = session.query(User).filter_by(id=user_id).first()

            if not db_user:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find user with id: {user_id}",
                )

            else:
                try:

                    session.delete(db_user)
                    session.commit()
                    return APIResponse(
                        success=True,
                        message=f"User with id: {user_id} deleted successfully",
                    )

                except Exception as e:
                    print("Something went wrong", e)
                    return APIResponse(
                        status_code=500,
                        success=False,
                        message=f"Failed to delete user with id: {user_id}",
                    )

    @classmethod
    def get_user_by_id(cls, user_id: int) -> APIResponse:

        with get_session() as session:
            db_user = session.query(User).filter(User.id == user_id).first()

            if not db_user:
                return APIResponse(
                    status_code=404,
                    success=False,
                    message=f"Cannot find user with id: {user_id}",
                )
            else:
                return APIResponse(success=True, message="Found user", data=[db_user])

    @classmethod
    def get_all_users(cls) -> APIResponse:
        with get_session() as session:
            db_users = session.query(User).all()
            if not db_users:
                db_users = []
            return APIResponse(success=True, message="All good", data=db_users)

    @classmethod
    def delete_users_all(cls) -> APIResponse:
        with get_session() as session:
            try:
                session.query(User).delete()
                session.commit()
                return APIResponse(success=True, message="Delete all users <:)")
            except Exception as e:
                print("Something went wrong:", e)
                return APIResponse(
                    success=False, message="Failed to wipe out all users. Thank God!"
                )
