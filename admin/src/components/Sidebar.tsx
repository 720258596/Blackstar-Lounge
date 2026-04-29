import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  icon: '◈' },
  { to: '/menu',       label: 'Menu',        icon: '🍽' },
  { to: '/events',     label: 'Events',      icon: '★' },
  { to: '/promotions', label: 'Promotions',  icon: '◆' },
  { to: '/customers',  label: 'Customers',   icon: '◉' },
  { to: '/qr',         label: 'QR Code',     icon: '▦' },
]

export default function Sidebar() {
  const { setAdmin } = useAdminStore()
  const navigate = useNavigate()

  function logout() {
    setAdmin(null)
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoWrap}>
        <img
          src="/logo-compact.svg"
          alt="Black Stars Lounge & Club"
          className={styles.logo}
        />
        <div className={styles.adminBadge}>Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className={styles.logout} onClick={logout}>
        <span>↩</span> Logout
      </button>
    </aside>
  )
}
