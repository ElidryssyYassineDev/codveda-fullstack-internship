// client/src/components/Navbar.jsx

import { useAuth } from '../context/AuthContext'

/**
 * @param {boolean} isDarkMode — current theme state
 * @param {function} onThemeToggle — callback to flip the theme
 */
function Navbar({ isDarkMode, onThemeToggle }) {
  const { currentUser, logout } = useAuth()
  // currentUser and logout come straight from Context — no props needed.
  // Contrast with isDarkMode/onThemeToggle above: theme only needs to
  // reach one level down, so props are the right tool there.

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__title">
          Product<span className="navbar__accent">.</span>Manager
        </span>
      </div>

      <nav className="navbar__links">
        {currentUser && (
          <span className="navbar__user">
            {currentUser.name}
            <span className="navbar__role-badge">{currentUser.role}</span>
          </span>
        )}

        <span className="navbar__tag">Level 2 — React</span>

        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {currentUser && (
          <button className="btn btn--secondary" onClick={logout}>
            Log Out
          </button>
        )}
      </nav>
    </header>
  )
}

export default Navbar