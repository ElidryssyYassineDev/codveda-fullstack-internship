import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { currentUser, isAuthLoading } = useAuth()

  if (isAuthLoading) return null
  // Renders nothing for one tick rather than a full skeleton here —
  // AppShell's own page-transition wrapper would otherwise animate
  // in a loading state just to immediately animate it back out again
  // once isAuthLoading flips, which reads as a flicker, not a loader.

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute