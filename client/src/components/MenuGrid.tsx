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
  // legacy — in case old items exist
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

// All category keys except 'all'
const ALL_CATS = CATEGORIES.filter(c => c.key !== 'all').map(c => c.key)

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
        const items = menuItems.filter(i => i.category === cat)
        if (!items.length) return null
        return (
          <div key={cat} className={styles.categoryBlock}>
            <h3 className={styles.catTitle}>
              {CAT_LABELS[cat] ?? cat}
            </h3>
            <div className={styles.grid}>
              {items.map((item: MenuItem, idx: number) => (
                <div className={styles.card} key={item.id ?? idx}>
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
                  <div className={styles.cardBody}>
                    <div className={styles.cardName}>{item.name}</div>
                    {item.description && (
                      <div className={styles.cardDesc}>{item.description}</div>
                    )}
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
