// client/src/App.jsx
// Now owns isDarkMode state — the only piece of state that
// belongs at the application level rather than inside a feature component.

import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
    // The () => makes this a LAZY INITIALIZER.
    // React runs this function once on mount — not on every render.
    // localStorage.getItem('theme') returns:
    //   null    → if key doesn't exist yet → null === 'dark' → false (light mode)
    //   'dark'  → 'dark' === 'dark' → true (dark mode)
    //   'light' → 'light' === 'dark' → false (light mode)
  )

  function toggleTheme() {
    setIsDarkMode(prev => !prev)
  }
  // useEffect reacts to isDarkMode changes and syncs to localStorage
  useEffect(()=>{
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])


  return (
    <div className="app" data-theme={isDarkMode ? 'dark' : 'light'}>
      <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />

      <main className="main-content">
        <div className="container">
          <ProductList />
        </div>
      </main>
    </div>
  )
}

export default App