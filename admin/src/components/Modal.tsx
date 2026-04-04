import styles from './Modal.module.css'

interface Props {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  actions?: React.ReactNode
}

export default function Modal({ isOpen, title, children, onClose, actions }: Props) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {children}
        </div>

        {actions && (
          <div className={styles.footer}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
