// client/src/context/ToastContext.jsx
// Purpose: single shared toast queue any component can push into.
// Generalizes the exact pattern LowStockAlert already had working —
// array of dismissable, auto-expiring entries — rather than building
// a second, separate mechanism alongside it.

import { createContext, useState, useContext, useCallback } from 'react'

const ToastContext = createContext(null)
const DEFAULT_DURATION = 40000

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // useCallback: this function gets handed down through context to
  // every consumer. Without it, ToastProvider re-rendering (which
  // happens every time the toasts array itself changes) would create
  // a brand-new addToast function each time — and effects elsewhere
  // that depend on addToast being stable would keep re-firing for no
  // real reason. Same stale-closure family of issue as the
  // functional-update fix from Task 1's code review, coming at it
  // from the opposite direction: keeping a reference stable on purpose.
  const addToast = useCallback((message, type = 'info', duration = DEFAULT_DURATION) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(current => [...current, { id, message, type }])
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, duration)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(current => current.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }
  return context
}

export default ToastContext