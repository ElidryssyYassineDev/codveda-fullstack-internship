// client/src/components/ProductList.jsx
// Purpose: Owns the products state for the entire application.
//          Fetches from the API, manages loading/error states,
//          and renders the product grid via ProductCard children.

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'
import AddProductForm from './AddProductForm'

function ProductList() {
  const [products, setProducts]   = useState([])     // ← [] not ProductCard
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    // Defined inside useEffect so it's scoped to this effect only.
    // Cannot make the useEffect callback itself async — React expects
    // it to return either nothing or a cleanup function, not a Promise.
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')

        // res.ok is true for 200–299 status codes.
        // Without this check, a 404 or 500 response would not throw —
        // fetch only rejects on network failure, not HTTP error codes.
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`)
        }

        const responseData = await res.json()

        // Your backend returns { success: true, count: n, data: [...] }
        // We need the array at .data, not the wrapper object.
        setProducts(responseData.data)

      } catch (err) {
        // Catches both network failures and the manual throw above.
        setError(err.message)

      } finally {
        // Runs whether the fetch succeeded or failed.
        // Always stop the spinner either way.
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])
  // [] → run once after first render (mount). Never again.
  // No dependencies means no external values can trigger a re-run.


  // ── Callback passed down to AddProductForm ───────────────────────
  // Defined here because setProducts lives here.
  // This is "lifting state up" — the child triggers this,
  // but the state update happens in the owner (ProductList).
  function handleProductAdded(newProduct) {
    setProducts([...products, newProduct]) 
  }


  // ── Conditional rendering — one state at a time ──────────────────
  // Each return is mutually exclusive. React runs the first one that
  // matches and skips the rest. This is cleaner than nested ternaries.

  if (isLoading) {
    return <LoadingSpinner message="Fetching products..." />
  }

  if (error) {
    return (
      <div className="status-message status-message--error">
        <p>Something went wrong:</p>
        <code>{error}</code>
      </div>
    )
  }



  // ── Happy path — we have data ─────────────────────────────────────
  return (
    <div className="product-list">

      <AddProductForm onProductAdded={handleProductAdded}/>

      <div className="product-list__header">
        <h2 className="product-list__title">Products</h2>
        <span className="product-list__count">{products.length} items</span>
      </div>
      
      {products.length === 0 ?
      (
        <div className="status-message">
          <p>No products found. Add one to get started.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}


    </div>
  )
}

export default ProductList