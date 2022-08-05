import os
from dotenv import load_dotenv

load_dotenv()

sender_address = os.environ["SENDER_ADDRESS"]
sender_password = os.environ["SENDER_PASSWORD"]

database_name = os.environ["DATABASE_NAME"]
database_user = os.environ["DATABASE_USER"]
database_password = os.environ["DATABASE_PASSWORD"]
database_host = os.environ["DATABASE_HOST"]
database_port = os.environ["DATABASE_PORT"]

backend_url = os.environ["BACKEND_URL"]
frontend_url = os.environ["FRONTEND_URL"]

secret_key_jwt = os.environ["SECRET_KET_JWT"]

admin_email = os.environ["ADMIN_EMAIL"]
admin_password = os.environ["ADMIN_PASSWORD"]
