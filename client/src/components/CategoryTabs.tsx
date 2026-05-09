import { useUIStore } from '../store/uiStore'
import styles from './CategoryTabs.module.css'

export const CATEGORIES = [
  { key: 'all',       label: 'All' },
  { key: 'whiskey',   label: 'Whiskey' },
  { key: 'gin',       label: 'Gin & Spirits' },
  { key: 'cognac',    label: 'Cognac' },
  { key: 'vodka',     label: 'Vodka' },
  { key: 'tequila',   label: 'Tequila' },
  { key: 'rum',       label: 'Rum & Liqueur' },
  { key: 'champagne', label: 'Champagne' },
  { key: 'cocktails', label: 'Cocktails' },
  { key: 'shooters',  label: 'Shooters' },
  { key: 'food',      label: 'Food' },
] as const

export type Category = typeof CATEGORIES[number]['key']

export default function CategoryTabs() {
  const { currentCategory, setCategory } = useUIStore()

  return (
    <div className={styles.tabs}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={`${styles.tab} ${currentCategory === cat.key ? styles.active : ''}`}
          onClick={() => setCategory(cat.key as Category)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
