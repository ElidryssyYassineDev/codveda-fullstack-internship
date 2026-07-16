// client/src/pages/LoginPage.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForms from '../components/AuthForms'

function LoginPage() {
  const { currentUser } = useAuth()
  // The reverse of ProtectedRoute: already logged in and you land here
  // anyway (typing /login directly, browser back button) → bounced
  // straight to /dashboard instead of seeing the login form again.
  if (currentUser) return <Navigate to="/dashboard" replace />
  return <AuthForms />
}

export default LoginPage