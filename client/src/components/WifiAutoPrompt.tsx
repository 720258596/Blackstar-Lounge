import { useUIStore } from '../store/uiStore'
import styles from './WifiAutoPrompt.module.css'

export default function WifiAutoPrompt() {
  const { wifiPromptVisible, openWifiModal } = useUIStore()

  return (
    <div className={`${styles.wrap} ${wifiPromptVisible ? styles.show : ''}`}>
      <div className={styles.bubble} onClick={openWifiModal} role="button" tabIndex={0}>
        <div className={styles.title}>
          <div className={styles.pulse} />
          Free WiFi Available
        </div>
        <div className={styles.sub}>Connect instantly with your Google account</div>
      </div>
    </div>
  )
}
