// client/src/components/LoginForm.jsx
// Purpose: Controlled login form. On success, hands off to AuthContext.

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function LoginForm() {
  const { login } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]       = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.message || `Server error ${res.status}`)
      }

      // One call — updates global auth state, App re-renders automatically
      login(responseData.token, responseData.data)

    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3 className="form__title">Welcome back</h3>

      {error && <div className="form__error">{error}</div>}

      <div className="form__group">
        <label className="form__label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          className="form__input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          className="form__input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn--primary form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  )
}

export default LoginForm