// client/src/context/ThemeContext.jsx
// Purpose: theme state, extracted from App.jsx now that AppShell and
// LoginPage are siblings, not parent/child. Identical shape to
// AuthContext/SocketContext — same pattern, different piece of state.

import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  function toggleTheme() {
    setIsDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }
  return context
}

export default ThemeContext