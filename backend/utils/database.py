from datetime import datetime, date
import mysql.connector

def db_connection():
    return mysql.connector.connect(
    host="mysql-dbk25-database-system-k25.i.aivencloud.com",
    port=24201,
    user="avnadmin",
    password="AVNS_g3dNFojw9XL5FBwUM-G",
    database="defaultdb",
    ssl_ca="ca.pem",
    ssl_verify_cert=True   # verify SSL certificate
)
