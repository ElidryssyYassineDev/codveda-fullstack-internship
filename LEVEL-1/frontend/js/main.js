import './theme.js';
import { fetchProducts, createProduct } from './api.js';

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const submitBtn = document.getElementById('submit-btn');
const statusMessage = document.getElementById('status-message');

function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';
  if (type) {
    statusMessage.classList.add(type);
  }
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

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

  meta.appendChild(badge);
  card.appendChild(meta);

  return card;
}

function renderProducts(products) {
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
  showStatus('Saving…');

  try {
    await createProduct(productData);
    showStatus('Product added.', 'success');
    productForm.reset();
    await loadProducts();
  } catch (error) {
    showStatus(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

loadProducts();