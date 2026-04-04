import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage  from "./pages/LandingPage";
import MenuPage     from "./pages/MenuPage";
import SuccessPage  from "./pages/SuccessPage";
import WifiModal    from "./components/WifiModal";
import Toast        from "./components/Toast";
import { useUIStore } from "./store/uiStore";
import { fetchCurrentUser } from "./services/api";

/**
 * On mount, silently check if a session cookie already exists
 * (e.g. user refreshed the page after logging in).
 * Stores the result in uiStore so any component can read it.
 */
function AuthRestorer() {
  const { setUser } = useUIStore();

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (user) setUser(user);
    });
  }, [setUser]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthRestorer />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/menu"    element={<MenuPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global overlays — rendered outside route tree so they persist */}
      <WifiModal />
      <Toast />
    </BrowserRouter>
  );
}
