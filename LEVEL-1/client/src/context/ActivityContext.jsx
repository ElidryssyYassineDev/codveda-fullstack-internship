// client/src/context/ActivityContext.jsx
// Session-only activity log, built entirely from live socket events —
// no backend storage. Resets on refresh; that's the honest tradeoff
// of not persisting it server-side.

import { createContext, useState, useContext, useEffect } from 'react'
import { useSocket } from './SocketContext'

const ActivityContext = createContext(null)
const MAX_ENTRIES = 15

export function ActivityProvider({ children }) {
  const { socket } = useSocket()
  const [activity, setActivity] = useState([])

  useEffect(() => {
    if (!socket) return

    function addEntry(type, message) {
      setActivity(current => [
        { id: `${Date.now()}-${Math.random()}`, type, message, timestamp: Date.now() },
        ...current,
      ].slice(0, MAX_ENTRIES))
    }

    function onCreated(product) { addEntry('created', `${product.name} added`) }
    function onUpdated(product) { addEntry('updated', `${product.name} updated`) }
    // Delete events only carry the id — the product's already gone by
    // the time this fires, so there's no name left to show without an
    // extra request that isn't worth it for one activity-log line.
    function onDeleted() { addEntry('deleted', 'A product was removed') }
    function onLowStock(data) { addEntry('lowStock', `${data.name} is now out of stock`) }

    socket.on('productCreated', onCreated)
    socket.on('productUpdated', onUpdated)
    socket.on('productDeleted', onDeleted)
    socket.on('lowStockAlert', onLowStock)

    return () => {
      socket.off('productCreated', onCreated)
      socket.off('productUpdated', onUpdated)
      socket.off('productDeleted', onDeleted)
      socket.off('lowStockAlert', onLowStock)
    }
  }, [socket])

  return (
    <ActivityContext.Provider value={{ activity }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used inside an ActivityProvider')
  }
  return context
}

export default ActivityContext