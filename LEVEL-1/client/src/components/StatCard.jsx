import { motion } from 'framer-motion'

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

function StatCard({ label, value, warn = false }) {
  return (
    <motion.div className={`stat-card ${warn ? 'stat-card--warn' : ''}`} variants={item}>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </motion.div>
  )
}

export default StatCard