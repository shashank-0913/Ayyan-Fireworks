import React from 'react';
import MyBookings from '../components/customer/MyBookings';
import { Ticket, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyBookingsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10 pb-24 sm:pb-12">
      {/* Back to Home Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-gold-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/book-slot"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-gold-400 hover:underline"
        >
          <span>New Reservation</span>
        </Link>
      </div>

      {/* Main Component */}
      <MyBookings />

      {/* Visiting Guidelines Strip */}
      <div className="pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
        <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-gold-500/10 border border-amber-500/30 dark:border-gold-500/20 flex items-center justify-center text-amber-600 dark:text-gold-400 shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Gate Pass Ready</h4>
            <p className="leading-relaxed">Present this QR code to the entrance security scanner at the showroom gate for rapid touchless check-in.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">15-Min Grace Window</h4>
            <p className="leading-relaxed">You may arrive up to 15 minutes prior to your scheduled slot start time for convenient parking.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Direct Factory Pricing</h4>
            <p className="leading-relaxed">Your pass entitles you and your group to authentic manufacturer rates on all fresh 2026 stock.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
