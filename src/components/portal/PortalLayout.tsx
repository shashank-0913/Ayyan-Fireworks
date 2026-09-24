import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  CalendarDays, 
  Users, 
  ShieldAlert, 
  LogOut, 
  ExternalLink, 
  Clock, 
  RefreshCw
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';

export const PortalLayout: React.FC = () => {
  const { currentUser, staffLogout, isEmergencyBlocked, toggleEmergencyBlock, resetToDefaultSeed } = useAyyanStore();
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span>EMERGENCY SHOWROOM LOCKDOWN ACTIVE: Public slot bookings are currently halted.</span>
          </div>
          <button
            onClick={toggleEmergencyBlock}
            className="bg-slate-950 text-red-400 hover:bg-slate-900 px-3 py-1 rounded text-xs uppercase tracking-wider font-extrabold"
          >
            Lift Lockdown
          </button>
        </div>
      )}

      {/* Workstation Top Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Portal Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-gold-600 rounded-xl p-0.5 border border-amber-400/40 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-0.5">
                  <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">AYYAN OPS</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Owner & Staff Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Visakhapatnam Operations Desk</p>
              </div>
            </div>

            {/* Middle Live Operational Clock */}
            <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono text-slate-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>IST {timeStr || 'Loading...'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Visakhapatnam Floor Live</span>
              </div>
            </div>

            {/* Right Tools & User Profile */}
            <div className="flex items-center gap-3">
              {/* Emergency Lockdown Toggle Button */}
              <button
                onClick={toggleEmergencyBlock}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isEmergencyBlocked
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
                title="Immediately halt all public showroom slot reservations"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isEmergencyBlocked ? 'Lockdown Active' : 'Emergency Block'}
                </span>
              </button>

              {/* View Public Site Door */}
              <Link
                to="/"
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700"
                title="Open Public Customer Portal in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Customer Portal</span>
              </Link>

              {/* User Drop / Log out */}
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
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
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors border border-slate-700"
                  title="Sign Out of Operations Console"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Sub-Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800">
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

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
