import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Flame, 
  Clock,
  Ticket
} from 'lucide-react';
import { useAyyanStore } from '../context/AppContext';
import { ProductCard } from '../components/customer/ProductCard';
import { ReserveSlotModal } from '../components/customer/ReserveSlotModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products } = useAyyanStore();
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  const featuredProducts = products.filter((p: Product) => p.is_active).slice(0, 6);

  return (
    <div className="relative space-y-20 pb-20 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
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
                Certified, Safe & Spectacular.
              </span>
            </h1>
          </div>

          {/* Hero CTA Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {/* Primary Button */}
            <a
              href="/catalogue"
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-black font-bold text-xs md:text-sm tracking-wider uppercase rounded-full shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore 2026 Price List</span>
            </a>

            {/* Replaced: Showroom & Directions -> Reserve Visiting Slot */}
            <button
              type="button"
              onClick={() => setIsSlotModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-black/70 hover:bg-black/90 text-amber-400 hover:text-amber-300 font-semibold text-xs md:text-sm tracking-wide rounded-full border border-amber-500/30 hover:border-amber-400 backdrop-blur-sm active:scale-95 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Reserve Visiting Slot</span>
            </button>
          </div>

          {/* Quick link to retrieve existing pass */}
          <div className="pt-2">
            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-gold-300 transition"
            >
              <span>Already reserved a slot?</span>
              <span className="font-bold underline text-amber-600 dark:text-gold-400">Find & View My Pass</span>
              <ArrowRight className="w-3 h-3 text-amber-600 dark:text-gold-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Slot Booking Modal */}
      <ReserveSlotModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 2. FEATURED 2026 FESTIVE CATALOGUE SHOWCASE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-gold-400 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Curated Festive Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              2026 Flagship Pyrotechnic Range
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              From electric low-smoke sparklers to sovereign grand aerial display cakes, explore authentic Sivakasi creations.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-gold-400 hover:text-amber-800 dark:hover:text-gold-300 group shrink-0"
          >
            <span>View Full Digital Catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid or Festive Update Card */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-300/70 dark:border-gold-500/30 p-8 sm:p-12 text-center space-y-5 bg-gradient-to-b from-white via-amber-50/40 to-white dark:from-obsidian-900/90 dark:to-obsidian-950 shadow-sm dark:shadow-glass">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 dark:bg-gold-500/10 border border-amber-400/50 dark:border-gold-500/30 flex items-center justify-center mx-auto text-amber-600 dark:text-gold-400 shadow-md dark:shadow-glow-gold">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-gold-300 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>2026 Festive Master Curation in Progress</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Official Season Pricing Updating Shortly
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our master pyrotechnicians are finalizing the certified festive line-up. Explore our digital price list or visit our Visakhapatnam showroom for live demonstrations.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 dark:bg-gold-500 hover:bg-amber-400 dark:hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-md dark:shadow-glow-gold transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Full Catalogue</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
