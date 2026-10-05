import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Package, 
  Volume2, 
  ArrowUpDown, 
  X, 
  Flame,
  Tag,
  CheckCircle2,
  Loader2,
  List,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { useAyyanStore } from '../context/AppContext';
import { ProductCard } from '../components/customer/ProductCard';
import { ProductRow } from '../components/customer/ProductRow';
import { ProductImageLightbox } from '../components/customer/ProductImageLightbox';
import { ProductSafetyModal } from '../components/customer/ProductSafetyModal';
import { StatutoryComplianceBanner } from '../components/common/StatutoryComplianceBanner';
import { useEstimate } from '../context/EstimateContext';
import { EstimateDrawer } from '../components/customer/EstimateDrawer';
import { Product, SoundLevel } from '../types';
import { formatINR } from '../lib/utils';

// Official Ayyan Category Pill Tabs
export const CATEGORY_PILL_TABS = [
  'All',
  'Maroons',
  'Sparklers',
  'Chakkars & Wheels',
  'Flower Pots',
  'Colour Fountains',
  'Rockets & Novelties',
  'Aerial Cakes',
  'Safety Matches',
  'Gift Boxes'
] as const;

export type CategoryTab = typeof CATEGORY_PILL_TABS[number];

export const CataloguePage: React.FC = () => {
  const { products, refreshProducts, isLoading } = useAyyanStore();
  const { totalItemsCount, totalEstimatePrice, setIsEstimateDrawerOpen } = useEstimate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('All');
  const [selectedSound, setSelectedSound] = useState<'All' | SoundLevel>('All');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high'>('default');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);

  // Fetch fresh products directly on mount with Supabase
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Category Matching Helper
  const matchesCategoryTab = (product: Product, tab: CategoryTab): boolean => {
    if (tab === 'All') return true;
    const cat = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();

    switch (tab) {
      case 'Maroons':
        return cat.includes('maroon') || name.includes('maroon') || name.includes('cracker') || name.includes('sound');
      case 'Sparklers':
        return cat.includes('sparkler') || name.includes('sparkler');
      case 'Chakkars & Wheels':
        return cat.includes('chakkar') || cat.includes('wheel') || cat.includes('spinner') || name.includes('chakkar') || name.includes('wheel') || name.includes('spinner') || name.includes('lotus');
      case 'Flower Pots':
        return (cat.includes('pot') || cat.includes('flower') || name.includes('pot')) && !cat.includes('colourful');
      case 'Colour Fountains':
        return cat.includes('colour') || cat.includes('fountain') || name.includes('fountain') || name.includes('jadugar') || name.includes('peacock') || name.includes('drops') || name.includes('patrol') || name.includes('manoranjan') || name.includes('roopkhela') || name.includes('varnajal');
      case 'Rockets & Novelties':
        return cat.includes('rocket') || cat.includes('novelties') || cat.includes('missile') || name.includes('rocket') || name.includes('missile') || name.includes('drone') || name.includes('pop');
      case 'Aerial Cakes':
        return cat.includes('cake') || cat.includes('shot') || cat.includes('aerial') || name.includes('shot') || name.includes('cake') || name.includes('star') || name.includes('mangal');
      case 'Safety Matches':
        return cat.includes('match') || name.includes('match') || name.includes('pops') || name.includes('ninja') || name.includes('twyla');
      case 'Gift Boxes':
        return cat.includes('gift') || cat.includes('hamper') || cat.includes('box') || name.includes('hamper') || name.includes('box');
      default:
        return true;
    }
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p: Product) => {
        if (!p.is_active) return false;

        // 1. Live Search Bar matching: product name, category, description, piece count, safety tags
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchCategory = p.category?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchPieceCount = p.piece_count?.toLowerCase().includes(q);
          const matchTags = p.safety_tags?.some((t: string) => t.toLowerCase().includes(q));
          
          if (!matchName && !matchCategory && !matchDesc && !matchPieceCount && !matchTags) {
            return false;
          }
        }

        // 2. Category Pill Tab Matching
        if (!matchesCategoryTab(p, selectedCategory)) {
          return false;
        }

        // 3. Sound Level matching
        if (selectedSound !== 'All' && p.sound_level !== selectedSound) {
          return false;
        }

        // 4. Maximum Price Slider
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return 0; // Default / Recommended
      });
  }, [products, searchQuery, selectedCategory, selectedSound, maxPrice, sortBy]);

  // Compute counts for each category tab
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORY_PILL_TABS.forEach(tab => {
      counts[tab] = tab === 'All' 
        ? products.filter(p => p.is_active).length 
        : products.filter(p => p.is_active && matchesCategoryTab(p, tab)).length;
    });

    return counts as Record<CategoryTab, number>;
  }, [products]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSound('All');
    setMaxPrice(15000);
    setSortBy('default');
  };

  const isFiltering = searchQuery || selectedCategory !== 'All' || selectedSound !== 'All' || maxPrice < 15000 || sortBy !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24 sm:pb-12">
      
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER                                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400 animate-pulse" />
            <span>Official 2026 CSIR-NEERI Green Crackers Price Master</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sivakasi Green Crackers Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Explore genuine Bunny Brand Sivakasi Sparklers &amp; Novelties, piece breakdowns, dynamic INR rates, and safety handling instructions.
          </p>
        </div>

        {/* Floating / Sticky Estimate Cart Badge Trigger */}
        {totalItemsCount > 0 && (
          <button
            type="button"
            onClick={() => setIsEstimateDrawerOpen(true)}
            className="self-center md:self-auto flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg dark:shadow-glow-gold active:scale-95 transition-all cursor-pointer border border-amber-300 animate-bounce"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-950 text-gold-300 flex items-center justify-center font-mono text-xs font-bold">
              {totalItemsCount}
            </div>
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-slate-900 leading-none">Showroom Estimate</span>
              <span className="text-sm font-mono font-black">{formatINR(totalEstimatePrice)}</span>
            </div>
            <FileText className="w-4 h-4 ml-1 text-slate-950" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. PROMINENT SUPREME COURT STATUTORY COMPLIANCE BANNER                    */}
      {/* ========================================================================= */}
      <StatutoryComplianceBanner variant="prominent" />

      {/* ========================================================================= */}
      {/* 3. SEARCH & QUICK FILTERS CONTROL PANEL                                   */}
      {/* ========================================================================= */}
      <div className="rounded-3xl p-5 sm:p-7 space-y-5 sm:space-y-6 border border-amber-300/80 dark:border-gold-500/30 bg-white dark:bg-obsidian-900/85 shadow-md dark:shadow-glass backdrop-blur-xl">
        
        {/* Top Row: Live Search Bar, Layout Toggle & Sort Options */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
          
          {/* Live Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-amber-600 dark:text-gold-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Green Crackers by name (e.g., 'sparkler', 'pot', '12 shot', 'chakkars')..."
              className="w-full bg-slate-50 dark:bg-obsidian-950/90 border border-slate-300 dark:border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 dark:focus:border-gold-400 focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[48px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Clear Search Input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Switcher Toggle & Sort Options */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            
            {/* Layout Switcher (List / Row View vs Grid View) */}
            <div className="flex items-center bg-slate-100 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-2xl p-1 min-h-[48px] shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-amber-800 dark:text-gold-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List / Table Row View"
                aria-label="Switch to List Row View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Row View</span>
              </button>
              
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-amber-800 dark:text-gold-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid Card View"
                aria-label="Switch to Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid View</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-2xl px-4 py-3 min-h-[48px] flex-1 sm:flex-none shadow-xs">
              <ArrowUpDown className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
                >
                  <option value="default" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Featured / Recommended</option>
                  <option value="price_low" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Price: Low → High</option>
                  <option value="price_high" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Reset Filter Button */}
            {isFiltering && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 dark:bg-gold-500/15 dark:hover:bg-gold-500/25 border border-amber-500/30 dark:border-gold-500/30 text-xs font-bold text-amber-800 dark:text-gold-300 flex items-center gap-1.5 whitespace-nowrap transition-colors min-h-[48px] shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs Row */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
              <span>Sivakasi Sparklers &amp; Novelty Categories:</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> items
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {CATEGORY_PILL_TABS.map((tab) => {
              const active = selectedCategory === tab;
              const count = categoryCounts[tab] || 0;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategory(tab)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 min-h-[44px] flex items-center gap-2 shrink-0 active:scale-95 shadow-xs cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 text-slate-950 font-extrabold shadow-md dark:shadow-glow-gold ring-2 ring-amber-400/50'
                      : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-obsidian-950/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    active 
                      ? 'bg-slate-950/20 text-slate-950 font-bold' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Controls: Price Slider & Sound Decibels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-200/80 dark:border-white/10">
          
          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                <span>Max Price Filter:</span>
              </span>
              <span className="font-mono font-bold text-amber-700 dark:text-gold-300 text-sm">
                Up to {formatINR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="15000"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 dark:accent-gold-500 bg-slate-200 dark:bg-obsidian-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹ 20</span>
              <span>₹ 7,500</span>
              <span>₹ 15,000+</span>
            </div>
          </div>

          {/* Sound Decibels Filter */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
              <span>Sound &amp; Spectacle Level:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {(['All', 'Low / Silent', 'Medium', 'High Spectacle'] as const).map((sound) => (
                <button
                  key={sound}
                  type="button"
                  onClick={() => setSelectedSound(sound)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] flex items-center active:scale-95 cursor-pointer ${
                    selectedSound === sound
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/50 font-bold shadow-xs'
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

      {/* ========================================================================= */}
      {/* 4. CATALOGUE PRODUCTS LIST / GRID OR ZERO STATE                           */}
      {/* ========================================================================= */}
      {isLoading && products.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading live Green Crackers catalogue from Supabase...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Showing <strong className="text-slate-900 dark:text-white font-extrabold">{filteredProducts.length}</strong> certified Green Cracker items
                {selectedCategory !== 'All' && <span> in <strong className="text-amber-700 dark:text-gold-300">{selectedCategory}</strong></span>}
                {searchQuery && <span> matching &ldquo;<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>&rdquo;</span>}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Layout: {viewMode === 'list' ? 'Vertical Table / Row View' : 'Card Grid View'}
            </span>
          </div>

          {/* List / Row View (Standard e-commerce table / row layout) */}
          {viewMode === 'list' ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              {filteredProducts.map((product: Product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onImageClick={setLightboxProduct}
                  onOpenDetails={setDetailsProduct}
                />
              ))}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onImageClick={setLightboxProduct}
                  onOpenDetails={setDetailsProduct}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-gold-500/10 border border-amber-500/20 dark:border-gold-500/20 flex items-center justify-center mx-auto text-amber-600 dark:text-gold-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Green Crackers Matched Your Filter</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find any items matching &ldquo;<strong>{searchQuery || selectedCategory}</strong>&rdquo;. Try searching for &ldquo;sparkler&rdquo;, &ldquo;pot&rdquo;, &ldquo;12 shot&rdquo;, or resetting your filters.
          </p>
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-2xl bg-amber-500 dark:bg-gold-500 text-slate-950 font-extrabold text-xs shadow-md dark:shadow-glow-gold min-h-[44px] active:scale-95 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Product Image Lightbox Modal */}
      <ProductImageLightbox
        product={lightboxProduct}
        onClose={() => setLightboxProduct(null)}
      />

      {/* Detailed Product Specs & Safety Modal */}
      <ProductSafetyModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
      />

      {/* Estimate & Inquiry Drawer */}
      <EstimateDrawer />
    </div>
  );
};
