import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  Ticket, 
  AlertTriangle,
  Package
} from 'lucide-react';
import { useEstimate } from '../../context/EstimateContext';
import { formatINR, getWhatsAppUrl, SHOWROOM_CONTACT } from '../../lib/utils';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { getTeluguSubtitle } from '../../lib/teluguSubtitles';
import { ReserveSlotModal } from './ReserveSlotModal';

export const EstimateDrawer: React.FC = () => {
  const { 
    estimateItems, 
    removeFromEstimate, 
    updateQuantity, 
    clearEstimate, 
    totalEstimatePrice, 
    totalItemsCount, 
    isEstimateDrawerOpen, 
    setIsEstimateDrawerOpen 
  } = useEstimate();

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  if (!isEstimateDrawerOpen) return null;

  const handleShareOnWhatsApp = () => {
    if (estimateItems.length === 0) return;

    let text = `🎆 *AYYAN FIREWORKS (BUNNY BRAND) — SHOWROOM ESTIMATE INQUIRY*\n`;
    text += `🏬 *Visakhapatnam Flagship Store*\n`;
    text += `📍 ${SHOWROOM_CONTACT.address}\n\n`;
    text += `📝 *Estimated Items (${totalItemsCount} units):*\n`;
    text += `------------------------------------\n`;

    estimateItems.forEach((item, idx) => {
      const p = item.product;
      const codeStr = p.code ? `[#${p.code}] ` : '';
      const unitTotal = p.price * item.quantity;
      text += `${idx + 1}. ${codeStr}*${p.name}*\n`;
      text += `   • Pack: ${p.piece_count} | Qty: ${item.quantity}\n`;
      text += `   • Rate: ${formatINR(p.price)} = *${formatINR(unitTotal)}*\n`;
    });

    text += `------------------------------------\n`;
    text += `💰 *Total Estimated Value: ${formatINR(totalEstimatePrice)}*\n\n`;
    text += `⚠️ *Note:* This is an informational showroom estimate as per Supreme Court directives. I plan to visit the Visakhapatnam showroom to inspect and complete purchase.\n`;
    text += `Please confirm stock availability.`;

    const waUrl = getWhatsAppUrl(text);
    window.open(waUrl, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsEstimateDrawerOpen(false)}
        />

        {/* Slide-out Drawer */}
        <div className="relative w-full max-w-lg bg-white dark:bg-obsidian-950 border-l border-slate-200 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300 h-full max-h-screen overflow-hidden">
          
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-gold-600 p-0.5 shadow-sm flex items-center justify-center text-slate-950 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Showroom Estimate List
                </h3>
                <p className="text-[11px] text-amber-700 dark:text-gold-300 font-semibold">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected for inquiry
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEstimateDrawerOpen(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close Estimate Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Statutory Compliance Warning in Drawer */}
          <div className="my-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-[11px] space-y-1 shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Informational Showroom Estimate Only</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-700 dark:text-amber-100/80">
              Per Supreme Court directives, no online transactions or doorstep shipping take place. This estimate assists in planning your visit to our Visakhapatnam showroom.
            </p>
          </div>

          {/* Item List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
            {estimateItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-gold-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-600 dark:text-gold-400">
                  <Package className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Your Estimate List is Empty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Browse our Green Crackers catalogue and tap &ldquo;Add to Inquiry/Estimate&rdquo; to build your showroom visit list.
                </p>
              </div>
            ) : (
              estimateItems.map((item) => {
                const p = item.product;
                const telugu = getTeluguSubtitle(p);
                const itemTotal = p.price * item.quantity;
                return (
                  <div 
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 flex items-center gap-3 justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10">
                      <img 
                        src={p.image_url || p.image || p.imageUrl || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60"} 
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-gold-300 font-bold">
                          #{p.code || 'AY'}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {p.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-amber-700 dark:text-gold-400/90 font-medium truncate">
                        {telugu}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">{p.piece_count}</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {formatINR(p.price)} ea
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(p.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-amber-100"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs px-1 text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(p.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-amber-100"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-amber-700 dark:text-gold-300 text-xs">
                          {formatINR(itemTotal)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromEstimate(p.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Summary & Actions */}
          {estimateItems.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-obsidian-900 border border-amber-200 dark:border-gold-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Total Selected Units:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalItemsCount} units</span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-amber-200/60 dark:border-white/5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Estimated Total (Showroom):</span>
                  <span className="text-xl sm:text-2xl font-mono font-black text-amber-700 dark:text-gold-300">
                    {formatINR(totalEstimatePrice)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {/* 1. Share via WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareOnWhatsApp}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer min-h-[44px] active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Send Estimate to Showroom on WhatsApp</span>
                </button>

                {/* 2. Book Visiting Slot */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEstimateDrawerOpen(false);
                    setIsSlotModalOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md dark:shadow-glow-gold transition-all cursor-pointer min-h-[44px] active:scale-95"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book VIP Visiting Slot to Purchase</span>
                </button>

                {/* 3. Clear List */}
                <button
                  type="button"
                  onClick={clearEstimate}
                  className="text-center text-[11px] text-slate-500 hover:text-red-500 dark:hover:text-red-400 pt-1"
                >
                  Clear Estimate List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Slot Modal */}
      <ReserveSlotModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
      />
    </>
  );
};
