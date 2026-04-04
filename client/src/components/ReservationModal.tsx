import { useState } from 'react'
import { useUIStore } from '../store/uiStore'
import { submitReservation } from '../services/api'
import styles from './ReservationModal.module.css'

interface Props {
  isOpen: boolean
  eventId?: string
  eventTitle?: string
  onClose: () => void
}

export default function ReservationModal({ isOpen, eventId, eventTitle, onClose }: Props) {
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    partySize: '1',
  })
  const [loading, setLoading] = useState(false)
  const { showToast } = useUIStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!eventId) return

    setLoading(true)
    try {
      await submitReservation({
        eventId,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        partySize: parseInt(form.partySize),
      })
      
      showToast('Reservation submitted! We\'ll confirm shortly.', 'success')
      setForm({ guestName: '', guestEmail: '', guestPhone: '', partySize: '1' })
      onClose()
    } catch (err) {
      showToast('Failed to submit reservation', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>

        <h2 className={styles.title}>Reserve Your Spot</h2>
        {eventTitle && <p className={styles.eventName}>{eventTitle}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              required
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              required
              value={form.guestEmail}
              onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              required
              value={form.guestPhone}
              onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="partysize">Party Size *</label>
            <select
              id="partysize"
              value={form.partySize}
              onChange={(e) => setForm({ ...form, partySize: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Reserve Now'}
            </button>
          </div>
        </form>

        <p className={styles.disclaimer}>
          We'll confirm your reservation via email shortly
        </p>
      </div>
    </div>
  )
}
