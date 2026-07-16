// client/src/components/RecentProductRow.jsx
// Deliberately NOT ProductCard — that component expects real
// onEdit/onDelete handlers and would throw without them. This one
// has exactly one job: display, nothing else.

function RecentProductRow({ product }) {
  const { name, price, inStock } = product
  return (
    <div className="recent-product">
      <span className={`badge ${inStock ? 'badge--in' : 'badge--out'}`}>
        {inStock ? 'In stock' : 'Out of stock'}
      </span>
      <span className="recent-product__name">{name}</span>
      <span className="recent-product__price">${price.toFixed(2)}</span>
    </div>
  )
}

export default RecentProductRow