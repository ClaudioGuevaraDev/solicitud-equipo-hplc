import psycopg2

conn = psycopg2.connect(
    database="hplc",
    user="postgres",
    password="claudio123",
    host="localhost",
    port="5432"
)

cur = conn.cursor()