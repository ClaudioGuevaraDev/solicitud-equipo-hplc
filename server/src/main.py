from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, roles, users
from db.initial_db import initial_roles

# Initilized database
initial_roles()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],)

app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(users.router)
