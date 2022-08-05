from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder

from models.roles import RolBaseModel
from db.connection import conn, cur

router = APIRouter(
    prefix="/api/roles",
    tags=["Roles"]
)


@router.get("/", status_code=200)
def get_roles():
    try:
        cur.execute("SELECT * FROM roles")
        roles = cur.fetchall()

        data = []
        for role in roles:
            data.append({
                "id": role[0],
                "name": role[1]
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los roles.")
