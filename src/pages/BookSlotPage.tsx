import React from 'react';
import { SlotBookingFlow } from '../components/customer/SlotBookingFlow';
import { LegalComplianceBanner } from '../components/common/LegalComplianceBanner';
import { Calendar, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const BookSlotPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10 pb-24 sm:pb-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Calendar className="w-4 h-4 text-amber-600 dark:text-gold-400" />
          <span>Visakhapatnam Flagship Visiting Reservation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reserve VIP Showroom Slot
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Avoid festive queues. Secure a dedicated 1-hour in-store visiting pass with personalized pyrotechnic advisory, direct factory pricing, and priority entry.
        </p>
      </div>

      {/* Statutory Banner */}
      <LegalComplianceBanner compact />

      {/* The 3-Step Interactive Booking Engine */}
      <SlotBookingFlow />

      {/* Showroom Benefits Strip */}
      <div className="pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/20 flex items-center justify-center text-amber-600 dark:text-gold-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Guaranteed 1-Hour Visiting Window</h4>
            <p className="leading-relaxed">Controlled visitor density ensures comfortable, unhurried selection with your family members.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">PESO Safety Locker Compliance</h4>
            <p className="leading-relaxed">All verified purchases are securely packaged in fire-retardant corrugated cartons with safety seals.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Ample Vehicle Parking</h4>
            <p className="leading-relaxed">Dedicated parking zone for cars and vans with easy cargo loading assistance by floor staff.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
