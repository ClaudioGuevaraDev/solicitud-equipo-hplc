from fastapi import APIRouter, HTTPException

from db.connection import cur, conn
from models.users_grupos import UserGrupoModel

router = APIRouter(
    prefix="/api/users-grupos",
    tags=["Usuarios - Grupos"]
)


@router.get("/", status_code=200)
def get_users_grupos():
    try:
        cur.execute("SELECT * FROM users_grupos")
        users_grupos = cur.fetchall()

        data = []
        for i in users_grupos:
            new_data = {}

            cur.execute("SELECT * FROM users WHERE id = %s", [i[0]])
            user_found = cur.fetchone()
            if user_found == None:
                new_data["user"] = None
            else:
                new_data["user"] = user_found[3]

            cur.execute("SELECT * FROM grupos WHERE id = %s", [i[1]])
            grupo_found = cur.fetchone()
            if grupo_found == None:
                new_data["grupo"] = None
            else:
                new_data["grupo"] = grupo_found[1]

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los usuarios y grupos.")


@router.get("/{user_id}")
def get_users_grupos_by_user(user_id: int):
    try:
        cur.execute(
            "SELECT * FROM users_grupos WHERE users_id = %s", [user_id])
        users_grupos = cur.fetchall()

        data = []
        for user_grupo in users_grupos:
            cur.execute("SELECT * FROM proyectos WHERE grupo_id = %s", [user_grupo[1]])
            proyectos_found = cur.fetchall()
            key = False
            for proyecto_found in proyectos_found:
                cur.execute("SELECT * FROM users_proyectos WHERE proyectos_id = %s", [proyecto_found[0]])
                if cur.fetchone():
                    key = True
                    break

            if key == True:
                cur.execute("SELECT * FROM grupos WHERE id = %s", [user_grupo[1]])
                grupo_found = cur.fetchone()

                if grupo_found:
                    data.append({
                        "id": grupo_found[0],
                        "name": grupo_found[1]
                    })

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los grupos del usuario.")


@router.post("/", status_code=200)
def handle_users_grupos(post: UserGrupoModel):
    try:
        if post.checked == True:
            cur.execute(
                "SELECT * FROM users_grupos WHERE users_id = %s AND grupos_id = %s", [post.user, post.grupo])
            if cur.fetchone() == None:
                cur.execute("INSERT INTO users_grupos (users_id, grupos_id) VALUES (%s, %s)", [
                            post.user, post.grupo])
                conn.commit()
        elif post.checked == False:
            cur.execute(
                "SELECT * FROM users_grupos WHERE users_id = %s AND grupos_id = %s", [post.user, post.grupo])
            if cur.fetchone():
                cur.execute("DELETE FROM users_grupos WHERE users_id = %s AND grupos_id = %s", [
                            post.user, post.grupo])
                conn.commit()

        data_users_grupos = []
        cur.execute(
            "SELECT * FROM users_grupos WHERE users_id = %s", [post.user])
        users_grupos = cur.fetchall()
        for user_grupo in users_grupos:
            data_users_grupos.append(user_grupo[1])

        return {"users_grupos": data_users_grupos}
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=500, detail="Error al asignar el usuario al grupo.")
