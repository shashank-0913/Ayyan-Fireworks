import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { EstimateProvider } from './context/EstimateContext';
import { SparkleCanvas } from './components/common/SparkleCanvas';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { FireworkIntroSplash } from './components/common/FireworkIntroSplash';
import { CustomerNavbar } from './components/customer/CustomerNavbar';
import { CustomerFooter } from './components/customer/CustomerFooter';
import { EstimateDrawer } from './components/customer/EstimateDrawer';

import { ErrorBoundary } from './components/common/ErrorBoundary';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { BookSlotPage } from './pages/BookSlotPage';
import { ShowroomPage } from './pages/ShowroomPage';
import { MyBookingsPage } from './pages/MyBookingsPage';

// Standalone Dedicated Scanner Components & Pages (Owner OTP Secured)
import { ScannerPage } from './pages/scanner/ScannerPage';

// Portal Components & Pages
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboardPage } from './pages/portal/PortalDashboardPage';
import { PortalProductsPage } from './pages/portal/PortalProductsPage';
import { PortalSlotsPage } from './pages/portal/PortalSlotsPage';
import { PortalBookingsPage } from './pages/portal/PortalBookingsPage';

// Owner Auth Portal & Route Protection Gate
import { OwnerAuthPortal } from './components/auth/OwnerAuthPortal';
import { RequireOwnerAuth } from './components/auth/RequireOwnerAuth';

// Customer Layout Wrapper
const CustomerPortalLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-200">
      {/* Cinematic Firework Intro Splash Screen (Runs on First Visit) */}
      <FireworkIntroSplash />

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
      <EstimateDrawer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <EstimateProvider>
            <BrowserRouter>
            <Routes>
              {/* ================================================================= */}
              {/* 1. PUBLIC WEBSITE & CUSTOMER PORTAL */}
              {/* ================================================================= */}
              <Route element={<CustomerPortalLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalogue" element={<CataloguePage />} />
                <Route path="/book-slot" element={<BookSlotPage />} />
                <Route path="/showroom" element={<ShowroomPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/passes" element={<MyBookingsPage />} />
              </Route>

              {/* Antigravity Route Redirect to Catalogue */}
              <Route path="/antigravity" element={<Navigate to="/catalogue" replace />} />

              {/* ================================================================= */}
              {/* 2. ADMIN AUTHENTICATION & DASHBOARD */}
              {/* ================================================================= */}
              <Route path="/admin" element={<OwnerAuthPortal defaultPortal="admin" />} />
              <Route path="/admin/login" element={<OwnerAuthPortal defaultPortal="admin" />} />
              <Route path="/portal/login" element={<OwnerAuthPortal defaultPortal="admin" />} />
              <Route path="/portal" element={<Navigate to="/admin" replace />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <RequireOwnerAuth type="admin">
                    <PortalLayout />
                  </RequireOwnerAuth>
                }
              >
                <Route index element={<PortalDashboardPage />} />
              </Route>

              {/* Admin Operations Sub-Routes */}
              <Route
                path="/admin/products"
                element={
                  <RequireOwnerAuth type="admin">
                    <PortalLayout />
                  </RequireOwnerAuth>
                }
              >
                <Route index element={<PortalProductsPage />} />
              </Route>
              
              <Route
                path="/admin/slots"
                element={
                  <RequireOwnerAuth type="admin">
                    <PortalLayout />
                  </RequireOwnerAuth>
                }
              >
                <Route index element={<PortalSlotsPage />} />
              </Route>

              <Route
                path="/admin/bookings"
                element={
                  <RequireOwnerAuth type="admin">
                    <PortalLayout />
                  </RequireOwnerAuth>
                }
              >
                <Route index element={<PortalBookingsPage />} />
              </Route>

              {/* ================================================================= */}
              {/* 3. STANDALONE SCANNER AUTHENTICATION & TERMINAL                   */}
              {/* ================================================================= */}
              <Route path="/scanner" element={<OwnerAuthPortal defaultPortal="scanner" />} />
              <Route path="/scanner/login" element={<OwnerAuthPortal defaultPortal="scanner" />} />
              <Route
                path="/scanner/terminal"
                element={
                  <RequireOwnerAuth type="scanner">
                    <ScannerPage />
                  </RequireOwnerAuth>
                }
              />

              {/* Quick Access Aliases */}
              <Route path="/verify-qr" element={<Navigate to="/scanner/terminal" replace />} />
              <Route path="/verify-qr/login" element={<Navigate to="/scanner" replace />} />
              <Route path="/gate" element={<Navigate to="/scanner/terminal" replace />} />
              <Route path="/gate/login" element={<Navigate to="/scanner" replace />} />
              <Route path="/scanner/scan" element={<Navigate to="/scanner/terminal" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          </EstimateProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
