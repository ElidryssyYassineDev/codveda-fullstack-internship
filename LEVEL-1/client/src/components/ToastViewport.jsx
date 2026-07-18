import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle }

function ToastViewport() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="toast-viewport">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = ICONS[toast.type] || ICONS.success
          return (
            <motion.div
              key={toast.id}
              className={`toast toast--${toast.type}`}
              initial={{ opacity: 0, x: 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              transition={{ duration: 2.18, ease: 'easeOut' }}
            >
              <Icon size={16} />
              <span>{toast.message}</span>
              <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastViewport