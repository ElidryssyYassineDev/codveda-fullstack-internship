// client/src/App.jsx

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import AuthForms from './components/AuthForms'
import { useAuth } from './context/AuthContext'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )
  const { currentUser } = useAuth()

  function toggleTheme() {
    setIsDarkMode(prev => !prev)
  }

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <div className="app" data-theme={isDarkMode ? 'dark' : 'light'}>
      <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />

      <main className="main-content">
        <div className="container">
          {/* !currentUser — the Q3 answer, corrected */}
          {!currentUser && <AuthForms />}

          {/* Always renders — matches your Milestone 4 decision to
              keep GET /api/products public. Anonymous visitors can
              still browse; they just can't add, edit, or delete. */}
          <ProductList />
        </div>
      </main>
    </div>
  )
}

export default App