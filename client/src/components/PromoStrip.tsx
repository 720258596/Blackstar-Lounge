import { useEffect } from 'react'
import { useUIStore, FALLBACK_PROMOS } from '../store/uiStore'
import { fetchActivePromotions } from '../services/api'
import styles from './PromoStrip.module.css'

export default function PromoStrip() {
  const { promotions, setPromotions } = useUIStore()

  useEffect(() => {
    fetchActivePromotions()
      .then(setPromotions)
      .catch(() => setPromotions(FALLBACK_PROMOS))
  }, [setPromotions])

  const items = promotions.length ? promotions : FALLBACK_PROMOS
  const doubled = [...items, ...items]

  return (
    <div className={styles.strip}>
      <div className={styles.track}>
        {doubled.map((item, i) => (
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
