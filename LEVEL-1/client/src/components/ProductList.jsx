import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'
import AddProductForm from './AddProductForm'

function ProductList() {
  const { isAdmin } = useAuth()
  const {
    products, isLoading, error, deleteError,
    handleProductAdded, handleDelete, handleEdit,
  } = useProducts()

  if (isLoading) return <LoadingSpinner message="Fetching products..." />
  if (error) return (
    <div className="status-message status-message--error">
      <p>Something went wrong:</p><code>{error}</code>
    </div>
  )

  return (
    <div className="product-list">
      {isAdmin && <AddProductForm onProductAdded={handleProductAdded} />}
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
        <div className="status-message"><p>No products yet. Add one above to get started.</p></div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList