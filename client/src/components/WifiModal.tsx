import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../store/uiStore'
import { initiateGoogleAuth } from '../services/api'
import styles from './WifiModal.module.css'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function WifiModal() {
  const { wifiModalOpen, closeWifiModal, showToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
      if (isDemoMode) {
        // Simulate OAuth round-trip in demo/dev
        await new Promise<void>((r) => setTimeout(r, 1800))
        closeWifiModal()
        setTimeout(() => navigate('/success'), 300)
      } else {
        // Real OAuth: redirect to backend → Google → callback
        initiateGoogleAuth()
      }
    } catch {
      showToast('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeWifiModal()
  }

  return (
    <div
      className={`${styles.overlay} ${wifiModalOpen ? styles.open : ''}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-label="WiFi sign-in"
    >
      <div className={styles.sheet}>
        <button className={styles.close} onClick={closeWifiModal} aria-label="Close">
          ✕
        </button>

        <div className={styles.icon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
        </div>

        <h3 className={styles.title}>Get Free WiFi</h3>
        <p className={styles.sub}>
          Connect instantly and stay updated with
          <br />
          <em>exclusive events & offers</em>
        </p>

        <button
          className={styles.btnGoogle}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Connecting...
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <p className={styles.disclaimer}>
          By connecting you agree to receive promotional updates from Black Star Lounge
        </p>
      </div>
    </div>
  )
}
