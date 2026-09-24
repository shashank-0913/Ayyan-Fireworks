import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { formatTime, formatDateReadable } from '../../lib/utils';

export const VIPTicker: React.FC = () => {
  const { slots, isEmergencyBlocked } = useAyyanStore();

  if (isEmergencyBlocked) {
    return (
      <div className="bg-red-950/60 border-b border-red-500/30 px-4 py-1.5 text-xs text-red-200 flex items-center justify-center gap-2 backdrop-blur-md animate-pulse">
        <ShieldAlert className="w-4 h-4 text-red-400" />
        <span className="font-semibold">Notice:</span> Showroom visitor capacity is currently at maximum safety threshold. Real-time slots on temporary hold.
      </div>
    );
  }

  // Find next available slot from today onwards
  const todayStr = new Date().toISOString().split('T')[0];
  const nextAvailableSlot = slots.find(
    s => s.slot_date >= todayStr && !s.is_blocked && (s.total_capacity - s.booked_capacity) > 0
  );

  const remaining = nextAvailableSlot ? nextAvailableSlot.total_capacity - nextAvailableSlot.booked_capacity : 0;

  return (
    <div className="bg-obsidian-900/90 border-b border-gold-500/15 px-4 py-1.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
          </span>
          <span className="text-gold-400 font-semibold tracking-wide uppercase text-[10px] hidden sm:inline">
            Showroom Real-Time:
          </span>
          {nextAvailableSlot ? (
            <span className="text-slate-200 font-medium">
              Next VIP Visiting Slot: <strong className="text-gold-300 font-bold">{formatDateReadable(nextAvailableSlot.slot_date)} at {formatTime(nextAvailableSlot.start_time)}</strong>
              <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                {remaining} Slots Remaining
              </span>
            </span>
          ) : (
            <span className="text-slate-300">
              High Festive Footfall — Booking slots filling fast across all dates
            </span>
          )}
        </div>

        <Link
          to="/book-slot"
          className="flex items-center gap-1 font-semibold text-gold-400 hover:text-gold-300 transition-colors shrink-0 group text-xs"
        >
          <span>Reserve Free Pass</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
