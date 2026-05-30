import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Wraps any route that requires authentication
// If not logged in → redirect to /login
// If wrong role → redirect to /login
// allowedRoles example: ['teacher'] or ['student', 'admin']

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()

  // Not logged in — send to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Wrong role — send to login
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  // All good — render the page
  return children
}