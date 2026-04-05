import { useState, useEffect } from 'react'
import { useAdminStore } from '../store/adminStore'
import { getCustomers } from '../services/api'
import styles from './DashboardPage.module.css'

interface Stats {
  totalCustomers: number
  todayCustomers: number
  thisWeekCustomers: number
}

export default function DashboardPage() {
  const { admin } = useAdminStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    if (!admin) return
    try {
      const res = await getCustomers(admin.token)

      // ✅ FIXED (res is array)
      setStats({
        totalCustomers: res.length || 0,
        todayCustomers: 0,     // backend not providing yet
        thisWeekCustomers: 0,  // backend not providing yet
      })

    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total Customers</div>
          <div className={styles.cardValue}>{loading ? '—' : stats?.totalCustomers || 0}</div>
          <div className={styles.cardSub}>all time</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Today</div>
          <div className={styles.cardValue}>{loading ? '—' : stats?.todayCustomers || 0}</div>
          <div className={styles.cardSub}>new signups</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>This Week</div>
          <div className={styles.cardValue}>{loading ? '—' : stats?.thisWeekCustomers || 0}</div>
          <div className={styles.cardSub}>new customers</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Status</div>
          <div className={styles.cardValue} style={{ color: 'var(--green)' }}>✓</div>
          <div className={styles.cardSub}>operational</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Quick Actions</h2>
        <div className={styles.actions}>
          <a href="/menu" className={styles.actionBtn}>🍽 Manage Menu</a>
          <a href="/events" className={styles.actionBtn}>★ Manage Events</a>
          <a href="/promotions" className={styles.actionBtn}>◆ Manage Promotions</a>
          <a href="/customers" className={styles.actionBtn}>◉ View Customers</a>
        </div>
      </div>
    </div>
  )
}