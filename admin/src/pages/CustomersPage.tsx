import { useState, useEffect } from 'react'
import { useAdminStore } from '../store/adminStore'
import { getCustomers } from '../services/api'
import DataTable, { Column } from '../components/DataTable'
import styles from './MenuPage.module.css'

interface Customer {
  id: string
  email: string
  name?: string
  createdAt: string
}

export default function CustomersPage() {
  const { admin, showToast } = useAdminStore()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadCustomers()
  }, [page])

  async function loadCustomers() {
    if (!admin) return
    try {
      const res = await getCustomers(admin.token)

      // ✅ FIXED
      setCustomers(res || [])
      setTotal(res.length || 0)

    } catch {
      showToast('Failed to load customers') // ✅ FIXED
    } finally {
      setLoading(false)
    }
  }

  const columns: Column[] = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    {
      key: 'createdAt',
      label: 'Joined',
      width: '150px',
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ]

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '2rem', color: 'rgba(245,242,236,0.6)', fontSize: '0.9rem' }}>
        Total: {total} customers
      </div>

      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
      />

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          className={styles.actionBtn}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(245,242,236,0.5)' }}>
          Page {page}
        </div>
        <button
          className={styles.actionBtn}
          onClick={() => setPage(p => p + 1)}
          disabled={customers.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  )
}