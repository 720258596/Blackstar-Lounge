import { useAdminStore } from '../store/adminStore'

export default function Toast() {
  const { toast } = useAdminStore()
  return (
    <div className={`toast ${toast ? 'show' : ''} ${toast?.type ?? ''}`}>
      {toast?.message}
    </div>
  )
}
