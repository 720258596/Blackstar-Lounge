import { useState, useEffect } from 'react'
import { useAdminStore } from '../store/adminStore'
import { getEvents } from '../services/api'
import { getReservations, deleteReservation } from '../services/api'
import DataTable, { Column } from '../components/DataTable'
import styles from './MenuPage.module.css'

interface Reservation {
  id: string
  eventId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  partySize: number
  reservedAt: string
}

export default function ReservationsPage() {
  const { admin, events, setEvents, showToast } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [loadingReservations, setLoadingReservations] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    if (!admin) return
    try {
      const data = await getEvents(admin.token)
      setEvents(data)
      if (data.length > 0) {
        setSelectedEventId(data[0].id)
        await loadReservationsForEvent(data[0].id)
      }
    } catch (err) {
      showToast('Failed to load events', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loadReservationsForEvent(eventId: string) {
    if (!admin || !eventId) return
    setLoadingReservations(true)
    try {
      const data = await getReservations(admin.token, eventId)
      setReservations(data)
    } catch (err) {
      showToast('Failed to load reservations', 'error')
      setReservations([])
    } finally {
      setLoadingReservations(false)
    }
  }

  function handleEventChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const eventId = e.target.value
    setSelectedEventId(eventId)
    loadReservationsForEvent(eventId)
  }

  async function handleDelete(id: string) {
    if (!admin || !window.confirm('Cancel this reservation?')) return
    try {
      await deleteReservation(admin.token, id)
      showToast('Reservation cancelled', 'success')
      if (selectedEventId) {
        await loadReservationsForEvent(selectedEventId)
      }
    } catch (err) {
      showToast('Failed to cancel reservation', 'error')
    }
  }

  const columns: Column[] = [
    { key: 'guestName', label: 'Guest Name' },
    { key: 'guestEmail', label: 'Email', width: '200px' },
    { key: 'guestPhone', label: 'Phone', width: '140px' },
    {
      key: 'partySize',
      label: 'Party Size',
      width: '100px',
      render: (val) => `${val} guest${val !== 1 ? 's' : ''}`,
    },
    {
      key: 'reservedAt',
      label: 'Reserved',
      width: '160px',
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ]

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gold)' }}>
          Filter by Event:
        </label>
        <select
          value={selectedEventId}
          onChange={handleEventChange}
          style={{
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
            borderRadius: '0.5rem',
            color: 'var(--white)',
            fontSize: '0.95rem',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <option value="">Select an event...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} {event.date ? `(${new Date(event.date).toLocaleDateString()})` : ''}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={reservations}
        loading={loading || loadingReservations}
        actions={(row) => (
          <button
            className={styles.actionBtn + ' ' + styles.danger}
            onClick={() => handleDelete(row.id)}
          >
            Cancel
          </button>
        )}
      />

      {reservations.length === 0 && !loading && !loadingReservations && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(245, 242, 236, 0.5)' }}>
          No reservations for this event
        </div>
      )}
    </div>
  )
}
