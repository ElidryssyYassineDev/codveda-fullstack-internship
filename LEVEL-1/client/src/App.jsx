// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import AppShell from './layouts/AppShell'
import ProtectedRoute from './routes/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'
import ToastViewport from './components/ToastViewport'

function App() {
  const { isDarkMode } = useTheme()

  return (
    <div className="app" data-theme={isDarkMode ? 'dark' : 'light'}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastViewport />
    </div>
  )
}

export default App