from fastapi import APIRouter, HTTPException

from db.connection import conn, cur
from models.jerarquias import JerarquiaModel

router = APIRouter(
    prefix="/api/jerarquias",
    tags=["Jerarquías"]
)


@router.get("/", status_code=200)
def get_jerarquias():
    try:
        cur.execute("SELECT * FROM jerarquias")
        jerarquias = cur.fetchall()

        data = []
        for jerarquia in jerarquias:
            data.append({
                "id": jerarquia[0],
                "name": jerarquia[1],
                "score": jerarquia[2]
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar las jerarquías.")


@router.post("/", status_code=201)
def create_jerarquia(jerarquia: JerarquiaModel):
    cur.execute("SELECT * FROM jerarquias WHERE name = %s", [jerarquia.name])
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="La jerarquía ya existe.")

    try:
        cur.execute("INSERT INTO jerarquias (name, score) VALUES (%s, %s) RETURNING *",
                    [jerarquia.name.lower(), jerarquia.score])
        conn.commit()

        created_jerarquia = cur.fetchone()
        data = {
            "id": created_jerarquia[0],
            "name": created_jerarquia[1],
            "score": created_jerarquia[2]
        }

        return {"data": data, "detail": "Jerarquía creada con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al crear la jerarquía.")


@router.delete("/{jerarquia_id}")
def delete_jerarquia(jerarquia_id: int):
    cur.execute("SELECT * FROM jerarquias WHERE id = %s", [jerarquia_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="La jerarquía no existe.")

    try:
        cur.execute(
            "DELETE FROM jerarquias WHERE id = %s RETURNING *", [jerarquia_id])
        deleted_jerarquia = cur.fetchone()

        data = {
            "id": deleted_jerarquia[0],
            "name": deleted_jerarquia[1],
            "score": deleted_jerarquia[2]
        }

        return {"data": data, "detail": "Jerarquía eliminada con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar la jerarquía.")


@router.put("/{jerarquia_id}")
def update_jerarquia(jerarquia_id: int, jerarquia: JerarquiaModel):
    cur.execute("SELECT * FROM jerarquias WHERE id = %s", [jerarquia_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="La jerarquía no existe.")

    try:
        cur.execute("UPDATE jerarquias SET name = %s, score = %s WHERE id = %s RETURNING *",
                    [jerarquia.name.lower(), jerarquia.score, jerarquia_id])
        conn.commit()

        updated_jerarquia = cur.fetchone()
        data = {
            "id": updated_jerarquia[0],
            "name": updated_jerarquia[1],
            "score": updated_jerarquia[2]
        }

        return {"detail": "Jerarquía actulizada con éxito.", "data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar la jerarquía.")
