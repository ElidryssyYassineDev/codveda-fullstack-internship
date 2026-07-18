import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, ShieldCheck, LayoutDashboard } from 'lucide-react'

function TallyMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 3v14M8 3v14M12 3v14" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 13l14-8" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Real, built, tested capabilities — no third-party names, unlike the
// reference this was modeled on.
const CAPABILITIES = [
  'Real-time sync', 'Role-based access', 'Live activity feed',
  'Instant low-stock alerts', 'REST + GraphQL APIs', 'Socket-powered updates',
]

function LandingPage() {
  const { currentUser } = useAuth()
  if (currentUser) return <Navigate to="/dashboard" replace />

  return (
    <div className="landing">
      <div className="landing__frame">
        <header className="landing__nav">
          <div className="landing__brand"><TallyMark /><span>Tally</span></div>
          <div className="landing__nav-actions">
            <Link to="/login" className="landing__btn landing__btn--ghost">Sign in</Link>
            <Link to="/signup" className="landing__btn landing__btn--primary">Get started</Link>
          </div>
        </header>

        <section className="landing__hero">
          <p className="landing__kicker">Real-time inventory management</p>
          <h1>
            Inventory that<br />
            <span className="landing__accent-text">counts itself</span>
          </h1>
          <p className="landing__sub">
            Real-time stock tracking and role-based access, so every
            teammate sees the same numbers the instant they change.
          </p>
          <div className="landing__cta">
            <Link to="/signup" className="landing__btn landing__btn--primary landing__btn--lg">Get started</Link>
            <Link to="/login" className="landing__btn landing__btn--ghost landing__btn--lg">Sign in</Link>
          </div>

          {/* Illustrative only, same as the stat preview below — mirrors
              the real event types ActivityContext produces, but this is
              static demo content, not a live fetch. */}
          <div className="landing__chip landing__chip--a" aria-hidden="true">
            <span className="landing__chip-tick" /> Wireless Mouse added
          </div>
          <div className="landing__chip landing__chip--b" aria-hidden="true">
            <span className="landing__chip-tick landing__chip-tick--warn" /> Standing Desk low stock
          </div>

          <div className="landing__preview" aria-hidden="true">
            <div className="landing__preview-card">
              <span className="landing__preview-label">Total products</span>
              <span className="landing__preview-value">128</span>
            </div>
            <div className="landing__preview-card">
              <span className="landing__preview-label">In stock</span>
              <span className="landing__preview-value">94%</span>
            </div>
            <div className="landing__preview-card landing__preview-card--warn">
              <span className="landing__preview-label">Low stock</span>
              <span className="landing__preview-value">6</span>
            </div>
          </div>
        </section>

        <div className="landing__ribbon">
          <div className="landing__ribbon-track">
            {CAPABILITIES.map((cap, i) => (
              <span key={i} className="landing__ribbon-item">{cap}</span>
            ))}
          </div>
        </div>

        <section className="landing__features">
          <div className="landing__feature">
            <Zap size={20} />
            <h3>Real-time sync</h3>
            <p>See every change instantly, from any teammate's screen.</p>
          </div>
          <div className="landing__feature">
            <ShieldCheck size={20} />
            <h3>Role-based access</h3>
            <p>Admins manage stock. Everyone else stays in the loop.</p>
          </div>
          <div className="landing__feature">
            <LayoutDashboard size={20} />
            <h3>Dashboard insights</h3>
            <p>Know what's low, what's moving, and what changed today.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage