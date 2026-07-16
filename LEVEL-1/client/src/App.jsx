// client/src/App.jsx
// Theme state stays exactly as it was — same useState, same effect,
// same wrapping div with data-theme. Only what's INSIDE that div
// changes: the old conditional render is now a real route tree.

import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <div className="app" data-theme={isDarkMode ? 'dark' : 'light'}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* A "layout route" — no path of its own, just wraps its
            children in ProtectedRoute + the shared AppShell. If the
            redirect fires, none of the three page routes below ever
            get a chance to render. */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default App