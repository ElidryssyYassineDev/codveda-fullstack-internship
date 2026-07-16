// client/src/components/StatCard.jsx
function StatCard({ label, value, warn = false }) {
  return (
    <div className={`stat-card ${warn ? 'stat-card--warn' : ''}`}>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </div>
  )
}

export default StatCard