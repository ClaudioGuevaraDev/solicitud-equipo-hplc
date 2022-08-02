from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from models.auth import UserRegisterModel
from utils.check_email import check_email
from utils.send_email import send_email
from utils.handle_password import encrypt_password
from db.connection import cur, conn

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/register", status_code=201)
def user_register(user: UserRegisterModel):
    try:
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
                status_code=400, detail="Correo electrónico ya registrado.")

        hashed_password = encrypt_password(password=user["password"])
        cur.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s) RETURNING id", [
                    user["first_name"], user["last_name"], user["email"], hashed_password])
        conn.commit()

        created_user = cur.fetchone()
        send_email(receiver_address=user["email"], user_id=created_user[0])

        return {"detail": "Usuario registrado. Te enviamos un correo para validar tu cuenta."}

    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al crear la cuenta. Inténtalo en otro momento.")


@router.get("/account-verification/{user_id}")
def account_verification(user_id: str):
    print(user_id)

    return {"message": "verificada"}
