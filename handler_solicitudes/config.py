import os
from dotenv import load_dotenv

load_dotenv()

database_name = os.environ["DATABASE_NAME"]
database_user = os.environ["DATABASE_USER"]
database_password = os.environ["DATABASE_PASSWORD"]
database_host = os.environ["DATABASE_HOST"]
database_port = os.environ["DATABASE_PORT"]