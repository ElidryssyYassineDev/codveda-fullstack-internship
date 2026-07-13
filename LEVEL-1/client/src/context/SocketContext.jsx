import { createContext, useState, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { token, logout } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    })

    // Rejected handshake here means THIS token specifically is no
    // longer valid — the exact three messages socket.js's io.use()
    // can send. Every other failure reason (server down, dropped
    // wifi) is left alone; socket.io-client already retries those
    // on its own, proven in Milestone 5's Test B. Logging someone
    // out over a flaky connection would be overreacting to a
    // non-issue.
    newSocket.on('connect_error', (err) => {
      const authFailures = ['Not authenticated', 'User no longer exists', 'Invalid or expired token']
      if (authFailures.includes(err.message)) {
        logout()
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
      setSocket(null)
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used inside a SocketProvider')
  }
  return context
}

export default SocketContext