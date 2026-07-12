// client/src/components/LowStockAlert.jsx
// Purpose: admin-only toast for low-stock notifications. The isAdmin
// check here isn't a security boundary — the server only ever emits
// this event to sockets already inside the 'admins' room, so a non-
// admin's socket could never receive it regardless. This just skips
// pointless subscription work for an event that can't arrive here.

import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'

function LowStockAlert() {
  const { socket } = useSocket()
  const { isAdmin } = useAuth()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (!socket || !isAdmin) return

    function handleLowStockAlert(data) {
      const alertId = Date.now()
      setAlerts(current => [...current, { id: alertId, name: data.name }])

      // Auto-dismiss so alerts don't pile up forever
      setTimeout(() => {
        setAlerts(current => current.filter(a => a.id !== alertId))
      }, 6000)
    }

    socket.on('lowStockAlert', handleLowStockAlert)

    return () => {
      socket.off('lowStockAlert', handleLowStockAlert)
    }
  }, [socket, isAdmin])

  if (!isAdmin || alerts.length === 0) return null

  return (
    <div className="low-stock-toast-container">
      {alerts.map(alert => (
        <div key={alert.id} className="low-stock-toast">
          ⚠️ <strong>{alert.name}</strong> just went out of stock
        </div>
      ))}
    </div>
  )
}

export default LowStockAlert