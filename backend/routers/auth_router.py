from fastapi import APIRouter
from service.auth_service import AuthService
from schema.login_schema import LoginSchema

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(user: LoginSchema):
    return AuthService.login(user)


@router.get("/logout/{token_id}")
def logout(token_id: int):
    return AuthService.logout(token_id)
