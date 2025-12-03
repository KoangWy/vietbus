from datetime import datetime, date
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def db_connection():
    current_file_path = os.path.abspath(__file__) 
    backend_dir = os.path.dirname(os.path.dirname(current_file_path)) 
    ssl_cert_path = os.path.join(backend_dir, "ca.pem")

    return mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    ssl_ca=ssl_cert_path,
    ssl_verify_cert=True   # verify SSL certificate
)
