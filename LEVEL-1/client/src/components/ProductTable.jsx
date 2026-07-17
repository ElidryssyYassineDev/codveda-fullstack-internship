import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

function SortHeader({ label, sortKey, sortBy, sortDirection, onSort }) {
  const isActive = sortBy === sortKey
  return (
    <th onClick={() => onSort(sortKey)} className="product-table__sort-header">
      {label}
      {isActive
        ? (sortDirection === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
        : <ChevronsUpDown size={13} className="product-table__sort-icon--idle" />}
    </th>
  )
}

function ProductTable({ products, sortBy, sortDirection, onSort, onEdit, onDelete, isAdmin }) {
  if (products.length === 0) {
    return <div className="status-message"><p>No products match your search.</p></div>
  }

  return (
    <table className="product-table">
      <thead>
        <tr>
          <SortHeader label="Name" sortKey="name" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
          <SortHeader label="Price" sortKey="price" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
          <th>Status</th>
          <th>Created by</th>
          {isAdmin && <th></th>}
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td className="product-table__price">${product.price.toFixed(2)}</td>
            <td>
              <span className={`badge ${product.inStock ? 'badge--in' : 'badge--out'}`}>
                {product.inStock ? 'In stock' : 'Out of stock'}
              </span>
            </td>
            <td className="product-table__creator">{product.createdBy?.name ?? '—'}</td>
            {isAdmin && (
              <td className="product-table__actions">
                <button className="btn btn--secondary" onClick={() => onEdit(product)}>Edit</button>
                <button className="btn btn--danger" onClick={() => onDelete(product._id, product.name)}>Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductTable