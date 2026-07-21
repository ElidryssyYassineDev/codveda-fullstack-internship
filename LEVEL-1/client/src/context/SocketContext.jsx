// client/src/context/SocketContext.jsx

import { createContext, useState, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { token, logout } = useAuth()
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  // socket.connected exists on the socket.io-client instance itself,
  // but reading it directly wouldn't trigger a re-render when it
  // changes. This state variable is what makes "live" actually visible.

  useEffect(() => {
    if (!token) {
      setIsConnected(false)
      return
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    })

    function handleConnect() { setIsConnected(true) }
    function handleDisconnect() { setIsConnected(false) }
    function handleConnectError(err) {
      const authFailures = ['Not authenticated', 'User no longer exists', 'Invalid or expired token']
      if (authFailures.includes(err.message)) logout()
    }

    newSocket.on('connect', handleConnect)
    newSocket.on('disconnect', handleDisconnect)
    newSocket.on('connect_error', handleConnectError)

    setSocket(newSocket)

    return () => {
      newSocket.off('connect', handleConnect)
      newSocket.off('disconnect', handleDisconnect)
      newSocket.off('connect_error', handleConnectError)
      newSocket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used inside a SocketProvider')
  return context
}

export default SocketContext