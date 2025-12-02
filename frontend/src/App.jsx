import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import TicketLookup from './pages/TicketLookup.jsx';
import Sidebar from "./components/Sidebar.jsx";
import Page1 from "./pages/Page1.jsx";
import Page2 from "./pages/Page2.jsx";
import Page3 from "./pages/Page3.jsx";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/lookup" element={<TicketLookup />} />

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <Page1 />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/page-2"
            element={
              <AdminLayout>
                <Page2 />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/page-3"
            element={
              <AdminLayout>
                <Page3 />
              </AdminLayout>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
