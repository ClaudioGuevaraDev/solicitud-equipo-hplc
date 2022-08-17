from fastapi import APIRouter, HTTPException

from models.grupos import GrupoModel
from db.connection import conn, cur

router = APIRouter(
    prefix="/api/grupos",
    tags=["Grupos"]
)


@router.get("/")
def get_grupos():
    try:
        cur.execute(
            "SELECT * FROM grupos")
        grupos = cur.fetchall()

        data = []
        for grupo in grupos:
            data.append({
                "id": grupo[0],
                "name": grupo[1],
                "creation_date": grupo[2],
                "score": grupo[3],
                "lider": grupo[4]
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los grupos.")


@router.get("/{user_id}/{type_filter}/{value_search}", status_code=200)
def get_grupos_by_user(user_id: int, type_filter: str, value_search: str):
    try:
        users_grupos = []
        cur.execute(
            "SELECT * FROM users_grupos WHERE users_id = %s", [user_id])
        users_grupos_found = cur.fetchall()
        for user_grupo_found in users_grupos_found:
            users_grupos.append(user_grupo_found[1])

        data = []

        if value_search == "null":
            cur.execute("SELECT * FROM grupos ORDER BY id ASC")
            grupos = cur.fetchall()
        else:
            cur.execute("SELECT * FROM grupos WHERE name LIKE %s ORDER BY id ASC",
                        [f"%{value_search}%"])
            grupos = cur.fetchall()
        for grupo in grupos:
            if type_filter == "all":
                data.append({
                    "id": grupo[0],
                    "name": grupo[1],
                    "creation_date": grupo[2],
                    "score": grupo[3],
                    "lider": grupo[4]
                })
            else:
                if grupo[0] in users_grupos:
                    data.append({
                        "id": grupo[0],
                        "name": grupo[1],
                        "creation_date": grupo[2],
                        "score": grupo[3],
                        "lider": grupo[4]
                    })

        return {"data": data, "users_grupos": users_grupos}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al listar los grupos.")

@router.post("/", status_code=201)
def create_grupo(grupo: GrupoModel):
    cur.execute("SELECT * FROM grupos WHERE name = %s", [grupo.name])
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="El grupo ya existe.")

    try:
        cur.execute("INSERT INTO grupos (name, creation_date, score, lider) VALUES (%s, %s, %s, %s) RETURNING *",
                    [grupo.name, grupo.date, grupo.score, grupo.lider])
        conn.commit()

        created_grupo = cur.fetchone()

        data = {
            "id": created_grupo[0],
            "name": created_grupo[1],
            "creation_date": created_grupo[2],
            "score": created_grupo[3],
            "lider": created_grupo[4]
        }

        return {"data": data, "detail": "Grupo creado con éxito."}
    except Exception as error:
        raise HTTPException(status_code=500, detail="Error al crear el grupo.")


@router.delete("/{grupo_id}")
def delete_grupo(grupo_id):
    cur.execute("SELECT * FROM grupos WHERE id = %s", [grupo_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El grupo no existe.")

    try:
        cur.execute("DELETE FROM grupos WHERE id = %s RETURNING *", [grupo_id])
        conn.commit()

        deleted_grupo = cur.fetchone()

        data = {
            "id": deleted_grupo[0],
        }

        return {"data": data, "detail": "Grupo eliminado."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar el grupo.")


@router.put("/{grupo_id}")
def update_grupo(grupo_id: int, grupo: GrupoModel):
    cur.execute("SELECT * FROM grupos WHERE id = %s", [grupo_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El grupo no existe.")

    try:
        cur.execute("UPDATE grupos SET name = %s, creation_date = %s, score = %s, lider = %s WHERE id = %s RETURNING *",
                    [grupo.name, grupo.date, grupo.score, grupo.lider, grupo_id])
        conn.commit()

        updated_grupo = cur.fetchone()

        new_data = {
            "id": updated_grupo[0],
            "name": updated_grupo[1],
            "creation_date": updated_grupo[2],
            "score": updated_grupo[3],
            "lider": updated_grupo[4]
        }

        return {"data": new_data, "detail": "Grupo actualizado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar el grupo.")
