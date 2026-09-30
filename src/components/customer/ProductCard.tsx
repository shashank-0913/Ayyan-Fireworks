import React, { useState } from 'react';
import { 
  Package, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Volume2,
  ZoomIn
} from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/utils';
import { ProductImageLightbox } from './ProductImageLightbox';

interface ProductCardProps {
  product: Product;
  onOpenSafety?: (product: Product) => void;
  onImageClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onImageClick }) => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const [isInternalLightboxOpen, setIsInternalLightboxOpen] = useState(false);

  const descriptionText = product.description || "Authentic Sivakasi festive pyrotechnic masterpiece crafted with premium Bunny Brand quality standards.";
  const isLongDescription = descriptionText.length > 90;

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(product);
    } else {
      setIsInternalLightboxOpen(true);
    }
  };

  return (
    <>
      <div className="group relative rounded-3xl bg-white dark:bg-obsidian-900/70 border border-slate-200/90 dark:border-white/[0.09] hover:border-amber-500/50 dark:hover:border-gold-500/40 p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-sm hover:shadow-xl dark:shadow-xl dark:hover:shadow-glow-gold backdrop-blur-xl">
        <div className="space-y-4">
          {/* =================================================================== */}
          {/* 1. [TOP] PRODUCT IMAGE (Clickable Fullscreen Lightbox Trigger)       */}
          {/* =================================================================== */}
          <div 
            onClick={handleImageClick}
            className="product-image-container relative h-48 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-inner cursor-pointer"
            title="Click to view full image in high resolution"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick();
              }
            }}
          >
            <img
              src={product.image_url || product.image || product.imageUrl || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60"}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-obsidian-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Hover Zoom Hint */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Zoom Image</span>
              </span>
            </div>

            {/* Category & Item Code Badge pinned to top-left corner */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-xl bg-white/95 dark:bg-obsidian-950/90 backdrop-blur-md border border-amber-400/50 dark:border-gold-500/40 text-amber-700 dark:text-gold-300 font-bold text-[11px] uppercase tracking-wider shadow-md">
                {product.category}
              </span>
              {product.code && (
                <span className="px-2 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 font-mono font-bold text-[10px] shadow-md">
                  #{product.code}
                </span>
              )}
            </div>

            {/* Sound / Atmosphere Pill pinned to top-right corner if available */}
            {product.sound_level && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-obsidian-950/90 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-medium flex items-center gap-1 shadow-md z-10 pointer-events-none">
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
            <h3 
              onClick={handleImageClick}
              className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug group-hover:text-amber-600 dark:group-hover:text-gold-300 transition-colors tracking-tight cursor-pointer"
            >
              {product.name}
            </h3>

            {/* Pack Count & Prominent Gold Price */}
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-obsidian-950/80 border border-amber-200/80 dark:border-white/[0.06] space-y-2">
              <div className="flex items-baseline justify-between gap-2">
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

              {/* Per-piece / Per-unit Calculation Breakdown */}
              {(product.unit_breakdown || (product.unit_price && product.unit_name)) && (
                <div className="pt-2 border-t border-amber-200/50 dark:border-white/5 flex items-center justify-between gap-1 text-[11px] text-amber-900 dark:text-gold-300/90 font-medium">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">Unit Calculation:</span>
                  <span className="font-mono font-bold bg-amber-100/70 dark:bg-gold-500/10 px-2 py-0.5 rounded-md border border-amber-300/50 dark:border-gold-500/20">
                    {product.unit_breakdown || `→ ${formatINR(product.unit_price!)} / ${product.unit_name}`}
                  </span>
                </div>
              )}
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

        {/* View Full Image Action Bar */}
        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={handleImageClick}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 dark:bg-slate-800/80 dark:hover:bg-amber-500/20 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[40px] cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
            <span>Click Image to Zoom</span>
          </button>
        </div>
      </div>

      {/* Internal Lightbox Fallback if parent doesn't handle modal */}
      {isInternalLightboxOpen && (
        <ProductImageLightbox
          product={product}
          onClose={() => setIsInternalLightboxOpen(false)}
        />
      )}
    </>
  );
};
