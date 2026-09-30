import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/utils';

interface ProductImageLightboxProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  const imgSrc = product.image_url || product.image || product.imageUrl || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Zoomed view of ${product.name}`}
    >
      {/* Prominent '✕' close button at the top-right corner */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Close image preview"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-[75vh] sm:max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10"
        />

        {/* Product Title & Details Below Zoomed Image */}
        <div className="mt-3 sm:mt-4 text-center space-y-1.5 max-w-xl px-4">
          <h3 className="font-display font-bold text-white text-base sm:text-2xl tracking-tight drop-shadow-md">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-300">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 font-semibold uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            {product.price > 0 && (
              <span className="font-mono font-extrabold text-gold-300 text-sm sm:text-base">
                {formatINR(product.price)}
              </span>
            )}
            {product.piece_count && (
              <span className="text-slate-300 font-medium">
                • {product.piece_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
