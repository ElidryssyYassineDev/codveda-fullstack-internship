// client/src/components/Topbar.jsx

import { Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

function Topbar({ searchValue, onSearchChange }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { currentUser } = useAuth()

  return (
    <header className="topbar">
      {/* Renders only where a page actually passes search props in.
          Dashboard passes nothing, so this whole block is simply
          absent there — not disabled, not empty, just not rendered. */}
      {onSearchChange ? (
        <div className="topbar__search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      ) : (
        <div />
      )}

      <div className="topbar__actions">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <button
          className="topbar__icon-btn"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="topbar__avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
      </div>
    </header>
  )
}

export default Topbar