import React from 'react';

const Header = () => {
  return (
    <nav className="header">
      <div className="header-logo">
        {/* dùng text làm logo */}
        FUTABUS
      </div>
      <ul className="header-nav">
        <li>Homepage</li>
        <li>Schedule</li>
        <li>Lookup</li>
      </ul>
      <button className="login-button">Login</button>
    </nav>
  );
};

export default Header;