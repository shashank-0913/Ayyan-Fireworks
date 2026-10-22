import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Menu, 
  X, 
  UserCheck,
  UserCog,
  QrCode, 
  Flame, 
  Phone, 
  Clock, 
  ChevronRight,
  Ticket,
  FileText,
  Sparkles,
  Download
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useEstimate } from '../../context/EstimateContext';
import { SHOWROOM_CONTACT, WHATSAPP_CONTACT } from '../../lib/utils';
import { SHOW_SLOT_BOOKING_UI } from '../../config/features';

export const CustomerNavbar: React.FC = () => {
  const { totalItemsCount, setIsEstimateDrawerOpen } = useEstimate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  const closeDrawer = () => setMobileDrawerOpen(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Flame },
    { name: 'Catalogue', path: '/catalogue', icon: BookOpen },
    { name: 'Showroom Visit', path: '/showroom', icon: MapPin },
    ...(SHOW_SLOT_BOOKING_UI ? [
      { name: 'Book VIP Slot', path: '/book-slot', icon: Ticket },
      { name: 'My Bookings', path: '/my-bookings', icon: Ticket },
    ] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY HEADER (DESKTOP & MOBILE COMPACT)                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-obsidian-950/90 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
        {/* Top Announcement Banner: Showroom Operating Hours */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-700 dark:via-amber-600 dark:to-amber-700 text-slate-950 dark:text-white px-3 py-1.5 text-center text-[11px] sm:text-xs font-bold border-b border-amber-600/30 flex items-center justify-center gap-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-950 dark:text-amber-200 animate-pulse shrink-0" />
          <span className="tracking-tight">
            Regular Hours: <strong>8:00 AM – 10:00 PM</strong> <span className="opacity-75">|</span> Special Diwali Season Hours: <strong>5:00 AM – 10:00 PM</strong>
          </span>
        </div>

        {/* Top Bar Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Official Company Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-touch">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 p-0.5 shadow-md dark:shadow-glow-gold transition-transform group-hover:scale-105 duration-300 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/ayyan-emblem.png"
                    alt="Bunny Brand Fancy Fireworks"
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-black text-lg sm:text-2xl tracking-tight gold-gradient-text">
                    AYYAN
                  </span>
                  <span className="font-display font-bold text-[10px] sm:text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
                    Fireworks
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                  <span>Bunny Brand</span>
                  <span>•</span>
                  <span>Since 1987</span>
                  <span className="hidden sm:inline">• Visakhapatnam</span>
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-obsidian-900/80 p-1.5 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md transition-colors">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 min-touch ${
                      active
                        ? 'bg-amber-500/15 dark:bg-gold-500/20 text-amber-700 dark:text-gold-300 border border-amber-500/40 dark:border-gold-500/40 shadow-sm dark:shadow-glow-gold font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-600 dark:text-gold-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Book VIP Slot CTA Button in Header (Desktop) - Always visible */}
              {SHOW_SLOT_BOOKING_UI && (
                <Link
                  to="/book-slot"
                  id="header-book-vip-slot-btn"
                  className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-400 hover:from-amber-400 hover:to-gold-300 text-slate-950 text-xs font-black shadow-sm transition-all transform active:scale-95"
                >
                  <Ticket className="w-3.5 h-3.5 text-slate-950" />
                  <span>Book VIP Slot</span>
                </Link>
              )}

              {/* Showroom Estimate Inquiry Trigger */}
              <button
                type="button"
                onClick={() => setIsEstimateDrawerOpen(true)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 min-touch justify-center cursor-pointer ${
                  totalItemsCount > 0
                    ? 'bg-amber-500/20 dark:bg-gold-500/20 border-amber-500/50 text-amber-800 dark:text-gold-300 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-900/80 dark:hover:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
                title="Showroom Estimate & Inquiry List"
                aria-label="View Showroom Estimate List"
              >
                <FileText className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                <span className="hidden sm:inline text-[11px]">Estimate</span>
                {totalItemsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-black">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Official Price List PDF Download Button */}
              <a
                href="/Ayyan_Fireworks_PriceList_2025_26.pdf?v=202526"
                download="Ayyan_Fireworks_PriceList_2025_26.pdf"
                target="_blank"
                rel="noopener noreferrer"
                id="header-download-pricelist-btn"
                className="hidden sm:inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-gold-300 border border-amber-500/30 text-xs font-bold transition-all min-touch"
                title="Download Official 2025-26 Price List PDF"
                aria-label="Download Official 2025-26 Price List (PDF)"
              >
                <Download className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                <span className="hidden md:inline text-[11px]">Download PDF</span>
              </a>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Admin Portal Doorway */}
              <Link
                to="/admin"
                title="Admin & Management Portal"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-gold-400 transition-all flex items-center gap-1.5 text-xs font-medium min-touch justify-center"
              >
                <UserCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span className="hidden sm:inline text-[11px] font-semibold">Admin Portal</span>
              </Link>

              {/* Mobile Drawer Trigger (More Info / Helpline) */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-gold-400 min-touch flex items-center justify-center active:scale-95"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. STICKY MOBILE BOTTOM NAVIGATION BAR (FIXED ON MOBILE < MD)             */}
      {/* ========================================================================= */}
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

          {/* 4. My Bookings */}
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

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDE-OVER SHEET DRAWER                                         */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-obsidian-900 border-l border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-gold-600 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                    <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain rounded-full bg-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Ayyan Fireworks</h3>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Bunny Brand Since 1987</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-touch flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all min-touch ${
                        active
                          ? 'bg-amber-500/15 dark:bg-gold-500/20 text-amber-700 dark:text-gold-300 border border-amber-500/40 dark:border-gold-500/40 shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-amber-600 dark:text-gold-400' : 'text-slate-400'}`} />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </Link>
                  );
                })}

                {/* Showroom Estimate Inquiry Item in Mobile Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setIsEstimateDrawerOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-gold-300 border border-amber-500/30 min-touch text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                    <span>Showroom Estimate List</span>
                  </div>
                  {totalItemsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-black">
                      {totalItemsCount} items
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Download Price List PDF in Mobile Drawer */}
                <a
                  href="/Ayyan_Fireworks_PriceList_2025_26.pdf?v=202526"
                  download="Ayyan_Fireworks_PriceList_2025_26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="mobile-drawer-download-pricelist-btn"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-gold-300 border border-amber-500/30 min-touch"
                  title="Download Official 2025-26 Price List PDF"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                    <span>Download Price List (PDF)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-black uppercase">
                    2025-26
                  </span>
                </a>
              </nav>

              {/* Showroom Quick Info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-amber-600 dark:text-gold-400 uppercase tracking-wider text-[10px] block">
                  Visakhapatnam Flagship
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {SHOWROOM_CONTACT.shortAddress}
                </p>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-gold-400 shrink-0" />
                    <span>Regular Hours: 8:00 AM – 10:00 PM</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-gold-300 font-bold text-[10px]">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    Special Diwali Season: 5:00 AM – 10:00 PM
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={SHOWROOM_CONTACT.callUrl}
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-amber-700 dark:text-gold-300 font-bold text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Helpline</span>
                  </a>

                  <a
                    href={WHATSAPP_CONTACT.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-xs"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3 pb-safe">
              <a
                href={WHATSAPP_CONTACT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all min-touch active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp ({WHATSAPP_CONTACT.display})</span>
              </a>

              {/* Management & Gate Operations Column */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                {/* Option 1: Admin Dashboard */}
                <Link
                  to="/admin"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-obsidian-950 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <UserCog className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Admin Management Portal</span>
                </Link>

                {/* Option 2: Standalone QR Scanner */}
                <Link
                  to="/scanner"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-obsidian-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Gate Entry QR Scanner</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
