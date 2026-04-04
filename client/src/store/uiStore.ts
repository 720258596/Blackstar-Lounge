import { create } from "zustand";
import type { MenuItem, Event, Promotion, AuthUser } from "../services/api";

// ─── FALLBACK DATA ─────────────────────────────────────────────────────────

export const FALLBACK_MENU: MenuItem[] = [
  { name: "Tusker Lager",          category: "drinks",    price: "KSh 350",   description: "Cold crisp Kenyan lager" },
  { name: "Whiskey Neat",          category: "drinks",    price: "KSh 800",   description: "Premium single malt served neat" },
  { name: "Vodka Soda",            category: "drinks",    price: "KSh 650",   description: "Clean, refreshing, ice cold" },
  { name: "Red Wine",              category: "drinks",    price: "KSh 900",   description: "Curated selection of reds" },
  { name: "Black Star Signature",  category: "cocktails", price: "KSh 1,200", description: "Aged rum, gold syrup, citrus, smoked rim", featured: true },
  { name: "Midnight Passion",      category: "cocktails", price: "KSh 1,100", description: "Passion fruit, vodka, lime, ginger beer", featured: true },
  { name: "Gold Rush",             category: "cocktails", price: "KSh 1,300", description: "Bourbon, honey, lemon, thyme sprig",       featured: true },
  { name: "Nairobi Nights",        category: "cocktails", price: "KSh 1,000", description: "Gin, tonic, cucumber, black pepper" },
  { name: "Chicken Wings",         category: "food",      price: "KSh 850",   description: "Smoky BBQ or buffalo, 10 pieces" },
  { name: "Club Fries",            category: "food",      price: "KSh 450",   description: "Crispy seasoned fries with dipping sauce" },
  { name: "Beef Sliders",          category: "food",      price: "KSh 1,100", description: "Wagyu beef, truffle mayo, pickles" },
  { name: "Nachos Platter",        category: "food",      price: "KSh 750",   description: "Loaded nachos, guacamole, salsa, cheese" },
];

export const FALLBACK_EVENTS: Event[] = [
  { title: "DJ Crème de la Crème",    date: "Friday, Apr 4",   description: "The finest Afro-house sets all night long" },
  { title: "EPL: Man City vs Arsenal",date: "Sunday, Apr 6",   description: "Live on our giant screens with full bar" },
  { title: "Acoustic Night",          date: "Saturday, Apr 12",description: "Live acoustic sets from Kenya's finest artists" },
];

export const FALLBACK_PROMOS: Promotion[] = [
  { title: "Live DJ Night",           detail: "Every Friday" },
  { title: "Sports Screening",        detail: "Matchdays Live" },
  { title: "Happy Hour",              detail: "5 PM – 8 PM" },
  { title: "Live Artist Performance", detail: "This Saturday" },
  { title: "Free WiFi",               detail: "Connect & Enjoy" },
  { title: "Premium Cocktails",       detail: "Signature Blends" },
];

// ─── STATE ─────────────────────────────────────────────────────────────────

interface UIState {
  // Auth
  user: AuthUser | null;

  // Data
  menuItems:       MenuItem[];
  events:          Event[];
  promotions:      Promotion[];
  currentCategory: "all" | "drinks" | "cocktails" | "food";

  // UI
  wifiModalOpen:    boolean;
  wifiPromptVisible: boolean;
  toast:            string;

  // Auth actions
  setUser: (user: AuthUser | null) => void;

  // Data actions
  setMenuItems:  (items: MenuItem[]) => void;
  setEvents:     (events: Event[]) => void;
  setPromotions: (promos: Promotion[]) => void;
  setCategory:   (cat: "all" | "drinks" | "cocktails" | "food") => void;

  // UI actions
  openWifiModal:  () => void;
  closeWifiModal: () => void;
  showWifiPrompt: () => void;
  hideWifiPrompt: () => void;
  showToast:      (msg: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Auth
  user: null,

  // Data
  menuItems:       [],
  events:          [],
  promotions:      [],
  currentCategory: "all",

  // UI
  wifiModalOpen:     false,
  wifiPromptVisible: false,
  toast:             "",

  // Auth actions
  setUser: (user) => set({ user }),

  // Data actions
  setMenuItems:  (menuItems)   => set({ menuItems }),
  setEvents:     (events)      => set({ events }),
  setPromotions: (promotions)  => set({ promotions }),
  setCategory:   (cat)         => set({ currentCategory: cat }),

  // UI actions
  openWifiModal:  () => set({ wifiModalOpen: true, wifiPromptVisible: false }),
  closeWifiModal: () => set({ wifiModalOpen: false }),
  showWifiPrompt: () => set({ wifiPromptVisible: true }),
  hideWifiPrompt: () => set({ wifiPromptVisible: false }),
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: "" }), 3500);
  },
}));
