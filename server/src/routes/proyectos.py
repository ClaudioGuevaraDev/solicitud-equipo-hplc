from fastapi import APIRouter, HTTPException

from db.connection import conn, cur
from models.proyectos import ProyectoModel

router = APIRouter(
    prefix="/api/proyectos",
    tags=["Proyectos"]
)


@router.get("/", status_code=200)
def get_proyectos():
    try:
        cur.execute("SELECT * FROM proyectos ORDER BY id ASC")
        proyectos = cur.fetchall()

        data = []
        for proyecto in proyectos:
            new_data = {
                "id": proyecto[0],
                "folio": proyecto[1],
                "name": proyecto[2],
                "start_date": proyecto[3],
                "termination_date": proyecto[4],
                "score": proyecto[5]
            }
            cur.execute("SELECT * FROM grupos WHERE id = %s", [proyecto[6]])
            grupo_found = cur.fetchone()
            if grupo_found == None:
                new_data["grupo"] = None
            else:
                new_data["grupo"] = grupo_found[1]

            data.append(new_data)

        return {"data": data}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los proyectos")


@router.get("/page/{id_value}/{value_search}")
def get_proyectos_page(id_value: int, value_search: str):
    try:
        proyectos = []
        if value_search == "null":
            cur.execute(
                "SELECT * FROM proyectos WHERE id >= %s ORDER BY id ASC LIMIT 10", [id_value])
            proyectos = cur.fetchall()
        else:
            cur.execute(
                "SELECT * FROM proyectos WHERE id >= %s AND name LIKE %s ORDER BY id ASC LIMIT 10", [id_value, f"%{value_search}%"])
            proyectos = cur.fetchall()

        data = []
        for proyecto in proyectos:
            new_data = {
                "id": proyecto[0],
                "folio": proyecto[1],
                "name": proyecto[2],
                "start_date": proyecto[3],
                "termination_date": proyecto[4],
                "score": proyecto[5]
            }
            cur.execute("SELECT * FROM grupos WHERE id = %s", [proyecto[6]])
            grupo_found = cur.fetchone()
            if grupo_found == None:
                new_data["grupo"] = None
            else:
                new_data["grupo"] = grupo_found[1]

            data.append(new_data)

        next_page = 0
        if (len(data) > 0):
            next_page = data[len(data)-1]["id"] + 1

        first_page = False
        first_element = None
        if value_search == "null":
            cur.execute("SELECT * FROM proyectos ORDER BY id ASC LIMIT 1")
            first_element = cur.fetchone()
        else:
            cur.execute(
                "SELECT * FROM proyectos WHERE name LIKE %s ORDER BY id ASC LIMIT 1", [f"%{value_search}%"])
            first_element = cur.fetchone()
        if ((first_element) and (len(data) > 0)):
            if data[0]["id"] == first_element[0]:
                first_page = True

        last_page = False
        last_element = None
        if value_search == "null":
            cur.execute("SELECT * FROM proyectos ORDER BY id DESC LIMIT 1")
            last_element = cur.fetchone()
        else:
            cur.execute(
                "SELECT * FROM proyectos WHERE name LIKE %s ORDER BY id DESC LIMIT 1", [f"%{value_search}%"])
            last_element = cur.fetchone()
        if ((last_element) and (len(data) > 0)):
            if data[-1]["id"] == last_element[0]:
                last_page = True

        return {"data": data, "next_page": next_page, "first_page": first_page, "last_page": last_page}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los proyectos")


@router.get("/previus-page/{previus_page}")
def get_previus_page(previus_page: int):
    cur.execute(
        "SELECT * FROM proyectos WHERE id < %s ORDER BY id DESC LIMIT 10", [previus_page])
    previus = cur.fetchall()

    previus_value = None
    if (len(previus) > 0):
        previus_value = previus[-1][0]

    return {"previus_value": previus_value}


@router.get("/{user_id}/{type_filter}/{id_value}/{value_search}", status_code=200)
def get_proyectos_by_user(user_id: int, type_filter: str, id_value: int, value_search: str):
    try:
        data_users_proyectos = []
        cur.execute(
            "SELECT * FROM users_proyectos WHERE users_id = %s", [user_id])
        users_proyectos = cur.fetchall()
        for user_proyecto in users_proyectos:
            data_users_proyectos.append(user_proyecto[1])

        cur.execute(
            "SELECT * FROM users_grupos WHERE users_id = %s", [user_id])
        users_grupos = cur.fetchall()

        data = []
        if len(users_grupos):
            for user_grupo in users_grupos:
                if user_grupo[1]:
                    if type_filter == "all":
                        if value_search == "null":
                            cur.execute(
                                "SELECT * FROM proyectos WHERE grupo_id = %s AND id >= %s ORDER BY id ASC", [user_grupo[1], id_value])
                        else:
                            cur.execute(
                                "SELECT * FROM proyectos WHERE grupo_id = %s AND id >= %s AND name LIKE %s ORDER BY id ASC", [user_grupo[1], id_value, f"%{value_search}%"])
                    else:
                        cur.execute(
                            "SELECT * FROM proyectos WHERE grupo_id = %s ORDER BY id ASC", [user_grupo[1]])
                    proyecto_found = cur.fetchall()
                    for p in proyecto_found:
                        if ((type_filter == "filter") and (p[0] in data_users_proyectos)):
                            new_data = {
                                "id": p[0],
                                "folio": p[1],
                                "name": p[2],
                                "start_date": p[3],
                                "termination_date": p[4],
                                "score": p[5]
                            }

                            cur.execute(
                                "SELECT * FROM grupos WHERE id = %s", [user_grupo[1]])
                            grupo_found = cur.fetchone()
                            if grupo_found == None:
                                new_data["grupo"] = None
                            else:
                                new_data["grupo"] = grupo_found[1]

                            data.append(new_data)
                        elif type_filter == "all":
                            if (len(data) < 10):
                                new_data = {
                                    "id": p[0],
                                    "folio": p[1],
                                    "name": p[2],
                                    "start_date": p[3],
                                    "termination_date": p[4],
                                    "score": p[5]
                                }

                                cur.execute(
                                    "SELECT * FROM grupos WHERE id = %s", [user_grupo[1]])
                                grupo_found = cur.fetchone()
                                if grupo_found == None:
                                    new_data["grupo"] = None
                                else:
                                    new_data["grupo"] = grupo_found[1]

                                data.append(new_data)

        next_page = 0
        if type_filter == "all":
            if len(data) > 0:
                next_page = data[len(data)-1]["id"] + 1

        first_page = False
        first_element = None
        if type_filter == "all":
            if (len(users_grupos) > 0):
                if value_search == "":
                    cur.execute("SELECT * FROM proyectos WHERE grupo_id = %s ORDER BY id ASC LIMIT 1",
                                [users_grupos[0][1]])
                    first_element = cur.fetchone()
                else:
                    cur.execute("SELECT * FROM proyectos WHERE grupo_id = %s AND name LIKE %s ORDER BY id ASC LIMIT 1",
                                [users_grupos[0][1], f"%{value_search}%"])
                    first_element = cur.fetchone()
                if ((first_element) and (len(data) > 0)):
                    if data[0]["id"] == first_element[0]:
                        first_page = True

        last_page = False
        data2 = []
        if type_filter == "all":
            cur.execute(
                "SELECT * FROM users_grupos WHERE users_id = %s", [user_id])
            users_grupos = cur.fetchall()

            if len(users_grupos):
                for user_grupo in users_grupos:
                    if user_grupo[1]:
                        if value_search == "null":
                            cur.execute(
                                "SELECT * FROM proyectos WHERE grupo_id = %s AND id >= %s ORDER BY id ASC", [user_grupo[1], next_page])
                            proyecto_found = cur.fetchall()
                        else:
                            cur.execute(
                                "SELECT * FROM proyectos WHERE grupo_id = %s AND id >= %s AND name LIKE %s ORDER BY id ASC", [user_grupo[1], next_page, f"%{value_search}%"])
                            proyecto_found = cur.fetchall()
                        for p in proyecto_found:
                            if type_filter == "all":
                                if (len(data2) < 10):
                                    new_data = {
                                        "id": p[0],
                                        "folio": p[1],
                                        "name": p[2],
                                        "start_date": p[3],
                                        "termination_date": p[4],
                                        "score": p[5]
                                    }

                                    data2.append(new_data)
        if len(data2) == 0:
            last_page = True

        return {"data": data, "users_proyectos": data_users_proyectos, "next_page": next_page, "first_page": first_page, "last_page": last_page}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al listar los proyectos.")
    # cur.execute("SELECT * FROM users_proyectos WHERE users_id = %s", [user_id])
    # users_proyectos_found = cur.fetchall()
    # users_proyectos_list = []
    # for user_proyecto_found in users_proyectos_found:
    #     users_proyectos_list.append(user_proyecto_found[1])

    # data = []
    # if type_filter == "all":
    #     cur.execute(
    #         "SELECT * FROM users_grupos WHERE users_id = %s", [user_id])
    #     users_grupos = cur.fetchall()
    #     for user_grupo in users_grupos:
    #         cur.execute("SELECT * FROM grupos WHERE id = %s", [user_grupo[1]])
    #         grupo_found = cur.fetchone()

    #         if value_search == "null":
    #             cur.execute(
    #                 "SELECT * FROM proyectos WHERE grupo_id = %s AND id >= %s ORDER BY id ASC", [user_grupo[1], id_value])
    #             proyectos = cur.fetchall()
    #         else:
    #             cur.execute("SELECT * FROM proyectos WHERE grupo_id = %s AND name LIKE %s AND id >= %s ORDER BY id ASC",
    #                         [user_grupo[1], f"%{value_search}%", id_value])
    #             proyectos = cur.fetchall()

    #         for proyecto in proyectos:
    #             if len(data) < 10:
    #                     data.append({
    #                     "id": proyecto[0],
    #                     "folio": proyecto[1],
    #                     "name": proyecto[2],
    #                     "start_date": proyecto[3],
    #                     "termination_date": proyecto[4],
    #                     "score": proyecto[5],
    #                     "grupo": grupo_found[1] if grupo_found else None
    #                 })
    # else:
    #     cur.execute(
    #         "SELECT * FROM users_proyectos WHERE users_id = %s", [user_id])
    #     users_proyectos = cur.fetchall()
    #     for user_proyecto in users_proyectos:
    #         cur.execute("SELECT * FROM proyectos WHERE id = %s",
    #                     [user_proyecto[1]])
    #         proyecto_found = cur.fetchone()

    #         cur.execute("SELECT * FROM grupos WHERE id = %s",
    #                     [proyecto_found[6]])
    #         grupo_found = cur.fetchone()

    #         data.append({
    #             "id": proyecto_found[0],
    #             "folio": proyecto_found[1],
    #             "name": proyecto_found[2],
    #             "start_date": proyecto_found[3],
    #             "termination_date": proyecto_found[4],
    #             "score": proyecto_found[5],
    #             "grupo": grupo_found[1] if grupo_found else None
    #         })

    # next_page = 0
    # if type_filter == "all":
    #     if len(data) > 0:
    #         next_page = data[len(data)-1]["id"] + 1

    # first_page = False
    # first_element = None
    # if type_filter == "all":
    #     if (len(users_grupos) > 0):
    #         if value_search == "":
    #             cur.execute("SELECT * FROM proyectos WHERE grupo_id = %s ORDER BY id ASC LIMIT 1",
    #                         [users_grupos[0][1]])
    #             first_element = cur.fetchone()
    #         else:
    #             cur.execute("SELECT * FROM proyectos WHERE grupo_id = %s AND name LIKE %s ORDER BY id ASC LIMIT 1",
    #                         [users_grupos[0][1], f"%{value_search}%"])
    #             first_element = cur.fetchone()
    #         if ((first_element) and (len(data) > 0)):
    #             if data[0]["id"] == first_element[0]:
    #                 first_page = True
        

    # return {"data": data, "users_proyectos": users_proyectos_list, "next_page": next_page, "first_page": first_page}


@router.post("/", status_code=201)
def create_proyecto(proyecto: ProyectoModel):
    cur.execute("SELECT * FROM proyectos WHERE name = %s", [proyecto.name])
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="El proyecto ya existe.")

    if proyecto.folio != "":
        cur.execute("SELECT * FROM proyectos WHERE folio = %s",
                    [proyecto.folio])
        if cur.fetchone():
            raise HTTPException(
                status_code=400, detail="Folio ingresado ya existe.")

    grupo_found = None
    if proyecto.grupo != None:
        cur.execute("SELECT * FROM grupos WHERE name = %s", [proyecto.grupo])
        grupo_found = cur.fetchone()
        if grupo_found == None:
            raise HTTPException(status_code=404, detail="El grupo no existe.")

    try:
        if grupo_found == None:
            cur.execute("INSERT INTO proyectos (folio, name, start_date, termination_date, score, grupo_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                        [proyecto.folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, None])
        else:
            cur.execute("INSERT INTO proyectos (folio, name, start_date, termination_date, score, grupo_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                        [proyecto.folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, grupo_found[0]])
        conn.commit()

        created_proyecto = cur.fetchone()
        if grupo_found == None:
            data = {
                "id": created_proyecto[0],
                "folio": created_proyecto[1],
                "name": created_proyecto[2],
                "start_date": created_proyecto[3],
                "termination_date": created_proyecto[4],
                "score": created_proyecto[5],
                "grupo": None
            }
        else:
            data = {
                "id": created_proyecto[0],
                "folio": created_proyecto[1],
                "name": created_proyecto[2],
                "start_date": created_proyecto[3],
                "termination_date": created_proyecto[4],
                "score": created_proyecto[5],
                "grupo": grupo_found[1]
            }

        return {"data": data, "detail": "Proyecto creado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al crear el proyecto.")


@router.delete("/{proyecto_id}", status_code=200)
def delete_proyecto(proyecto_id: int):
    cur.execute("SELECT * FROM proyectos WHERE id = %s", [proyecto_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El proyecto no existe.")

    try:
        cur.execute("DELETE FROM proyectos WHERE id = %s", [proyecto_id])
        conn.commit()

        return {"detail": "Proyecto eliminado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al eliminar el proyecto.")


@router.put("/{proyecto_id}")
def update_proyecto(proyecto_id: int, proyecto: ProyectoModel):
    cur.execute("SELECT * FROM proyectos WHERE id = %s", [proyecto_id])
    if cur.fetchone() == None:
        raise HTTPException(status_code=404, detail="El proyecto no existe.")

    cur.execute("SELECT * FROM proyectos WHERE name = %s", [proyecto.name])
    proyecto_found_name = cur.fetchone()
    if proyecto_found_name and proyecto_found_name[0] != proyecto_id:
        raise HTTPException(status_code=400, detail="El proyecto ya existe.")

    value_folio = None
    if len(proyecto.folio) > 0:
        value_folio = proyecto.folio
        cur.execute("SELECT * FROM proyectos WHERE folio = %s",
                    [proyecto.folio])
        proyecto_found_folio = cur.fetchone()
        if proyecto_found_folio and proyecto_found_folio[0] != proyecto_id:
            raise HTTPException(
                status_code=400, detail="El folio ingresado ya existe.")

    grupo_found = None
    if proyecto.grupo:
        cur.execute("SELECT * FROM grupos WHERE name = %s", [proyecto.grupo])
        grupo_found = cur.fetchone()
        if grupo_found == None:
            raise HTTPException(status_code=404, detail="El grupo no existe.")

    try:
        if grupo_found == None:
            cur.execute("UPDATE proyectos SET folio = %s, name = %s, start_date = %s, termination_date = %s, score = %s WHERE id = %s RETURNING *",
                        [value_folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, proyecto_id])
        else:
            cur.execute("UPDATE proyectos SET folio = %s, name = %s, start_date = %s, termination_date = %s, score = %s, grupo_id = %s WHERE id = %s RETURNING *",
                        [value_folio, proyecto.name, proyecto.start_date, proyecto.termination_date, proyecto.score, grupo_found[0], proyecto_id])
        conn.commit()

        updated_proyecto = cur.fetchone()
        data = {
            "id": updated_proyecto[0],
            "folio": updated_proyecto[1],
            "name": updated_proyecto[2],
            "start_date": updated_proyecto[3],
            "termination_date": updated_proyecto[4],
            "score": updated_proyecto[5],
            "grupo": grupo_found[1] if grupo_found else None
        }

        return {"data": data, "detail": "Proyeto actualizado con éxito."}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail="Error al actualizar el proyecto.")
