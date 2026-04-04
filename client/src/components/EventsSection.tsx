import { useState, useEffect } from 'react'
import { useUIStore, FALLBACK_EVENTS } from '../store/uiStore'
import { fetchActiveEvents } from '../services/api'
import ReservationModal from './ReservationModal'
import styles from './EventsSection.module.css'

export default function EventsSection() {
  const { events, setEvents } = useUIStore()
  const [fetchFailed, setFetchFailed] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>()
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | undefined>()
  const [showReservation, setShowReservation] = useState(false)

  useEffect(() => {
    fetchActiveEvents()
      .then((data) => {
        setEvents(data)
        setFetchFailed(false)
      })
      .catch(() => {
        setFetchFailed(true)
        setEvents(FALLBACK_EVENTS)
      })
  }, [setEvents])

  // Only show fallback if the network request actually failed
  const items = fetchFailed ? FALLBACK_EVENTS : events

  function openReservation(eventId: string, eventTitle: string) {
    setSelectedEventId(eventId)
    setSelectedEventTitle(eventTitle)
    setShowReservation(true)
  }

  if (!fetchFailed && items.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.label}>What's on</p>
        <h2 className={styles.title}>Upcoming Events</h2>
        <p style={{ color: 'rgba(245,242,236,0.45)', fontSize: '0.9rem' }}>
          No upcoming events at the moment. Check back soon.
        </p>
      </section>
    )
  }

  return (
    <>
      <section className={styles.section}>
        <p className={styles.label}>What's on</p>
        <h2 className={styles.title}>Upcoming Events</h2>
        <div className={styles.grid}>
          {items.map((event, i) => (
            <div className={styles.card} key={event.id ?? i}>
              {event.posterUrl && (
                <div className={styles.posterContainer}>
                  <img src={event.posterUrl} alt={event.title} className={styles.poster} />
                </div>
              )}
              <div className={styles.content}>
                <div className={styles.date}>{event.date ?? 'Upcoming'}</div>
                <div className={styles.name}>{event.title}</div>
                <div className={styles.desc}>{event.description ?? ''}</div>
                <button
                  className={styles.reserveBtn}
                  onClick={() => openReservation(event.id || '', event.title)}
                >
                  Reserve Spot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ReservationModal
        isOpen={showReservation}
        eventId={selectedEventId}
        eventTitle={selectedEventTitle}
        onClose={() => setShowReservation(false)}
      />
    </>
  )
}