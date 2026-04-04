import { useState } from 'react'
import QRCode from 'qrcode'
import styles from './QRPage.module.css'

export default function QRPage() {
  const [qrValue, setQrValue] = useState('https://blackstarlounge.com')
  const [qrImage, setQrImage] = useState('')
  const [loading, setLoading] = useState(false)

  async function generateQR() {
    if (!qrValue) return
    setLoading(true)
    try {
      const image = await QRCode.toDataURL(qrValue, {
        width: 400,
        margin: 2,
        color: { dark: '#c9a84c', light: '#0a0a0a' },
      })
      setQrImage(image)
    } catch (err) {
      console.error('QR generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!qrImage) return
    const link = document.createElement('a')
    link.href = qrImage
    link.download = `qr-${Date.now()}.png`
    link.click()
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Generate QR Code</h2>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Target URL or Text</label>
              <input
                type="text"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <button className={styles.genBtn} onClick={generateQR} disabled={loading}>
              {loading ? 'Generating...' : 'Generate QR'}
            </button>
          </div>
        </div>

        {qrImage && (
          <div className={styles.section}>
            <h2>Preview</h2>
            <div className={styles.preview}>
              <img src={qrImage} alt="QR Code" />
            </div>
            <button className={styles.downBtn} onClick={handleDownload}>
              ⬇ Download QR Code
            </button>
          </div>
        )}

        <div className={styles.section}>
          <h2>Quick Presets</h2>
          <div className={styles.presets}>
            <button
              className={styles.presetBtn}
              onClick={() => { setQrValue('https://blackstarlounge.com'); }}
            >
              Website
            </button>
            <button
              className={styles.presetBtn}
              onClick={() => { setQrValue('https://blackstarlounge.com/menu'); }}
            >
              Menu
            </button>
            <button
              className={styles.presetBtn}
              onClick={() => { setQrValue('https://blackstarlounge.com/booking'); }}
            >
              Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
