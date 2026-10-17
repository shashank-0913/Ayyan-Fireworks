import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Ticket, Sparkles, CalendarX, BookOpen, Clock } from 'lucide-react';
import { SlotBookingFlow } from './SlotBookingFlow';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import { SHOWROOM_CONTACT } from '../../lib/utils';

export interface ReserveSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReserveSlotModal: React.FC<ReserveSlotModalProps> = ({ isOpen, onClose }) => {
  const { vip_booking_enabled, isLoading } = useStoreSettings();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // When disabled: show closed message inside modal
  if (!isLoading && !vip_booking_enabled) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        {/* Darkened Blur Backdrop */}
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative w-full max-w-lg bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-6 text-center">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-md">
            <CalendarX className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-gold-300 text-[10px] font-bold uppercase tracking-wider">
              Showroom Notice
            </span>
            <h3 className="font-display font-black text-slate-900 dark:text-white text-xl sm:text-2xl tracking-tight">
              VIP Slot Bookings Currently Closed
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Online slot reservations are temporarily closed as per store operations. Visiting passes are not required — customers are warmly welcome for direct in-store selections and purchases during regular showroom hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 text-left text-xs space-y-2">
            <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Showroom Operational Hours:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 pl-6 text-[11px] leading-relaxed">
              {SHOWROOM_CONTACT.operationalHours}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/catalogue"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Catalogue</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Darkened Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 sm:pb-8 overflow-y-auto shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-slate-900 dark:text-white text-base sm:text-xl tracking-tight">
                  Reserve VIP Visiting Slot
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-gold-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Free Instant Pass</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Visakhapatnam Flagship Showroom • NH-16 Sheela Nagar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
            aria-label="Close Reservation Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Interactive Booking Engine */}
        <SlotBookingFlow />
      </div>
    </div>
  );
};

export default ReserveSlotModal;
