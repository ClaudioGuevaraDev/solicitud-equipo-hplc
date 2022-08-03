from pydantic import BaseModel


class RolBaseModel(BaseModel):
    name: str
