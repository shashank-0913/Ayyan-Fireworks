import React from 'react';
import { ShieldCheck, Scale } from 'lucide-react';
import { SHOWROOM_CONTACT } from '../../lib/utils';

export const LegalComplianceBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-950/40 border-b border-gold-500/20 px-4 py-2 text-xs text-amber-200/90 flex flex-wrap items-center justify-center gap-3 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-semibold text-gold-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          PESO Certified & Supreme Court Compliant
        </span>
        <span className="hidden md:inline text-white/30">•</span>
        <span className="text-slate-300">
          Digital Catalogue & Showroom Slot Booking Only (No Online Delivery)
        </span>
        <span className="hidden md:inline text-white/30">•</span>
        <span className="text-amber-400/90 font-mono text-[11px]">
          License: {SHOWROOM_CONTACT.pesoLicense}
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-r from-obsidian-900 via-amber-950/40 to-obsidian-900 p-5 md:p-6 backdrop-blur-xl shadow-glass">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 text-gold-400 shadow-glow-gold">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-sm md:text-base font-bold text-slate-100 tracking-wide">
                Statutory Compliance & Safe Pyrotechnics Discovery Hub
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                PESO Authorized
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed max-w-3xl">
              In strict adherence to the Supreme Court of India guidelines and the Petroleum & Explosives Safety Organisation (PESO) regulations, <strong className="text-gold-300">Ayyan Fireworks does not engage in online transactions, payment gateways, or courier shipping.</strong> This portal serves exclusively as a digital catalogue and showroom visiting reservation system.
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
          <span className="text-[11px] text-slate-400">License ID</span>
          <span className="font-mono text-xs text-gold-300 font-semibold bg-obsidian-950/80 px-2.5 py-1 rounded-md border border-gold-500/20">
            E/HQ/TN/20/1982
          </span>
        </div>
      </div>
    </div>
  );
};
