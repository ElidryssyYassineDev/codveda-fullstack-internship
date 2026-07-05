// client/src/App.jsx
// Now owns isDarkMode state — the only piece of state that
// belongs at the application level rather than inside a feature component.

import { useState } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  function toggleTheme() {
    setIsDarkMode(prev => !prev)
    // Using the functional update form: prev => !prev
    // instead of !isDarkMode — safer when React batches
    // multiple state updates together.
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