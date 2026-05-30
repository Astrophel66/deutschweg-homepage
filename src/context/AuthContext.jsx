import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

// 1. Create the context — this is what components will consume via useAuth()
const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  // 2. Initialize user from localStorage so login persists on page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const [loading, setLoading] = useState(false)

  // ── REGISTER ──────────────────────────────────────────────────────────────
  // Combines firstName + lastName into full_name before sending to backend
  // Backend creates user + sends verification email
  // Frontend just shows "check your email" — no token stored yet
  const register = async ({ firstName, lastName, email, password, role }) => {
    setLoading(true)
    try {
      await api.post('/auth/register/', {
        full_name: `${firstName} ${lastName}`,
        email,
        password,
        role,
      })
      setLoading(false)
      return { success: true }
    } catch (err) {
      setLoading(false)
      // Pull the most relevant error message from DRF's response shape
      const msg = err.response?.data?.email?.[0]
        || err.response?.data?.password?.[0]
        || err.response?.data?.non_field_errors?.[0]
        || 'Registration failed. Try again.'
      return { success: false, error: msg }
    }
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  // Sends email + password → gets back JWT tokens + user object
  // Stores tokens in localStorage so axios interceptor auto-attaches them
  // Stores user so we know role for redirects (student/teacher/admin)
  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login/', { email, password })
      const { tokens, user } = res.data

      // Save tokens — axios interceptor in api/axios.js picks up 'access' automatically
      localStorage.setItem('access', tokens.access)
      localStorage.setItem('refresh', tokens.refresh)
      localStorage.setItem('user', JSON.stringify(user))

      // Update state so all components re-render with logged-in user
      setUser(user)
      setLoading(false)
      return { success: true, user }
    } catch (err) {
      setLoading(false)
      const msg = err.response?.data?.non_field_errors?.[0]
        || 'Invalid email or password.'
      return { success: false, error: msg }
    }
  }

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  // Clears everything from localStorage and resets user state
  // No backend call needed — JWT is stateless, just discard the token
  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    setUser(null)
  }

  // 3. Expose everything components need
  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4. Custom hook — components call useAuth() instead of useContext(AuthContext) directly
export function useAuth() {
  return useContext(AuthContext)
}