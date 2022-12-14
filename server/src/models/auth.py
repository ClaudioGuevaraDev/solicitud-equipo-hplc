from fastapi import File, UploadFile
from pydantic import BaseModel


class UserLoginModel(BaseModel):
    email: str
    password: str


class UserRegisterModel(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    confirm_password: str
    jerarquia: str


class UserPasswordRecoveryModel(BaseModel):
    email: str


class UserChangePasswordModel(BaseModel):
    password: str
    confirm_password: str
