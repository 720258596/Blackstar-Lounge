import { useNavigate } from 'react-router-dom'
import styles from './SuccessPage.module.css'

export default function SuccessPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.ring}>
        <div className={styles.pulse} />
        <span className={styles.check}>★</span>
      </div>

      <h2 className={styles.title}>You're In</h2>

      <p className={styles.sub}>
        WiFi access granted. Welcome to
        <br />
        Black Star Lounge.
      </p>

      <div className={styles.badge}>
        <div className={styles.dot} />
        Connected to BSL_Guest
      </div>

      <p className={styles.note}>
        Stay tuned for exclusive offers and upcoming events sent to your email
      </p>

      <button className={styles.backBtn} onClick={() => navigate('/menu')}>
        Back to Menu
      </button>
    </div>
  )
}
