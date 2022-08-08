from pydantic import BaseModel
from typing import Union
import datetime


class ProyectoModel(BaseModel):
    folio: Union[str, None] = None
    name: str
    start_date: datetime.date
    termination_date: datetime.date
    score: int
    grupo: Union[str, None] = None
