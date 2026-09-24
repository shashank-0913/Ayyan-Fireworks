import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
    <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 relative">
      <SparkleCanvas density={45} />
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
  );
};

export default App;
