from fastapi import APIRouter, HTTPException

from db.connection import conn, cur
from models.proyectos import ProyectoModel

router = APIRouter(
    prefix="/api/proyectos",
    tags=["Proyectos"]
)


@router.get("/", status_code=200)
def get_proyectos():
    try:
        cur.execute("SELECT * FROM proyectos ORDER BY id ASC")
        proyectos = cur.fetchall()

        data = []
        for proyecto in proyectos:
            new_data = {
                "id": proyecto[0],
                "folio": proyecto[1],
                "name": proyecto[2],
                "start_date": proyecto[3],
                "termination_date": proyecto[4],
                "score": proyecto[5]
            }
            cur.execute("SELECT * FROM grupos WHERE id = %s", [proyecto[6]])
            grupo_found = cur.fetchone()
            if grupo_found == None:
                new_data["grupo"] = None
            else:
                new_data["grupo"] = grupo_found[1]

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los proyectos")


@router.get("/{user_id}/{role}/{type_filter}/{value_search}", status_code=200)
def get_proyectos_by_user(user_id: int, role: str, type_filter: str, value_search: str):
    users_proyectos = []
    if role == "user":
        cur.execute(
            "SELECT * FROM users_proyectos WHERE users_id = %s", [user_id])
        users_proyectos_found = cur.fetchall()
        for user_proyecto_found in users_proyectos_found:
            users_proyectos.append(user_proyecto_found[1])

    try:
        data = []
        proyectos = []

        if role == "admin":
            if value_search == "null":
                cur.execute("SELECT * FROM proyectos ORDER BY id ASC")
                proyectos = cur.fetchall()
            else:
                cur.execute(
                    "SELECT * FROM proyectos WHERE name LIKE %s ORDER BY id ASC", [f"%{value_search}%"])
                proyectos = cur.fetchall()
            for proyecto in proyectos:
                cur.execute("SELECT * FROM grupos WHERE id = %s",
                            [proyecto[6]])
                grupo_found = cur.fetchone()

                data.append({
                    "id": proyecto[0],
                    "folio": proyecto[1],
                    "name": proyecto[2],
                    "start_date": proyecto[3],
                    "termination_date": proyecto[4],
                    "score": proyecto[5],
                    "grupo": grupo_found[1] if grupo_found else None
                })
        elif role == "user":
            cur.execute(
                "SELECT * FROM users_grupos WHERE users_id = %s", [user_id])
            users_grupos = cur.fetchall()
            for user_grupo in users_grupos:
                if value_search == "null":
                    cur.execute(
                        "SELECT * FROM proyectos WHERE grupo_id = %s ORDER BY id ASC", [user_grupo[1]])
                    proyectos = cur.fetchall()
                else:
                    cur.execute(
                        "SELECT * FROM proyectos WHERE grupo_id = %s AND name LIKE %s ORDER BY id ASC", [user_grupo[1], f"%{value_search}%"])
                    proyectos = cur.fetchall()
                for proyecto in proyectos:
                    cur.execute(
                        "SELECT * FROM grupos WHERE id = %s", [proyecto[6]])
                    grupo_found = cur.fetchone()

                    if type_filter == "all":
                        data.append({
                            "id": proyecto[0],
                            "folio": proyecto[1],
                            "name": proyecto[2],
                            "start_date": proyecto[3],
                            "termination_date": proyecto[4],
                            "score": proyecto[5],
                            "grupo": grupo_found[1] if grupo_found else None
                        })
                    else:
                        if proyecto[0] in users_proyectos:
                            data.append({
                                "id": proyecto[0],
                                "folio": proyecto[1],
                                "name": proyecto[2],
                                "start_date": proyecto[3],
                                "termination_date": proyecto[4],
                                "score": proyecto[5],
                                "grupo": grupo_found[1] if grupo_found else None
                            })

        return {"data": data, "users_proyectos": users_proyectos}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al listar los proyectos.")


@router.post("/", status_code=201)
def create_proyecto(proyecto: ProyectoModel):
    cur.execute("SELECT * FROM proyectos WHERE name = %s", [proyecto.name])
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="El proyecto ya existe.")

    if proyecto.folio != "":
        cur.execute("SELECT * FROM proyectos WHERE folio = %s",
                    [proyecto.folio])
        if cur.fetchone():
            raise HTTPException(
                status_code=400, detail="Folio ingresado ya existe.")

    grupo_found = None
    if proyecto.grupo != None:
        cur.execute("SELECT * FROM grupos WHERE name = %s", [proyecto.grupo])
        grupo_found = cur.fetchone()
        if grupo_found == None:
            raise HTTPException(status_code=404, detail="El grupo no existe.")

    try:
        if grupo_found == None:
            cur.execute("INSERT INTO proyectos (folio, name, start_date, termination_date, score, grupo_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                        [proyecto.folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, None])
        else:
            cur.execute("INSERT INTO proyectos (folio, name, start_date, termination_date, score, grupo_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                        [proyecto.folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, grupo_found[0]])
        conn.commit()

        created_proyecto = cur.fetchone()
        if grupo_found == None:
            data = {
                "id": created_proyecto[0],
                "folio": created_proyecto[1],
                "name": created_proyecto[2],
                "start_date": created_proyecto[3],
                "termination_date": created_proyecto[4],
                "score": created_proyecto[5],
                "grupo": None
            }
        else:
            data = {
                "id": created_proyecto[0],
                "folio": created_proyecto[1],
                "name": created_proyecto[2],
                "start_date": created_proyecto[3],
                "termination_date": created_proyecto[4],
                "score": created_proyecto[5],
                "grupo": grupo_found[1]
            }

        return {"data": data, "detail": "Proyecto creado con ??xito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al crear el proyecto.")


@router.delete("/{proyecto_id}", status_code=200)
def delete_proyecto(proyecto_id: int):
    cur.execute("SELECT * FROM proyectos WHERE id = %s", [proyecto_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El proyecto no existe.")

    try:
        cur.execute("DELETE FROM proyectos WHERE id = %s", [proyecto_id])
        conn.commit()

        return {"detail": "Proyecto eliminado con ??xito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar el proyecto.")


@router.put("/{proyecto_id}")
def update_proyecto(proyecto_id: int, proyecto: ProyectoModel):
    cur.execute("SELECT * FROM proyectos WHERE id = %s", [proyecto_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El proyecto no existe.")

    cur.execute("SELECT * FROM proyectos WHERE name = %s", [proyecto.name])
    proyecto_found_name = cur.fetchone()
    if proyecto_found_name and proyecto_found_name[0] != proyecto_id:
        raise HTTPException(status_code=400, detail="El proyecto ya existe.")

    value_folio = None
    if len(proyecto.folio) > 0:
        value_folio = proyecto.folio
        cur.execute("SELECT * FROM proyectos WHERE folio = %s",
                    [proyecto.folio])
        proyecto_found_folio = cur.fetchone()
        if proyecto_found_folio and proyecto_found_folio[0] != proyecto_id:
            raise HTTPException(
                status_code=400, detail="El folio ingresado ya existe.")

    grupo_found = None
    if proyecto.grupo:
        cur.execute("SELECT * FROM grupos WHERE name = %s", [proyecto.grupo])
        grupo_found = cur.fetchone()
        if grupo_found == None:
            raise HTTPException(status_code=404, detail="El grupo no existe.")

    try:
        if grupo_found == None:
            cur.execute("UPDATE proyectos SET folio = %s, name = %s, start_date = %s, termination_date = %s, score = %s WHERE id = %s RETURNING *",
                        [value_folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, proyecto_id])
        else:
            cur.execute("UPDATE proyectos SET folio = %s, name = %s, start_date = %s, termination_date = %s, score = %s, grupo_id = %s WHERE id = %s RETURNING *",
                        [value_folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, grupo_found[0], proyecto_id])
        conn.commit()

        updated_proyecto = cur.fetchone()
        data = {
            "id": updated_proyecto[0],
            "folio": updated_proyecto[1],
            "name": updated_proyecto[2],
            "start_date": updated_proyecto[3],
            "termination_date": updated_proyecto[4],
            "score": updated_proyecto[5],
            "grupo": grupo_found[1] if grupo_found else None
        }

        return {"data": data, "detail": "Proyeto actualizado con ??xito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar el proyecto.")
