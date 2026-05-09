import { useState, useEffect } from 'react'
import { useUIStore } from '../store/uiStore'
import type { Event } from '../services/api'
import { fetchActiveEvents } from '../services/api'
import ReservationModal from './ReservationModal'
import styles from './EventsSection.module.css'

export default function EventsSection() {
  const { events, setEvents } = useUIStore()
  const [fetchFailed, setFetchFailed]         = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>()
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | undefined>()
  const [showReservation, setShowReservation] = useState(false)

  useEffect(() => {
    fetchActiveEvents()
      .then((data) => { setEvents(data); setFetchFailed(false) })
      .catch(() => { setFetchFailed(true) })
  }, [setEvents])

  const items = events

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
          {items.map((event: Event, i: number) => (
            <div
              className={styles.card}
              key={event.id ?? i}
              onClick={() => openReservation(event.id || '', event.title)}
            >
              {/* ── POSTER — dominant visual ── */}
              {event.posterUrl ? (
                <div className={styles.posterContainer}>
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className={styles.poster}
                    loading="lazy"
                  />
                  {/* Date badge overlaid on poster */}
                  {event.date && (
                    <div className={styles.dateBadge}>{event.date}</div>
                  )}
                </div>
              ) : (
                <div className={styles.noPoster}>
                  <div className={styles.noPosterStar}>★</div>
                  <div className={styles.noPosterLabel}>Event</div>
                  {event.date && (
                    <div className={styles.dateBadge}
                      style={{ position: 'relative', top: 'unset', left: 'unset' }}
                    >
                      {event.date}
                    </div>
                  )}
                </div>
              )}

              {/* ── CONTENT below poster ── */}
              <div className={styles.content}>
                {/* Only show date here if no poster (poster has badge) */}
                {!event.posterUrl && event.date && (
                  <div className={styles.date}>{event.date}</div>
                )}
                {event.posterUrl && event.date && (
                  <div className={styles.date}>{event.date}</div>
                )}
                <div className={styles.name}>{event.title}</div>
                {event.description && (
                  <div className={styles.desc}>{event.description}</div>
                )}
                <button
                  className={styles.reserveBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    openReservation(event.id || '', event.title)
                  }}
                >
                  Reserve a Spot
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
