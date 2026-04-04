const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function req<T>(
  method: string,
  path: string,
  token?: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: token ? authHeaders(token) : { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  return req<{ token: string; email: string }>('POST', '/admin/auth/login', undefined, { email, password })
}

// ─── MENU ─────────────────────────────────────────────────────────────────────

export async function getMenuItems(token: string) {
  return req<any[]>('GET', '/admin/menu', token)
}

export async function createMenuItem(token: string, data: unknown) {
  return req<any>('POST', '/admin/menu', token, data)
}

export async function updateMenuItem(token: string, id: string, data: unknown) {
  return req<any>('PUT', `/admin/menu/${id}`, token, data)
}

export async function deleteMenuItem(token: string, id: string) {
  return req<any>('DELETE', `/admin/menu/${id}`, token)
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export async function getEvents(token: string) {
  return req<any[]>('GET', '/admin/events', token)
}

export async function createEvent(token: string, data: unknown) {
  return req<any>('POST', '/admin/events', token, data)
}

export async function updateEvent(token: string, id: string, data: unknown) {
  return req<any>('PUT', `/admin/events/${id}`, token, data)
}

export async function deleteEvent(token: string, id: string) {
  return req<any>('DELETE', `/admin/events/${id}`, token)
}

// ─── PROMOTIONS ───────────────────────────────────────────────────────────────

export async function getPromotions(token: string) {
  return req<any[]>('GET', '/admin/promotions', token)
}

export async function createPromotion(token: string, data: unknown) {
  return req<any>('POST', '/admin/promotions', token, data)
}

export async function updatePromotion(token: string, id: string, data: unknown) {
  return req<any>('PUT', `/admin/promotions/${id}`, token, data)
}

export async function deletePromotion(token: string, id: string) {
  return req<any>('DELETE', `/admin/promotions/${id}`, token)
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────

export async function getCustomers(token: string) {
  return req<any[]>('GET', '/admin/customers', token)
}

// ─── RESERVATIONS ─────────────────────────────────────────────────────────────

export async function getReservations(token: string, eventId: string) {
  return req<any[]>('GET', `/admin/reservations/${eventId}`, token)
}

export async function deleteReservation(token: string, id: string) {
  return req<any>('DELETE', `/admin/reservations/${id}`, token)
}

// ─── FILE UPLOADS ─────────────────────────────────────────────────────────────

export async function uploadEventPoster(token: string, file: File) {
  const form = new FormData()
  form.append('poster', file)
  
  const res = await fetch(`${API_BASE}/admin/events/upload-poster`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  
  if (!res.ok) throw new Error('Poster upload failed')
  return res.json()
}

// ─── IMAGE UPLOAD (ImageKit) ──────────────────────────────────────────────────

export async function getImageKitAuth(token: string) {
  return req<{ token: string; expire: number; signature: string }>(
    'GET', '/admin/menu/imagekit-auth', token
  )
}

export async function uploadToImageKit(
  file: File,
  authParams: { token: string; expire: number; signature: string },
  publicKey: string
): Promise<{ url: string; fileId: string }> {
  const form = new FormData()
  form.append('file', file)
  form.append('fileName', `menu_${Date.now()}_${file.name}`)
  form.append('folder', '/blackstar/menu')
  form.append('publicKey', publicKey)
  form.append('signature', authParams.signature)
  form.append('expire',    String(authParams.expire))
  form.append('token',     authParams.token)

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error('ImageKit upload failed')
  const data = await res.json()
  return { url: data.url, fileId: data.fileId }
}
