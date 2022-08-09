from pydantic import BaseModel


class UsersProyectosModel(BaseModel):
    user: int
    proyecto: int
    checked: bool
