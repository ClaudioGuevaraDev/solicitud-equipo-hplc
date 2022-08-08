from pydantic import BaseModel

class UserGrupoModel(BaseModel):
    user: int
    grupo: int
    checked: bool