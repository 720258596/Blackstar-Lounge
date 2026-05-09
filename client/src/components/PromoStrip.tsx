import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'
import type { Promotion } from '../services/api'
import { fetchActivePromotions } from '../services/api'
import styles from './PromoStrip.module.css'

export default function PromoStrip() {
  const { promotions, setPromotions } = useUIStore()

  useEffect(() => {
    fetchActivePromotions()
      .then(setPromotions)
      .catch(() => {})
  }, [setPromotions])

  const doubled = [...promotions, ...promotions]

  return (
    <div className={styles.strip}>
      <div className={styles.track}>
        {doubled.map((item: Promotion, i: number) => (
          <div className={styles.item} key={i}>
            <div className={styles.dot} />
            <span className={styles.highlight}>{item.title}</span>
            &nbsp;—&nbsp;{item.detail}
          </div>
        ))}
      </div>
    </div>
  )
}
