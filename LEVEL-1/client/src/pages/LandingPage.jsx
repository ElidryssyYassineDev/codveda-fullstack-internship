import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, ShieldCheck, LayoutDashboard } from 'lucide-react'

function TallyMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 3v14M8 3v14M12 3v14" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 13l14-8" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LandingPage() {
  const { currentUser } = useAuth()
  if (currentUser) return <Navigate to="/dashboard" replace />

  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__brand">
          <TallyMark />
          <span>Tally</span>
        </div>
        <div className="landing__nav-actions">
          <Link to="/login" className="btn btn--secondary">Sign in</Link>
          <Link to="/signup" className="btn btn--primary">Get started</Link>
        </div>
      </header>

      <section className="landing__hero">
        <h1>Inventory that counts itself</h1>
        <p>
          Real-time stock tracking, role-based access, and a live view your
          whole team shares — the moment something changes, everyone sees it.
        </p>
        <div className="landing__cta">
          <Link to="/signup" className="btn btn--primary btn--lg">Get started</Link>
          <Link to="/login" className="btn btn--secondary btn--lg">Sign in</Link>
        </div>

        <div className="landing__preview" aria-hidden="true">
          <div className="landing__preview-card">
            <span className="stat-card__label">Total products</span>
            <span className="stat-card__value">128</span>
          </div>
          <div className="landing__preview-card">
            <span className="stat-card__label">In stock</span>
            <span className="stat-card__value">94%</span>
          </div>
          <div className="landing__preview-card stat-card--warn">
            <span className="stat-card__label">Low stock</span>
            <span className="stat-card__value">6</span>
          </div>
        </div>
      </section>

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
  )
}

export default LandingPage


