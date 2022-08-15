from fastapi import APIRouter, HTTPException

from models.users_proyectos import UsersProyectosModel
from db.connection import cur, conn

router = APIRouter(
    prefix="/api/users-proyectos",
    tags=["Usuarios - Proyectos"]
)


@router.get("/", status_code=200)
def get_users_proyectos():
    try:
        cur.execute("SELECT * FROM users_proyectos")
        users_proyectos = cur.fetchall()

        data = []
        for user_proyecto in users_proyectos:
            new_data = {}

            cur.execute("SELECT * FROM users WHERE id = %s",
                        [user_proyecto[0]])
            user_found = cur.fetchone()
            if user_found == None:
                new_data["user"] = None
            else:
                new_data["user"] = user_found[3]

            cur.execute("SELECT * FROM proyectos WHERE id = %s",
                        [user_proyecto[1]])
            proyecto_found = cur.fetchone()
            if proyecto_found == None:
                new_data["proyecto"] = None
            else:
                new_data["proyecto"] = proyecto_found[2]

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los usuarios con sus proyectos.")


@router.get("/{user_id}")
def get_users_proyectos_by_user(user_id: int):
    try:
        cur.execute(
            "SELECT * FROM users_proyectos WHERE users_id = %s", [user_id])
        user_proyectos = cur.fetchall()

        data = []
        for user_proyecto in user_proyectos:
            cur.execute("SELECT * FROM proyectos WHERE id = %s",
                        [user_proyecto[1]])
            proyecto_found = cur.fetchone()
            if proyecto_found:
                data.append({
                    "id": proyecto_found[0],
                    "name": proyecto_found[2]
                })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los proyectos del usuario.")


@router.post("/", status_code=200)
def handle_users_proyectos(post: UsersProyectosModel):
    try:
        if post.checked == False:
            cur.execute(
                "SELECT * FROM users_proyectos WHERE users_id = %s AND proyectos_id = %s", [post.user, post.proyecto])
            if cur.fetchone():
                cur.execute("DELETE FROM users_proyectos WHERE users_id = %s AND proyectos_id = %s", [
                            post.user, post.proyecto])
                conn.commit()
        elif post.checked == True:
            cur.execute(
                "SELECT * FROM users_proyectos WHERE users_id = %s AND proyectos_id = %s", [post.user, post.proyecto])
            if cur.fetchone() == None:
                cur.execute("INSERT INTO users_proyectos (users_id, proyectos_id) VALUES (%s, %s)", [
                            post.user, post.proyecto])
                conn.commit()

        data_users_proyectos = []
        cur.execute(
            "SELECT * FROM users_proyectos WHERE users_id = %s", [post.user])
        users_proyectos = cur.fetchall()
        for user_proyecto in users_proyectos:
            data_users_proyectos.append(user_proyecto[1])

        return {"users_proyectos": data_users_proyectos}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al asignar el usuario al proyecto.")
