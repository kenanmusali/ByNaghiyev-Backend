import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import '../public/assets/root.css'

import App from './App.jsx'
import AdminApps from './admin/AdminApps.jsx'
import NotFound from './components/notfound.jsx'

// Create a Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    // Check auth status after component mounts
    const authStatus = localStorage.getItem("isAuth") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  // Show nothing or a loader while checking
  if (isAuthenticated === null) {
    return <div>Loading...</div> // Or your loading component
  }

  return isAuthenticated ? children : <Navigate to="/" replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminApps />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </StrictMode>
)