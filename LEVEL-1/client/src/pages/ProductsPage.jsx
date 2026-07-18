import { useState, useEffect, useRef, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductsToolbar from '../components/ProductsToolbar'
import ProductTable from '../components/ProductTable'
import Pagination from '../components/Pagination'
import ProductFormModal from '../components/ProductFormModal'
import Skeleton from '../components/Skeleton'

const PAGE_SIZE = 6

function ProductsSkeleton() {
  return (
    <div className="products-page">
      <Skeleton width="120px" height="24px" />
      <div style={{ marginTop: '4px' }} />
      <div className="product-table">
        {[0, 1, 2, 3, 4].map(i => (
          <div className="skeleton-table-row" key={i}>
            <Skeleton width="70%" />
            <Skeleton width="50%" />
            <Skeleton width="60px" height="20px" radius="999px" />
            <Skeleton width="50%" />
            <Skeleton width="70px" height="28px" radius="8px" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductsPage() {
  const { isAdmin } = useAuth()
  const { products, isLoading, error, handleProductAdded, handleDelete, handleEdit } = useProducts()
  const searchInputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)

  const [editingProduct, setEditingProduct] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  

  function handleSort(key) {
    if (sortBy === key) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDirection('asc') }
    setPage(1)
  }

  function handleQueryChange(value) {
    setQuery(value)
    setPage(1) // a filtered list starting on the old page 4 would just look broken
  }

  function handleFilterChange(value) {
    setFilter(value)
    setPage(1)
  }

  function handleDeleteClick(id, name) {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      handleDelete(id)
    }
  }

  // Search → filter → sort, chained as plain array methods — the
  // same .filter()/.sort() instinct from the very first ES6 lessons,
  // and literally the exact pattern from the search-bar exercise at
  // the end of Task 1's knowledge check, now actually built.
  const processedProducts = useMemo(() => {
    let result = products

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q))
    }
    if (filter === 'inStock') result = result.filter(p => p.inStock)
    if (filter === 'outOfStock') result = result.filter(p => !p.inStock)

    result = [...result].sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      if (sortBy === 'price') comparison = a.price - b.price
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [products, query, filter, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / PAGE_SIZE))
  const paginatedProducts = processedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    function handleKeyDown(e) {
      // Guards against hijacking a keystroke while the user is
      // actually typing somewhere — the exact bug a shortcut that
      // doesn't check this would have. Also skips while a modal is
      // open, so "n" while editing a product's name field doesn't
      // pop a second, unrelated create modal on top of it.
      const isTyping = ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
      if (isTyping || isCreating || editingProduct) return

      if (e.key === '/') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'n' && isAdmin) {
        e.preventDefault()
        setIsCreating(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAdmin, isCreating, editingProduct])

  if (isLoading) return <ProductsSkeleton />
  if (error) return (
    <div className="status-message status-message--error">
      <p>Something went wrong:</p><code>{error}</code>
    </div>
  )

  return (
    <div className="products-page">
      <div className="product-list__header">
        <h2 className="product-list__title">Products</h2>
        <span className="product-list__count">{processedProducts.length} of {products.length}</span>
      </div>

      <ProductsToolbar query={query} onQueryChange={handleQueryChange} filter={filter} onFilterChange={handleFilterChange} searchInputRef={searchInputRef} />

      <ProductTable
        products={paginatedProducts}
        sortBy={sortBy} sortDirection={sortDirection} onSort={handleSort}
        onEdit={setEditingProduct} onDelete={handleDeleteClick}
        isAdmin={isAdmin}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {isAdmin && (
        <button className="fab" onClick={() => setIsCreating(true)} aria-label="New product">
          <Plus size={22} />
        </button>
      )}
       <AnimatePresence>
        {isCreating && <ProductFormModal onClose={() => setIsCreating(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {editingProduct && <ProductFormModal product={editingProduct} onClose={() => setEditingProduct(null)} />}
      </AnimatePresence>
      
    </div>
  )
}

export default ProductsPage