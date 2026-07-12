// client/src/context/SocketContext.jsx
// Purpose: Manages the WebSocket connection lifecycle, tied to auth state.
// Mirrors AuthContext's shape — Provider + custom hook — but holds a
// live socket connection instead of user/token data.

import { createContext, useState, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { token } = useAuth()
  // token is null when nobody's logged in, and a real string the moment
  // someone logs in — the same on/off signal App.jsx already reads via
  // !currentUser to show/hide AuthForms. It does double duty here: it's
  // both "is anyone logged in?" AND the exact value the handshake needs
  // below, so one variable covers both jobs — no separate flag needed.

  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // No token → nobody logged in → no connection should exist.
    // Same guard-clause shape as every "if (!x) return" already in
    // your controllers.
    if (!token) return

    // Backend's socket.js reads socket.handshake.auth?.token — an
    // object with a `token` key. This is the exact shape that has
    // to be sent for that line to find anything.
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    })

    setSocket(newSocket)
    newSocket.on('connect', () => console.log('Socket connected:', newSocket.id))
    newSocket.on('disconnect', () => console.log('Socket disconnected'))

    // This returned function is the cleanup. React runs it right
    // before this effect fires again — which happens the instant
    // token changes, i.e. exactly on logout (token → null) or a new
    // login (token → a different string). Without this, the OLD
    // connection would keep running underneath a second, new one —
    // two live sockets for one browser tab. disconnect() here plays
    // the same role localStorage.removeItem() plays inside logout():
    // undoing exactly what was set up.
    return () => {
      newSocket.disconnect()
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