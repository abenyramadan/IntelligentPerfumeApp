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


@router.get("/tokens")
def get_tokens_all():
    return AuthService.get_tokens_all()


@router.delete("/tokens/all")
def delete_tokens_all():
    return AuthService.delete_tokens_all()


@router.delete("/tokens/{token_id}")
def delete_token(token_id: int):
    return AuthService.delete_token(token_id)
