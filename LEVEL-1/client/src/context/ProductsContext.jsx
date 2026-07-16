// client/src/context/ProductsContext.jsx
// Single source of truth for product data. Both ProductsPage and
// DashboardPage read from here now — one fetch, one set of socket
// listeners, instead of duplicated per page.

import { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useSocket } from './SocketContext'
import { authHeaders } from '../utils/authHeaders'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const { token, logout } = useAuth()
  const { socket } = useSocket()

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
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

  useEffect(() => {
    if (!socket) return

    function handleProductCreated(newProduct) {
      setProducts(current => {
        const alreadyExists = current.some(p => p._id === newProduct._id)
        if (alreadyExists) return current
        return [...current, newProduct]
      })
    }
    function handleProductUpdated(updatedProduct) {
      setProducts(current =>
        current.map(p => p._id === updatedProduct._id ? updatedProduct : p)
      )
    }
    function handleProductDeleted(deletedId) {
      setProducts(current => current.filter(p => p._id !== deletedId))
    }

    socket.on('productCreated', handleProductCreated)
    socket.on('productUpdated', handleProductUpdated)
    socket.on('productDeleted', handleProductDeleted)

    return () => {
      socket.off('productCreated', handleProductCreated)
      socket.off('productUpdated', handleProductUpdated)
      socket.off('productDeleted', handleProductDeleted)
    }
  }, [socket])

  function handleProductAdded(newProduct) {
    setProducts(current => [...current, newProduct])
  }

  async function handleDelete(productId) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      })
      if (res.status === 401) { logout(); return }
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setProducts(current => current.filter(p => p._id !== productId))
      setDeleteError(null)
    } catch (err) {
      setDeleteError('Could not delete product. Check your connection and try again.')
    }
  }

  async function handleEdit(productId, updatedData) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(updatedData),
      })
      if (res.status === 401) { logout(); return false }
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const responseData = await res.json()
      setProducts(current =>
        current.map(p => p._id === productId ? responseData.data : p)
      )
      return true
    } catch (err) {
      return false
    }
  }

  return (
    <ProductsContext.Provider
      value={{ products, isLoading, error, deleteError, handleProductAdded, handleDelete, handleEdit }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used inside a ProductsProvider')
  }
  return context
}

export default ProductsContext