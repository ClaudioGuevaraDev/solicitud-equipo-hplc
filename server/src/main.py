import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import auth, roles, users, jerarquias, lideres, grupos, proyectos
from db.initial_db import initial_roles, initial_jerarquias, inital_user_admin
from config.config import frontend_url
from utils.initial_folders import initial_folders

# Initilized database
initial_roles()
initial_jerarquias()
inital_user_admin()

# Initialzed folders
initial_folders()


app = FastAPI()

# Cors
origins = [
    frontend_url,
]

app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],)

# Static Files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routes
app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(users.router)
app.include_router(jerarquias.router)
app.include_router(lideres.router)
app.include_router(grupos.router)
app.include_router(proyectos.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
