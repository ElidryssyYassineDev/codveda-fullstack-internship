// LoginPage.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForms from '../components/AuthForms'
import AuthLayout, { AuthFieldsSkeleton } from '../components/AuthLayout'

function LoginPage() {
  const { currentUser, isAuthLoading } = useAuth()

  if (isAuthLoading) return <AuthLayout><AuthFieldsSkeleton fieldCount={2} /></AuthLayout>
  if (currentUser) return <Navigate to="/dashboard" replace />

  return <AuthForms mode="login" />
}

export default LoginPage