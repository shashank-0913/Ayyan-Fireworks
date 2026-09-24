import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Package, 
  Volume2, 
  ArrowUpDown, 
  X, 
  Flame,
  Sparkles,
  CalendarCheck,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAyyanStore } from '../context/AppContext';
import { ProductCard } from '../components/customer/ProductCard';
import { LegalComplianceBanner } from '../components/common/LegalComplianceBanner';
import { Product, ProductCategory, SoundLevel, PRODUCT_CATEGORIES } from '../types';
import { formatINR } from '../lib/utils';

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  ...PRODUCT_CATEGORIES
];

export const CataloguePage: React.FC = () => {
  const { products } = useAyyanStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [selectedSound, setSelectedSound] = useState<'All' | SoundLevel>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high'>('default');

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p: Product) => {
        if (!p.is_active) return false;

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchCategory = p.category?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchTags = p.safety_tags?.some((t: string) => t.toLowerCase().includes(q));
          if (!matchName && !matchCategory && !matchDesc && !matchTags) return false;
        }

        // Category matching (with fuzzy/alias matching)
        if (selectedCategory !== 'All') {
          const pCat = p.category?.toLowerCase() || '';
          const sCat = selectedCategory.toLowerCase();
          if (pCat !== sCat && !pCat.includes(sCat) && !sCat.includes(pCat)) {
            return false;
          }
        }

        // Sound Level matching
        if (selectedSound !== 'All' && p.sound_level !== selectedSound) {
          return false;
        }

        // Price Slider
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedSound, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSound('All');
    setMaxPrice(10000);
    setSortBy('default');
  };

  const isFiltering = searchQuery || selectedCategory !== 'All' || selectedSound !== 'All' || maxPrice < 10000 || sortBy !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8 pb-24 sm:pb-12">
      {/* Page Header */}
      <div className="space-y-2.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-glow-gold">
          <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400 animate-pulse" />
          <span>Official 2026 Factory Price Master</span>
        </div>
        <h1 className="text-2xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sivakasi Pyrotechnic Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Explore genuine PESO-certified formulations, piece breakdowns, dynamic INR rates, and safety handling instructions.
        </p>
      </div>

      {/* Statutory Banner */}
      <LegalComplianceBanner compact />

      {/* ========================================================================= */}
      {/* ZERO PRODUCTS FESTIVE EMPTY STATE / CLEAN SLATE                           */}
      {/* ========================================================================= */}
      {products.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-amber-300/60 dark:border-gold-500/30 p-6 sm:p-16 text-center shadow-lg dark:shadow-2xl bg-gradient-to-b from-white via-amber-50/40 to-white dark:from-obsidian-900/90 dark:via-obsidian-950/95 dark:to-obsidian-950">
          {/* Decorative festive ambient glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 dark:bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Festive Icon / Badge */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 border border-amber-400/50 dark:border-gold-500/40 flex items-center justify-center mx-auto shadow-md dark:shadow-glow-gold">
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-amber-600 dark:text-gold-400 animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-gold-300 text-[11px] font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                <span>Season 2026 Collection Preparation</span>
              </div>

              <h2 className="text-xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                2026 Festive Catalogue Updating
              </h2>

              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                Our team is curating this season&apos;s certified collection and daily pricing. Check back shortly or reserve your showroom visiting slot below.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
              <div className="p-3 rounded-xl bg-white dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>PESO Certified</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 shadow-xs">
                <Flame className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
                <span>100% Green Chemistry</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Direct Factory Rate</span>
              </div>
            </div>

            {/* Call to Action: Reserve Showroom Slot */}
            <div className="pt-2 sm:pt-4">
              <Link
                to="/book-slot"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 dark:from-gold-500 dark:via-amber-400 dark:to-gold-500 hover:from-amber-400 hover:to-amber-300 text-obsidian-950 font-extrabold text-sm tracking-wide uppercase shadow-md dark:shadow-glow-gold hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-0.5 active:scale-95 min-h-[48px]"
              >
                <CalendarCheck className="w-5 h-5 text-obsidian-950" />
                <span>Reserve Showroom Slot</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter & Search Control Panel */}
          <div className="rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-5 border border-amber-300/70 dark:border-gold-500/25 bg-white dark:bg-obsidian-900/80 shadow-sm dark:shadow-glass backdrop-blur-xl">
            {/* Search Bar & Sort Dropdown */}
            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by firework name, category, or feature..."
                  className="w-full bg-slate-50 dark:bg-obsidian-950/90 border border-slate-300 dark:border-white/10 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors min-h-[44px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3.5 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white min-h-[32px] min-w-[32px] flex items-center justify-center"
                    aria-label="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-2xl px-4 py-2.5 w-full md:w-auto min-h-[44px]">
                  <ArrowUpDown className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
                  >
                    <option value="default" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Sort: Recommended</option>
                    <option value="price_low" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Price: Low to High</option>
                    <option value="price_high" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Price: High to Low</option>
                  </select>
                </div>

                {isFiltering && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-obsidian-950 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-300 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-gold-300 flex items-center gap-1.5 whitespace-nowrap transition-colors min-h-[44px]"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills - Momentum Touch Scroll */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                Filter by Pyrotechnic Category:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 min-h-[44px] flex items-center shrink-0 ${
                        active
                          ? 'bg-amber-500 dark:bg-gold-500 text-slate-950 shadow-md dark:shadow-glow-gold'
                          : 'bg-slate-100 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/40 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Filters: Price Slider & Sound Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-200 dark:border-white/10">
              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                    Maximum Price Filter:
                  </span>
                  <span className="font-mono font-bold text-amber-700 dark:text-gold-300 text-sm">
                    Up to {formatINR(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 dark:accent-gold-500 bg-slate-200 dark:bg-obsidian-950 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹ 100</span>
                  <span>₹ 5,000</span>
                  <span>₹ 10,000+</span>
                </div>
              </div>

              {/* Sound Level Pills */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                  Sound & Decibel Level:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['All', 'Low / Silent', 'Medium', 'High Spectacle'] as const).map((sound) => (
                    <button
                      key={sound}
                      onClick={() => setSelectedSound(sound)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] flex items-center ${
                        selectedSound === sound
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {sound}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Catalogue Results Header */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div>
              Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> certified fireworks items
              {selectedCategory !== 'All' && <span> in <strong className="text-amber-700 dark:text-gold-300">{selectedCategory}</strong></span>}
            </div>
          </div>

          {/* Products Grid - 1-col on mobile (< 640px), 2-col on sm, 3-col on lg, 4-col on xl */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Fireworks Matched Your Filter</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Try broadening your price range, searching for another category or resetting the active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-xl bg-amber-500 dark:bg-gold-500 text-obsidian-950 font-bold text-xs shadow-md dark:shadow-glow-gold min-h-[44px]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
