// client/src/components/Topbar.jsx

import { Search, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

function Topbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { currentUser } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar__search">
        <Search size={15} />
        <input type="text" placeholder="Search products..." disabled />
        {/* disabled, not just unstyled — an input that looks clickable
            but silently does nothing is worse than one that's honest
            about not being wired up yet */}
      </div>

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