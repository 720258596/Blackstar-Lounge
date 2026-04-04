# Black Star Lounge — React Frontend

Premium nightlife web app. Pixel-perfect React conversion of the original HTML design.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

Demo mode is on by default — Google OAuth is simulated locally with no backend needed.

---

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx      # Route: /
│   ├── MenuPage.tsx         # Route: /menu
│   └── SuccessPage.tsx      # Route: /success
│
├── components/
│   ├── Hero.tsx             # Landing hero section
│   ├── PromoStrip.tsx       # Animated promo ticker
│   ├── EventsSection.tsx    # Upcoming events grid
│   ├── MenuGrid.tsx         # Menu items by category
│   ├── CategoryTabs.tsx     # All / Drinks / Cocktails / Food tabs
│   ├── FeaturedCarousel.tsx # Tonight's specials carousel
│   ├── WifiModal.tsx        # Bottom-sheet WiFi modal
│   ├── WifiAutoPrompt.tsx   # Auto popup after 20s on menu
│   └── Toast.tsx            # Global toast notifications
│
├── services/
│   └── api.ts               # All HTTP calls + auth helpers
│
├── store/
│   └── uiStore.ts           # Zustand — global state + fallback data
│
├── App.tsx                  # Router + OAuth callback handler
├── main.tsx
└── index.css                # Design tokens + global styles
```

---

## Environment Variables

| Variable | Dev Default | Description |
|---|---|---|
| `VITE_API_BASE` | `/api` | Backend base URL (proxied in dev) |
| `VITE_DEMO_MODE` | `true` | `true` = simulate OAuth; `false` = real redirect |

### Dev (`.env`)
```
VITE_API_BASE=/api
VITE_DEMO_MODE=true
```

### Production (`.env.production`)
```
VITE_API_BASE=https://your-backend.com/api
VITE_DEMO_MODE=false
```

---

## API Endpoints Expected

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/menu` | `MenuItem[]` |
| `GET` | `/api/events/active` | `Event[]` |
| `GET` | `/api/promotions/active` | `Promotion[]` |
| `GET` | `/api/auth/google` | Redirect → Google OAuth |
| `GET` | `/api/auth/callback?code=` | `{ email, name }` |

All endpoints fall back to hardcoded data if they return an error or the network is unavailable.

---

## Enabling Real Google OAuth

1. Set `VITE_DEMO_MODE=false` in `.env.production`
2. Set `VITE_API_BASE=https://your-backend.com/api`
3. On your backend:
   - `GET /api/auth/google` → redirect to Google OAuth consent screen
   - Google redirects back to your frontend at `/success?code=xyz`
   - `App.tsx` `AuthHandler` picks up `?code=` and calls `GET /api/auth/callback?code=xyz`
   - Store session/token and return `{ email, name }`

---

## Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```
