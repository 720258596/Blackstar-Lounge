import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'
import { adminLogin } from '../services/api'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAdmin, showToast } = useAdminStore()
  const [email, setEmail] = useState('klisandru@gmail.com')
  const [password, setPassword] = useState('Kelly123')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { token, email: adminEmail } = await adminLogin(email, password)
      setAdmin({ email: adminEmail, token })
      showToast('Login successful', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast('Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.mark}>★</div>
          <h1 className={styles.title}>Black Star Lounge</h1>
          <p className={styles.subtitle}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className={styles.hint}>Demo: use the credentials provided</p>
      </div>
    </div>
  )
}
