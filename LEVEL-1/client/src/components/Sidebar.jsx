// client/src/components/Sidebar.jsx
// Purpose: fixed nav. NavLink (not Link) auto-applies its className
// function's "isActive" flag against the current URL — no manual
// "which page am I on" tracking needed anywhere.

import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function TallyMark() {
  // The brand mark itself, not a generic UI icon — stays hand-drawn
  // rather than pulled from Lucide's general icon set.
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 3v14M8 3v14M12 3v14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 13l14-8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Sidebar() {
  const { currentUser, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <TallyMark />
        <span>Tally</span>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
          <Package size={17} />
          Products
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <User size={17} />
          Profile
        </NavLink>
      </nav>

      <div className="sidebar__foot">
        <div className="sidebar__avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
        <div>
          <div className="sidebar__name">{currentUser.name}</div>
          <div className="sidebar__role">{currentUser.role}</div>
        </div>
        <button className="sidebar__logout" onClick={logout} aria-label="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar