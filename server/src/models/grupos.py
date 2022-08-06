import datetime
from pydantic import BaseModel


class GrupoModel(BaseModel):
    name: str
    date: datetime.date
    score: int
    lider: str
