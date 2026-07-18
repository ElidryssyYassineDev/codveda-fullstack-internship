import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForms from '../components/AuthForms'

function SignupPage() {
  const { currentUser } = useAuth()
  if (currentUser) return <Navigate to="/dashboard" replace />
  return <AuthForms mode="signup" />
}

export default SignupPage