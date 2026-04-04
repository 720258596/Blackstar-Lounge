import { useRef, useState } from 'react'
import { useAdminStore } from '../store/adminStore'
import styles from './ImageUpload.module.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

interface Props {
  currentUrl?: string
  onUploaded: (url: string) => void
  endpoint?: string
  fieldName?: string
}

export default function ImageUpload({ currentUrl, onUploaded, endpoint = '/admin/menu/upload-image', fieldName = 'image' }: Props) {
  const { admin, showToast } = useAdminStore()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(currentUrl ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !admin) return

    // Local preview
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const form = new FormData()
      form.append(fieldName, file)
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${admin.token}` },
        body: form,
      })
      
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onUploaded(data.url)
      showToast('Image uploaded', 'success')
    } catch (err) {
      showToast('Upload failed', 'error')
      setPreview(currentUrl ?? '')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className={styles.preview} />
        ) : (
          <div className={styles.placeholder}>
            <span>📷</span>
            <p>Click to upload image</p>
          </div>
        )}
        {uploading && (
          <div className={styles.uploading}>
            <span className="spinner" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      {preview && (
        <button
          className={styles.clear}
          onClick={() => { setPreview(''); onUploaded('') }}
          type="button"
        >
          Remove image
        </button>
      )}
    </div>
  )
}
