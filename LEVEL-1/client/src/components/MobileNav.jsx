// client/src/components/MobileNav.jsx
// Purpose: bottom tab bar, visible only below 900px. Sidebar and this
// component both exist in the DOM at all times — CSS display:none
// decides which one is actually present (and, correctly, which one
// screen readers see — display:none removes an element from the
// accessibility tree entirely, so there's never a duplicate nav
// exposed at any given width).

import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, User } from 'lucide-react'

function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
        <Package size={20} />
        <span>Products</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}

export default MobileNav