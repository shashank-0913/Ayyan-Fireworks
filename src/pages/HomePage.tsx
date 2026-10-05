import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Flame, 
  Clock, 
  Ticket, 
  MapPin, 
  ShieldCheck, 
  Package, 
  Award, 
  Navigation 
} from 'lucide-react';
import { ReserveSlotModal } from '../components/customer/ReserveSlotModal';
import { StatutoryComplianceBanner } from '../components/common/StatutoryComplianceBanner';
import { SHOWROOM_CONTACT, getWhatsAppUrl } from '../lib/utils';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const HomePage: React.FC = () => {
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  const crackerCategories = [
    {
      title: 'Grand Aerial Display Cakes',
      subtitle: 'Multi-shot sky spectacles with vivid aerial breaks',
      tag: 'Festive Bestseller',
      icon: Flame,
      color: 'from-amber-500/20 to-orange-500/10'
    },
    {
      title: 'Electric & Colour Sparklers',
      subtitle: 'Low-smoke, extra-long duration family favourites',
      tag: 'Certified Safe',
      icon: Sparkles,
      color: 'from-yellow-500/20 to-amber-500/10'
    },
    {
      title: 'Flower Pots & Fountains',
      subtitle: 'High-altitude multi-colour sprays and glitter showers',
      tag: 'Classic Glow',
      icon: Award,
      color: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      title: 'Chakkars & Ground Spinners',
      subtitle: 'High-velocity spinning wheels with lotus effects',
      tag: 'Kids Friendly',
      icon: Package,
      color: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      title: 'Sound Maroons & Crackers',
      subtitle: 'Crisp, rhythmic traditional Sivakasi festive sound',
      tag: 'Green Cracker Certified',
      icon: ShieldCheck,
      color: 'from-red-500/20 to-rose-500/10'
    },
    {
      title: 'Curated Gift Boxes & Hampers',
      subtitle: 'All-in-one assorted festive packs for family celebrations',
      tag: 'Best Value',
      icon: Package,
      color: 'from-purple-500/20 to-pink-500/10'
    }
  ];

  return (
    <div className="relative space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
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
                Certified, Safe & Spectacular.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore authentic Sivakasi Green Crackers &amp; Novelties, direct factory pricing, and priority showroom visiting passes at our Visakhapatnam flagship store.
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

            {/* Secondary Button: Reserve Visiting Slot */}
            <button
              type="button"
              onClick={() => setIsSlotModalOpen(true)}
              className="flex items-center gap-2 px-7 py-4 bg-white/80 dark:bg-obsidian-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-amber-300 font-bold text-xs md:text-sm tracking-wide rounded-2xl border border-slate-300 dark:border-amber-500/30 hover:border-amber-500 backdrop-blur-sm active:scale-95 transition-all cursor-pointer shadow-md"
            >
              <Ticket className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Reserve VIP Visiting Slot</span>
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

      {/* Statutory Compliance Notice Banner on Homepage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatutoryComplianceBanner variant="compact" />
      </section>

      {/* ========================================================================= */}
      {/* 2. PROMINENT 2026 CATALOGUE GATEWAY BANNER                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-obsidian-900 to-obsidian-950 border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>2026 Festive Season Master Collection</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
                Authentic Sivakasi Green Crackers &amp; Novelties
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Browse complete piece counts, safety instructions, high-definition videos, sound decibel classifications, and direct factory pricing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                to="/catalogue"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Full Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIVAKASI GREEN CRACKER CATEGORIES SHOWCASE                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-gold-400 uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Green Crackers &amp; Sivakasi Novelties</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curated Festive Range
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Click on any category to view full specifications, sound levels, and authentic 2026 festive rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crackerCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to="/catalogue"
                className="group relative p-6 rounded-3xl bg-white dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.color} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-gold-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {cat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-gold-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-gold-400 relative z-10">
                  <span>Browse in Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOWROOM LOCATION & VISITING GUIDELINES                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-100 dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/10 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-gold-400 uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>Flagship Showroom Details</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Visakhapatnam Operations & Experience Centre
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={SHOWROOM_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Directions</span>
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Key Benefits 3-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-gold-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Extended Showroom Hours</h4>
                <p className="leading-relaxed">{SHOWROOM_CONTACT.operationalHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">100% Certified Green Crackers</h4>
                <p className="leading-relaxed">All products carry authentic Sivakasi Bunny Brand barcode seals and QR emission compliance.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Ample Parking & Easy Cargo Access</h4>
                <p className="leading-relaxed">{SHOWROOM_CONTACT.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
