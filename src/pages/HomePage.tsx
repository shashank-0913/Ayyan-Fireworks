import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  Flame, 
  MapPin, 
  Award, 
  Users, 
  ShieldAlert
} from 'lucide-react';
import { useAyyanStore } from '../context/AppContext';
import { ProductCard } from '../components/customer/ProductCard';
import { ProductSafetyModal } from '../components/customer/ProductSafetyModal';
import { LegalComplianceBanner } from '../components/common/LegalComplianceBanner';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products } = useAyyanStore();
  const [safetyModalProduct, setSafetyModalProduct] = useState<Product | null>(null);

  const featuredProducts = products.filter((p: Product) => p.is_active).slice(0, 6);

  const TRUST_PILLARS = [
    {
      icon: ShieldCheck,
      title: 'PESO Licensed & CSIR-NEERI Green Certified',
      description: 'Zero barium nitrate, low-smoke formulation, and 100% statutory compliant for safer family celebrations.'
    },
    {
      icon: Award,
      title: 'Direct Factory Transparency',
      description: 'Direct Sivakasi manufacturing pricing without middleman markups. Discover accurate rates upfront in our live catalogue.'
    },
    {
      icon: Users,
      title: 'In-Store VIP Showroom Experience',
      description: 'Avoid festive crowd rush. Book a dedicated 1-hour air-conditioned consultation slot for personalized selection.'
    },
    {
      icon: Flame,
      title: 'Heritage Craftsmanship Since 1923',
      description: 'Over a century of pyrotechnic mastery, precision timing fuses, and unmatched color vibrancy.'
    }
  ];

  const SAFETY_RULES = [
    {
      title: 'Always Maintain 10-Meter Clearance',
      desc: 'Ensure all spectators, children, and inflammable items remain safely behind the 10m safety perimeter.'
    },
    {
      title: 'Use Agarbatti or Extended Torches',
      desc: 'Never light fireworks holding matchsticks in hand or bending directly over the fireworks tube.'
    },
    {
      title: 'Dual Bucket Protocol',
      desc: 'Keep one bucket of fresh water and one bucket of dry sand nearby before beginning any fireworks session.'
    },
    {
      title: 'Never Re-ignite Misfires',
      desc: 'If a firework does not ignite, wait 15 minutes and submerge it in water. Never inspect closely.'
    }
  ];

  return (
    <div className="relative space-y-20 pb-20 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Glow Radial Embers Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-b from-amber-500/15 via-gold-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Heritage Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest shadow-glow-gold animate-float">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Ayyan Fireworks • Sivakasi 2026 Festive Showcase</span>
          </div>

          {/* Dynamic Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.1]">
              Experience the Sparkle of Tradition —{' '}
              <span className="gold-gradient-text block sm:inline">
                Certified, Safe & Spectacular.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300/90 font-normal max-w-2xl mx-auto leading-relaxed">
              Explore our transparent 2026 digital price catalogue and reserve your exclusive in-store VIP visiting slot at our flagship Sivakasi showroom.
            </p>
          </div>

          {/* Dual Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/catalogue"
              className="w-full sm:w-auto gold-gradient-btn px-8 py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2.5 group"
            >
              <BookOpen className="w-5 h-5 text-obsidian-950" />
              <span>Browse 2026 Festive Catalogue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/book-slot"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:glass-panel-gold border border-gold-500/30 text-gold-300 hover:text-white text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-glass"
            >
              <Calendar className="w-5 h-5 text-gold-400" />
              <span>Reserve Showroom Slot</span>
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>PESO Licensed Showroom</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Direct Factory Pricing</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Zero Delivery Hazards</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4 text-gold-400 shrink-0" />
                <span>In-Store VIP Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATUTORY LEGAL COMPLIANCE HIGHLIGHT */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalComplianceBanner />
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED 2026 FESTIVE CATALOGUE SHOWCASE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Curated Festive Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              2026 Flagship Pyrotechnic Range
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              From electric low-smoke sparklers to sovereign 120-shot grand aerial display cakes, explore authentic Sivakasi creations.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="flex items-center gap-2 text-xs font-bold text-gold-400 hover:text-gold-300 group shrink-0"
          >
            <span>View Full Digital Catalogue ({products.length} Items)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenSafety={(p: Product) => setSafetyModalProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY AYYAN FIREWORKS / TRUST PILLARS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-white/[0.08] p-8 sm:p-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Safety • Transparency • Authenticity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Celebrations Trust Ayyan Fireworks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Engineered with advanced green chemistry and verified quality controls in the fireworks capital of India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-obsidian-950/80 border border-white/5 space-y-3 hover:border-gold-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SAFETY DISCOVERY & SAFE FIRING CIVICS HUB */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Responsible Festive Celebrations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Ayyan Pyrotechnic Safety Charter
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every festive joy must be safe for family, neighbours, and community. Please follow these statutory safety protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAFETY_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-2.5 relative overflow-hidden"
            >
              <div className="text-xl font-black text-gold-400 font-mono">0{idx + 1}</div>
              <h3 className="text-sm font-bold text-slate-100">{rule.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SHOWROOM VIP VISIT CTA BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-obsidian-900 via-amber-950/40 to-obsidian-900 border-2 border-gold-500/40 p-8 sm:p-12 backdrop-blur-2xl shadow-glow-gold-lg">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Sivakasi Flagship Visiting Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Skip The Crowds. Enjoy A Personalized Fireworks Selection Tour.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reserve your free 1-hour VIP Visiting Slot at our Police Station Road Showroom in Sivakasi. Our pyrotechnic consultants will guide you through effect demonstrations, box breakdowns, and statutory vehicle loading.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/book-slot"
                className="gold-gradient-btn px-8 py-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-obsidian-950" />
                <span>Reserve Free VIP Visiting Pass</span>
              </Link>

              <Link
                to="/showroom"
                className="px-6 py-3.5 rounded-xl bg-obsidian-950 hover:bg-slate-900 border border-white/10 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Showroom Location & Parking Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Modal Drawer */}
      <ProductSafetyModal
        product={safetyModalProduct}
        onClose={() => setSafetyModalProduct(null)}
      />
    </div>
  );
};
