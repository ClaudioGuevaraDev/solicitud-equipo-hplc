from fastapi import APIRouter, HTTPException

from db.connection import cur

router = APIRouter(
    prefix="/api/estados-equipos",
    tags=["Estados"]
)


@router.get("/", status_code=200)
def get_estados():
    try:
        cur.execute("SELECT * FROM estado_equipos")
        estados = cur.fetchall()

        data = []
        for estado in estados:
            data.append({
                "id": estado[0],
                "name": estado[1]
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los estados.")
