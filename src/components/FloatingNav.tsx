import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, BookOpen, MapPin, Ticket } from 'lucide-react';
import { SHOW_SLOT_BOOKING_UI } from '../config/features';

export const FloatingNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-obsidian-950/95 backdrop-blur-2xl border-t border-slate-200/90 dark:border-white/10 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.8)] transition-colors duration-200">
      <nav className={`grid ${SHOW_SLOT_BOOKING_UI ? 'grid-cols-4' : 'grid-cols-3'} h-16 items-center px-1 max-w-md mx-auto`}>
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center h-full min-touch relative transition-colors ${
            isActive('/') 
              ? 'text-amber-700 dark:text-gold-300 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Flame className={`w-4.5 h-4.5 ${isActive('/') ? 'text-amber-600 dark:text-gold-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Home</span>
          {isActive('/') && (
            <span className="absolute top-1 w-5 h-0.5 rounded-full bg-amber-500 dark:bg-gold-400 shadow-sm dark:shadow-glow-gold" />
          )}
        </Link>

        {/* 2. Catalogue */}
        <Link
          to="/catalogue"
          className={`flex flex-col items-center justify-center h-full min-touch relative transition-colors ${
            isActive('/catalogue') 
              ? 'text-amber-700 dark:text-gold-300 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className={`w-4.5 h-4.5 ${isActive('/catalogue') ? 'text-amber-600 dark:text-gold-400' : 'text-slate-400'}`} />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Catalogue</span>
          {isActive('/catalogue') && (
            <span className="absolute top-1 w-5 h-0.5 rounded-full bg-amber-500 dark:bg-gold-400 shadow-sm dark:shadow-glow-gold" />
          )}
        </Link>

        {/* 3. Showroom */}
        <Link
          to="/showroom"
          className={`flex flex-col items-center justify-center h-full min-touch relative transition-colors ${
            isActive('/showroom') 
              ? 'text-amber-700 dark:text-gold-300 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MapPin className={`w-4.5 h-4.5 ${isActive('/showroom') ? 'text-amber-600 dark:text-gold-400' : 'text-slate-400'}`} />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Showroom</span>
          {isActive('/showroom') && (
            <span className="absolute top-1 w-5 h-0.5 rounded-full bg-amber-500 dark:bg-gold-400 shadow-sm dark:shadow-glow-gold" />
          )}
        </Link>

        {/* 4. My Bookings / VIP Slot */}
        {SHOW_SLOT_BOOKING_UI && (
          <Link
            to="/my-bookings"
            className={`flex flex-col items-center justify-center h-full min-touch relative transition-colors ${
              isActive('/my-bookings') 
                ? 'text-amber-700 dark:text-gold-300 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Ticket className={`w-4.5 h-4.5 ${isActive('/my-bookings') ? 'text-amber-600 dark:text-gold-400' : 'text-slate-400'}`} />
            <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Bookings</span>
            {isActive('/my-bookings') && (
              <span className="absolute top-1 w-5 h-0.5 rounded-full bg-amber-500 dark:bg-gold-400 shadow-sm dark:shadow-glow-gold" />
            )}
          </Link>
        )}
      </nav>
    </div>
  );
};

export default FloatingNav;
