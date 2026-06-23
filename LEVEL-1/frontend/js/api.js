const API_BASE_URL = 'http://localhost:5000/api/products';

async function handleResponse(response) {
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || 'Something went wrong');
  }

  return body;
}

export async function fetchProducts() {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
}

export async function createProduct(productData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}