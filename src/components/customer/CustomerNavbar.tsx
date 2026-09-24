import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, MapPin, Menu, X, UserCheck, Flame } from 'lucide-react';
import { LegalComplianceBanner } from '../common/LegalComplianceBanner';
import { VIPTicker } from '../common/VIPTicker';

export const CustomerNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Flame },
    { name: '2026 Catalogue', path: '/catalogue', icon: BookOpen },
    { name: 'Book VIP Slot', path: '/book-slot', icon: Calendar },
    { name: 'Showroom Visit', path: '/showroom', icon: MapPin },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-obsidian-950/90 border-b border-white/[0.08] transition-all">
      {/* Statutory Legal Strip */}
      <LegalComplianceBanner compact />

      {/* Dynamic VIP Slot Ticker */}
      <VIPTicker />

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Company Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 p-0.5 shadow-glow-gold transition-transform group-hover:scale-105 duration-300 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-0.5">
                <img
                  src="/ayyan-emblem.png"
                  alt="Bunny Brand"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight gold-gradient-text">
                  AYYAN
                </span>
                <span className="font-display font-bold text-xs uppercase tracking-widest text-slate-300">
                  Fireworks
                </span>
              </div>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                <span>Bunny Brand</span>
                <span>•</span>
                <span>Since 1987</span>
                <span className="hidden sm:inline">• Visakhapatnam</span>
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-obsidian-900/80 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-glow-gold font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Staff Portal Doorway */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/book-slot"
              className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Slot</span>
            </Link>

            <Link
              to="/portal"
              title="Staff & Management Portal"
              className="p-2.5 rounded-xl bg-obsidian-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-gold-400 transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-[11px]">Staff Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/portal"
              className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 text-xs"
            >
              <UserCheck className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-obsidian-900 border border-white/10 text-slate-200 hover:text-gold-400"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-obsidian-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    active
                      ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/book-slot"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full gold-gradient-btn py-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Showroom Visiting Slot</span>
            </Link>

            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-semibold text-center flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-gold-400" />
              <span>Staff & Operations Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
