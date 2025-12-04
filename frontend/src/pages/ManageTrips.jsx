import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ManageTrips = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra user có phải staff không
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(loggedInUser);
      
      // Kiểm tra role - chỉ staff mới được truy cập
      if (userData.role !== 'STAFF') {
        alert('Bạn không có quyền truy cập trang này!');
        navigate('/');
        return;
      }
      
      setUser(userData);
    } catch (e) {
      console.error("Lỗi đọc dữ liệu user", e);
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Fetch trips data
    const fetchTrips = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch trips
        // const response = await fetch('http://127.0.0.1:5000/api/schedule/trips');
        // const data = await response.json();
        // setTrips(data);
        
        // Placeholder data for now
        setTrips([]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  if (!user) {
    return null; // Hoặc loading spinner
  }

  return (
    <div>
      <Header />
      <div className="page-container" style={{ minHeight: '70vh', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            color: 'var(--futa-orange)', 
            marginBottom: '30px',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Manage Trips
          </h1>

          {loading ? (
            <p>Loading trips...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#666' }}>
                  Welcome, <strong>{user.name}</strong>! You can manage trips here.
                </p>
                <button 
                  className="login-button"
                  style={{ padding: '10px 20px' }}
                >
                  + Add New Trip
                </button>
              </div>

              {trips.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  <p style={{ color: '#999', fontSize: '1.1rem' }}>
                    No trips available. Click "Add New Trip" to create one.
                  </p>
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {/* Trip list will be rendered here */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Trip ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Route</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map(trip => (
                        <tr key={trip.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{trip.id}</td>
                          <td style={{ padding: '12px' }}>{trip.route}</td>
                          <td style={{ padding: '12px' }}>{trip.date}</td>
                          <td style={{ padding: '12px' }}>{trip.time}</td>
                          <td style={{ padding: '12px' }}>{trip.status}</td>
                          <td style={{ padding: '12px' }}>
                            <button className="btn btn--ghost btn--sm">Edit</button>
                            <button className="btn btn--danger btn--sm" style={{ marginLeft: '8px' }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageTrips;
