from calendar import c
from fastapi import APIRouter, HTTPException

from db.connection import conn, cur
from models.lideres import LiderModel

router = APIRouter(
    prefix="/api/lideres",
    tags=["Líderes"]
)


@router.get("/")
def get_lideres():
    try:
        cur.execute("SELECT * FROM lideres")
        lideres = cur.fetchall()

        data = []
        for lider in lideres:
            data.append({
                "id": lider[0],
                "full_name": lider[1]
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los líderes.")


@router.post("/")
def create_lider(lider: LiderModel):
    try:
        cur.execute(
            "INSERT INTO lideres (full_name) VALUES (%s) RETURNING *", [lider.full_name])
        conn.commit()

        created_lider = cur.fetchone()

        data = {
            "id": created_lider[0],
            "full_name": created_lider[1]
        }

        return {"data": data, "detail": "Líder creado con éxito."}
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Error al crear el líder.")


@router.delete("/{lider_id}")
def delete_lider(lider_id: int):
    cur.execute("SELECT * FROM lideres WHERE id = %s", [lider_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El líder no existe.")

    try:
        cur.execute(
            "DELETE FROM lideres WHERE id = %s RETURNING *", [lider_id])
        conn.commit()

        deleted_lider = cur.fetchone()
        data = {
            "id": deleted_lider[0],
            "full_name": deleted_lider[1]
        }

        return {"data": data, "detail": "Líder eliminado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar el líder.")


@router.put("/{lider_id}")
def update_lider(lider_id: int, lider: LiderModel):
    cur.execute("SELECT * FROM lideres WHERE id = %s", [lider_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El líder no existe.")

    try:
        cur.execute("UPDATE lideres SET full_name = %s WHERE id = %s RETURNING *",
                    [lider.full_name, lider_id])
        conn.commit()

        updated_lider = cur.fetchone()
        data = {
            "id": updated_lider[0],
            "full_name": updated_lider[1]
        }

        return {"data": data, "detail": "Líder actualizado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar el líder.")
