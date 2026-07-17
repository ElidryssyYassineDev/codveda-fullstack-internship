// client/src/components/Modal.jsx
// Purpose: reusable modal shell. Escape key and backdrop click both
// close it — the cleanup function here is doing real work, same
// principle as every socket listener cleanup: an effect that adds a
// listener must remove it, or it leaks past the moment it's needed.

import { useEffect } from 'react'
import { X } from 'lucide-react'

function Modal({ title, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation is the one genuinely new trick here — without
          it, a click anywhere INSIDE the modal bubbles up to the
          backdrop's own onClick and closes it immediately. */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default Modal