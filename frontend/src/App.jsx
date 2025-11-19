import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import pages
import Homepage from './pages/Homepage.jsx';
import AuthPage from './pages/AuthPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<Homepage />} />
          
          {/* Trang Đăng nhập / Đăng ký */}
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;