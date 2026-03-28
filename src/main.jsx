import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import '../public/assets/root.css'

import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import NotFound from './components/notfound.jsx'

const isAuth = () => localStorage.getItem("isAuth") === "true"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={isAuth() ? <AdminApp /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </StrictMode>
)