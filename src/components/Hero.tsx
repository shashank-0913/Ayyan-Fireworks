import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, ArrowRight, Ticket, Download } from 'lucide-react';
import { SHOW_SLOT_BOOKING_UI } from '../config/features';

export interface HeroProps {
  onOpenSlotModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSlotModal }) => {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Glow Radial Embers & Circular Logo Emblem Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] pointer-events-none -z-10 flex items-center justify-center opacity-[0.10] dark:opacity-[0.14] select-none">
        <img
          src="/ayyan-emblem.png"
          alt="Bunny Brand"
          className="w-full h-full object-contain filter drop-shadow-[0_0_80px_rgba(245,158,11,0.6)]"
        />
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-gold-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        {/* Top Heritage Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-widest shadow-sm dark:shadow-glow-gold animate-float">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-gold-400" />
          <span>Ayyan Fireworks • Bunny Brand Since 1987 • Visakhapatnam</span>
        </div>

        {/* Dynamic Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Experience the Sparkle of Tradition —{' '}
            <span className="gold-gradient-text block sm:inline">
              Certified, Safe &amp; Spectacular.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore authentic Sivakasi Green Crackers &amp; Novelties, direct factory pricing, and {SHOW_SLOT_BOOKING_UI ? 'priority showroom visiting passes' : 'direct in-store showroom purchases'} at our Visakhapatnam flagship store.
          </p>
        </div>

        {/* Hero CTA Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {/* Primary Button: View Full Catalogue */}
          <Link
            to="/catalogue"
            className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs md:text-sm tracking-wider uppercase rounded-2xl shadow-xl hover:shadow-amber-500/25 active:scale-95 transition-all duration-200 group"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Download Official Price List PDF */}
          <a
            href="/Ayyan_Fireworks_PriceList_2026.pdf?v=20261022"
            download="Ayyan_Fireworks_Official_PriceList_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            id="hero-download-pricelist-btn"
            className="flex items-center gap-2 px-7 py-4 bg-white/80 dark:bg-obsidian-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-amber-300 font-bold text-xs md:text-sm tracking-wide rounded-2xl border border-slate-300 dark:border-amber-500/30 hover:border-amber-500 backdrop-blur-sm active:scale-95 transition-all cursor-pointer shadow-md"
            title="Download Official 2026 Price List PDF"
          >
            <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Download Price List (PDF)</span>
          </a>

          {/* Secondary Button: Reserve Visiting Slot */}
          {SHOW_SLOT_BOOKING_UI && onOpenSlotModal && (
            <button
              type="button"
              onClick={onOpenSlotModal}
              className="flex items-center gap-2 px-7 py-4 bg-white/80 dark:bg-obsidian-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-amber-300 font-bold text-xs md:text-sm tracking-wide rounded-2xl border border-slate-300 dark:border-amber-500/30 hover:border-amber-500 backdrop-blur-sm active:scale-95 transition-all cursor-pointer shadow-md"
            >
              <Ticket className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Reserve VIP Visiting Slot</span>
            </button>
          )}
        </div>

        {/* Quick link to retrieve existing pass */}
        {SHOW_SLOT_BOOKING_UI && (
          <div className="pt-2">
            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-gold-300 transition"
            >
              <span>Already reserved a slot?</span>
              <span className="font-bold underline text-amber-600 dark:text-gold-400">Find &amp; View My Pass</span>
              <ArrowRight className="w-3 h-3 text-amber-600 dark:text-gold-400" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
