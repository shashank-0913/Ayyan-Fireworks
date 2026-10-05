import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  Package, 
  CheckCircle2, 
  Leaf, 
  AlertTriangle,
  Plus,
  Check
} from 'lucide-react';
import { Product } from '../../types';
import { formatINR, getWhatsAppUrl } from '../../lib/utils';
import { getTeluguSubtitle } from '../../lib/teluguSubtitles';
import { useEstimate } from '../../context/EstimateContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface ProductSafetyModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductSafetyModal: React.FC<ProductSafetyModalProps> = ({ product, onClose }) => {
  const { addToEstimate, isInEstimate, getItemQuantity } = useEstimate();
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const teluguSubtitle = getTeluguSubtitle(product);
  const inEstimate = isInEstimate(product.id);
  const currentQty = getItemQuantity(product.id);

  const handleAddEstimate = () => {
    addToEstimate(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppInquiry = () => {
    const codeStr = product.code ? `[#${product.code}] ` : '';
    const text = `🎆 *Product Inquiry — Ayyan Fireworks (Visakhapatnam)*\n\nItem: *${codeStr}${product.name}*\nCategory: ${product.category}\nPack: ${product.piece_count}\nRate: ${formatINR(product.price)}\n\nHello! I am planning to visit your Visakhapatnam showroom and would like to confirm stock availability for this item.`;
    const waUrl = getWhatsAppUrl(text);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all z-10 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close Product Details Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-5 items-start pb-5 border-b border-slate-200 dark:border-white/10">
          <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shrink-0 relative group">
            <img
              src={product.image_url || product.image || product.imageUrl || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-gold-300 text-[10px] font-bold">
              {product.category}
            </div>
            {product.code && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/80 text-white font-mono text-[9px] font-bold">
                #{product.code}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                <Leaf className="w-3 h-3 text-emerald-600" />
                <span>CSIR-NEERI Green Cracker</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.name}
            </h3>
            
            <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-gold-400">
              {teluguSubtitle}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description || "Authentic Sivakasi Green Cracker masterpiece crafted with premium Bunny Brand quality standards."}
            </p>

            {/* Price and Piece Specification */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 text-amber-800 dark:text-gold-300 font-black text-base sm:text-lg font-mono">
                {formatINR(product.price)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 font-medium">
                <Package className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                <span>{product.piece_count}</span>
              </div>
            </div>

            {/* Per-piece calculation breakdown */}
            {(product.unit_breakdown || (product.unit_price && product.unit_name)) && (
              <p className="text-[11px] font-mono font-medium text-amber-800 dark:text-gold-300 pt-0.5">
                Unit breakdown: <strong>{product.unit_breakdown || `₹${product.unit_price} / ${product.unit_name}`}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Supreme Court Compliance Notice */}
        <div className="my-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Statutory Compliance Notice</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-700 dark:text-amber-100/80">
            Per Supreme Court of India directives, online transactions and shipping are prohibited. This item is available exclusively for in-person inspection and direct purchase at our Visakhapatnam physical showroom.
          </p>
        </div>

        {/* Safety Badges & Decibels */}
        <div className="py-3 border-b border-slate-200 dark:border-white/10">
          <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
            <span>Certified Safety Attributes</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% CSIR-NEERI Green Cracker</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Bunny Brand Quality Certified</span>
            </span>
            {product.sound_level && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Sound Level: {product.sound_level}</span>
              </span>
            )}
          </div>
        </div>

        {/* Standard Safety Protocol */}
        <div className="py-4 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-amber-800 dark:text-gold-300 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Firing Protocol & Safe Handling Guidelines</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {product.safety_instructions || "Always place on a flat, clear outdoor surface. Ignite fuse with an agarbatti / sparkler at arm's length and retreat immediately to a safe distance of 10 meters."}
            </p>
          </div>
        </div>

        {/* Action Buttons in Modal */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-2.5">
          {/* Add to Estimate */}
          <button
            type="button"
            onClick={handleAddEstimate}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] active:scale-95 shadow-xs ${
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
                <span>In Estimate ({currentQty}) + Add Another</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Showroom Estimate / Inquiry</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Inquiry */}
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px] active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Inquire on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
