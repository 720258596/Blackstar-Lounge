import { useEffect } from 'react'
import { useUIStore, FALLBACK_MENU } from '../store/uiStore'
import { fetchMenuItems } from '../services/api'
import styles from './MenuGrid.module.css'

const EMOJI: Record<string, string> = { drinks: '🥃', cocktails: '🍹', food: '🍽️' }
const ALL_CATS = ['drinks', 'cocktails', 'food'] as const

export default function MenuGrid() {
  const { menuItems, setMenuItems, currentCategory } = useUIStore()

  useEffect(() => {
    if (menuItems.length) return
    fetchMenuItems()
      .then(setMenuItems)
      .catch(() => setMenuItems(FALLBACK_MENU))
  }, [menuItems.length, setMenuItems])

  const source = menuItems.length ? menuItems : FALLBACK_MENU
  const cats = currentCategory === 'all' ? [...ALL_CATS] : [currentCategory]

  return (
    <div className={styles.section}>
      {cats.map((cat) => {
        const items = source.filter((i) => i.category === cat)
        if (!items.length) return null
        return (
          <div key={cat}>
            <h3 className={styles.catTitle}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </h3>
            <div className={styles.grid}>
              {items.map((item, idx) => (
                <div className={styles.card} key={item.id ?? idx}>
                  <div className={styles.cardImg}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} loading="lazy" />
                    ) : (
                      EMOJI[item.category] ?? '🍽️'
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardName}>{item.name}</div>
                    <div className={styles.cardDesc}>{item.description ?? ''}</div>
                  </div>
                  <div className={styles.cardPrice}>{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
