import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import LowStockAlert from '../components/LowStockAlert'

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
        <div className="page-content">
          <LowStockAlert />
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppShell