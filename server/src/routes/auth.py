import jwt
from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from models.auth import UserLoginModel, UserRegisterModel
from utils.check_email import check_email
from utils.send_email import send_email
from utils.handle_password import encrypt_password, compare_password
from db.connection import cur, conn

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/login", status_code=200)
def login(user: UserLoginModel):
    user = jsonable_encoder(user)

    cur.execute("SELECT * FROM users WHERE email = %s", [user["email"]])
    user_found = cur.fetchone()
    if user_found == None:
        raise HTTPException(status_code=401, detail="Error al iniciar sesión.")

    if compare_password(user["password"], hashed_password=user_found[4]) == False:
        raise HTTPException(status_code=401, detail="Error al iniciar sesión.")

    if user_found[6] == False:
        raise HTTPException(status_code=401, detail="Cuenta no verificada.")

    try:
        encoded_user = {
            "id": user_found[0],
            "first_name": user_found[1],
            "last_name": user_found[2],
            "image": user_found[5],
        }
        token = jwt.encode(encoded_user, "secret", algorithm="HS256")

        return {"token": token}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al iniciar sesión. Inténtelo en otro momento.")


@router.post("/register", status_code=201)
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
            status_code=400, detail="Correo electrónico ya registrado.")
    try:
        hashed_password = encrypt_password(password=user["password"])
        cur.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s) RETURNING id", [
                    user["first_name"], user["last_name"], user["email"], hashed_password])
        conn.commit()

        created_user = cur.fetchone()
        send_email(receiver_address=user["email"], user_id=created_user[0])

        return {"detail": "Cuenta registrada. Te enviamos un email para validar tu correo."}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al crear la cuenta. Inténtelo en otro momento.")


@router.get("/account-verification/{user_id}")
def account_verification(user_id: str):
    print(user_id)

    return {"message": "verificada"}
