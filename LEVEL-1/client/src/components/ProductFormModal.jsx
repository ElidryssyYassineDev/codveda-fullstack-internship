// client/src/components/ProductFormModal.jsx
// Purpose: one form for both creating and editing. If `product` is
// passed, it opens pre-filled in edit mode; otherwise it's blank.
// Note the asymmetry below is intentional, not new: create has always
// POSTed directly and notified the parent after (AddProductForm's
// original Task 1 pattern); edit has always gone fully through
// context. Preserved exactly as it already was — just relocated.

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { authHeaders } from '../utils/authHeaders'
import Modal from './Modal'
import { API_BASE_URL } from '../utils/apiBase'

function ProductFormModal({ product, onClose }) {
  const { token } = useAuth()
  const { handleProductAdded, handleEdit } = useProducts()
  const isEditMode = Boolean(product)

  const [form, setForm] = useState({
    name: product?.name ?? '',
    price: product?.price ?? '',
    description: product?.description ?? '',
    inStock: product?.inStock ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleFieldChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) { setError('Product name cannot be empty.'); return }
    if (Number(form.price) < 0) { setError('Price cannot be negative.'); return }

    setIsSubmitting(true)
    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      inStock: form.inStock,
    }

    if (isEditMode) {
      const success = await handleEdit(product._id, payload)
      setIsSubmitting(false)
      if (success) onClose()
      else setError('Could not save changes. Please try again.')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || `Server error ${res.status}`)
      }
      const responseData = await res.json()
      handleProductAdded(responseData.data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={isEditMode ? 'Edit product' : 'New product'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="product-form">
        {error && <div className="form__error">{error}</div>}

        <div className="form__group">
          <label className="form__label" htmlFor="pf-name">Name</label>
          <input id="pf-name" type="text" className="form__input" autoFocus required
            value={form.name} onChange={e => handleFieldChange('name', e.target.value)} />
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="pf-price">Price ($)</label>
          <input id="pf-price" type="number" className="form__input" min="0" step="0.01" required
            value={form.price} onChange={e => handleFieldChange('price', e.target.value)} />
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="pf-desc">Description</label>
          <textarea id="pf-desc" className="form__input form__textarea" rows={3}
            value={form.description} onChange={e => handleFieldChange('description', e.target.value)} />
        </div>

        <div className="form__group form__group--checkbox">
          <input id="pf-stock" type="checkbox"
            checked={form.inStock} onChange={e => handleFieldChange('inStock', e.target.checked)} />
          <label className="form__label" htmlFor="pf-stock">In stock</label>
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ProductFormModal