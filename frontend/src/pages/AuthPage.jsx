// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Chế độ: Đăng nhập (true) hay Đăng ký (false)
  const [role, setRole] = useState('passenger'); // Vai trò: Khách hàng (passenger) hay Nhân viên (staff)

  // Dữ liệu Form (Được map đúng với các cột trong Database)
  const [formData, setFormData] = useState({
    full_name: '',      // Bảng PERSON
    email: '',          // Bảng ACCOUNT
    phone: '',          // Bảng ACCOUNT
    password: '',       // Bảng ACCOUNT
    confirm_pass: '',   // Chỉ dùng để kiểm tra ở frontend
    gov_id_number: '',  // Bảng PERSON (Số CMND/CCCD/Hộ chiếu)
    date_of_birth: '',  // Bảng PERSON
    hire_date: '',      // Bảng STAFF (Chỉ dành cho nhân viên)
    operator_id: '1'    // Bảng STAFF (Mặc định ID nhà xe là 1)
  });

  const [errors, setErrors] = useState({});

  // Hàm kiểm tra dữ liệu (Validation Logic)
  const validateForm = () => {
    const newErrors = {};
    
    // 1. Kiểm tra định dạng Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address (e.g., example@email.com)";
    }

    // 2. Kiểm tra logic Đăng Ký
    if (!isLogin) {
        // Kiểm tra SĐT 
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = "Invalid phone number (must be 10 digits)";
        }

        // Kiểm tra số giấy tờ tùy thân (9 hoặc 12 số)
        const govIdRegex = /^\d{9}$|^\d{12}$/;
        if (!formData.gov_id_number || !govIdRegex.test(formData.gov_id_number)) {
            newErrors.gov_id_number = "National ID must be 9 or 12 digits";
        }

        // Kiểm tra độ tuổi (Phải >= 16 tuổi)
        if (formData.date_of_birth) {
            const birthYear = new Date(formData.date_of_birth).getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear < 16) {
                newErrors.date_of_birth = "You must be at least 16 years old";
            }
        } else {
            newErrors.date_of_birth = "Date of birth is required";
        }

        // Kiểm tra mật khẩu
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirm_pass) {
            newErrors.confirm_pass = "Passwords do not match";
        }
        if (!formData.full_name) newErrors.full_name = "Full name is required";

        // Kiểm tra riêng cho Nhân viên (Staff)
        if (role === 'staff' && !formData.hire_date) {
            newErrors.hire_date = "Hire date is required for staff";
        }
    } else {
        // Kiểm tra logic Đăng Nhập
        if (!formData.password) newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    // Nếu không có lỗi nào (Object rỗng) thì trả về true
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang
    if (validateForm()) {
        if (isLogin) {
            alert("Login Successful (Demo Mode)!");
            navigate('/'); // Chuyển hướng về Trang chủ
        } else {
            const payload = {
                action: "REGISTER",
                role: role.toUpperCase(), // 'PASSENGER' hoặc 'STAFF'
                data: {
                    ...formData
                }
            };
            console.log("Đang gửi dữ liệu xuống Backend:", payload);
            alert("Registration Successful! Check Console (F12) for payload details.");
            setIsLogin(true); // Chuyển sang form Đăng nhập
        }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Xóa lỗi ngay khi người dùng bắt đầu gõ lại
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

    return (
        <>  
            <Header />
            <div className="auth-page">
                <div className="auth-container">
                    <h2 className="auth-title">{isLogin ? 'SYSTEM LOGIN' : 'CREATE ACCOUNT'}</h2>
                    
                    {/* Tab chọn Vai trò (Role) */}
                    <div className="role-tabs">
                        <button 
                            className={role === 'passenger' ? 'active' : ''} 
                            onClick={() => setRole('passenger')}
                            type="button"
                        >
                            PASSENGER
                        </button>
                        <button 
                            className={role === 'staff' ? 'active' : ''} 
                            onClick={() => setRole('staff')}
                            type="button"
                        >
                            STAFF
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Các trường nhập liệu cho Đăng Ký */}
                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input name="full_name" type="text" placeholder="Nguyen Van A" onChange={handleChange} />
                                    {errors.full_name && <span className="error">{errors.full_name}</span>}
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>National ID Number</label>
                                        <input name="gov_id_number" type="text" placeholder="079..." onChange={handleChange} />
                                        {errors.gov_id_number && <span className="error">{errors.gov_id_number}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input name="date_of_birth" type="date" onChange={handleChange} />
                                        {errors.date_of_birth && <span className="error">{errors.date_of_birth}</span>}
                                    </div>
                                </div>
                                {/* Chỉ hiện trường Ngày tuyển dụng nếu đang chọn tab Staff */}
                                {role === 'staff' && (
                                    <div className="form-group staff-box">
                                        <label>Hire Date (Staff Only)</label>
                                        <input name="hire_date" type="date" onChange={handleChange} />
                                        {errors.hire_date && <span className="error">{errors.hire_date}</span>}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Các trường chung (Cho cả Đăng nhập và Đăng ký) */}
                        <div className="form-group">
                            <label>Email Address</label>
                            <input name="email" type="text" placeholder="email@example.com" onChange={handleChange} />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input name="phone" type="text" placeholder="0912345678" onChange={handleChange} />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" placeholder="******" onChange={handleChange} />
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input name="confirm_pass" type="password" placeholder="******" onChange={handleChange} />
                                {errors.confirm_pass && <span className="error">{errors.confirm_pass}</span>}
                            </div>
                        )}

                        <button type="submit" className="submit-btn">
                            {isLogin ? 'LOGIN' : 'REGISTER'}
                        </button>
                    </form>

                    <p className="switch-auth">
                        {isLogin ? "Don't have an account?" : "Already have an account?"} 
                        <span onClick={() => {setIsLogin(!isLogin); setErrors({});}}>
                            {isLogin ? ' Register Now' : ' Login Here'}
                        </span>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}