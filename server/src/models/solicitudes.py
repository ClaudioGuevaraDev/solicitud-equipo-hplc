from pydantic import BaseModel


class SolicitudModel(BaseModel):
    user: int
    equipo: int
    grupo: int
    proyecto: int
