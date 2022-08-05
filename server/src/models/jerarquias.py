from pydantic import BaseModel


class JerarquiaModel(BaseModel):
    name: str
    score: int