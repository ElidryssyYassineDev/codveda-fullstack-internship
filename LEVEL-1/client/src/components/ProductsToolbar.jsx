import { Search } from 'lucide-react'

function ProductsToolbar({ query, onQueryChange, filter, onFilterChange }) {
  return (
    <div className="products-toolbar">
      <div className="products-toolbar__search">
        <Search size={15} />
        <input type="text" placeholder="Search products..."
          value={query} onChange={e => onQueryChange(e.target.value)} />
      </div>
      <select className="products-toolbar__filter"
        value={filter} onChange={e => onFilterChange(e.target.value)}>
        <option value="all">All products</option>
        <option value="inStock">In stock</option>
        <option value="outOfStock">Out of stock</option>
      </select>
    </div>
  )
}

export default ProductsToolbar