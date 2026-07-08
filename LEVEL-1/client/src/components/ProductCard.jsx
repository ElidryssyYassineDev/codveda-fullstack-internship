// Purpose: Displays one product. Toggles between display and edit mode.
// Props:
//   product  (object)   — the product data
//   onEdit   (function) — async, receives (productId, updatedData), returns boolean
//   onDelete (function) — receives (productId)

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

function ProductCard({ product, onEdit, onDelete }) {
  const { isAdmin, currentUser } = useAuth()
  const { _id, name, description, price, inStock } = product

  // ── Local UI state — only this card cares about these ─────────────
  const [isEditing, setIsEditing]     = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Edit field state — pre-filled with current product values ─────
  // Q3 answer: initial values are the product's actual current values,
  // not empty strings. User sees what they're editing.
  const [editForm, setEditForm]= useState({name, price, description, inStock})
  // Update a single field without touching others
  function handleFieldChange(field, value){
    setEditForm(prev =>({...prev, [field]:value}))
  }

  // ── Reset edit state whenever the logged-in identity changes ──────
  // currentUser changes on login AND logout (it becomes null on logout,
  // then a new object on the next login). Either transition means
  // "a different person is now looking at this screen" — any in-progress
  // edit belonged to whoever was here before and must not carry over.
  useEffect(()=>{
    setIsEditing(false)
  },[currentUser])

  // ── Edit submit handler ───────────────────────────────────────────
  async function handleSubmitEdit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    // onEdit is async — it returns a Promise that resolves to true/false.
    // We await it so we know whether the server accepted the update.
    const success = await onEdit(_id, {
      name: editForm.name,
      price: Number(editForm.price),   // convert string input back to number
      description: editForm.description,
      inStock: editForm.inStock,
    })

    setIsSubmitting(false)

    // Only close the edit form if the server confirmed success.
    // If it failed, form stays open so the user can try again.
    if (success) setIsEditing(false)
  }

  function handleDeleteClick() {
  if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
    onDelete(_id)
  }
}

  // ── Edit mode render ──────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="product-card product-card--editing">
        <form onSubmit={handleSubmitEdit}>

          <div className="form__group">
            <label className="form__label" htmlFor={`name-${_id}`}>Name</label>
            <input
              id={`name-${_id}`}
              // id is unique per card using _id — prevents label conflicts
              // when multiple cards are in edit mode simultaneously
              type="text"
              className="form__input"
              value={editForm.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor={`price-${_id}`}>Price ($)</label>
            <input
              id={`price-${_id}`}
              type="number"
              className="form__input"
              value={editForm.price}
              onChange={e => handleFieldChange('price', e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor={`desc-${_id}`}>Description</label>
            <textarea
              id={`desc-${_id}`}
              className="form__input form__textarea"
              value={editForm.description}
              onChange={e => handleFieldChange('description', e.target.value)}
              rows={2}
            />
          </div>

          <div className="form__group form__group--checkbox">
            <input
              id={`stock-${_id}`}
              type="checkbox"
              className="form__checkbox"
              checked={editForm.inStock}
              onChange={e => handleFieldChange('inStock', e.target.checked)}
            />
            <label className="form__label" htmlFor={`stock-${_id}`}>In Stock</label>
          </div>

          <div className="product-card__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    )
  }

  // ── Display mode render (default) ─────────────────────────────────
  const isOutOfStock = !inStock

  return (
    <div className={`product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}`}>

      <div className="product-card__header">
        <h3 className="product-card__name">{name}</h3>
        <span className={`product-card__stock-badge ${isOutOfStock ? 'badge--out' : 'badge--in'}`}>
          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
        </span>
      </div>

      {description && (
        <p className="product-card__description">{description}</p>
      )}

      <div className="product-card__footer">
        <span className="product-card__price">${price.toFixed(2)}</span>

       {isAdmin && <div className="product-card__actions">
          <button
            className="btn btn--secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="btn btn--danger"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>}
      </div>

    </div>
  )
}

export default ProductCard