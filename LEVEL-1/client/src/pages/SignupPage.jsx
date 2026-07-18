// SignupPage.jsx — identical shape, three fields instead of two
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForms from '../components/AuthForms'
import AuthLayout, { AuthFieldsSkeleton } from '../components/AuthLayout'

function SignupPage() {
  const { currentUser, isAuthLoading } = useAuth()

  if (isAuthLoading) return <AuthLayout><AuthFieldsSkeleton fieldCount={3} /></AuthLayout>
  if (currentUser) return <Navigate to="/dashboard" replace />

  return <AuthForms mode="signup" />
}

export default SignupPage