// Purpose: Global auth state for the entire React app.
// Provides: token, currentUser, login(), signup(), logout()
// Any component can read these via useContext(AuthContext)

import { createContext, useState, useContext } from "react";

// Step 1 — create the context object
// This is the "radio frequency" — Provider broadcasts on it,
// consumers tune into it via useContext
const AuthContext = createContext(null)

// Step 2 — Provider component
// Wraps the entire app in main.jsx
// Holds the actual state and functions
export function AuthProvider ({children}){
    const [token, setToken] = useState(
        () => localStorage.getItem('token') || null
        // Lazy initializer — reads token from localStorage on mount.
        // If user was previously logged in, they stay logged in after refresh.
    )

    const [currentUser, setCurrentUser] = useState(
        () => {
          try{
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
          }catch{
            // Corrupted localStorage -- fail safe instead of crashing the app
            return null
          }
        }
        //same pattern - persists user object across refreshes.
    )
      // ── login ───────────────────────────────────────────────────────
  // Called after successful POST /api/auth/login or /api/auth/signup.
  // Receives the token and user object from the API response.
  function login(newToken, user) {
    setToken(newToken)
    setCurrentUser(user)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(user))
  }

  // ── logout ──────────────────────────────────────────────────────
  // Clears all auth state and localStorage.
  function logout() {
    setToken(null)
    setCurrentUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ── isAdmin convenience getter ──────────────────────────────────
  // Components check this instead of currentUser?.role === 'admin'
  // everywhere — single place to change if role logic evolves.
  const isAdmin = currentUser?.role === 'admin'

  return (
    <AuthContext.Provider value={{ token, currentUser, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3 — custom hook
// useAuth() is cleaner than writing useContext(AuthContext) everywhere.
// Any component imports useAuth and calls it — one line to get everything.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
    // This error fires if someone calls useAuth() outside the Provider tree —
    // catches the mistake immediately rather than producing a cryptic undefined error.
  }
  return context
}

export default AuthContext
