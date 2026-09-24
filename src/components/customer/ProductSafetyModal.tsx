import React from 'react';
import { X, ShieldAlert, Sparkles, Volume2, Package, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/utils';

interface ProductSafetyModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductSafetyModal: React.FC<ProductSafetyModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-obsidian-900 border border-gold-500/30 rounded-3xl p-6 md:p-8 shadow-glass overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-obsidian-950/80 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/40 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-white/10">
          <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10 shrink-0 relative group">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-obsidian-950/90 border border-gold-500/30 text-gold-300 text-[10px] font-bold">
              {product.category}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {product.name}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 font-bold text-sm">
                Factory Price: {formatINR(product.price)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/10">
                <Package className="w-4 h-4 text-gold-400" />
                <span>{product.piece_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Badges */}
        <div className="py-4 border-b border-white/10">
          <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Certified Attributes & Green Chemistry
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.safety_tags?.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {tag}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              Sound Level: {product.sound_level}
            </span>
          </div>
        </div>

        {/* Standard Safety Protocol */}
        <div className="py-5 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Firing Protocol & Safe Handling Guidelines
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {product.safety_instructions}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-obsidian-950/60 border border-white/5">
              <span className="text-gold-400 font-bold">1.</span>
              <span>Always maintain a minimum 10-meter spectator safety perimeter.</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-obsidian-950/60 border border-white/5">
              <span className="text-gold-400 font-bold">2.</span>
              <span>Keep a bucket of clean water and dry sand within immediate reach.</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-obsidian-950/60 border border-white/5">
              <span className="text-gold-400 font-bold">3.</span>
              <span>Never attempt to re-ignite a misfired or delayed firework.</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-obsidian-950/60 border border-white/5">
              <span className="text-gold-400 font-bold">4.</span>
              <span>Always light using agarbatti/incense sticks or extended torch lighters.</span>
            </div>
          </div>
        </div>

        {/* Legal In-Store Reminder Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-400 text-center sm:text-left">
            Available for purchase exclusively at our Sivakasi Licensed Showroom.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 transition-colors shadow-glow-gold"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
