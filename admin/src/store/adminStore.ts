import { create } from 'zustand'

export interface AdminUser {
  email: string
  token: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: string
  description?: string
  imageUrl?: string
  isFeatured: boolean
  isActive: boolean
}

export interface Event {
  id: string
  title: string
  description?: string
  date?: string
  isActive: boolean
}

export interface Promotion {
  id: string
  title: string
  detail: string
  isActive: boolean
}

export interface Customer {
  id: string
  email: string
  name?: string
  picture?: string
  createdAt: string
}

export interface Reservation {
  id: string
  eventId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  partySize: number
  reservedAt: string
}

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
}

interface AdminState {
  // Auth
  admin: AdminUser | null
  setAdmin: (admin: AdminUser | null) => void

  // Data
  menuItems:   MenuItem[]
  events:      Event[]
  promotions:  Promotion[]
  customers:   Customer[]
  reservations: Reservation[]

  setMenuItems:  (items: MenuItem[]) => void
  setEvents:     (events: Event[]) => void
  setPromotions: (promos: Promotion[]) => void
  setCustomers:  (customers: Customer[]) => void
  setReservations: (reservations: Reservation[]) => void

  // Toast
  toast: Toast | null
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export const useAdminStore = create<AdminState>((set) => ({
  admin: (() => {
    try {
      const raw = localStorage.getItem('bsl_admin')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })(),

  setAdmin: (admin) => {
    if (admin) localStorage.setItem('bsl_admin', JSON.stringify(admin))
    else        localStorage.removeItem('bsl_admin')
    set({ admin })
  },

  menuItems:  [],
  events:     [],
  promotions: [],
  customers:  [],
  reservations: [],

  setMenuItems:  (menuItems)   => set({ menuItems }),
  setEvents:     (events)      => set({ events }),
  setPromotions: (promotions)  => set({ promotions }),
  setCustomers:  (customers)   => set({ customers }),
  setReservations: (reservations) => set({ reservations }),

  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },
}))
