import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import AppShell from './layouts/AppShell'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const { isDarkMode } = useTheme()
  // The useState/useEffect pair that used to live here moved into
  // ThemeContext. App just reads the current value now.

  return (
    <div className="app" data-theme={isDarkMode ? 'dark' : 'light'}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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