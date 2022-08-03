from .connection import cur, conn


def initial_roles():
    cur.execute("SELECT * FROM roles")

    if len(cur.fetchall()) == 0:
        roles = [
            ("root"),
            ("admin"),
            ("user")
        ]
        for role in roles:
            cur.execute("INSERT INTO roles (name) VALUES (%s)", [role])
            conn.commit()
