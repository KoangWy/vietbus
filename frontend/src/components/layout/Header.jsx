import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Kiểm tra user mỗi khi Header load
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Lỗi đọc dữ liệu user", e);
        localStorage.removeItem('user'); // Xóa nếu dữ liệu lỗi
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="header">
      <div className="header-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        FUTABUS
      </div>
      <ul className="header-nav">
        <li onClick={() => navigate('/')}>Homepage</li>
        <li onClick={() => navigate('/schedule')}>Schedule</li>
        <li onClick={() => navigate('/lookup')}>Lookup</li>
      </ul>
      
      {user ? (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#f26522' }}>
            Hi, {user.name}
          </span>
          <button 
            className="login-button" 
            onClick={handleLogout}
            style={{ backgroundColor: '#666', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <button className="login-button" onClick={() => navigate('/login')}>
          Login
        </button>
      )}
    </nav>
  );
};

export default Header;