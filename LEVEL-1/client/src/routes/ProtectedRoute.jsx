// client/src/routes/ProtectedRoute.jsx
// Purpose: gatekeeper for any route requiring a logged-in user.
// Renders its children if authenticated; otherwise redirects to /login
// instead of ever rendering the protected content.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
    // replace, not push — this redirect doesn't add a new history entry,
    // so clicking "back" from /login can't bounce into a redirect loop
    // back to the page that just kicked the user out.
  }

  return children
}

export default ProtectedRoute