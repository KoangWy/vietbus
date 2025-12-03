"""Ticket routes for Page 4 - Ticket Lookup"""

from flask import Blueprint, request, jsonify
from utils.database import db_connection

ticket_bp = Blueprint('ticket', __name__, url_prefix='/api/tickets')

@ticket_bp.route('/lookup', methods=['POST'])
def lookup_ticket():
    """
    Tra cứu thông tin vé thông qua serial number và số điện thoại
    Page 4 requirement
    """
    try:
        data = request.get_json()
        serial_number = data.get('serial_number')
        phone = data.get('phone')

        if not serial_number or not phone:
            return jsonify({
                'success': False,
                'message': 'Vui lòng cung cấp đầy đủ mã vé và số điện thoại'
            }), 400

        # Remove leading 0 from phone if exists
        if phone.startswith('0'):
            phone = phone[1:]

        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        # Query ticket information with all related data
        query = """
            SELECT
                t.ticket_id,
                t.serial_number,
                t.seat_code,
                t.seat_price,
                t.ticket_status,
                t.qr_code_link,
                tr.trip_id,
                tr.service_date,
                tr.trip_status,
                rt.route_id,
                rt.distance,
                rt.default_duration_time,
                b.plate_number,
                b.vehicle_type,
                b.capacity,
                a.phone,
                a.email,
                s1.station_name as departure_station,
                s1.city as departure_city,
                s1.province as departure_province
            FROM ticket t
            INNER JOIN trip tr ON t.trip_id = tr.trip_id
            INNER JOIN routetrip rt ON tr.route_id = rt.route_id
            INNER JOIN bus b ON tr.bus_id = b.bus_id
            INNER JOIN account a ON t.account_id = a.account_id
            INNER JOIN station s1 ON rt.station_id = s1.station_id
            WHERE t.serial_number = %s AND a.phone = %s
        """

        cursor.execute(query, (serial_number, phone))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if not result:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy vé với mã vé và số điện thoại này'
            }), 404

        # Format response
        response = {
            'success': True,
            'data': {
                'ticket_id': result['ticket_id'],
                'serial_number': result['serial_number'],
                'seat_code': result['seat_code'],
                'seat_price': result['seat_price'],
                'ticket_status': result['ticket_status'],
                'qr_code_link': result['qr_code_link'],
                'trip': {
                    'trip_id': result['trip_id'],
                    'service_date': result['service_date'].isoformat() if result['service_date'] else None,
                    'trip_status': result['trip_status']
                },
                'route': {
                    'route_id': result['route_id'],
                    'distance': result['distance'],
                    'default_duration_time': str(result['default_duration_time']) if result['default_duration_time'] else None,
                    'departure_station': result['departure_station'],
                    'departure_city': result['departure_city'],
                    'departure_province': result['departure_province']
                },
                'bus': {
                    'plate_number': result['plate_number'],
                    'vehicle_type': result['vehicle_type'],
                    'capacity': result['capacity']
                },
                'account': {
                    'phone': result['phone'],
                    'email': result['email']
                }
            }
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error in lookup_ticket: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Lỗi server khi tra cứu vé',
            'error': str(e)
        }), 500
