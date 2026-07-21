// client/src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { useSocket } from '../context/SocketContext'
import { useTheme } from '../context/ThemeContext'
import Skeleton from '../components/Skeleton'
import RecentProductRow from '../components/RecentProductRow'
import { API_BASE_URL } from '../utils/apiBase'

function formatMemberSince(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function ProfilePage() {
  const { currentUser, token, isAdmin, logout } = useAuth()
  const { products } = useProducts()
  const { isConnected } = useSocket()
  const { isDarkMode, toggleTheme } = useTheme()

  // The one thing currentUser never carried. Stays local to this page —
  // nothing else in the app needs createdAt, so it doesn't belong in
  // AuthContext.
  const [memberSince, setMemberSince] = useState(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    async function fetchFullProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const responseData = await res.json()
          setMemberSince(responseData.data.createdAt)
        }
      } finally {
        setIsLoadingProfile(false)
      }
    }
    fetchFullProfile()
  }, [token])

  // Derived from the SAME live array ProductsContext already keeps in
  // sync. If this admin creates a product while sitting on this exact
  // page, the count below updates on its own — no extra listener needed.
  const myProducts = products.filter(p => p.createdBy?._id === currentUser._id)

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div className="profile-header__avatar">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-header__info">
          <h1>{currentUser.name}</h1>
          <p>{currentUser.email}</p>
          <div className="profile-header__meta">
            <span className="role-badge">{currentUser.role}</span>
            {isLoadingProfile ? (
              <Skeleton width="120px" height="12px" />
            ) : memberSince ? (
              <span className="profile-header__since">Member since {formatMemberSince(memberSince)}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="dashboard__row">

        <div className="panel">
          <h3>{isAdmin ? 'Your products' : 'Your access'}</h3>
          {isAdmin ? (
            myProducts.length === 0 ? (
              <p className="panel__empty">You haven't added any products yet.</p>
            ) : (
              <>
                <p className="profile-stat">
                  {myProducts.length} product{myProducts.length === 1 ? '' : 's'}
                </p>
                <div className="profile-products-list">
                  {myProducts.slice(0, 4).map(product => (
                    <RecentProductRow key={product._id} product={product} />
                  ))}
                </div>
              </>
            )
          ) : (
            <p className="panel__empty">
              Your account can view every product in real time. Creating,
              editing, and deleting is limited to admin accounts.
            </p>
          )}
        </div>

        <div className="panel">
          <h3>Session</h3>

          <div className="profile-session-row">
            <span>Real-time sync</span>
            <span className={`connection-status ${isConnected ? 'connection-status--live' : 'connection-status--offline'}`}>
              <span className="connection-status__dot" />
              {isConnected ? 'Live' : 'Reconnecting…'}
            </span>
          </div>

          <div className="profile-session-row">
            <span>Appearance</span>
            <button className="btn btn--secondary profile-theme-btn" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              {isDarkMode ? 'Light mode' : 'Dark mode'}
            </button>
          </div>

          <button className="btn btn--danger profile-logout-btn" onClick={logout}>
            <LogOut size={14} />
            Log out
          </button>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage