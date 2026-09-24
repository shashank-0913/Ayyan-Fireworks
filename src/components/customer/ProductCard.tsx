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

  return (
    <div className="group relative rounded-3xl glass-panel hover:glass-panel-gold border border-white/[0.09] hover:border-gold-500/40 p-5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl hover:shadow-glow-gold bg-obsidian-900/60 backdrop-blur-xl">
      <div className="space-y-4">
        {/* =================================================================== */}
        {/* 1. [TOP] PRODUCT IMAGE                                              */}
        {/*    - High-quality image container with category badge pinned        */}
        {/* =================================================================== */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10 shadow-inner">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-black/20 pointer-events-none" />

          {/* Category Badge pinned to top-left corner */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-gold-500/40 text-gold-300 font-bold text-[11px] uppercase tracking-wider shadow-lg">
            {product.category}
          </div>

          {/* Sound / Atmosphere Pill pinned to top-right corner if available */}
          {product.sound_level && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-medium flex items-center gap-1 shadow-lg">
              <Volume2 className="w-3 h-3 text-gold-400" />
              <span>{product.sound_level}</span>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 2. [DOWN / MIDDLE] NAME & PRICING                                   */}
        {/*    - Product Name (Bold, clean heading)                             */}
        {/*    - Pack / Piece count (e.g. "Pack of 10")                         */}
        {/*    - Prominent Price in ₹ INR (Highlighted in radiant gold text)    */}
        {/* =================================================================== */}
        <div className="space-y-2.5 pt-1">
          {/* Product Name */}
          <h3 className="font-display font-bold text-white text-lg sm:text-xl leading-snug group-hover:text-gold-300 transition-colors tracking-tight">
            {product.name}
          </h3>

          {/* Pack Count & Prominent Gold Price */}
          <div className="flex items-baseline justify-between gap-2 p-3 rounded-2xl bg-obsidian-950/70 border border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Showroom Price
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-300 font-mono tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.25)]">
                {formatINR(product.price)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Packaging
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Package className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>{product.piece_count}</span>
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. [BOTTOM] DETAILED DESCRIPTION                                    */}
        {/*    - Clean typography displaying owner description                  */}
        {/*    - Subtle collapsible "Safety Guide" text for precautions         */}
        {/* =================================================================== */}
        <div className="space-y-3 pt-1">
          {/* Description */}
          <p className="text-slate-300/90 text-xs sm:text-sm leading-relaxed font-normal">
            {product.description || "Authentic Sivakasi festive pyrotechnic masterpiece crafted under strict statutory quality standards."}
          </p>

          {/* Collapsible Safety Guide */}
          {product.safety_instructions && (
            <div className="rounded-xl border border-white/10 bg-obsidian-950/50 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => setIsSafetyOpen(prev => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-gold-300 transition-colors"
              >
                <span className="flex items-center gap-1.5 text-amber-400">
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
                <div className="px-3 pb-3 pt-1 text-[11px] text-slate-300 border-t border-white/5 space-y-1.5 animate-in fade-in duration-200">
                  <p className="leading-relaxed">{product.safety_instructions}</p>
                  {product.safety_tags && product.safety_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.safety_tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-medium"
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
      {/* 4. [ACTION FOOTER]                                                  */}
      {/*    - "Book Showroom Slot" button                                    */}
      {/* =================================================================== */}
      <div className="pt-4 mt-4 border-t border-white/[0.08]">
        <Link
          to="/book-slot"
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 hover:from-gold-400 hover:to-amber-300 text-obsidian-950 font-extrabold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-glow-gold hover:shadow-[0_0_24px_rgba(245,158,11,0.5)] active:scale-[0.98]"
        >
          <CalendarCheck className="w-4 h-4 text-obsidian-950" />
          <span>Book Showroom Slot</span>
        </Link>
      </div>
    </div>
  );
};
