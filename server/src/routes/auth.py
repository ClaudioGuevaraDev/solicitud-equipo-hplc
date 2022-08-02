from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from models.auth import UserRegisterModel
from utils.check_email import check_email
from utils.send_email import send_email

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/register")
def user_register(user: UserRegisterModel):
    user = jsonable_encoder(user)

    if check_email(user["email"]) == False:
        raise HTTPException(
            status_code=400, detail="Correo electrónico inválido.")

    send_email(receiver_address=user["email"], user_id="1")

    return {"username": "hello"}

@router.get("/account-verification/{user_id}")
def account_verification(user_id: str):
    print(user_id)

    return {"message": "verificada"}