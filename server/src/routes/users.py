import shutil
import os
import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile

from db.connection import conn, cur
from models.users import UserInfoModel

router = APIRouter(
    tags=["Users"],
    prefix="/api/users"
)


@router.get("/", status_code=200)
def get_users():
    try:
        cur.execute("SELECT users.id, users.first_name, users.last_name, users.email, users.password, users.url_image, users.verified, users.change_password, roles.id, roles.name FROM users JOIN roles ON roles.id = users.role_id")
        users = cur.fetchall()

        data = []
        for user in users:
            data.append({
                "id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "email": user[3],
                "password": user[4],
                "url_image": user[5],
                "verified": user[6],
                "change_password": user[7],
                "role": {
                    "id": user[8],
                    "name": user[9]
                }
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los usuarios.")


@router.get("/{user_id}", status_code=200)
def get_user(user_id: int):
    cur.execute(
        "SELECT users.id, users.first_name, users.last_name, users.email, users.password, users.url_image, users.verified, users.change_password, roles.id, roles.name FROM users JOIN roles ON roles.id = users.role_id WHERE users.id = %s", [user_id])
    user_found = cur.fetchone()
    if user_found == None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    try:
        data = {
            "id": user_found[0],
            "first_name": user_found[1],
            "last_name": user_found[2],
            "email": user_found[3],
            "password": user_found[4],
            "url_image": user_found[5],
            "verified": user_found[6],
            "change_password": user_found[7],
            "role": {
                "id": user_found[8],
                "name": user_found[9]
            }
        }

        return {"user": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al obtener el usuario.")


@router.put("/change-info-user/{user_id}", status_code=200)
def change_info_user(user_id: int, user: UserInfoModel):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    try:
        cur.execute("UPDATE users SET first_name = %s, last_name = %s WHERE id = %s RETURNING first_name, last_name",
                    [user.first_name, user.last_name, user_id])
        conn.commit()

        updated_user = cur.fetchone()
        data = {
            "first_name": updated_user[0],
            "last_name": updated_user[1]
        }

        return {"user": data, "detail": "Información actualizada."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar los datos.")


@router.put("/change-image/{user_id}", status_code=200)
def change_image(user_id: int, image: UploadFile = File(...)):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    try:
        image_name = f"{str(uuid.uuid4())}_{str(user_id)}_{image.filename}"
        path_image = os.path.join(
            os.getcwd(), "static", "images", image_name)

        with open(path_image, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        new_url_image = f"/static/images/{image_name}"
        cur.execute("UPDATE users SET url_image = %s WHERE id = %s", [
                    new_url_image, user_id])
        conn.commit()

        return {"detail": "Foto de perfil actualizada.", "url_image": new_url_image}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar su foto de perfil.")
