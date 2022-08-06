import jwt
from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse

from models.auth import UserChangePasswordModel, UserLoginModel, UserPasswordRecoveryModel, UserRegisterModel
from utils.check_email import check_email
from utils.send_email import send_email
from utils.handle_password import encrypt_password, compare_password
from db.connection import cur, conn
from config.config import backend_url, frontend_url, secret_key_jwt

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

    if user_found[9] == None:
        raise HTTPException(status_code=500, detail="Error al iniciar sesión.")

    try:
        encoded_user = {
            "id": user_found[0],
            "first_name": user_found[1],
            "last_name": user_found[2],
            "email": user_found[3],
            "url_image": user_found[5],
        }

        if (user_found[8]):
            cur.execute("SELECT * FROM jerarquias WHERE id = %s",
                        [user_found[8]])
            jerarquia_found = cur.fetchone()
            encoded_user["jerarquia"] = jerarquia_found[1]
        else:
            encoded_user["jerarquia"] = None

        if (user_found[9]):
            cur.execute("SELECT * FROM roles WHERE id = %s", [user_found[9]])
            role_found = cur.fetchone()
            encoded_user["role"] = role_found[1]
        else:
            encoded_user["role"] = None

        token = jwt.encode(encoded_user, secret_key_jwt, algorithm="HS256")

        return {"token": token}
    except Exception as error:
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

    cur.execute("SELECT * FROM roles WHERE name = %s", ["user"])
    role_found = cur.fetchone()
    if role_found == None:
        raise HTTPException(status_code=404, detail="El rol no existe.")

    cur.execute("SELECT * FROM jerarquias WHERE name = %s",
                [user["jerarquia"]])
    jerarquia_found = cur.fetchone()
    if jerarquia_found == None:
        raise HTTPException(status_code=404, detail="La jerarquía no existe.")

    try:
        hashed_password = encrypt_password(password=user["password"])
        cur.execute("INSERT INTO users (first_name, last_name, email, password, jerarquia_id, role_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id", [
                    user["first_name"], user["last_name"], user["email"], hashed_password, jerarquia_found[0], role_found[0]])
        conn.commit()

        created_user = cur.fetchone()
        token = jwt.encode(
            {"id": created_user[0]}, secret_key_jwt, algorithm="HS256")
        mail_content = f'''
            <a href="{backend_url}/api/auth/account-verification/{token}">Presiona aquí para validar tu cuenta!</a>
        '''
        send_email(
            receiver_address=user["email"], mail_content=mail_content, subject="Validación de cuenta.")

        return {"detail": "Cuenta registrada. Te enviamos un email para validar tu correo."}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al crear la cuenta. Inténtelo en otro momento.")


@router.get("/account-verification/{token}", status_code=200)
def account_verification(token: str):
    decoded = jwt.decode(token, secret_key_jwt, algorithms="HS256")
    cur.execute("SELECT * FROM users WHERE id = %s", [decoded["id"]])
    user_found = cur.fetchone()
    if user_found == None:
        return RedirectResponse(f"{frontend_url}/error-page")

    try:
        cur.execute("UPDATE users SET verified = %s WHERE id = %s",
                    [True, decoded["id"]])
        conn.commit()

        return RedirectResponse(f"{frontend_url}/success/verified-account")
    except Exception as error:
        return RedirectResponse(f"{frontend_url}/error-page")


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
        token = jwt.encode(
            {"id": user_found[0]}, secret_key_jwt, algorithm="HS256")
        mail_content = f'''
            <a href="{backend_url}/api/auth/authorized-password-change/{token}">Presiona aquí para recuperar tu contraseña!</a>
        '''
        send_email(receiver_address=user.email,
                   mail_content=mail_content, subject="Restaurar contraseña.")

        return {"detail": "Te envíamos un correo para poder restaurar tu contraseña."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al restaurar la contraseña.")


@router.get("/authorized-password-change/{token}", status_code=200)
def authorized_password_change(token: str):
    decoded = jwt.decode(token, secret_key_jwt, algorithms="HS256")
    cur.execute("SELECT * FROM users WHERE id = %s", [decoded["id"]])
    user_found = cur.fetchone()

    if user_found == None:
        return RedirectResponse(f"{frontend_url}/error-page")

    try:
        cur.execute("UPDATE users SET change_password = %s WHERE id = %s", [
            True, decoded["id"]])
        conn.commit()

        return RedirectResponse(f"{frontend_url}/new-password/{user_found[0]}")
    except Exception as error:
        print(error)
        return RedirectResponse(f"{frontend_url}/error-page")


@router.post("/change-password/{user_id}", status_code=200)
def change_password(user_id: int, user: UserChangePasswordModel):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    user_found = cur.fetchone()
    if user_found == None:
        raise HTTPException(
            status_code=404, detail="Error al cambiar la contraseña. Usuario no encontrado.")

    if user_found[6] == False:
        raise HTTPException(status_code=401, detail="Cuenta no verificada.")

    if user_found[7] == False:
        raise HTTPException(
            status_code=401, detail="Error al cambiar la contraseña.")

    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=400, detail="Las contraseñas no coinciden.")

    try:
        hashed_password = encrypt_password(password=user.password)
        cur.execute("UPDATE users SET password = %s, change_password = %s WHERE id = %s",
                    [hashed_password, False, user_id])
        conn.commit()

        return {"detail": "Su contraseña se actualizó con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Hubo un error al intentar cambiar su contraseña.")
