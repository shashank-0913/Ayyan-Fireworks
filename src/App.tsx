import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { SparkleCanvas } from './components/common/SparkleCanvas';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { CustomerNavbar } from './components/customer/CustomerNavbar';
import { CustomerFooter } from './components/customer/CustomerFooter';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { BookSlotPage } from './pages/BookSlotPage';
import { ShowroomPage } from './pages/ShowroomPage';

// Portal Components & Pages
import { PortalAuthGate } from './components/portal/PortalAuthGate';
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalLoginPage } from './pages/portal/PortalLoginPage';
import { PortalDashboardPage } from './pages/portal/PortalDashboardPage';
import { PortalProductsPage } from './pages/portal/PortalProductsPage';
import { PortalSlotsPage } from './pages/portal/PortalSlotsPage';
import { PortalBookingsPage } from './pages/portal/PortalBookingsPage';

// Customer Layout Wrapper
const CustomerPortalLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-200">
      {/* Background Ambient Logo Watermark (Only Circular Emblem) */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-[0.035] dark:opacity-[0.03] select-none">
        <img
          src="/ayyan-emblem.png"
          alt=""
          className="w-[650px] sm:w-[900px] max-w-none object-contain filter drop-shadow-[0_0_60px_rgba(245,158,11,0.3)]"
        />
      </div>

      <SparkleCanvas density={35} />
      <CustomerNavbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <CustomerFooter />
      <WhatsAppFloatingButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* ================================================================= */}
            {/* 1. PUBLIC CUSTOMER PORTAL */}
            {/* ================================================================= */}
            <Route element={<CustomerPortalLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogue" element={<CataloguePage />} />
              <Route path="/book-slot" element={<BookSlotPage />} />
              <Route path="/showroom" element={<ShowroomPage />} />
            </Route>

            {/* ================================================================= */}
            {/* 2. STANDALONE STAFF & MANAGEMENT PORTAL */}
            {/* ================================================================= */}
            <Route path="/portal/login" element={<PortalLoginPage />} />
            
            <Route
              path="/portal"
              element={
                <PortalAuthGate>
                  <PortalLayout />
                </PortalAuthGate>
              }
            >
              <Route index element={<Navigate to="/portal/dashboard" replace />} />
              <Route path="dashboard" element={<PortalDashboardPage />} />
              <Route path="products" element={<PortalProductsPage />} />
              <Route path="slots" element={<PortalSlotsPage />} />
              <Route path="bookings" element={<PortalBookingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
