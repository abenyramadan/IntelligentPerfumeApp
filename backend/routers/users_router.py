from fastapi import APIRouter
from service.user_service import UserService
from schema.user_schema import UserSchema

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users_all():
    return UserService.get_users_all()


@router.post("/")
def create_user(user: UserSchema):
    return UserService.create_user(user)


@router.get("/{user_id}")
def get_user_by_id(user_id: int):
    return UserService.get_user_by_id(user_id)


@router.put("/{user_id}")
def update_user(user_id: int, user: UserSchema):
    return UserService.update_user(user_id, user)


@router.delete("/{user_id}")
def delete_user(user_id: int):
    return UserService.delete_user(user_id)


@router.delete("/d/all")
def delete_users_all():
    return UserService.delete_users_all()
