from flask import Blueprint, request, jsonify
from datetime import datetime, date
import re
from utils.database import db_connection

admin_bp = Blueprint("admin", __name__)



def is_valid_email(email: str) -> bool:
    """Basic email syntax validation using regex."""
    if not email or len(email) > 254:
        return False
    pattern = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    return bool(pattern.match(email))



@admin_bp.route("/stations", methods=["GET"])
def get_stations():
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM station")
        result = cursor.fetchall()
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()
@admin_bp.route("/stations", methods=["POST"])
def post_stations():

    data = request.get_json(silent=True) or {}
    station_data = [
        "city",
        "station_name",
        "province",
        "address_station",
        "operator_id",
        "active_flag",
        "latitude",
        "longitude",
    ]

    missing = [f for f in station_data if data.get(f) in (None, "")]
    if missing:
        return jsonify({"error": "missing_fields", "fields": missing}), 400
        
    city = str(data.get("city")).strip()
    active_flag = str(data.get("active_flag")).strip()
    if active_flag not in ("Active", "Inactive", "Maintenance"):
        return jsonify({"error": "invalid_active_flag", "field": "active_flag"}), 400
    station_name = str(data.get("station_name")).strip()
    try:
        latitude = float(data["latitude"])
        longitude = float(data["longitude"])
    except (TypeError, ValueError):
        return jsonify({"error": "invalid_coordinates", "fields": ["latitude", "longitude"]}), 400
    province = str(data.get("province")).strip()
    address_station = str(data.get("address_station")).strip()


    operator_id = str(data.get("operator_id")).strip()

    
    conn = db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT 1 FROM operator WHERE operator_id=%s", (operator_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "operator_not_found", "field": "operator_id"}), 404
        cursor.execute(
            "insert into station(city,active_flag,station_name,latitude,longtitude,province,address_station,operator_id) values (%s,%s, %s, %s, %s,%s,%s,%s)",
            (city, active_flag, station_name, latitude, longitude, province, address_station, operator_id),
        )
        conn.commit()

        return jsonify({
            "status": "created",
            "station": {
                "city": city,
                "active_flag": active_flag,
                "station_name": station_name,
                "latitude": latitude,
                "longitude": longitude,
                "province": province,
                "address_station": address_station,
                "operator_id": operator_id,
            }
        }), 201
    except Exception as exc:
        conn.rollback()
        return jsonify({"error": "db_error", "message": str(exc)}), 500
    finally:
        cursor.close()
        conn.close()

@admin_bp.route("/stations/<int:station_id>", methods=["PATCH"])
def update_station(station_id):
    data = request.get_json(silent=True) or {}

    # Các field cho phép update
    allowed_fields = [
        "city",
        "station_name",
        "province",
        "address_station",
        "operator_id",
        "active_flag",
        "latitude",
        "longitude",
    ]

    # Kiểm tra có gửi field hợp lệ hay không
    update_fields = {k: v for k, v in data.items() if k in allowed_fields}
    if not update_fields:
        return jsonify({"error": "no_valid_fields"}), 400

    # Validate active_flag nếu có
    if "active_flag" in update_fields:
        active_flag = str(update_fields["active_flag"]).strip()
        if active_flag not in ("Active", "Inactive", "Maintenance"):
            return jsonify({"error": "invalid_active_flag", "value": active_flag}), 400
        update_fields["active_flag"] = active_flag

    # Validate latitude, longitude nếu có
    if "latitude" in update_fields:
        try:
            update_fields["latitude"] = float(update_fields["latitude"])
        except (TypeError, ValueError):
            return jsonify({"error": "invalid_latitude"}), 400

    if "longitude" in update_fields:
        try:
            update_fields["longitude"] = float(update_fields["longitude"])
        except (TypeError, ValueError):
            return jsonify({"error": "invalid_longitude"}), 400

    # Validate operator_id nếu có
    if "operator_id" in update_fields:
        update_fields["operator_id"] = str(update_fields["operator_id"]).strip()

    conn = db_connection()
    cursor = conn.cursor()
    try:
        # Check station tồn tại
        cursor.execute("SELECT 1 FROM station WHERE station_id=%s", (station_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "station_not_found"}), 404

        # Check operator_id tồn tại
        if "operator_id" in update_fields:
            cursor.execute("SELECT 1 FROM operator WHERE operator_id=%s",
                           (update_fields["operator_id"],))
            if cursor.fetchone() is None:
                return jsonify({"error": "operator_not_found"}), 404

        # Build câu UPDATE động
        set_clause = ", ".join(f"{k}=%s" for k in update_fields.keys())
        values = list(update_fields.values()) + [station_id]

        cursor.execute(
            f"UPDATE station SET {set_clause} WHERE station_id=%s",
            values
        )
        conn.commit()

        return jsonify({
            "status": "updated",
            "station_id": station_id,
            "updated_fields": update_fields
        }), 200

    except Exception as exc:
        conn.rollback()
        return jsonify({"error": "db_error", "message": str(exc)}), 500

    finally:
        cursor.close()
        conn.close()

@admin_bp.route("/stations/<int:station_id>", methods=["DELETE"])
def del_stations(station_id):
    conn = db_connection()
    cursor = conn.cursor()
    try:
        # Kiểm tra station có tồn tại
        cursor.execute("SELECT 1 FROM station where station_id = %s ",(station_id,))
        if cursor.fetchone() is None:
            return jsonify({"error":"Station is not exist"}), 404
        
        cursor.execute("DELETE FROM station WHERE (station_id = %s);",(station_id,))
        conn.commit()
        return jsonify({
            "status":"deleted complete"
        }), 200
    except Exception as exc:
        conn.rollback()
        return jsonify({"error": "db_error", "message": str(exc)}), 500

    finally:
        cursor.close()
        conn.close()


@admin_bp.route("/operators", methods=["GET"])
def get_operators():
    conn = db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM operator")
        result = cursor.fetchall()
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()
@admin_bp.route("/operators", methods=["POST"])
def add_operator():
    data = request.get_json(silent=True) or {}

    required = ["legal_name", "brand_name", "brand_email", "tax_id"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": "missing_fields", "fields": missing}), 400

    legal_name = str(data.get("legal_name")).strip()
    brand_name = str(data.get("brand_name")).strip()
    brand_email = str(data.get("brand_email")).strip().lower()
    tax_id = str(data.get("tax_id")).strip()

    if not is_valid_email(brand_email):
        return jsonify({"error": "invalid_email", "field": "brand_email"}), 400

    conn = db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO operator(legal_name,brand_name,brand_email,tax_id) VALUES (%s, %s, %s, %s)",
            (legal_name, brand_name, brand_email, tax_id)
        )
        conn.commit()
        return jsonify({
            "status": "created",
            "operator": {
                "legal_name": legal_name,
                "brand_name": brand_name,
                "brand_email": brand_email,
                "tax_id": tax_id
            }
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "db_error", "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@admin_bp.route("/passengers", methods=["GET"])
def get_customers():
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT p.* FROM person p join passenger c on p.person_id = c.passenger_id") 
        result = cursor.fetchall()
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()
@admin_bp.route("/passengers/<int:passenger_id>/account-info", methods=["GET"])
def get_cus_acc_info(passenger_id):
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT 1 FROM passenger where passenger_id = %s",(passenger_id,))
        if cursor.fetchone() is None:
            return jsonify({"error":"Passenger_not_found"}),404
        cursor.execute("SELECT person_id from passenger where passenger_id = %s", (passenger_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"error":"person_link_missing"}),404
        target_person_id = row["person_id"]
        
        cursor.execute("Select account_id from person where person_id = %s",(target_person_id,))
        row = cursor.fetchone()
        target_acc_id = row["account_id"]
        
        cursor.execute("select email, phone ,stat, create_at from account where account_id = %s",(target_acc_id,))
        result = cursor.fetchone()
        return jsonify(result),200
    finally:
        cursor.close()
        conn.close()

@admin_bp.route("/staffs", methods=["GET"])
def get_staffs():
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT p.* FROM person p join staff s on p.person_id = s.staff_id")
        result = cursor.fetchall()
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()
@admin_bp.route("/staffs/<int:staff_id>/account-info", methods=["GET"])
def get_staff_acc_info(staff_id):
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT 1 FROM staff where staff_id = %s",(staff_id,))
        if cursor.fetchone() is None:
            return jsonify({"error":"Staff_not_found"}),404
        cursor.execute("SELECT person_id from staff where staff_id = %s", (staff_id,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"error":"person_link_missing"}),404
        target_person_id = row["person_id"]
        
        cursor.execute("Select account_id from person where person_id = %s",(target_person_id,))
        row = cursor.fetchone()
        target_acc_id = row["account_id"]
        
        cursor.execute("select email, phone ,stat, create_at from account where account_id = %s",(target_acc_id,))
        result = cursor.fetchone()
        return jsonify(result),200
    finally:
        cursor.close()
        conn.close()
@admin_bp.route("/trips", methods=["GET"])
def get_trips():
    conn = db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM trip")
        result = cursor.fetchall()
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()


            
__all__ = ["admin_bp"]
