import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../store/uiStore'
import styles from './Hero.module.css'

export default function Hero() {
  const navigate = useNavigate()
  const { openWifiModal } = useUIStore()

  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.bgGrid} />

      <div className={styles.content}>

        {/* ── LOGO ── */}
        <div className={styles.logoWrap}>
          <img
            src="/logo.svg"
            alt="Black Stars Lounge & Club"
            className={styles.logo}
          />
        </div>

        <p className={styles.eyebrow}>Nairobi's Premier Nightlife Destination</p>

        <p className={styles.sub}>Premium nightlife experience</p>

        <div className={styles.ctaGroup}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate('/menu')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h12" />
            </svg>
            View Menu
          </button>

          <button className={styles.btnSecondary} onClick={openWifiModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
            </svg>
            Connect to Free WiFi
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <div className={styles.scrollDot} />
      </div>
    </section>
  )
}
