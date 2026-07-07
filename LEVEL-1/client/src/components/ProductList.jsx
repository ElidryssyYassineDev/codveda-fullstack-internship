// client/src/components/ProductList.jsx

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'
import AddProductForm from './AddProductForm'
import { useAuth } from '../context/AuthContext'
import { authHeaders } from '../utils/authHeaders'

function ProductList() {
  const { token, isAdmin } = useAuth()
  const [products, setProducts]       = useState([])
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error(`Server responded with status ${res.status}`)
        const responseData = await res.json()
        setProducts(responseData.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  function handleProductAdded(newProduct) {
    setProducts(current =>[...current, newProduct])
  }

  // ── Delete handler ────────────────────────────────────────────────
  // Receives the _id of the product to delete.
  // Makes the DELETE request, then filters it out of state on success.
  async function handleDelete(productId) {
    try {
      
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      })
      
      if (!res.ok) throw new Error(`Server error ${res.status}`)

      // .filter() returns a new array excluding the deleted product.
      // React detects the new array reference and re-renders.
      setProducts(current =>current.filter(p => p._id !== productId))
      setDeleteError(null)

    } catch (err) {
      setDeleteError('Could not delete product. Check your connection and try again!')
      // Could set an error state here — keeping it simple for now.
    }
  }

  // ── Edit handler ──────────────────────────────────────────────────
  // Receives the _id and the updated field values.
  // Returns true on success, false on failure.
  // ProductCard awaits this return value to decide whether to close
  // the edit form — this is why it must be async (returns a Promise).
  async function handleEdit(productId, updatedData) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)

      const responseData = await res.json()

      // .map() walks every product.
      // For the one whose _id matches: replace it with the updated version.
      // For all others: return them unchanged.
      // Result is a new array — React re-renders.
      setProducts(current =>current.map(p =>
        p._id === productId ? responseData.data : p
      ))

      const succeeded = true

      return succeeded   // signal success to ProductCard

    } catch (err) {
      console.error('Update failed:', err.message)
      return (!succeeded)  // signal failure — ProductCard keeps form open
    }
  }

  // ── Conditional renders ───────────────────────────────────────────
  if (isLoading) return <LoadingSpinner message="Fetching products..." />

  if (error) return (
    <div className="status-message status-message--error">
      <p>Something went wrong:</p>
      <code>{error}</code>
    </div>
  )

  return (
    <div className="product-list">
      {isAdmin && <AddProductForm onProductAdded={handleProductAdded} />}

      {/* ← NEW: delete error renders here, above the grid, dismisses on next successful delete */}
      {deleteError && (
        <div className="status-message status-message--error" style={{ marginBottom: '1rem' }}>
          {deleteError}
        </div>
      )}

      <div className="product-list__header">
        <h2 className="product-list__title">Products</h2>
        <span className="product-list__count">{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <div className="status-message">
          <p>No products yet. Add one above to get started.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList