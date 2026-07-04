// Purpose: Displays a single product's data.
// Props:
//   product (object, required) — { _id, name, description, price, stock }
//   onEdit   (function, optional) — called when Edit is clicked
//   onDelete (function, optional) — called when Delete is clicked

function ProductCard ({product, onEdit, onDelete}){
    const {name, price, description, inStock } = product
    const isOutOfStock = !inStock;

    return (
        <div className={`product-card ${isOutOfStock ? 'product-card--out-of-stock':''}`}>
            <div className="product-card__header">
                <h3 className="product-card__name">{name}</h3>
                <span className={`product-card__stock-badge ${isOutOfStock ? 'badge--out': 'badge--in'}`}>
                    {isOutOfStock ? 'Out of Stock' : `In stock`}
                </span>
            </div>

            {description && (
                <p className="product-card__description">{description}</p>
            )}
            <div className="product-card__footer">
                <span className="product-card__price">
                    ${price.toFixed(2)}
                </span>
                <div className="product-card__actions">
                    <button className="btn btn--secondary" onClick={() => onEdit && onEdit(product)}>
                        Edit
                    </button>
                    <button className="btn btn--danger" onClick={() => onDelete && onDelete(product._id)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard