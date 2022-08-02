from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from models.auth import UserRegisterModel
from utils.check_email import check_email
from utils.send_email import send_email
from db.connection import cur

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/register")
def user_register(user: UserRegisterModel):
    user = jsonable_encoder(user)

    if user["password"] != user["confirm_password"]:
        raise HTTPException(
            status_code=400, detail="Las contraseñas no coinciden.")

    if check_email(user["email"]) == False:
        raise HTTPException(
            status_code=400, detail="Correo electrónico inválido.")

    cur.execute("SELECT * FROM users WHERE email = %s", [user["email"]])
    user_found = cur.fetchone()
    if user_found:
        raise HTTPException(
            status_code=401, detail="Correo electrónico ya registrado.")

    #send_email(receiver_address=user["email"], user_id="1")

    return {"username": "hello"}


@router.get("/account-verification/{user_id}")
def account_verification(user_id: str):
    print(user_id)

    return {"message": "verificada"}
