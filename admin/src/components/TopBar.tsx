import { useAdminStore } from '../store/adminStore'
import styles from './TopBar.module.css'

interface Props { title: string; subtitle?: string }

export default function TopBar({ title, subtitle }: Props) {
  const { admin } = useAdminStore()
  return (
    <header className={styles.bar}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>
      <div className={styles.user}>
        <div className={styles.userDot} />
        <span>{admin?.email}</span>
      </div>
    </header>
  )
}
