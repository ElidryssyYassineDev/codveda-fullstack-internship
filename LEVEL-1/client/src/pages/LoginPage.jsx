import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForms from '../components/AuthForms'

function LoginPage() {
  const { currentUser } = useAuth()
  if (currentUser) return <Navigate to="/dashboard" replace />
  return <AuthForms mode="login" />
}

export default LoginPage