import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'
import type { MenuItem } from '../services/api'
import { fetchMenuItems } from '../services/api'
import styles from './MenuGrid.module.css'
import { CATEGORIES } from './CategoryTabs'

const CAT_LABELS: Record<string, string> = {
  whiskey:   'Whiskey',
  gin:       'Gin & Spirits',
  cognac:    'Cognac & Brandy',
  vodka:     'Vodka',
  tequila:   'Tequila',
  rum:       'Rum & Liqueur',
  champagne: 'Champagne & Sparkling',
  cocktails: 'Cocktails',
  shooters:  'Shooter Cocktails',
  food:      'Food',
  drinks:    'Drinks',
}

const CAT_EMOJI: Record<string, string> = {
  whiskey:   '🥃',
  gin:       '🍸',
  cognac:    '🥂',
  vodka:     '🍾',
  tequila:   '🌵',
  rum:       '🍹',
  champagne: '🍾',
  cocktails: '🍹',
  shooters:  '🎯',
  food:      '🍽️',
  drinks:    '🥃',
}

const ALL_CATS = CATEGORIES.filter(c => c.key !== 'all').map(c => c.key)

/**
 * Splits "Shot KSh 450 | Bottle KSh 9,800" into two lines.
 * Returns [primary, secondary?] — secondary is undefined for single prices.
 */
function parsePrice(price: string): [string, string?] {
  if (price.includes('|')) {
    const parts = price.split('|').map(p => p.trim())
    return [parts[0], parts[1]]
  }
  return [price]
}

export default function MenuGrid() {
  const { menuItems, setMenuItems, currentCategory } = useUIStore()

  useEffect(() => {
    if (menuItems.length) return
    fetchMenuItems()
      .then(setMenuItems)
      .catch(() => {})
  }, [menuItems.length, setMenuItems])

  const cats = currentCategory === 'all'
    ? ALL_CATS
    : [currentCategory]

  return (
    <div className={styles.section}>
      {cats.map((cat: string) => {
        const items = menuItems.filter((i: MenuItem) => i.category === cat)
        if (!items.length) return null

        return (
          <div key={cat} className={styles.categoryBlock}>
            <h3 className={styles.catTitle}>
              {CAT_LABELS[cat] ?? cat}
            </h3>

            <div className={styles.grid}>
              {items.map((item: MenuItem, idx: number) => {
                const [primary, secondary] = parsePrice(item.price)

                return (
                  <div className={styles.card} key={item.id ?? idx}>

                    {/* ── Image or emoji ── */}
                    <div className={styles.cardImgWrap}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          className={styles.cardImg}
                        />
                      ) : (
                        <span className={styles.cardEmoji}>
                          {CAT_EMOJI[item.category] ?? '🥂'}
                        </span>
                      )}
                    </div>

                    {/* ── Name + description ── */}
                    <div className={styles.cardBody}>
                      <div className={styles.cardName}>{item.name}</div>
                      {item.description && (
                        <div className={styles.cardDesc}>{item.description}</div>
                      )}
                    </div>

                    {/* ── Price ── */}
                    <div className={styles.cardPriceBlock}>
                      {secondary ? (
                        <>
                          <span className={styles.cardPriceLine}>{primary}</span>
                          <span className={`${styles.cardPriceLine} ${styles.secondary}`}>
                            {secondary}
                          </span>
                        </>
                      ) : (
                        <span className={styles.cardPriceSingle}>{primary}</span>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
