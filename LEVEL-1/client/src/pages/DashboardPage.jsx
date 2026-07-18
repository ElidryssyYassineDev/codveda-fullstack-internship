import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useProducts } from '../context/ProductsContext'
import { useActivity } from '../context/ActivityContext'
import useCountUp from '../hooks/useCountUp'
import StatCard from '../components/StatCard'
import RecentProductRow from '../components/RecentProductRow'
import { motion } from 'framer-motion'

const statsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getMonthlyData(products) {
  const buckets = {}
  products.forEach(p => {
    const date = new Date(p.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    buckets[key] = (buckets[key] || 0) + 1
  })
  return Object.keys(buckets).sort().map(key => {
    const [year, month] = key.split('-')
    const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'short' })
    return { month: label, count: buckets[key] }
  })
}

function formatRelativeTime(timestamp) {
  const diffMin = Math.floor((Date.now() - timestamp) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
})

function DashboardPage() {
  const { currentUser } = useAuth()
  const { isDarkMode } = useTheme()
  const { products, isLoading } = useProducts()
  const { activity } = useActivity()

  // Resolved via JS rather than passed as fill="var(--color-accent)"
  // directly — reading the actual computed value avoids any ambiguity
  // about CSS custom properties inside SVG presentation attributes,
  // and re-runs whenever the theme flips.
  const [accentColor, setAccentColor] = useState('#F59E0B')
  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
    if (resolved) setAccentColor(resolved)
  }, [isDarkMode])

  // useMemo: only recomputes when `products` actually changes, not on
  // every render — the same instinct as useEffect's dependency array,
  // applied to a plain calculation instead of a side effect.
  const stats = useMemo(() => {
    const total = products.length
    const inStockCount = products.filter(p => p.inStock).length
    const outOfStockCount = total - inStockCount
    const inStockPercent = total === 0 ? 0 : Math.round((inStockCount / total) * 100)
    const inventoryValue = products.filter(p => p.inStock).reduce((sum, p) => sum + p.price, 0)
    return { total, inStockPercent, outOfStockCount, inventoryValue }
  }, [products])

  const monthlyData = useMemo(() => getMonthlyData(products), [products])

  const animatedTotal = useCountUp(stats.total)
  const animatedInStockPercent = useCountUp(stats.inStockPercent)
  const animatedOutOfStock = useCountUp(stats.outOfStockCount)
  // Inventory value isn't animated — compact currency notation
  // ("$1K" → "$5K"...) reformats its own suffix mid-count, which reads
  // as glitchy rather than satisfying. Static value instead.

  const recentProducts = useMemo(() => {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
  }, [products])

  if (isLoading) return <p>Loading dashboard...</p>

  return (
    <div className="dashboard">
      <div className="dashboard__greeting">
        <h1>{getGreeting()}, {currentUser.name}</h1>
        <p>Here's what's happening across your inventory.</p>
      </div>

      <motion.div className="stats-row" variants={statsContainer} initial="hidden" animate="show">
        <StatCard label="Total products" value={animatedTotal} />
        <StatCard label="In stock" value={`${animatedInStockPercent}%`} />
        <StatCard label="Out of stock" value={animatedOutOfStock} warn={stats.outOfStockCount > 0} />
        <StatCard label="Inventory value" value={currencyFormatter.format(stats.inventoryValue)} />
      </motion.div>

      <div className="dashboard__row">
        <div className="panel">
          <h3>Products added by month</h3>
          {monthlyData.length === 0 ? (
            <p className="panel__empty">Not enough data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip cursor={{ fill: 'var(--color-accent-soft)' }} />
                <Bar dataKey="count" fill={accentColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel">
          <h3>Recent activity</h3>
          {activity.length === 0 ? (
            <p className="panel__empty">Activity will appear here as it happens.</p>
          ) : (
            <div className="activity-feed">
              {activity.map(entry => (
                <div className="activity-feed__item" key={entry.id}>
                  <span className={`activity-tick activity-tick--${entry.type}`} aria-hidden="true" />
                  <div><p>{entry.message}</p><time>{formatRelativeTime(entry.timestamp)}</time></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="section-label">Recent products</h3>
        {recentProducts.length === 0 ? (
          <p className="panel__empty">No products yet.</p>
        ) : (
          <div className="recent-products">
            {recentProducts.map(product => (
              <RecentProductRow key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage