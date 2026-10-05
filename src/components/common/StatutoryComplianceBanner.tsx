import React from 'react';
import { 
  AlertTriangle, 
  Scale, 
  Leaf, 
  Building2, 
  Info
} from 'lucide-react';

interface StatutoryComplianceBannerProps {
  variant?: 'prominent' | 'compact' | 'footer' | 'modal';
  className?: string;
}

export const StatutoryComplianceBanner: React.FC<StatutoryComplianceBannerProps> = ({
  variant = 'prominent',
  className = ''
}) => {
  const complianceText = "In accordance with the directives of the Hon'ble Supreme Court of India, online sale, direct e-commerce purchase, and shipping of fireworks are strictly prohibited. This website serves strictly as an informational digital catalog and showroom appointment booking portal. We only sell 100% CSIR-NEERI approved Green Crackers across our authorized physical showrooms in Visakhapatnam.";

  // Variant: Modal Header / Body Banner
  if (variant === 'modal') {
    return (
      <div className={`rounded-2xl p-3.5 sm:p-4 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="uppercase tracking-wider text-[11px]">Hon&apos;ble Supreme Court Statutory Compliance Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-amber-100/90 font-normal">
          {complianceText}
        </p>
      </div>
    );
  }

  // Variant: Footer declaration
  if (variant === 'footer') {
    return (
      <div className={`w-full rounded-2xl p-4 sm:p-5 bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-slate-700 dark:text-slate-300 text-xs space-y-2.5 ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-gold-300 text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
            <span>Statutory Legal Declaration & Supreme Court Directives</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
              <Leaf className="w-3 h-3" />
              <span>100% Green Crackers</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
              <Building2 className="w-3 h-3" />
              <span>Physical Showroom Only</span>
            </span>
          </div>
        </div>
        <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <strong className="text-amber-800 dark:text-amber-300 font-bold">⚠️ Statutory Compliance: </strong>
          {complianceText}
        </p>
      </div>
    );
  }

  // Variant: Compact
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl p-3 bg-amber-50 dark:bg-obsidian-950/90 border border-amber-400/50 dark:border-amber-500/30 flex items-start gap-2.5 text-xs ${className}`}>
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-800 dark:text-amber-300 text-[11px] block uppercase tracking-wider">
            Supreme Court Directives Notice
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {complianceText}
          </p>
        </div>
      </div>
    );
  }

  // Variant: Prominent (Default on top of Catalog)
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 dark:from-amber-950/40 dark:via-obsidian-950 dark:to-emerald-950/30 border-2 border-amber-400/70 dark:border-amber-500/40 p-5 sm:p-6 shadow-md dark:shadow-glow-gold ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Header Row with Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-gold-300 shrink-0 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xs sm:text-sm text-amber-900 dark:text-gold-300 uppercase tracking-wider">
                  ⚠️ Statutory Compliance & Supreme Court Mandate
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Hon&apos;ble Supreme Court of India Order Compliance • CSIR-NEERI Certified
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-900/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-xs font-bold shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>100% CSIR-NEERI Green Crackers</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-[10px] sm:text-xs font-bold">
              <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Informational Catalog Only</span>
            </span>
          </div>
        </div>

        {/* Declaration Message Box */}
        <div className="rounded-2xl bg-white/80 dark:bg-obsidian-900/80 p-4 border border-amber-200/80 dark:border-white/5 shadow-inner space-y-2">
          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong className="text-amber-800 dark:text-gold-300 font-bold">⚠️ Statutory Compliance: </strong>
            In accordance with the directives of the Hon&apos;ble Supreme Court of India, online sale, direct e-commerce purchase, and shipping of fireworks are strictly prohibited. This website serves strictly as an informational digital catalog and showroom appointment booking portal. We only sell 100% CSIR-NEERI approved Green Crackers across our authorized physical showrooms in Visakhapatnam.
          </p>
        </div>
      </div>
    </div>
  );
};
