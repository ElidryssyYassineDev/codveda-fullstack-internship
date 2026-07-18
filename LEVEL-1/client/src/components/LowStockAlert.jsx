// client/src/components/LowStockAlert.jsx
// Purpose: listens for the admin-only room-targeted lowStockAlert
// socket event and pushes it into the SHARED toast queue. No longer
// owns its own alerts array or setTimeout — that logic now lives
// once, in ToastContext, reused by every toast in the app including
// this one.

import { useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function LowStockAlert() {
  const { socket } = useSocket()
  const { isAdmin } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    if (!socket || !isAdmin) return

    function handleLowStockAlert(data) {
      addToast(`⚠️ ${data.name} just went out of stock`, 'warning')
    }

    socket.on('lowStockAlert', handleLowStockAlert)
    return () => {
      socket.off('lowStockAlert', handleLowStockAlert)
    }
  }, [socket, isAdmin, addToast])

  // Renders nothing itself now — ToastViewport is the one place
  // toasts actually appear. This component's whole job is listening
  // and forwarding.
  return null
}

export default LowStockAlert