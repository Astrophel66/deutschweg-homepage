import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false)

  const register = async (data) => {
    setLoading(true)

    // fake API for now
    console.log("Registering user:", data)

    setLoading(false)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}