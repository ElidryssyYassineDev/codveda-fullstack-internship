// client/src/layouts/AppShell.jsx
// Purpose: shared shell for every authenticated page. Deliberately
// bare here — Milestone 2 replaces this with the real sidebar/topbar
// from the confirmed mockup. <Outlet /> is the concept to notice:
// Dashboard, Products, and Profile all share this exact component;
// only what Outlet renders changes as the URL changes.

import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LowStockAlert from '../components/LowStockAlert'

function AppShell() {
  const { logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar-temp">
        <nav>
          {/* NavLink, not Link — it auto-applies an active class to
              whichever one matches the current URL. That's the exact
              mechanism the amber sidebar highlight will hook into
              in Milestone 2 — the plumbing's already here. */}
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <button onClick={logout}>Log out</button>
      </aside>

      <main className="main-area">
        <LowStockAlert />
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell