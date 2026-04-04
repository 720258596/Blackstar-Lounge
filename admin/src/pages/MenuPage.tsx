import { useState, useEffect } from 'react'
import { useAdminStore } from '../store/adminStore'
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import DataTable, { Column } from '../components/DataTable'
import Modal from '../components/Modal'
import styles from './MenuPage.module.css'

interface MenuItem {
  id: string
  name: string
  category: string
  price: string
  description?: string
  imageUrl?: string
  isFeatured: boolean
  isActive: boolean
}

export default function MenuPage() {
  const { admin, menuItems, setMenuItems, showToast } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [isModal, setIsModal] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState({ name: '', category: '', price: '', description: '', imageUrl: '', isFeatured: false, isActive: true })

  useEffect(() => {
    loadMenu()
  }, [])

  async function loadMenu() {
    if (!admin) return
    try {
      const items = await getMenuItems(admin.token)
      setMenuItems(items)
    } catch (err) {
      showToast('Failed to load menu', 'error')
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditing(null)
    setForm({ name: '', category: '', price: '', description: '', imageUrl: '', isFeatured: false, isActive: true })
    setIsModal(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm(item)
    setIsModal(true)
  }

  async function handleSubmit() {
    if (!admin || !form.name || !form.category || !form.price) {
      showToast('Fill all required fields', 'error')
      return
    }

    try {
      if (editing) {
        await updateMenuItem(admin.token, editing.id, form)
        showToast('Item updated', 'success')
      } else {
        await createMenuItem(admin.token, form)
        showToast('Item created', 'success')
      }
      setIsModal(false)
      await loadMenu()
    } catch (err) {
      showToast('Operation failed', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!admin || !window.confirm('Delete this item?')) return
    try {
      await deleteMenuItem(admin.token, id)
      showToast('Item deleted', 'success')
      await loadMenu()
    } catch (err) {
      showToast('Failed to delete', 'error')
    }
  }

  const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', width: '120px' },
    { key: 'price', label: 'Price', width: '100px' },
    {
      key: 'isFeatured',
      label: 'Featured',
      width: '80px',
      render: (val) => <span className={val ? 'gold' : ''}>{val ? '★' : '◆'}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '80px',
      render: (val) => <span className={val ? 'green' : 'red'}>{val ? '✓' : '✗'}</span>,
    },
  ]

  return (
    <div className={styles.page}>
      <button className={styles.addBtn} onClick={openNew}>+ New Item</button>

      <DataTable
        columns={columns}
        data={menuItems}
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

      <Modal isOpen={isModal} title={editing ? 'Edit Item' : 'New Item'} onClose={() => setIsModal(false)} actions={
        <>
          <button className={styles.btnCancel} onClick={() => setIsModal(false)}>Cancel</button>
          <button className={styles.btnSubmit} onClick={handleSubmit}>Save</button>
        </>
      }>
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label>Category *</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label>Price *</label>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label>Image</label>
            <ImageUpload currentUrl={form.imageUrl} onUploaded={(url) => setForm({ ...form, imageUrl: url })} />
          </div>

          <div className={styles.field}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={form.isFeatured || false}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Mark as Tonight's Special (Featured)
            </label>
          </div>

          <div className={styles.field}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={form.isActive || true}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
