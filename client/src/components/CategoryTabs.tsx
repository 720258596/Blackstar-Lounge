import { useUIStore } from '../store/uiStore'
import styles from './CategoryTabs.module.css'

const CATEGORIES = [
  { key: 'all' as const,       label: 'All' },
  { key: 'drinks' as const,    label: 'Drinks' },
  { key: 'cocktails' as const, label: 'Cocktails' },
  { key: 'food' as const,      label: 'Food' },
]

export default function CategoryTabs() {
  const { currentCategory, setCategory } = useUIStore()

  return (
    <div className={styles.tabs}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={`${styles.tab} ${currentCategory === cat.key ? styles.active : ''}`}
          onClick={() => setCategory(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
