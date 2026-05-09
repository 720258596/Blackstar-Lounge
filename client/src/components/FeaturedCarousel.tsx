import { useUIStore } from '../store/uiStore'
import type { MenuItem } from '../services/api'
import styles from './FeaturedCarousel.module.css'

const EMOJI: Record<string, string> = { drinks: '🥃', cocktails: '🍹', food: '🍽️' }

export default function FeaturedCarousel() {
  const { menuItems } = useUIStore()
  const featured = menuItems.filter(item => item.featured === true)

  // If admin has not marked anything featured yet, hide section entirely
  if (!featured.length) return null

  // Duplicate for seamless infinite carousel loop
  const doubled = [...featured, ...featured]

  return (
    <div className={styles.section}>
      <p className={styles.label}>★ Tonight's Specials</p>
      <div className={styles.wrap}>
        <div className={styles.track}>
          {doubled.map((item: MenuItem, i: number) => (
            <div className={styles.card} key={i}>
              <div className={styles.img}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} loading="lazy" />
                ) : (
                  <div className={styles.placeholder}>
                    {EMOJI[item.category] ?? '★'}
                  </div>
                )}
                {/* FIX 3: Hover overlay showing price + description */}
                <div className={styles.overlay}>
                  <div className={styles.overlayPrice}>{item.price}</div>
                  {item.description && (
                    <div className={styles.overlayDesc}>{item.description}</div>
                  )}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.price}>{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}