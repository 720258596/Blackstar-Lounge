import { useUIStore } from '../store/uiStore'

export default function Toast() {
  const { toast } = useUIStore()
  return (
    <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
      {toast}
    </div>
  )
}
