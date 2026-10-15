import React from 'react';
import { Download, Sparkles } from 'lucide-react';

export const FloatingPriceListDownload: React.FC = () => {
  return (
    <aside
      aria-label="Download Ayyan Fireworks Price List PDF"
      className="fixed bottom-24 right-5 max-sm:bottom-[154px] max-sm:right-4 z-40 flex items-center mb-safe group select-none"
    >
      <a
        href="/Ayyan_Fireworks_PriceList_2026.pdf"
        download="Ayyan_Fireworks_PriceList_2026.pdf"
        target="_blank"
        rel="noopener noreferrer"
        id="floating-pricelist-download-btn"
        className="relative flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-4.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-gold-400 hover:from-amber-300 hover:via-amber-400 hover:to-gold-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.6)] border border-amber-300/80 dark:border-amber-400/60 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-400/50 min-h-[44px]"
        aria-label="Download Price List (PDF) - Ayyan Fireworks 2026"
        title="Download Price List (PDF)"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span
          className="absolute -inset-1 rounded-full bg-amber-400 opacity-25 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity"
          aria-hidden="true"
        />

        {/* Download Icon with subtle hover lift */}
        <div className="w-6 h-6 rounded-full bg-slate-950/15 dark:bg-slate-950/20 flex items-center justify-center shrink-0">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
        </div>

        {/* Clear Required Text */}
        <span className="font-extrabold tracking-tight whitespace-nowrap">
          Download Price List (PDF)
        </span>

        {/* Edition Pill Badge */}
        <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-950/85 text-amber-300 text-[10px] font-black tracking-wider uppercase font-mono shadow-xs">
          2026
        </span>

        {/* Desktop Hover Tooltip */}
        <span
          className="hidden md:flex items-center gap-1.5 absolute right-0 bottom-full mb-2 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-black/95 text-white text-[11px] font-medium whitespace-nowrap shadow-xl backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-y-1 group-hover:translate-y-0"
          aria-hidden="true"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Full 153 SKUs Sivakasi Catalogue with Pricing</span>
        </span>
      </a>
    </aside>
  );
};

export default FloatingPriceListDownload;
