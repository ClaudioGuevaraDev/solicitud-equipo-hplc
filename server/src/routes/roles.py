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


@router.post("/", status_code=201)
def create_role(role: RolBaseModel):
    role = jsonable_encoder(role)

    cur.execute("SELECT * FROM roles WHERE name = %s", [role["name"]])
    if len(cur.fetchall()) > 0:
        raise HTTPException(status_code=400, detail="El rol ya existe")

    try:
        cur.execute("INSERT INTO roles (name) VALUES (%s) RETURNING *",
                    [role["name"]])
        conn.commit()

        created_role = cur.fetchone()

        data = {
            "id": created_role[0],
            "name": created_role[1]
        }

        return {"data": data}
    except Exception as error:
        raise HTTPException(status_code=500, detail="Error al crear el rol.")


@router.delete("/{role_id}", status_code=200)
def delete_role(role_id: int):
    cur.execute("SELECT * FROM roles WHERE id = %s", [role_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="Rol no encontrado.")

    try:
        cur.execute("DELETE FROM roles WHERE id = %s RETURNING *", [role_id])
        conn.commit()

        deleted_role = cur.fetchone()
        data = {
            "id": deleted_role[0],
            "name": deleted_role[1]
        }

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar el rol.")


@router.put("/{role_id}", status_code=200)
def update_role(role_id: int, role: RolBaseModel):
    cur.execute("SELECT * FROM roles WHERE id = %s", [role_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="Rol no encontrado.")

    try:
        cur.execute("UPDATE roles SET name = %s WHERE id = %s RETURNING *",
                    [role.name, role_id])
        conn.commit()

        updated_role = cur.fetchone()
        data = {
            "id": updated_role[0],
            "name": updated_role[1]
        }

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar el rol.")
