// client/src/components/AuthForms.jsx
// Purpose: Toggles between LoginForm and SignupForm.
// "mode" state lives HERE — this is the Q2 answer in code.
// Nothing outside this component tree needs to know which form is showing.

import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

function AuthForms() {
  const [mode, setMode] = useState('login')  // 'login' | 'signup'

  return (
    <div className="auth-page">
      {mode === 'login' ? <LoginForm /> : <SignupForm />}

      <p className="auth-toggle">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button type="button" onClick={() => setMode('signup')}>
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('login')}>
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  )
}

export default AuthForms