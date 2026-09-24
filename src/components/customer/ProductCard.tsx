import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  CalendarCheck,
  Volume2
} from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onOpenSafety?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);

  const descriptionText = product.description || "Authentic Sivakasi festive pyrotechnic masterpiece crafted under strict statutory quality standards.";
  const isLongDescription = descriptionText.length > 90;

  return (
    <div className="group relative rounded-3xl bg-white dark:bg-obsidian-900/70 border border-slate-200/90 dark:border-white/[0.09] hover:border-amber-500/50 dark:hover:border-gold-500/40 p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-sm hover:shadow-xl dark:shadow-xl dark:hover:shadow-glow-gold backdrop-blur-xl">
      <div className="space-y-4">
        {/* =================================================================== */}
        {/* 1. [TOP] PRODUCT IMAGE (Full-width aspect ratio with rounded corners) */}
        {/* =================================================================== */}
        <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-obsidian-950 border border-slate-200/80 dark:border-white/10 shadow-inner">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-obsidian-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Category Badge pinned to top-left corner */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-white/95 dark:bg-obsidian-950/90 backdrop-blur-md border border-amber-400/50 dark:border-gold-500/40 text-amber-700 dark:text-gold-300 font-bold text-[11px] uppercase tracking-wider shadow-md">
            {product.category}
          </div>

          {/* Sound / Atmosphere Pill pinned to top-right corner if available */}
          {product.sound_level && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-obsidian-950/90 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-medium flex items-center gap-1 shadow-md">
              <Volume2 className="w-3 h-3 text-amber-600 dark:text-gold-400" />
              <span>{product.sound_level}</span>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 2. [DOWN] NAME & BOLD ₹ INR PRICE BADGE                             */}
        {/* =================================================================== */}
        <div className="space-y-2.5 pt-1">
          {/* Product Name */}
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-xl leading-snug group-hover:text-amber-600 dark:group-hover:text-gold-300 transition-colors tracking-tight">
            {product.name}
          </h3>

          {/* Pack Count & Prominent Gold Price */}
          <div className="flex items-baseline justify-between gap-2 p-3 rounded-2xl bg-amber-50/70 dark:bg-obsidian-950/80 border border-amber-200/80 dark:border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                Showroom Price
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-gold-300 font-mono tracking-tight drop-shadow-[0_1px_8px_rgba(217,119,6,0.2)] dark:drop-shadow-[0_2px_12px_rgba(245,158,11,0.25)]">
                {formatINR(product.price)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                Packaging
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 shadow-xs">
                <Package className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400 shrink-0" />
                <span>{product.piece_count}</span>
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. [BOTTOM] DESCRIPTION WITH "Read more..." TAP TOGGLE               */}
        {/* =================================================================== */}
        <div className="space-y-3 pt-1">
          {/* Description Text with Tap Toggle */}
          <div className="text-slate-600 dark:text-slate-300/90 text-xs sm:text-sm leading-relaxed font-normal">
            <p className={isExpandedDesc ? '' : 'line-clamp-3'}>
              {descriptionText}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpandedDesc(prev => !prev)}
                className="mt-1 text-amber-600 dark:text-gold-400 hover:text-amber-700 dark:hover:text-gold-300 text-[11px] font-bold inline-flex items-center gap-1 min-h-[32px] focus:outline-none"
              >
                <span>{isExpandedDesc ? 'Show less' : 'Read more...'}</span>
                {isExpandedDesc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Collapsible Safety Guide */}
          {product.safety_instructions && (
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-obsidian-950/50 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => setIsSafetyOpen(prev => !prev)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-gold-300 transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Safety Guide & Precautions</span>
                </span>
                {isSafetyOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isSafetyOpen && (
                <div className="px-3 pb-3 pt-1 text-[11px] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-white/5 space-y-1.5 animate-in fade-in duration-200">
                  <p className="leading-relaxed">{product.safety_instructions}</p>
                  {product.safety_tags && product.safety_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.safety_tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-medium"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. [ACTION FOOTER] Full-width Touch-Friendly Button (Min 44px)       */}
      {/* =================================================================== */}
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/[0.08]">
        <Link
          to="/book-slot"
          className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 dark:from-gold-500 dark:via-amber-400 dark:to-gold-500 hover:from-amber-400 hover:to-amber-300 text-obsidian-950 font-extrabold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg dark:shadow-glow-gold dark:hover:shadow-[0_0_24px_rgba(245,158,11,0.5)] active:scale-[0.98]"
        >
          <CalendarCheck className="w-4 h-4 text-obsidian-950 shrink-0" />
          <span>Book Showroom Slot</span>
        </Link>
      </div>
    </div>
  );
};
