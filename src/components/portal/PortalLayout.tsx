import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  CalendarDays, 
  Users, 
  ShieldAlert, 
  LogOut, 
  ExternalLink, 
  Clock, 
  RefreshCw,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';

export const PortalLayout: React.FC = () => {
  const { currentUser, staffLogout, isEmergencyBlocked, toggleEmergencyBlock, resetToDefaultSeed } = useAyyanStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    staffLogout();
    navigate('/portal/login');
  };

  const navItems = [
    { name: 'Command Center', path: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'Catalogue & Stock', path: '/portal/products', icon: Package },
    { name: 'Slot & Capacity Controller', path: '/portal/slots', icon: CalendarDays },
    { name: 'Live Guest Manifest', path: '/portal/bookings', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Emergency Lockdown Notice Bar */}
      {isEmergencyBlocked && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-[11px] sm:text-xs">EMERGENCY LOCKDOWN ACTIVE: Public slot bookings halted.</span>
          </div>
          <button
            onClick={toggleEmergencyBlock}
            className="bg-slate-950 text-red-400 hover:bg-slate-900 px-3 py-1.5 rounded text-[10px] sm:text-xs uppercase tracking-wider font-extrabold shrink-0 ml-2"
          >
            Lift
          </button>
        </div>
      )}

      {/* Workstation Top Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile Hamburger + Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-700"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-gold-600 rounded-xl p-0.5 border border-amber-400/40 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-0.5">
                  <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">AYYAN OPS</span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:block">Visakhapatnam Operations Desk</p>
              </div>
            </div>

            {/* Middle Live Operational Clock (Desktop) */}
            <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono text-slate-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>IST {timeStr || 'Live'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Visakhapatnam Floor Live</span>
              </div>
            </div>

            {/* Right Tools & User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Emergency Lockdown Toggle Button (Desktop & Tablet) */}
              <button
                onClick={toggleEmergencyBlock}
                className={`hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-bold items-center gap-1.5 transition-all ${
                  isEmergencyBlocked
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
                title="Emergency halt slot bookings"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isEmergencyBlocked ? 'Lockdown' : 'Emergency Block'}</span>
              </button>

              {/* View Public Site Door */}
              <Link
                to="/"
                target="_blank"
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700 min-h-[38px]"
                title="Open Public Customer Portal in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Public Site</span>
              </Link>

              {/* User Drop / Log out */}
              <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-slate-200 block leading-tight">
                    {currentUser?.name || 'Owner Staff'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono capitalize">
                    {currentUser?.role?.replace('_', ' ') || 'Manager'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors border border-slate-700 min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title="Sign Out of Operations Console"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Sub-Navigation Bar (Desktop / Tablet horizontal nav) */}
      <div className="hidden md:block bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto py-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Slide-over Sheet Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 p-0.5 border border-amber-400/40">
                    <img src="/ayyan-emblem.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Owner Portal</h3>
                    <p className="text-[10px] text-amber-400 font-mono">Visakhapatnam</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Owner Profile Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-snug">
                    {currentUser?.name || 'Owner Staff'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono capitalize">
                    {currentUser?.role?.replace('_', ' ') || 'Manager'}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Emergency Lockdown Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    toggleEmergencyBlock();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 min-h-[44px] ${
                    isEmergencyBlocked
                      ? 'bg-red-600 text-white'
                      : 'bg-red-950/50 border border-red-500/30 text-red-300'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{isEmergencyBlocked ? 'Lift Emergency Lockdown' : 'Trigger Emergency Lockdown'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Sign Out */}
            <div className="pt-6 border-t border-slate-800 space-y-2">
              <Link
                to="/"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 min-h-[44px]"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>Open Public Catalogue</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Workstation Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            <span>Ayyan Fireworks • Bunny Brand Since 1987 (Visakhapatnam Showroom Ops)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm('Reset local showroom database to clean state?')) {
                  resetToDefaultSeed();
                }
              }}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
              title="Reset slots and database cache"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset State Cache</span>
            </button>
            <span>v2.6.0 Supabase Concurrency Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
