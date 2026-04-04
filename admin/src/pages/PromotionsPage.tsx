import { useState, useEffect } from 'react'
import { useAdminStore } from '../store/adminStore'
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '../services/api'
import DataTable, { Column } from '../components/DataTable'
import Modal from '../components/Modal'
import styles from './MenuPage.module.css'

interface Promotion {
  id: string
  title: string
  detail: string
  isActive: boolean
}

export default function PromotionsPage() {
  const { admin, promotions, setPromotions, showToast } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [isModal, setIsModal] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)
  const [form, setForm] = useState({ title: '', detail: '' })

  useEffect(() => {
    loadPromotions()
  }, [])

  async function loadPromotions() {
    if (!admin) return
    try {
      const items = await getPromotions(admin.token)
      setPromotions(items)
    } catch (err) {
      showToast('Failed to load promotions', 'error')
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditing(null)
    setForm({ title: '', detail: '' })
    setIsModal(true)
  }

  function openEdit(item: Promotion) {
    setEditing(item)
    setForm(item)
    setIsModal(true)
  }

  async function handleSubmit() {
    if (!admin || !form.title || !form.detail) {
      showToast('Fill all fields', 'error')
      return
    }

    try {
      if (editing) {
        await updatePromotion(admin.token, editing.id, form)
        showToast('Promotion updated', 'success')
      } else {
        await createPromotion(admin.token, form)
        showToast('Promotion created', 'success')
      }
      setIsModal(false)
      await loadPromotions()
    } catch (err) {
      showToast('Operation failed', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!admin || !window.confirm('Delete this promotion?')) return
    try {
      await deletePromotion(admin.token, id)
      showToast('Promotion deleted', 'success')
      await loadPromotions()
    } catch (err) {
      showToast('Failed to delete', 'error')
    }
  }

  const columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'detail', label: 'Detail' },
    {
      key: 'isActive',
      label: 'Status',
      width: '80px',
      render: (val) => <span className={val ? 'green' : 'red'}>{val ? '✓' : '✗'}</span>,
    },
  ]

  return (
    <div className={styles.page}>
      <button className={styles.addBtn} onClick={openNew}>+ New Promotion</button>

      <DataTable
        columns={columns}
        data={promotions}
        loading={loading}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} onClick={() => openEdit(row)}>Edit</button>
            <button className={styles.actionBtn + ' ' + styles.danger} onClick={() => handleDelete(row.id)}>
              Delete
            </button>
          </>
        )}
      />

      <Modal isOpen={isModal} title={editing ? 'Edit Promotion' : 'New Promotion'} onClose={() => setIsModal(false)} actions={
        <>
          <button className={styles.btnCancel} onClick={() => setIsModal(false)}>Cancel</button>
          <button className={styles.btnSubmit} onClick={handleSubmit}>Save</button>
        </>
      }>
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label>Details *</label>
            <textarea
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
