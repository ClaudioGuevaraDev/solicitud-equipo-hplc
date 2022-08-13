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


@router.get("/page/{id_value}", status_code=200)
def get_users(id_value: int):
    cur.execute("SELECT * FROM roles WHERE name = %s", ["user"])
    rol_found = cur.fetchone()
    if rol_found == None:
        raise HTTPException(
            status_code=500, detail="Error al listar los usuarios.")

    try:
        cur.execute(
            "SELECT * FROM users WHERE id >= %s AND role_id = %s ORDER BY id ASC LIMIT 10", [id_value, rol_found[0]])
        users = cur.fetchall()

        data = []
        if (len(users) > 0):
            for user in users:
                new_data = {
                    "id": user[0],
                    "first_name": user[1],
                    "last_name": user[2],
                    "email": user[3],
                    "url_image": user[5],
                    "verified": user[6],
                }

                if (user[8]):
                    cur.execute(
                        "SELECT * FROM jerarquias WHERE id = %s", [user[8]])
                    jerarquia_found = cur.fetchone()
                    new_data["jerarquia"] = {
                        "id": jerarquia_found[0],
                        "name": jerarquia_found[1],
                        "score": jerarquia_found[2]
                    }
                else:
                    new_data["jerarquia"] = None

                grupos = []
                cur.execute(
                    "SELECT * FROM users_grupos WHERE users_id = %s", [user[0]])
                users_grupos = cur.fetchall()
                for user_grupo in users_grupos:
                    cur.execute(
                        "SELECT * FROM grupos WHERE id = %s", [user_grupo[1]])
                    grupo_found = cur.fetchone()
                    if grupo_found:
                        grupos.append(grupo_found[1])
                new_data["grupos"] = grupos

                proyectos = []
                cur.execute(
                    "SELECT * FROM users_proyectos WHERE users_id = %s", [user[0]])
                users_proyectos = cur.fetchall()
                for user_proyecto in users_proyectos:
                    cur.execute(
                        "SELECT * FROM proyectos WHERE id = %s", [user_proyecto[0]])
                    proyecto_found = cur.fetchone()
                    if proyecto_found:
                        proyectos.append(proyecto_found[2])
                new_data["proyectos"] = proyectos

                data.append(new_data)

        next_page = 0
        if (len(data) > 0):
            next_page = data[len(data)-1]["id"] + 1

        first_page = False
        cur.execute("SELECT * FROM users WHERE role_id = %s ORDER BY id ASC LIMIT 1",
                    [rol_found[0]])
        first_element = cur.fetchone()
        if ((first_element) and (len(data) > 0) and (data[0]["id"] == first_element[0])):
            first_page = True

        last_page = False
        cur.execute(
            "SELECT * FROM users WHERE role_id = %s ORDER BY id DESC LIMIT 1", [rol_found[0]])
        last_element = cur.fetchone()
        if ((last_element) and (len(data) > 0) and (data[-1]["id"] == last_element[0])):
            last_page = True

        return {"data": data, "next_page": next_page, "first_page": first_page, "last_page": last_page}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al listar los usuarios.")


@router.get("/previus-page/{previus_page}")
def get_previus_page(previus_page: int):
    cur.execute(
        "SELECT * FROM users WHERE id < %s ORDER BY id DESC LIMIT 10", [previus_page])
    previus = cur.fetchall()

    previus_value = None
    if (len(previus) > 0):
        previus_value = previus[-1][0]

    return {"previus_value": previus_value}


@router.get("/{user_id}", status_code=200)
def get_user(user_id: int):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    user_found = cur.fetchone()
    if user_found == None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    try:
        data = {
            "id": user_found[0],
            "first_name": user_found[1],
            "last_name": user_found[2],
            "email": user_found[3],
            "url_image": user_found[5],
            "verified": user_found[6],
        }

        if (user_found[8]):
            cur.execute("SELECT * FROM jerarquias WHERE id = %s",
                        [user_found[8]])
            jerarquia_found = cur.fetchone()
            data["jerarquia"] = {
                "id": jerarquia_found[0],
                "name": jerarquia_found[1],
                "score": jerarquia_found[2]
            }
        else:
            data["jerarquia"] = None

        if (user_found[9]):
            cur.execute("SELECT * FROM roles WHERE id = %s", [user_found[9]])
            role_found = cur.fetchone()
            data["role"] = {
                "id": role_found[0],
                "name": role_found[1]
            }
        else:
            data["role"] = None

        return {"user": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al obtener el usuario.")


@router.put("/change-info-user/{user_id}", status_code=200)
def change_info_user(user_id: int, user: UserInfoModel):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    jerarquia_found = None
    if user.jerarquia != "":
        cur.execute("SELECT * FROM jerarquias WHERE name = %s",
                    [user.jerarquia])
        jerarquia_found = cur.fetchone()
        if jerarquia_found == None:
            raise HTTPException(
                status_code=404, detail="La jerarquía no existe.")
        else:
            jerarquia_found = jerarquia_found[0]

    try:
        cur.execute("UPDATE users SET first_name = %s, last_name = %s, jerarquia_id = %s WHERE id = %s RETURNING first_name, last_name, jerarquia_id",
                    [user.first_name, user.last_name, jerarquia_found, user_id])
        conn.commit()

        updated_user = cur.fetchone()

        jerarquia_found_updated = None
        if jerarquia_found == None:
            jerarquia_found_updated = None
        else:
            cur.execute("SELECT * FROM jerarquias WHERE id = %s",
                        [updated_user[2]])
            jerarquia_found_updated = cur.fetchone()[1]

        data = {
            "first_name": updated_user[0],
            "last_name": updated_user[1],
            "jerarquia": jerarquia_found_updated
        }

        return {"user": data, "detail": "Información actualizada."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar los datos.")


@router.put("/change-image/{user_id}", status_code=200)
def change_image(user_id: int, image: UploadFile = File(...)):
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    user_found = cur.fetchone()
    if user_found == None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    try:
        image_name = f"{str(uuid.uuid4())}_{str(user_id)}_{image.filename}"
        path_image = os.path.join(
            os.getcwd(), "static", "images", image_name)
        new_url_image = f"/static/images/{image_name}"

        cur.execute("SELECT * FROM users WHERE url_image = %s",
                    [new_url_image])
        if cur.fetchone():
            raise HTTPException(
                status_code=500, detail="Error al actualizar su foto de perfil.")

        with open(path_image, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        cur.execute("UPDATE users SET url_image = %s WHERE id = %s", [
                    new_url_image, user_id])
        conn.commit()

        if (user_found[5] != None) and (len(user_found[5].split("/")) == 4):
            os.remove(os.path.join(os.getcwd(), "static",
                      "images", user_found[5].split("/")[3]))

        return {"detail": "Foto de perfil actualizada.", "url_image": new_url_image}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar su foto de perfil.")
