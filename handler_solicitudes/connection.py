import psycopg2

from config import database_host, database_name, database_password, database_port, database_user

conn = psycopg2.connect(
    database=database_name,
    user=database_user,
    password=database_password,
    host=database_host,
    port=database_port
)

cur = conn.cursor()
