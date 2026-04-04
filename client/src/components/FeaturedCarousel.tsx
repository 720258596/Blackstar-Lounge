import { useUIStore, FALLBACK_MENU } from '../store/uiStore'
import styles from './FeaturedCarousel.module.css'

const EMOJI: Record<string, string> = { drinks: '🥃', cocktails: '🍹', food: '🍽️' }

export default function FeaturedCarousel() {
  const { menuItems } = useUIStore()
  const source = menuItems.length ? menuItems : FALLBACK_MENU
  const featured = source
    .filter((item, i) => item.featured || i % 3 === 0)
    .slice(0, 6)
  const doubled = [...featured, ...featured]

  return (
    <div className={styles.section}>
      <p className={styles.label}>★ Tonight's Specials</p>
      <div className={styles.wrap}>
        <div className={styles.track}>
          {doubled.map((item, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.img}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} loading="lazy" />
                ) : (
                  <div className={styles.placeholder}>
                    {EMOJI[item.category] ?? '★'}
                  </div>
                )}
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
