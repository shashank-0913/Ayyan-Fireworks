import React from 'react';
import { Link } from 'react-router-dom';
import { SlotBookingFlow } from '../components/customer/SlotBookingFlow';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { Calendar, Clock, ShieldCheck, MapPin, CalendarX, BookOpen, ArrowLeft } from 'lucide-react';
import { SHOWROOM_CONTACT } from '../lib/utils';

export const BookSlotPage: React.FC = () => {
  const { vip_booking_enabled, isLoading } = useStoreSettings();

  // If slot booking is disabled, show a clear message stating bookings are currently closed
  if (!isLoading && !vip_booking_enabled) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-8 animate-in fade-in duration-300">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-lg">
          <CalendarX className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider">
            <span>Visakhapatnam Operations Notice</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            VIP Slot Bookings Currently Closed
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Online slot booking is temporarily closed as per store operations. Visiting passes are not required — customers are warmly welcome for direct in-store selections and purchases during regular showroom hours.
          </p>
        </div>

        {/* Showroom Visiting Info Card */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/10 shadow-sm text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Visakhapatnam Flagship Showroom</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{SHOWROOM_CONTACT.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Extended Showroom Hours</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{SHOWROOM_CONTACT.operationalHours}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/catalogue"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase rounded-2xl shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>Explore Cracker Catalogue</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

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
          Avoid festive queues. Secure a dedicated 1-hour in-store visiting pass with personalized Green Cracker advisory, direct factory pricing, and priority entry.
        </p>
      </div>

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
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Certified Packaging & Safety</h4>
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

export default BookSlotPage;
