// client/src/App.jsx
// Now owns isDarkMode state — the only piece of state that
// belongs at the application level rather than inside a feature component.

import { useState } from 'react'
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
    setIsDarkMode(prev => {
      const next = !prev
      // Write to localStorage inside the functional update —
      // this guarantees next is always the correct new value,
      // never a stale closure over isDarkMode.
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
  })
  }

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