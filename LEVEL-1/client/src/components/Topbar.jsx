// client/src/components/Topbar.jsx

import { Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

function Topbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { currentUser } = useAuth()
  const { isConnected } = useSocket()

  return (
    <header className="topbar">
      <div className={`connection-status ${isConnected ? 'connection-status--live' : 'connection-status--offline'}`}>
        <span className="connection-status__dot" />
        <span className="connection-status__label">{isConnected ? 'Live' : 'Reconnecting…'}</span>
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