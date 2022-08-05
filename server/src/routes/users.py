import shutil
import os
import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile

from db.connection import conn, cur

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


@router.get("/{user_id}")
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


@router.post("/change-image/{user_id}")
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
