import { useState, useEffect } from 'react'
import { useAdminStore } from '../store/adminStore'
import { getEvents, createEvent, updateEvent, deleteEvent, uploadEventPoster } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import DataTable, { Column } from '../components/DataTable'
import Modal from '../components/Modal'
import styles from './MenuPage.module.css'

interface Event {
  id: string
  title: string
  description?: string
  date?: string
  posterUrl?: string
  isActive: boolean
}

export default function EventsPage() {
  const { admin, events, setEvents, showToast } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [isModal, setIsModal] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState({ title: '', description: '', date: '', posterUrl: '' })

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    if (!admin) return
    try {
      const items = await getEvents(admin.token)
      setEvents(items)
    } catch (err) {
      showToast('Failed to load events', 'error')
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditing(null)
    setForm({ title: '', description: '', date: '', posterUrl: '' })
    setIsModal(true)
  }

  function openEdit(item: Event) {
    setEditing(item)
    setForm(item)
    setIsModal(true)
  }

  async function handleSubmit() {
    if (!admin || !form.title) {
      showToast('Fill required fields', 'error')
      return
    }

    try {
      if (editing) {
        await updateEvent(admin.token, editing.id, form)
        showToast('Event updated', 'success')
      } else {
        await createEvent(admin.token, form)
        showToast('Event created', 'success')
      }
      setIsModal(false)
      await loadEvents()
    } catch (err) {
      showToast('Operation failed', 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!admin || !window.confirm('Delete this event?')) return
    try {
      await deleteEvent(admin.token, id)
      showToast('Event deleted', 'success')
      await loadEvents()
    } catch (err) {
      showToast('Failed to delete', 'error')
    }
  }

  const columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'date',
      label: 'Date',
      width: '150px',
      render: (val) => val ? new Date(val).toLocaleDateString() : '—',
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
      <button className={styles.addBtn} onClick={openNew}>+ New Event</button>

      <DataTable
        columns={columns}
        data={events}
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

      <Modal isOpen={isModal} title={editing ? 'Edit Event' : 'New Event'} onClose={() => setIsModal(false)} actions={
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
            <label>Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label>Date</label>
            <input
              type="date"
              value={form.date ? form.date.split('T')[0] : ''}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label>Event Poster</label>
            <ImageUpload 
              currentUrl={form.posterUrl} 
              onUploaded={(url) => setForm({ ...form, posterUrl: url })}
              endpoint="/admin/events/upload-poster"
              fieldName="poster"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
