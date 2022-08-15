from fastapi import APIRouter, HTTPException

from db.connection import cur, conn
from models.solicitudes import SolicitudModel

router = APIRouter(
    prefix="/api/solicitudes",
    tags=["Solicitudes"]
)


@router.get("/", status_code=200)
def get_solicitudes():
    try:
        cur.execute("SELECT * FROM solicitudes")
        solicitudes = cur.fetchall()

        data = []
        for solicitud in solicitudes:
            new_data = {
                "solicitud": solicitud[0],
                "created_at": solicitud[5],
                "assigned_date": solicitud[6],
                "canceled": solicitud[7]
            }

            cur.execute("SELECT * FROM users WHERE id = %s", [solicitud[1]])
            user_found = cur.fetchone()
            if user_found:
                new_data["user"] = user_found[3]
            else:
                new_data["user"] = None

            cur.execute("SELECT * FROM grupos WHERE id = %s", [solicitud[2]])
            grupo_found = cur.fetchone()
            if grupo_found:
                new_data["grupo"] = grupo_found[1]
            else:
                new_data["grupo"] = None

            cur.execute("SELECT * FROM proyectos WHERE id = %s",
                        [solicitud[3]])
            proyecto_found = cur.fetchone()
            if proyecto_found:
                new_data["proyecto"] = proyecto_found[2]
            else:
                new_data["proyecto"] = None

            cur.execute("SELECT * FROM equipos WHERE id = %s", [solicitud[4]])
            equipo_found = cur.fetchone()
            if equipo_found:
                new_data["equipo"] = equipo_found[1]
            else:
                new_data["equipo"] = None

            cur.execute(
                "SELECT * FROM estado_solicitudes WHERE id = %s", [solicitud[8]])
            estado_solicitud_found = cur.fetchone()
            if estado_solicitud_found:
                new_data["estado"] = estado_solicitud_found[1]
            else:
                new_data["estado"] = None

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar las solicitudes.")


@router.post("/", status_code=201)
def create_solicitud(solicitud: SolicitudModel):
    cur.execute("SELECT * FROM estado_solicitudes WHERE name = %s",
                ["Procesando"])
    estado_solicitud_found = cur.fetchone()
    if estado_solicitud_found == None:
        raise HTTPException(
            status_code=404, detail="Error al crear la solicitud.")

    cur.execute("SELECT * FROM users WHERE id = %s", [solicitud.user])
    user_found = cur.fetchone()
    if user_found == None:
        raise HTTPException(
            status_code=404, detail="Error al crear la solicitud")

    cur.execute("SELECT * FROM grupos WHERE id = %s", [solicitud.grupo])
    grupo_found = cur.fetchone()
    if grupo_found == None:
        raise HTTPException(
            status_code=404, detail="Error al crear la solicitud.")

    cur.execute("SELECT * FROM proyectos WHERE id = %s", [solicitud.proyecto])
    proyecto_found = cur.fetchone()
    if proyecto_found == None:
        raise HTTPException(
            status_code=404, detail="Error al crear la solicitud.")

    cur.execute("SELECT * FROM equipos WHERE id = %s", [solicitud.equipo])
    equipo_found = cur.fetchone()
    if equipo_found == None:
        raise HTTPException(
            status_code=404, detail="Error al crear la solicitud.")

    try:
        cur.execute(
            "INSERT INTO solicitudes (user_id, grupo_id, proyecto_id, equipo_id, estado_solicitud_id) VALUES (%s, %s, %s, %s, %s) RETURNING *", [solicitud.user, solicitud.grupo, solicitud.proyecto, solicitud.equipo, estado_solicitud_found[0]])
        conn.commit()

        created_solicitud = cur.fetchone()
        data = {
            "solicitud": created_solicitud[0],
            "user": user_found[3],
            "equipo": equipo_found[1],
            "grupo": grupo_found[1],
            "proyecto": proyecto_found[2],
            "created_at": created_solicitud[5],
            "assigned_date": created_solicitud[6],
            "canceled": created_solicitud[7],
            "estado": estado_solicitud_found[1]
        }

        return {"data": data, "detail": "Su solicitud ha sido añadida con éxito. Le enviaremos un correo cuando esta sea aprobada y asignada a una fecha."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al crear la solicitud.")


@router.delete("/{solicitud_id}", status_code=204)
def delete_solicitud(solicitud_id: int):
    cur.execute("SELECT * FROM solicitudes WHERE id = %s", [solicitud_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="La solicitud no existe.")

    try:
        cur.execute("DELETE FROM solicitudes WHERE id = %s", [solicitud_id])
        conn.commit()

        return {"detail": "Solicitud eliminada con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar la solicitud.")
