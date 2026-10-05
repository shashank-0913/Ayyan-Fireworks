import React, { useState } from 'react';
import { 
  Package, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Volume2,
  ZoomIn,
  Plus,
  Check,
  Leaf,
  Info
} from 'lucide-react';
import { Product } from '../../types';
import { formatINR, getWhatsAppUrl } from '../../lib/utils';
import { getTeluguSubtitle } from '../../lib/teluguSubtitles';
import { useEstimate } from '../../context/EstimateContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { ProductImageLightbox } from './ProductImageLightbox';
import { ProductSafetyModal } from './ProductSafetyModal';

interface ProductRowProps {
  product: Product;
  onImageClick?: (product: Product) => void;
  onOpenDetails?: (product: Product) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({ 
  product, 
  onImageClick,
  onOpenDetails
}) => {
  const { addToEstimate, isInEstimate, getItemQuantity } = useEstimate();

  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isInternalLightboxOpen, setIsInternalLightboxOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const teluguSubtitle = getTeluguSubtitle(product);
  const descriptionText = product.description || "Authentic Sivakasi Green Cracker masterpiece crafted with premium Bunny Brand quality standards.";
  const isLongDescription = descriptionText.length > 120;

  const inEstimate = isInEstimate(product.id);
  const currentQty = getItemQuantity(product.id);

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(product);
    } else {
      setIsInternalLightboxOpen(true);
    }
  };

  const handleOpenDetails = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else {
      setIsDetailsModalOpen(true);
    }
  };

  const handleAddEstimate = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToEstimate(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleQuickWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const codeStr = product.code ? `[#${product.code}] ` : '';
    const text = `🎆 *Product Inquiry — Ayyan Fireworks (Visakhapatnam)*\n\nItem: *${codeStr}${product.name}*\nCategory: ${product.category}\nPack: ${product.piece_count}\nRate: ${formatINR(product.price)}\n\nHello! I am planning to visit your Visakhapatnam showroom and would like to confirm stock availability for this item.`;
    const waUrl = getWhatsAppUrl(text);
    window.open(waUrl, '_blank');
  };

  return (
    <>
      <div className="group relative rounded-3xl bg-white dark:bg-obsidian-900/80 border border-slate-200/90 dark:border-white/[0.09] hover:border-amber-500/50 dark:hover:border-gold-500/40 p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md dark:hover:shadow-glow-gold backdrop-blur-xl">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          
          {/* ================================================================= */}
          {/* 1. LEFT: THUMBNAIL IMAGE WITH CODE & LIGHTBOX TRIGGER            */}
          {/* ================================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0">
            <div 
              onClick={handleImageClick}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-inner cursor-pointer shrink-0 group/img"
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
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover/img:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60';
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-1.5 rounded-full bg-black/75 text-white shadow-md">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                </span>
              </div>

              {/* Code Pill on Image */}
              {product.code && (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 font-mono font-bold text-[9px] shadow-sm">
                  #{product.code}
                </div>
              )}
            </div>

            {/* Mobile-only visible quick details beside image */}
            <div className="md:hidden flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-800 dark:text-gold-300 font-bold text-[10px] uppercase tracking-wider">
                  {product.category}
                </span>
                {product.sound_level && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    <Volume2 className="w-3 h-3 text-amber-600 dark:text-gold-400" />
                    <span>{product.sound_level}</span>
                  </span>
                )}
              </div>
              <h3 
                onClick={handleImageClick}
                className="font-display font-bold text-slate-900 dark:text-white text-base leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-gold-300"
              >
                {product.name}
              </h3>
              <p className="text-xs font-semibold text-amber-700 dark:text-gold-400">
                {teluguSubtitle}
              </p>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. MIDDLE: PRODUCT NAME, TELUGU SUBTITLE, SPECS & BADGES         */}
          {/* ================================================================= */}
          <div className="flex-1 min-w-0 space-y-2.5 w-full">
            
            {/* Desktop Title & Badges */}
            <div className="hidden md:flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/30 text-amber-800 dark:text-gold-300 font-bold text-[11px] uppercase tracking-wider">
                {product.category}
              </span>
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>100% Green Cracker (CSIR-NEERI)</span>
              </span>

              {product.sound_level && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  <Volume2 className="w-3 h-3 text-amber-600 dark:text-gold-400" />
                  <span>{product.sound_level}</span>
                </span>
              )}
            </div>

            {/* Product Name (Desktop) */}
            <div className="hidden md:block space-y-0.5">
              <h3 
                onClick={handleImageClick}
                className="font-display font-bold text-slate-900 dark:text-white text-lg hover:text-amber-600 dark:hover:text-gold-300 transition-colors tracking-tight cursor-pointer"
              >
                {product.name}
              </h3>
              <p className="text-xs font-semibold text-amber-700 dark:text-gold-400">
                {teluguSubtitle}
              </p>
            </div>

            {/* Description with read more */}
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <p className={isExpandedDesc ? '' : 'line-clamp-2 md:line-clamp-2'}>
                {descriptionText}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpandedDesc(prev => !prev)}
                  className="mt-0.5 text-amber-600 dark:text-gold-400 hover:text-amber-700 dark:hover:text-gold-300 text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <span>{isExpandedDesc ? 'Show less' : 'Read more...'}</span>
                  {isExpandedDesc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Spec & Safety Tags Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
                <Package className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400 shrink-0" />
                <span>Pack: <strong>{product.piece_count}</strong></span>
              </span>

              {(product.unit_breakdown || (product.unit_price && product.unit_name)) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-900 dark:text-gold-300 bg-amber-50 dark:bg-gold-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-gold-500/20">
                  <span>Unit Calc: </span>
                  <strong className="font-bold">{product.unit_breakdown || `₹${product.unit_price} / ${product.unit_name}`}</strong>
                </span>
              )}

              {product.safety_instructions && (
                <button
                  type="button"
                  onClick={() => setIsSafetyOpen(prev => !prev)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-gold-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:border-amber-400/50 transition-colors"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  <span>Safety Guide</span>
                  {isSafetyOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Collapsible safety accordion */}
            {isSafetyOpen && product.safety_instructions && (
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-obsidian-950 border border-amber-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Firing Protocol:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{product.safety_instructions}</p>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 3. RIGHT: PRICE BADGE & ACTION BUTTONS                           */}
          {/* ================================================================= */}
          <div className="w-full md:w-56 shrink-0 flex flex-col items-stretch md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-white/10">
            
            {/* Price block */}
            <div className="text-left md:text-right w-full flex md:flex-col items-baseline md:items-end justify-between md:justify-start gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                Showroom Price
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-gold-300 font-mono tracking-tight drop-shadow-xs">
                {formatINR(product.price)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full">
              
              {/* Primary Action: Add to Estimate / Inquiry */}
              <button
                type="button"
                onClick={handleAddEstimate}
                className={`w-full py-2.5 px-3.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer min-h-[42px] active:scale-95 shadow-xs ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white shadow-md'
                    : inEstimate
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-900 dark:text-gold-300 hover:bg-amber-500/30'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 text-slate-950 hover:from-amber-600 hover:to-gold-600 shadow-md dark:shadow-glow-gold'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Estimate!</span>
                  </>
                ) : inEstimate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>In Estimate ({currentQty}) + Add</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Estimate / Inquiry</span>
                  </>
                )}
              </button>

              {/* Secondary Actions Row: View Details & WhatsApp */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={handleOpenDetails}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[38px] cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickWhatsAppInquiry}
                  className="py-2 px-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[38px] cursor-pointer"
                  title="Inquire directly on WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Inquiry</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Internal Image Lightbox */}
      {isInternalLightboxOpen && (
        <ProductImageLightbox
          product={product}
          onClose={() => setIsInternalLightboxOpen(false)}
        />
      )}

      {/* Detailed Product Specs & Safety Modal */}
      {isDetailsModalOpen && (
        <ProductSafetyModal
          product={product}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
};
