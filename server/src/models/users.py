from pydantic import BaseModel


class UserInfoModel(BaseModel):
    first_name: str
    last_name: str
    jerarquia: str
