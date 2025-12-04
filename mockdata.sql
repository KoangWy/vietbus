-- mockdata.sql
-- dùng để test trong local

USE defaultdb; 

-- =======================================================
-- 0. LÀM SẠCH DỮ LIỆU CŨ (RESET DATABASE)
-- =======================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ticket;
TRUNCATE TABLE booking;
TRUNCATE TABLE fare;
TRUNCATE TABLE trip;
TRUNCATE TABLE routetrip;
TRUNCATE TABLE haspoint;
TRUNCATE TABLE pickupdropoff;
TRUNCATE TABLE bus;
TRUNCATE TABLE station;
TRUNCATE TABLE staff;
TRUNCATE TABLE passenger;
TRUNCATE TABLE person;
TRUNCATE TABLE account;
TRUNCATE TABLE operator;
SET FOREIGN_KEY_CHECKS = 1;


-- =======================================================
-- 1. TẠO 3 NHÀ XE LỚN
-- =======================================================
INSERT INTO operator (operator_id, legal_name, brand_name, brand_email, tax_id) VALUES 
('', 'Cong ty CP Xe Khach Phuong Trang', 'FUTA Bus Lines', 'hotro@futabus.vn', 11001100),
('', 'Cong ty TNHH Thanh Buoi', 'Thanh Buoi', 'cskh@thanhbuoi.com.vn', 22002200),
('', 'Cong ty TNHH Van Tai Kumho', 'Kumho Samco', 'contact@kumhosamco.com', 33003300);
-- ID sẽ tự sinh là: OP001 (FUTA), OP002 (Thanh Bưởi), OP003 (Kumho)


-- =======================================================
-- 2. TẠO HỆ THỐNG TÀI KHOẢN (ADMIN, STAFF, USER)
-- =======================================================
INSERT INTO account (account_id, email, phone, stat, create_at, acc_password) VALUES 
(1, 'admin@system.vn', 900000001, 'Active', '2023-01-01', 'admin123'),
(2, 'staff.futa@gmail.com', 900000002, 'Active', '2023-01-01', 'staff123'),
(3, 'staff.thanhbuoi@gmail.com', 900000003, 'Active', '2023-01-01', 'staff123'),
(4, 'nguyenvana@gmail.com', 918111222, 'Active', '2023-05-15', 'user123'),  -- Khách hàng VIP
(5, 'tranthib@gmail.com', 939444555, 'Active', '2023-06-20', 'user123');   -- Khách hàng Mới

INSERT INTO person (person_id, person_name, date_of_birth, gov_id_num, account_id) VALUES 
(1, 'Quan Tri Vien', '1990-01-01', 111111111, 1),
(2, 'NV Ban Ve FUTA', '1995-02-02', 222222222, 2),
(3, 'NV Ban Ve TB', '1996-03-03', 333333333, 3),
(4, 'Nguyen Van A', '1988-08-08', 444444444, 4),
(5, 'Tran Thi B', '2000-10-10', 555555555, 5);

-- Phân quyền
INSERT INTO staff (person_id, hire_date, operator_id) VALUES 
(2, '2021-01-01', 'OP001'), -- NV của FUTA
(3, '2021-05-01', 'OP002'); -- NV của Thanh Bưởi

INSERT INTO passenger (person_id) VALUES (4), (5);


-- =======================================================
-- 3. TẠO MẠNG LƯỚI BẾN XE (5 TỈNH THÀNH)
-- =======================================================
INSERT INTO station (station_id, city, active_flag, station_name, province, address_station, operator_id, latitude, longtitude) VALUES 
(1, 'Ho Chi Minh', 'Active', 'Ben Xe Mien Dong', 'HCM', '292 Dinh Bo Linh, Binh Thanh', 'OP001', 10.81, 106.70),
(2, 'Ho Chi Minh', 'Active', 'Ben Xe Mien Tay', 'HCM', '395 Kinh Duong Vuong, Binh Tan', 'OP001', 10.74, 106.61),
(3, 'Da Lat', 'Active', 'Ben Xe Lien Tinh Da Lat', 'Lam Dong', '01 To Hien Thanh', 'OP002', 11.93, 108.44),
(4, 'Can Tho', 'Active', 'Ben Xe Trung Tam Can Tho', 'Can Tho', 'Khu Do Thi Nam Can Tho', 'OP001', 10.01, 105.76),
(5, 'Vung Tau', 'Active', 'Ben Xe Vung Tau', 'Ba Ria - Vung Tau', 'Nam Ky Khoi Nghia', 'OP003', 10.35, 107.08),
(6, 'Nha Trang', 'Active', 'Ben Xe Phia Nam Nha Trang', 'Khanh Hoa', 'Vinh Trung, Nha Trang', 'OP001', 12.25, 109.18);


-- =======================================================
-- 4. TẠO ĐỘI XE (FLEET) - 10 CHIẾC
-- =======================================================
INSERT INTO bus (bus_id, plate_number, bus_active_flag, capacity, vehicle_type) VALUES 
-- Xe FUTA (Giường nằm & Limousine)
(101, '51B-100.01', 'Active', 40, 'Sleeper'),
(102, '51B-100.02', 'Active', 40, 'Sleeper'),
(103, '51B-100.99', 'Active', 22, 'Limousine'), -- VIP Cabin
-- Xe Thanh Bưởi (Giường nằm & Ghế ngồi)
(201, '49B-200.01', 'Active', 40, 'Sleeper'),
(202, '49B-200.02', 'Active', 45, 'Seater'),
-- Xe Kumho (Limousine & Ghế ngồi)
(301, '72B-300.01', 'Active', 22, 'Limousine'),
(302, '72B-300.02', 'Maintenance', 45, 'Seater'); -- Đang bảo trì


-- =======================================================
-- 5. TẠO TUYẾN ĐƯỜNG & GIÁ VÉ (ROUTES & FARES)
-- =======================================================
-- Route 1: HCM (Mien Dong) <-> Da Lat (FUTA)
INSERT INTO routetrip (route_id, default_duration_time, distance, station_id, arrival_station, operator_id) VALUES (1, '08:00:00', 305, 1, 3, 'OP001');
INSERT INTO fare (currency, route_id, seat_class, base_fare, seat_price, valid_from, valid_to) VALUES 
('VND', 1, 'Standard', 250000, 280000, '2023-01-01', '2025-12-31'), -- Vé thường 280k
('VND', 1, 'VIP', 350000, 450000, '2023-01-01', '2025-12-31');      -- Vé VIP 450k

-- Route 2: HCM (Mien Tay) <-> Can Tho (FUTA)
INSERT INTO routetrip (route_id, default_duration_time, distance, station_id, arrival_station, operator_id) VALUES (2, '04:00:00', 170, 2, 4, 'OP001');
INSERT INTO fare (currency, route_id, seat_class, base_fare, seat_price, valid_from, valid_to) VALUES 
('VND', 2, 'Standard', 140000, 165000, '2023-01-01', '2025-12-31');

-- Route 3: HCM (Mien Dong) <-> Vung Tau (Kumho)
INSERT INTO routetrip (route_id, default_duration_time, distance, station_id, arrival_station, operator_id) VALUES (3, '02:30:00', 100, 1, 5, 'OP003');
INSERT INTO fare (currency, route_id, seat_class, base_fare, seat_price, valid_from, valid_to) VALUES 
('VND', 3, 'VIP', 180000, 200000, '2023-01-01', '2025-12-31');

-- Route 4: HCM (Mien Dong) <-> Nha Trang (FUTA)
INSERT INTO routetrip (route_id, default_duration_time, distance, station_id, arrival_station, operator_id) VALUES (4, '09:00:00', 430, 1, 6, 'OP001');
INSERT INTO fare (currency, route_id, seat_class, base_fare, seat_price, valid_from, valid_to) VALUES 
('VND', 4, 'Standard', 300000, 320000, '2023-01-01', '2025-12-31');


-- =======================================================
-- 6. TẠO LỊCH TRÌNH CHUYẾN XE (TRIPS) - QUAN TRỌNG
-- Sử dụng hàm NOW() để luôn tạo dữ liệu động
-- =======================================================

-- --- HÔM QUA (Đã hoàn thành) ---
INSERT INTO trip (trip_status, service_date, bus_id, route_id) VALUES 
('Arrived', CONCAT(DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)), ' 08:00:00'), 101, 1),
('Arrived', CONCAT(DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)), ' 22:00:00'), 102, 1);

-- --- HÔM NAY (Đang chạy hoặc sắp chạy) ---
INSERT INTO trip (trip_status, service_date, bus_id, route_id) VALUES 
('Departed',  CONCAT(DATE(NOW()), ' 07:00:00'), 201, 1), -- Đã xuất bến sáng nay
('Scheduled', CONCAT(DATE(NOW()), ' 23:00:00'), 103, 1), -- Chuyến đêm nay (VIP Cabin)
('Scheduled', CONCAT(DATE(NOW()), ' 14:00:00'), 301, 3); -- Chiều nay đi Vũng Tàu

-- --- NGÀY MAI (Để test đặt vé) ---
INSERT INTO trip (trip_status, service_date, bus_id, route_id) VALUES 
('Scheduled', CONCAT(DATE(DATE_ADD(NOW(), INTERVAL 1 DAY)), ' 08:00:00'), 101, 1), -- Sáng mai 8h đi ĐL
('Scheduled', CONCAT(DATE(DATE_ADD(NOW(), INTERVAL 1 DAY)), ' 09:00:00'), 201, 1), -- Sáng mai 9h đi ĐL (Thanh Bưởi)
('Scheduled', CONCAT(DATE(DATE_ADD(NOW(), INTERVAL 1 DAY)), ' 10:00:00'), 301, 3), -- Sáng mai 10h đi Vũng Tàu
('Scheduled', CONCAT(DATE(DATE_ADD(NOW(), INTERVAL 1 DAY)), ' 20:00:00'), 102, 4); -- Tối mai 20h đi Nha Trang

-- --- BỊ HỦY (Để test giao diện hiển thị hủy) ---
INSERT INTO trip (trip_status, service_date, bus_id, route_id) VALUES 
('Cancelled', CONCAT(DATE(DATE_ADD(NOW(), INTERVAL 1 DAY)), ' 12:00:00'), 103, 1);


-- =======================================================
-- 7. TẠO BOOKING VÀ VÉ (Mô phỏng tình trạng ghế)
-- =======================================================

-- Kịch bản 1: Chuyến đi Đà Lạt đêm nay (Trip ID tự sinh, ta lấy tạm logic giả định)
-- Giả sử Trip ID 4 là chuyến đêm nay (dòng insert thứ 4 trong mục trip)
-- Khách A đặt 2 vé A01, A02
INSERT INTO booking (booking_id, currency, total_amount, account_id, operator_id, booking_status) VALUES 
(1, 'VND', 900000, 4, 'OP001', 'Active');

-- Lấy ID chuyến đêm nay (Trip VIP Limousine)
SET @trip_vip = (SELECT trip_id FROM trip WHERE bus_id = 103 AND trip_status = 'Scheduled' LIMIT 1);
SET @fare_vip = (SELECT fare_id FROM fare WHERE route_id = 1 AND seat_class = 'VIP' LIMIT 1);

INSERT INTO ticket (trip_id, account_id, booking_id, fare_id, ticket_status, seat_price, seat_code, serial_number) VALUES 
(@trip_vip, 4, 1, @fare_vip, 'Issued', 450000, 'A01', 12345678),
(@trip_vip, 4, 1, @fare_vip, 'Issued', 450000, 'A02', 12345679);


-- Kịch bản 2: Chuyến đi Vũng Tàu chiều nay (Sắp hết vé)
-- Khách B đặt 1 vé B05
INSERT INTO booking (booking_id, currency, total_amount, account_id, operator_id, booking_status) VALUES 
(2, 'VND', 200000, 5, 'OP003', 'Active');

SET @trip_vt = (SELECT trip_id FROM trip WHERE bus_id = 301 AND DATE(service_date) = DATE(NOW()) LIMIT 1);
SET @fare_vt = (SELECT fare_id FROM fare WHERE route_id = 3 LIMIT 1);

INSERT INTO ticket (trip_id, account_id, booking_id, fare_id, ticket_status, seat_price, seat_code, serial_number) VALUES 
(@trip_vt, 5, 2, @fare_vt, 'Issued', 200000, 'B05', 88888888);


-- Kịch bản 3: Chuyến đã bị hủy -> Vé phải được Refund
INSERT INTO booking (booking_id, currency, total_amount, account_id, operator_id, booking_status) VALUES 
(3, 'VND', 450000, 4, 'OP001', 'Cancelled');

SET @trip_cancel = (SELECT trip_id FROM trip WHERE trip_status = 'Cancelled' LIMIT 1);

INSERT INTO ticket (trip_id, account_id, booking_id, fare_id, ticket_status, seat_price, seat_code, serial_number) VALUES 
(@trip_cancel, 4, 3, @fare_vip, 'Refunded', 450000, 'A05', 77777777);


-- =======================================================
-- KIỂM TRA KẾT QUẢ
-- =======================================================
SELECT '--- DANH SÁCH CHUYẾN XE NGÀY MAI ---' AS Info;
SELECT t.trip_id, t.service_date, t.trip_status, b.vehicle_type, s1.city as 'From', s2.city as 'To', f.seat_price
FROM trip t
JOIN bus b ON t.bus_id = b.bus_id
JOIN routetrip r ON t.route_id = r.route_id
JOIN station s1 ON r.station_id = s1.station_id
JOIN station s2 ON r.arrival_station = s2.station_id
JOIN fare f ON f.route_id = r.route_id
WHERE DATE(t.service_date) = DATE(DATE_ADD(NOW(), INTERVAL 1 DAY));