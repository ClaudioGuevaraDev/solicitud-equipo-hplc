from pydantic import BaseModel


class LiderModel(BaseModel):
    full_name: str
