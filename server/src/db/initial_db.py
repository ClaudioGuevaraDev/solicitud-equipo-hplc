from .connection import cur, conn
import jwt

from utils.handle_password import encrypt_password
from utils.send_email import send_email
from config.config import admin_email, admin_password, backend_url, secret_key_jwt


def initial_roles():
    cur.execute("SELECT * FROM roles")

    if len(cur.fetchall()) == 0:
        roles = [
            ("admin"),
            ("user")
        ]
        for role in roles:
            cur.execute("INSERT INTO roles (name) VALUES (%s)", [role])
            conn.commit()


def initial_estado_equipos():
    cur.execute("SELECT * FROM estado_equipos")

    if (len(cur.fetchall()) == 0):
        estado_equipos = [
            ("Operativo"),
            ("En mantención"),
            ("Defectuoso")
        ]

        for estado in estado_equipos:
            cur.execute(
                "INSERT INTO estado_equipos (name) VALUES (%s)", [estado])
            conn.commit()


def initial_estado_solicitudes():
    cur.execute("SELECT * FROM estado_solicitudes")

    if (len(cur.fetchall()) == 0):
        estado_solicitudes = [
            ("Aprobada"),
            ("Procesando"),
            ("Cancelada")
        ]

        for estado in estado_solicitudes:
            cur.execute(
                "INSERT INTO estado_solicitudes (name) VALUES (%s)", [estado])
            conn.commit()


def initial_jerarquias():
    cur.execute("SELECT * FROM jerarquias")

    if len(cur.fetchall()) == 0:
        jerarquias = [
            ("jerarquía 1", 10),
            ("jerarquía 2", 20),
            ("jerarquía 3", 40)
        ]

        for jerarquia in jerarquias:
            cur.execute(
                "INSERT INTO jerarquias (name, score) VALUES (%s, %s)", [jerarquia[0], jerarquia[1]])
            conn.commit()


def inital_user_admin():
    cur.execute("SELECT * FROM users WHERE email = %s",
                [admin_email])
    if cur.fetchone() == None:
        cur.execute("SELECT * FROM roles WHERE name = %s", ["admin"])
        role_found = cur.fetchone()
        if role_found:
            try:
                hashed_password = encrypt_password(password=admin_password)

                cur.execute("INSERT INTO users (first_name, last_name, email, password, role_id) VALUES (%s, %s, %s, %s, %s) RETURNING *", [
                            "Claudio", "Guevara", admin_email, hashed_password, role_found[0]])
                conn.commit()

                created_user = cur.fetchone()

                token = jwt.encode(
                    {"id": created_user[0]}, secret_key_jwt, algorithm="HS256")
                mail_content = f'''
                    <html>
                    <head></head>
                    <body>
                        <div
                            style="
                                width: 28rem;
                                height: 14rem;
                                padding: 10px;
                                border-radius: 8px;
                                background-color: #f5f6f8;
                                margin: auto;
                            "
                            >
                            <h1 style="text-align: center">Validación de Cuenta HPLC</h1>
                            <p style="font-style: italic; text-align: center; margin-bottom: 2rem; font-size: 1.1rem;">
                                Presiona el botón para validar tu cuenta de HPLC!
                            </p>
                            <a
                                href="{backend_url}/api/auth/account-verification/{token}"
                                style="
                                background-color: #0099ff;
                                padding: 12px 20px;
                                border-radius: 5px;
                                text-decoration: none;
                                color: white;
                                font-size: 1.3rem;
                                font-weight: bold;
                                margin: 0 7rem;
                                "
                                >Presiona aquí!</a
                            >
                        </div>
                    </body>
                </html>
                '''
                send_email(
                    receiver_address=admin_email, mail_content=mail_content, subject="Validación de cuenta.")
            except Exception as error:
                pass
