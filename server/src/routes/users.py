from fastapi import APIRouter, HTTPException

from db.connection import conn, cur

router = APIRouter(
    tags=["Users"],
    prefix="/api/users"
)


@router.get("/", status_code=200)
def get_users():
    try:
        cur.execute("SELECT users.id, users.first_name, users.last_name, users.email, users.password, users.url_image, users.verified, users.change_password, roles.id, roles.name FROM users JOIN roles ON roles.id = users.role_id")
        users = cur.fetchall()

        data = []
        for user in users:
            data.append({
                "id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "email": user[3],
                "password": user[4],
                "url_image": user[5],
                "verified": user[6],
                "change_password": user[7],
                "role": {
                    "id": user[8],
                    "name": user[9]
                }
            })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los usuarios.")
