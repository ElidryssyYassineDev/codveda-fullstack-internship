import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import AuthLayout from './AuthLayout'

function AuthForms({ mode }) {
  return (
    <AuthLayout>
      {mode === 'login' ? <LoginForm /> : <SignupForm />}
      <p className="auth-toggle">
        {mode === 'login' ? (
          <>Don't have an account? <Link to="/signup">Sign up</Link></>
        ) : (
          <>Already have an account? <Link to="/login">Log in</Link></>
        )}
      </p>
    </AuthLayout>
  )
}

export default AuthForms