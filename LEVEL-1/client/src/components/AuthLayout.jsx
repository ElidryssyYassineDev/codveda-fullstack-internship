// client/src/components/AuthLayout.jsx
// Purpose: shared split-screen shell for Login and Signup. children
// is whichever form (+ toggle link) AuthForms decides to render —
// this component only owns the visual frame around it.

function TallyMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 3v14M8 3v14M12 3v14" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 13l14-8" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card-col">
        <div className="auth-layout__card">
          <div className="auth-layout__logo">
            <TallyMark />
            <span>Tally</span>
          </div>
          {children}
        </div>
      </div>

      <div className="auth-layout__brand-col" aria-hidden="true">
        <div className="auth-chip auth-chip--a">
          <span className="auth-chip__tick" /> Wireless Mouse added
        </div>
        <div className="auth-chip auth-chip--b">
          <span className="auth-chip__tick auth-chip__tick--warn" /> Standing Desk low stock
        </div>
        <h2>See your stock,<br />the moment it moves.</h2>
        <p>Every teammate sees the same numbers, the instant they change — no refresh, no waiting.</p>
      </div>
    </div>
  )
}

export default AuthLayout