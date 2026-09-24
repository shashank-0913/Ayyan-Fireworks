import React from 'react';
import { ShieldCheck, Package, Volume2, Info, Eye, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onOpenSafety: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenSafety }) => {
  return (
    <div className="group relative rounded-2xl glass-panel hover:glass-panel-gold border border-white/[0.08] hover:border-gold-500/40 p-4 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-lg hover:shadow-glow-gold">
      <div>
        {/* Image Container with Zoom & Badge */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-obsidian-900 border border-white/5 mb-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-obsidian-950/85 backdrop-blur-md border border-gold-500/30 text-gold-300 font-bold text-[10px] uppercase tracking-wider">
            {product.category}
          </div>

          {/* Sound Level Pill */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-obsidian-950/85 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-medium flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-gold-400" />
            <span>{product.sound_level}</span>
          </div>

          {/* Quick Preview Hover Overlay */}
          <button
            onClick={() => onOpenSafety(product)}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gold-500/90 text-obsidian-950 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-glow-gold z-10"
            title="View Safety & Details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-100 text-sm sm:text-base leading-snug group-hover:text-gold-300 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Safety Badges Strip */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.safety_tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-medium flex items-center gap-1"
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Footer Actions */}
      <div className="pt-4 mt-3 border-t border-white/[0.08] space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Factory Direct Rate</span>
            <span className="text-lg sm:text-xl font-extrabold text-gold-300 tracking-tight">
              {formatINR(product.price)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-300 font-medium flex items-center justify-end gap-1">
              <Package className="w-3 h-3 text-gold-400" />
              {product.piece_count}
            </span>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenSafety(product)}
            className="w-full py-2 px-2 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Info className="w-3.5 h-3.5 text-gold-400" />
            <span>Safety Guide</span>
          </button>

          <Link
            to="/book-slot"
            className="w-full py-2 px-2 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/40 text-gold-300 hover:text-gold-200 text-xs font-bold flex items-center justify-center gap-1 transition-all"
          >
            <span>Book Visit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
