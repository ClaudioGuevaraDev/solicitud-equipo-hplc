from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Union
import datetime
import uuid
import os
import shutil

from db.connection import cur, conn

router = APIRouter(
    prefix="/api/equipos",
    tags=["Equipos"]
)


@router.get("/", status_code=200)
def get_equipos():
    try:
        cur.execute("SELECT * FROM equipos")
        equipos = cur.fetchall()

        data = []
        for equipo in equipos:
            new_data = {
                "id": equipo[0],
                "name": equipo[1],
                "url_image": equipo[2],
                "date_obtained": equipo[3],
            }

            cur.execute("SELECT * FROM estados WHERE id = %s", [equipo[4]])
            estado_found = cur.fetchone()
            if estado_found == None:
                new_data["estado"] = None
            else:
                new_data["estado"] = estado_found[1]

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los equipos.")


@router.post("/")
def create_equipo(file: UploadFile = File(...), name: str = Form(...), date_obtained: datetime.date = Form(...), estado: str = Form(...)):
    image_name = f"{str(uuid.uuid4())}_{name}_{file.filename}"
    path_image = os.path.join(os.getcwd(), "static", "images", image_name)
    url_image = f"/static/images/{image_name}"

    cur.execute("SELECT * FROM equipos WHERE name = %s", [name])
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="El equipo ya existe.")

    cur.execute("SELECT * FROM equipos WHERE url_image = %s", [url_image])
    if cur.fetchone():
        raise HTTPException(
            status_code=500, detail="Error al crear el equipo.")

    cur.execute("SELECT * FROM estados WHERE name = %s", [estado])
    estado_found = cur.fetchone()
    if estado_found == None:
        raise HTTPException(status_code=404, detail="El estado no existe.")

    try:
        with open(path_image, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        cur.execute("INSERT INTO equipos (name, url_image, date_obtained, estado_id) VALUES (%s, %s, %s, %s) RETURNING *",
                    [name, url_image, date_obtained, estado_found[0]])
        conn.commit()

        created_equipo = cur.fetchone()
        data = {
            "id": created_equipo[0],
            "name": created_equipo[1],
            "url_image": created_equipo[2],
            "date_obtained": created_equipo[3],
            "estado": estado_found[1]
        }

        return {"detail": "Equipo creado con éxito.", "data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al crear el equipo.")


@router.delete("/{equipo_id}")
def delete_equipo(equipo_id):
    cur.execute("SELECT * FROM equipos WHERE id = %s", [equipo_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El equipo no existe.")

    try:
        cur.execute(
            "DELETE FROM equipos WHERE id = %s RETURNING *", [equipo_id])
        conn.commit()

        deleted_user = cur.fetchone()
        if ((deleted_user[2] != None) and (len(deleted_user[2].split("/")) == 4)):
            os.remove(os.path.join(os.getcwd(), "static",
                      "images", deleted_user[2].split("/")[3]))

        data = {
            "id": deleted_user[0]
        }

        return {"data": data, "detail": "Equipo eliminado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar el equipo.")


@router.put("/{equipo_id}")
def update_equipo(equipo_id: int, file: Union[UploadFile, None] = None, name: str = Form(...), date_obtained: datetime.date = Form(...), estado: str = Form(...)):
    cur.execute("SELECT * FROM equipos WHERE id = %s", [equipo_id])
    equipo_found = cur.fetchone()
    if equipo_found == None:
        raise HTTPException(status_code=404, detail="El equipo no existe.")

    cur.execute("SELECT * FROM equipos WHERE name = %s", [name])
    equipo_found_name = cur.fetchone()
    if ((equipo_found_name) and (equipo_found_name[0] != equipo_id)):
        raise HTTPException(status_code=400, detail="El equipo ya existe.")

    cur.execute("SELECT * FROM estados WHERE name = %s", [estado])
    estado_found = cur.fetchone()
    if estado_found == None:
        raise HTTPException(status_code=404, detail="El estado no existe.")

    try:
        updated_equipo = None
        if file:
            image_name = f"{str(uuid.uuid4())}_{name}_{file.filename}"
            path_image = os.path.join(
                os.getcwd(), "static", "images", image_name)
            url_image = f"/static/images/{image_name}"

            with open(path_image, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            cur.execute("UPDATE equipos SET name = %s, url_image = %s, date_obtained = %s, estado_id = %s WHERE id = %s RETURNING *",
                        [name, url_image, date_obtained, estado_found[0], equipo_id])

            if ((equipo_found[2] != None) and (len(equipo_found[2].split("/")) == 4)):
                os.remove(os.path.join(os.getcwd(), "static",
                                       "images", equipo_found[2].split("/")[3]))
        else:
            cur.execute("UPDATE equipos SET name = %s, date_obtained = %s, estado_id = %s WHERE id = %s RETURNING *",
                        [name, date_obtained, estado_found[0], equipo_id])

        updated_equipo = cur.fetchone()
        data = {
            "id": updated_equipo[0],
            "name": updated_equipo[1],
            "url_image": updated_equipo[2],
            "date_obtained": updated_equipo[3],
            "estado": estado_found[1]
        }

        return {"detail": "Equipo actualizado.", "data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar el equipo.")
