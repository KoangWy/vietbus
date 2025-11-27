import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Hotline & Customer Support */}
        <div className="footer-column">
            <h3>Hotline & Customer Support</h3>
            <div className="hotline-box">
                <span>Hotline</span>
                <strong>1900 6067</strong>
            </div>
            <p>Call us for 24/7 consultation.</p>
            <a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>
                Send us your feedback
            </a>
        </div>

        {/* Column 4: Contact Information (Address) */}
        <div className="footer-column">
          <h3>CÔNG TY CP XE KHÁCH PHƯƠNG TRANG</h3>
          <p>
            <strong>Địa chỉ:</strong> 486-486A Lê Văn Lương, Phường Tân Hưng,TPHCM, Việt Nam.
          </p>
          <p>
            <strong>Email:</strong> hotro@futabus.vn
          </p>
          <p>
            <strong>Điện thoại:</strong> 028 3838 6852
          </p>
          <p>
            <strong>Fax:</strong> 028 3838 6853
          </p>
        </div>
      </div>

      {/* Dòng bản quyền dưới cùng */}
      <div className="copyright">
        &copy; {new Date().getFullYear()} FUTA Bus Lines. Clone project for educational purpose.
      </div>
    </footer>
  );
};

export default Footer;