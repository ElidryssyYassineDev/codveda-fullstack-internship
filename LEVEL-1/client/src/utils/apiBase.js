// client/src/utils/apiBase.js
// Empty string locally → fetch('' + '/api/products') = '/api/products'
// → still hits the Vite proxy exactly as it always has.
// A real URL in production → becomes an absolute request to the
// deployed backend, since no proxy exists there.

export const API_BASE_URL = import.meta.env.VITE_API_URL || ''