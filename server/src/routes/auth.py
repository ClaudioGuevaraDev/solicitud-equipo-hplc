import jwt
from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse

from models.auth import UserChangePasswordModel, UserLoginModel, UserPasswordRecoveryModel, UserRegisterModel
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
        raise HTTPException(
            status_code=401, detail="Error al iniciar sesión.")

    if compare_password(user["password"], hashed_password=user_found[4]) == False:
        raise HTTPException(status_code=401, detail="Error al iniciar sesión.")

    if user_found[6] != True:
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
        cur.execute("SELECT * FROM roles WHERE name = %s", ["user"])
        role_found = cur.fetchone()
        cur.execute("INSERT INTO users (first_name, last_name, email, password, role_id) VALUES (%s, %s, %s, %s, %s) RETURNING id", [
                    user["first_name"], user["last_name"], user["email"], hashed_password, role_found[0]])
        conn.commit()

        created_user = cur.fetchone()
        mail_content = f'''
            <a href="http://localhost:8000/api/auth/account-verification/{created_user[0]}">Presiona aquí para validar tu cuenta!</a>
        '''
        send_email(receiver_address=user["email"], mail_content=mail_content)

        return {"detail": "Cuenta registrada. Te enviamos un email para validar tu correo."}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al crear la cuenta. Inténtelo en otro momento.")


@router.get("/account-verification/{user_id}", status_code=200)
def account_verification(user_id: str):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    user_found = cur.fetchone()
    if user_found == None:
        return RedirectResponse("http://localhost:5173/error/user-not-found")

    try:
        cur.execute("UPDATE users SET verified = %s WHERE id = %s",
                    [True, user_id])
        conn.commit()

        return RedirectResponse("http://localhost:5173/success/cuenta-verificada")
    except Exception as error:
        print(error)
        return RedirectResponse("http://localhost:5173/error/error-verificacion")


@router.post("/password-recovery", status_code=200)
def password_recovery(user: UserPasswordRecoveryModel):
    cur.execute("SELECT * FROM users WHERE email = %s", [user.email])
    user_found = cur.fetchone()

    if user_found == None:
        raise HTTPException(
            status_code=404, detail="Este correo electrónico no se encuentra registrado.")

    if user_found[6] == False:
        raise HTTPException(
            status_code=401, detail="Debes validar tu cuenta primero.")

    try:
        mail_content = f'''
            <a href="http://localhost:5173/new-password/{user_found[0]}">Presiona aquí para recuperar tu contraseña!</a>
        '''
        send_email(receiver_address=user.email, mail_content=mail_content)

        return {"detail": "Te envíamos un correo para poder restaurar tu contraseña."}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al restaurar la contraseña.")


@router.post("/change-password/{user_id}", status_code=200)
def change_password(user_id: int, user: UserChangePasswordModel):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    if cur.fetchone() == None:
        raise HTTPException(
            status_code=404, detail="Error al cambiar la contraseña. Usuario no encontrado.")

    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=400, detail="Las contraseñas no coinciden.")

    try:
        hashed_password = encrypt_password(password=user.password)
        cur.execute("UPDATE users SET password = %s WHERE id = %s",
                    [hashed_password, user_id])
        conn.commit()

        return {"detail": "Su contraseña se actualizó con éxito."}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Hubo un error al intentar cambiar su contraseña.")
