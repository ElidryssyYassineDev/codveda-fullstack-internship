// client/src/layouts/AppShell.jsx

import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
import Topbar from '../components/Topbar'
import LowStockAlert from '../components/LowStockAlert'

function AppShell() {
  const location = useLocation()

  return (
    <div className="app-shell">
      {/* Invisible until focused — a keyboard user's first Tab press
          lets them jump straight past the nav to page content. */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      <Sidebar />
      <MobileNav />

      <main className="main-area">
        <Topbar />
        <div className="page-content" id="main-content" tabIndex={-1}>
          <LowStockAlert />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default AppShell