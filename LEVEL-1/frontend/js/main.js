import './theme.js';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from './api.js';

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const statusMessage = document.getElementById('status-message');

let currentProducts = [];
let editingId = null;

function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';
  if (type) {
    statusMessage.classList.add(type);
  }
}

function resetFormState() {
  editingId = null;
  productForm.reset();
  submitBtn.textContent = 'Add product';
  cancelBtn.hidden = true;
}

function startEdit(product) {
  editingId = product._id;
  productForm.elements.name.value = product.name;
  productForm.elements.price.value = product.price;
  productForm.elements.description.value = product.description || '';
  productForm.elements.inStock.checked = product.inStock;

  submitBtn.textContent = 'Update product';
  cancelBtn.hidden = false;
  productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.id = product._id;

  const top = document.createElement('div');
  top.className = 'product-card-top';

  const name = document.createElement('h3');
  name.className = 'product-name';
  name.textContent = product.name;

  const price = document.createElement('span');
  price.className = 'product-price';
  price.textContent = `$${product.price.toFixed(2)}`;

  top.append(name, price);
  card.appendChild(top);

  if (product.description) {
    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description;
    card.appendChild(description);
  }

  const meta = document.createElement('div');
  meta.className = 'product-meta';

  const badge = document.createElement('span');
  badge.className = `stock-badge ${product.inStock ? 'stock-badge--in' : 'stock-badge--out'}`;
  badge.textContent = product.inStock ? 'In stock' : 'Out of stock';

  const actions = document.createElement('div');
  actions.className = 'product-actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.dataset.action = 'edit';
  editBtn.textContent = 'Edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn-danger';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.textContent = 'Delete';

  actions.append(editBtn, deleteBtn);
  meta.append(badge, actions);
  card.appendChild(meta);

  return card;
}

function renderProducts(products) {
  currentProducts = products;
  productList.innerHTML = '';

  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'placeholder';
    empty.textContent = 'No products yet — add one to get started.';
    productList.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    productList.appendChild(createProductCard(product));
  });
}

async function loadProducts() {
  try {
    const { data } = await fetchProducts();
    renderProducts(data);
  } catch (error) {
    productList.innerHTML = '';
    showStatus(error.message, 'error');
  }
}

async function handleDelete(id) {
  const confirmed = confirm('Delete this product? This cannot be undone.');
  if (!confirmed) return;

  try {
    await deleteProduct(id);
    showStatus('Product deleted.', 'success');
    if (editingId === id) {
      resetFormState();
    }
    await loadProducts();
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

// Event delegation: one listener on the container, not one per button
productList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const card = button.closest('.product-card');
  const id = card.dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') {
    handleDelete(id);
  } else if (action === 'edit') {
    const product = currentProducts.find((p) => p._id === id);
    if (product) startEdit(product);
  }
});

cancelBtn.addEventListener('click', resetFormState);

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(productForm);
  const productData = {
    name: formData.get('name').trim(),
    price: parseFloat(formData.get('price')),
    description: formData.get('description').trim(),
    inStock: formData.get('inStock') === 'on',
  };

  submitBtn.disabled = true;
  showStatus(editingId ? 'Updating…' : 'Saving…');

  try {
    if (editingId) {
      await updateProduct(editingId, productData);
      showStatus('Product updated.', 'success');
    } else {
      await createProduct(productData);
      showStatus('Product added.', 'success');
    }
    resetFormState();
    await loadProducts();
  } catch (error) {
    showStatus(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

loadProducts();