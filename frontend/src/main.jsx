import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import file CSS chính của chúng ta
import './App.css'
import './pages/admin.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)