import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../store/uiStore'
import CategoryTabs from '../components/CategoryTabs'
import FeaturedCarousel from '../components/FeaturedCarousel'
import MenuGrid from '../components/MenuGrid'
import WifiAutoPrompt from '../components/WifiAutoPrompt'
import styles from './MenuPage.module.css'

export default function MenuPage() {
  const navigate = useNavigate()
  const { openWifiModal, showWifiPrompt, wifiPromptVisible } = useUIStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Show WiFi bubble after 20 s if not already shown
    if (wifiPromptVisible) return
    timerRef.current = setTimeout(() => showWifiPrompt(), 20_000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [showWifiPrompt, wifiPromptVisible])

  return (
    <div className={styles.page}>
      {/* ─── Sticky Nav ─── */}
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <span className={styles.backArrow}>←</span> Back
        </button>

        <div className={styles.logo}>
          Black <span>★</span> Star
        </div>

        <button className={styles.wifiBtn} onClick={openWifiModal}>
          <svg
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
          Free WiFi
        </button>
      </nav>

      {/* ─── Category Tabs ─── */}
      <CategoryTabs />

      {/* ─── Featured Carousel ─── */}
      <FeaturedCarousel />

      {/* ─── Menu Grid ─── */}
      <MenuGrid />

      {/* ─── Auto WiFi Prompt ─── */}
      <WifiAutoPrompt />

      <footer className="footer-strip">
        Black Star Lounge · Premium Nightlife Experience
      </footer>
    </div>
  )
}
