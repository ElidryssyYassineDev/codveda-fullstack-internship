// Purpose: single source of truth for building authenticated request headers.
// Used by any component sending a token-protected request.

export function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}