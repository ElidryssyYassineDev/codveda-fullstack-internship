// client/src/components/SignupForm.jsx
// Purpose: Controlled signup form.
// Backend issues a token identical in shape to login's — calling
// login() here immediately authenticates the new user. No separate
// login step needed (this is the Q4 correction, now in code).

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SignupForm() {
  const { login } = useAuth()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]       = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.message || `Server error ${res.status}`)
      }

      login(responseData.token, responseData.data)

    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3 className="form__title">Sign Up</h3>

      {error && <div className="form__error">{error}</div>}

      <div className="form__group">
        <label className="form__label" htmlFor="signup-name">Name</label>
        <input
          id="signup-name"
          type="text"
          className="form__input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          className="form__input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          className="form__input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn--primary form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}

export default SignupForm