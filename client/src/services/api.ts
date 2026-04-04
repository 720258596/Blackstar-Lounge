// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface MenuItem {
  id?: string
  name: string
  category: "drinks" | "cocktails" | "food"
  price: string
  description?: string
  image_url?: string
  featured?: boolean
}

export interface Event {
  id?: string
  title: string
  date?: string | null
  description?: string
  posterUrl?: string
}

export interface Promotion {
  id?: string
  title: string
  detail: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  picture?: string
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // send session cookie with every request
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── MENU ────────────────────────────────────────────────────────────────────

export async function fetchMenuItems(): Promise<MenuItem[]> {
  return get<MenuItem[]>("/menu");
}

// ─── EVENTS ──────────────────────────────────────────────────────────────────

export async function fetchActiveEvents(): Promise<Event[]> {
  return get<Event[]>("/events/active");
}

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────

export async function fetchActivePromotions(): Promise<Promotion[]> {
  return get<Promotion[]>("/promotions/active");
}

// ─── RESERVATIONS ────────────────────────────────────────────────────────────

export async function submitReservation(data: {
  eventId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`API ${res.status}: reservation failed`);
  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

/**
 * Redirects the browser to the backend Google OAuth flow.
 * Backend handles the full cycle:
 *   GET /api/auth/google
 *     → Google consent screen
 *     → GET /api/auth/google/callback
 *     → session created
 *     → redirect to http://localhost:5173/success
 */
export function initiateGoogleAuth(): void {
  window.location.href = `${API_BASE}/auth/google`;
}

/**
 * Check if the user is currently authenticated (has an active session).
 * Call this on app mount to restore auth state after a page refresh.
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    return await get<AuthUser>("/auth/me");
  } catch {
    return null; // 401 = not logged in, that's fine
  }
}
