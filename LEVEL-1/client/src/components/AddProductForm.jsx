// Purpose: Controlled form for creating a new product.
// Props:
//   onProductAdded (function, required) — called with the new product
//                   object after a successful POST. Defined in ProductList,
//                   passed down as a prop. This is the "lifting state up" pattern.


import { useState } from "react";

function AddProductForm({onProductAdded}){
  // ── Form field state ─────────────────────────────────────────────
  // Each input is controlled — React owns the value at all times.
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);

  // ── Submission state ─────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // ── Submit handler ───────────────────────────────────────────────
  async function handleSubmit(e){
    e.preventDefault();    //prevent default reload on submit
    setError(null);        //clear any previous error 
    setIsSubmitting(true); //disable button while request is in flight  

    try {
        const res = await fetch('/api/products', {
            method:'Post',
            headers:{
                'Content-Type': 'application/json',
                // Tells Express the body is JSON, not a form submission.
          // Without this header, req.body would be undefined.
            },
            body : JSON.stringify(
                {name,
                price : Number(price),
                description,
                inStock}
            ),
        })

        if (!res.ok){
            const errData = await res.json();
            throw new Error(errData.message || `Server Error ${res.status}`);
            
        }

        const responseData = await res.json();

        // Tell the parent (ProductList) about the new product.
        // ProductList will add it to its own state — no second fetch needed.
        onProductAdded(responseData.data);

        // ── Clear the form ───────────────────────────────────────────
        setName('')
        setPrice('')
        setDescription('')
        setInStock('')

    } catch (error) {
        setError(error.message)
    }
    finally{
        setIsSubmitting(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────
  return(
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3 className="form__title">Add New Product</h3>

      {/* Error message — only renders if error is non-null */}
      {error && (
        <div className="form__error">{error}</div>
      )}

      <div className="form__group">
        <label className="form__label" htmlFor="name">Product Name</label>
        {/*
          htmlFor instead of 'for' — same reason as className instead of class.
          'for' is a reserved word in JavaScript.
          htmlFor links the label to the input for accessibility.
        */}
        <input
          id="name"
          type="text"
          className="form__input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Wireless Keyboard"
          required
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="price">Price ($)</label>
        <input
          id="price"
          type="number"
          className="form__input"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="e.g. 49.99"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="form__input form__textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional product description"
          rows={3}
        />
      </div>

      <div className="form__group form__group--checkbox">
        <input
          id="inStock"
          type="checkbox"
          className="form__checkbox"
          checked={inStock}
          onChange={e => setInStock(e.target.checked)}
          // Note: checkboxes use e.target.checked not e.target.value
        />
        <label className="form__label" htmlFor="inStock">In Stock</label>
      </div>

      <button
        type="submit"
        className="btn btn--primary form__submit"
        disabled={isSubmitting}
        // Disabled during submission — prevents double-posting if
        // the user clicks twice before the response arrives.
      >
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )

}

export default AddProductForm