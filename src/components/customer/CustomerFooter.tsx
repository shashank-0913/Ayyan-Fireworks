import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { SHOWROOM_CONTACT } from '../../lib/utils';
import { StatutoryComplianceBanner } from '../common/StatutoryComplianceBanner';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="relative bg-slate-100 dark:bg-obsidian-950 border-t border-slate-200 dark:border-white/[0.08] py-8 sm:py-12 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Supreme Court Statutory Compliance Declaration Banner */}
        <StatutoryComplianceBanner variant="footer" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 border-t border-slate-200/80 dark:border-white/5 text-center md:text-left">
          {/* Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-full p-0.5 shadow-md dark:shadow-glow-gold border border-amber-400/40 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center p-0.5 overflow-hidden">
                <img
                  src="/ayyan-emblem.png"
                  alt="Bunny Brand"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white block">
                AYYAN <span className="gold-gradient-text">FIREWORKS</span>
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase block">
                Bunny Brand • Since 1987 • Visakhapatnam
              </span>
            </div>
          </div>

          {/* Address & Hours */}
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-xl text-slate-700 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
              <span className="leading-relaxed text-xs">
                {SHOWROOM_CONTACT.address}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{SHOWROOM_CONTACT.operationalHours}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
