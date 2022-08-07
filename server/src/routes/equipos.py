from fastapi import APIRouter, UploadFile, File, Form, HTTPException
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


@router.post("/", status_code=201)
def create_equipo(file: UploadFile = File(...), name: str = Form(...), date_obtained: datetime.date = Form(...), estado: int = Form(...)):
    image_name = f"{str(uuid.uuid4())}_{name}_{file.filename}"
    path_image = os.path.join(os.getcwd(), "static", "images", image_name)
    url_image = f"/static/images/{image_name}"

    cur.execute("SELECT * FROM equipos WHERE url_image = %s", [url_image])
    if cur.fetchone():
        raise HTTPException(
            status_code=500, detail="Error al crear el equipo.")

    cur.execute("SELECT * FROM estados WHERE id = %s", [estado])
    estado_found = cur.fetchone()
    if estado_found == None:
        raise HTTPException(status_code=404, detail="El estado no existe.")

    with open(path_image, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
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
