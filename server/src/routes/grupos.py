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
        cur.execute("SELECT * FROM grupos")
        grupos = cur.fetchall()

        data = []
        for grupo in grupos:
            new_data = {
                "id": grupo[0],
                "name": grupo[1],
                "description": grupo[2],
                "creation_date": grupo[3],
                "score": grupo[4]
            }

            if grupo[5]:
                cur.execute("SELECT * FROM lideres WHERE id = %s", [grupo[5]])
                new_data["lider"] = cur.fetchone()[1]
            else:
                new_data["lider"] = None

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los grupos.")


@router.post("/", status_code=201)
def create_grupo(grupo: GrupoModel):
    cur.execute("SELECT * FROM grupos WHERE name = %s", [grupo.name])
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="El grupo ya existe.")

    cur.execute("SELECT * FROM lideres WHERE id = %s", [grupo.lider])
    lider_found = cur.fetchone()
    if lider_found == None:
        raise HTTPException(status_code=404, detail="El líder no existe.")

    try:
        cur.execute("INSERT INTO grupos (name, description, creation_date, score, lider_id) VALUES (%s, %s, %s, %s, %s) RETURNING *",
                    [grupo.name, grupo.description, grupo.date, grupo.score, lider_found[0]])
        conn.commit()

        created_grupo = cur.fetchone()
        data = {
            "id": created_grupo[0],
            "name": created_grupo[1],
            "description": created_grupo[2],
            "creation_date": created_grupo[3],
            "score": created_grupo[4]
        }

        return {"data": data, "detail": "Grupo creado con éxito."}
    except Exception as error:
        raise HTTPException(status_code=500, detail="Error al crear el grupo.")
