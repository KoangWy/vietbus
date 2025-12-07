from datetime import datetime, date
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def db_connection():
    return mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    ssl_ca="ca.pem",
    ssl_verify_cert=True   # verify SSL certificate
)