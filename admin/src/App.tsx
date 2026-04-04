import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAdminStore } from './store/adminStore'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Toast from './components/Toast'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MenuPage from './pages/MenuPage'
import EventsPage from './pages/EventsPage'
import ReservationsPage from './pages/ReservationsPage'
import PromotionsPage from './pages/PromotionsPage'
import CustomersPage from './pages/CustomersPage'
import QRPage from './pages/QRPage'

function ProtectedLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 'var(--sidebar-w)', flex: 1 }}>
        <TopBar title={title} subtitle={subtitle} />
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>
      <Toast />
    </div>
  )
}

export default function App() {
  const { admin } = useAdminStore()

  if (!admin) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedLayout title="Dashboard"><DashboardPage /></ProtectedLayout>} />
        <Route path="/menu" element={<ProtectedLayout title="Menu Management" subtitle="Manage menu items and categories"><MenuPage /></ProtectedLayout>} />
        <Route path="/events" element={<ProtectedLayout title="Events" subtitle="Create and manage events"><EventsPage /></ProtectedLayout>} />
        <Route path="/reservations" element={<ProtectedLayout title="Reservations" subtitle="View and manage table reservations"><ReservationsPage /></ProtectedLayout>} />
        <Route path="/promotions" element={<ProtectedLayout title="Promotions" subtitle="Manage promotional offers"><PromotionsPage /></ProtectedLayout>} />
        <Route path="/customers" element={<ProtectedLayout title="Customers" subtitle="View and manage customer data"><CustomersPage /></ProtectedLayout>} />
        <Route path="/qr" element={<ProtectedLayout title="QR Codes" subtitle="Generate and manage QR codes"><QRPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
