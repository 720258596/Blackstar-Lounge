import { create } from "zustand";
import type { MenuItem, Event, Promotion, AuthUser } from "../services/api";

// ─── STATE ─────────────────────────────────────────────────────────────────

interface UIState {
  // Auth
  user: AuthUser | null;

  // Data
  menuItems:       MenuItem[];
  events:          Event[];
  promotions:      Promotion[];
  currentCategory: "all" | "whiskey" | "gin" | "cognac" | "vodka" | "tequila" | "rum" | "champagne" | "cocktails" | "shooters" | "food";

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
  setCategory:   (cat: "all" | "whiskey" | "gin" | "cognac" | "vodka" | "tequila" | "rum" | "champagne" | "cocktails" | "shooters" | "food") => void;

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
