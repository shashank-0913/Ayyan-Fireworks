import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  ShieldAlert, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { KPICards } from '../../components/portal/KPICards';
import { ProductDrawer } from '../../components/portal/ProductDrawer';
import { BatchSlotGeneratorModal } from '../../components/portal/BatchSlotGeneratorModal';
import { formatTime, formatDateReadable, exportToCSV } from '../../lib/utils';
import { getFormattedDateOffset } from '../../lib/initialData';

export const PortalDashboardPage: React.FC = () => {
  const { 
    slots, 
    bookings, 
    isEmergencyBlocked, 
    toggleEmergencyBlock, 
    updateBookingStatus 
  } = useAyyanStore();

  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isBatchSlotModalOpen, setIsBatchSlotModalOpen] = useState(false);

  const todayStr = getFormattedDateOffset(0);

  // Today's bookings
  const todayBookings = bookings.filter(b => {
    const sDate = b.slot?.slot_date || slots.find(s => s.id === b.slot_id)?.slot_date;
    return sDate === todayStr;
  });

  // Today's Slots
  const todaySlots = slots
    .filter(s => s.slot_date === todayStr)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleExportToday = () => {
    const exportData = todayBookings.map(b => {
      const s = b.slot || slots.find(slot => slot.id === b.slot_id);
      return {
        'Booking Code': b.booking_code,
        'Visitor Name': b.customer_name,
        'Phone': b.customer_phone,
        'Visitors Count': b.visitor_count,
        'Time Slot': s ? `${formatTime(s.start_time)} - ${formatTime(s.end_time)}` : '',
        'Status': b.status.toUpperCase(),
        'Special Notes': b.notes || 'N/A'
      };
    });
    exportToCSV(`Ayyan_Guest_Manifest_${todayStr}`, exportData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Emergency Block Controller */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Operations Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time showroom footfall monitoring, catalogue controls, and statutory visitor tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsProductDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700 min-h-[40px]"
          >
            <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>New Product SKU</span>
          </button>

          <button
            onClick={() => setIsBatchSlotModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700 min-h-[40px]"
          >
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Generate Schedule</span>
          </button>

          <button
            onClick={toggleEmergencyBlock}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md min-h-[40px] ${
              isEmergencyBlocked
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                : 'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyBlocked ? 'LIFT EMERGENCY BLOCK' : 'EMERGENCY BLOCK SLOTS'}</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <KPICards />

      {/* Grid: Slot Utilization Visualizer + Today's Incoming Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Today's Slot Utilization Timeline (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Today's Showroom Capacity Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-Hour Windows for {formatDateReadable(todayStr)}
              </p>
            </div>

            <Link
              to="/portal/slots"
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {todaySlots.length > 0 ? (
              todaySlots.map((slot) => {
                const booked = slot.booked_capacity || 0;
                const total = slot.total_capacity || 120;
                const remaining = Math.max(0, total - booked);
                const percentage = Math.min(100, Math.round((booked / total) * 100));
                const isFull = booked >= 120 || booked >= total || remaining <= 0;
                const isFillingFast = !isFull && (booked >= 81 || (total > 0 && booked / total >= 0.675));

                return (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </span>
                      <div className="flex items-center gap-2">
                        {slot.is_blocked ? (
                          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-300 dark:border-red-500/30">
                            BLOCKED
                          </span>
                        ) : isFull ? (
                          <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-300 dark:border-red-500/30">
                            FULL ({booked}/{total})
                          </span>
                        ) : isFillingFast ? (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                            FILLING FAST ({booked}/{total})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
                            {booked}/{total} Booked
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          slot.is_blocked || isFull 
                            ? 'bg-red-500' 
                            : isFillingFast 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No slots configured for today. Click "Generate Schedule" to create.
              </div>
            )}
          </div>
        </div>

        {/* Right: Today's Incoming Visitor Manifest (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Today's Guest Manifest ({todayBookings.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Priority check-in & verified showroom arrivals
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportToday}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700 min-h-[36px]"
                title="Export Today's CSV Manifest"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <Link
                to="/portal/bookings"
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Full Manifest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {todayBookings.length > 0 ? (
              todayBookings.map((b) => {
                const s = b.slot || slots.find(slot => slot.id === b.slot_id);
                return (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-[11px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {b.booking_code}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white truncate">{b.customer_name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">({b.visitor_count} Guests)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <span>📱 +91 {b.customer_phone}</span>
                        {s && <span>⏰ {formatTime(s.start_time)}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {b.status === 'checked_in' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Checked-In
                        </span>
                      ) : (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'checked_in')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Check-In
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No visitor bookings recorded for today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawers & Modals */}
      <ProductDrawer
        isOpen={isProductDrawerOpen}
        onClose={() => setIsProductDrawerOpen(false)}
      />

      <BatchSlotGeneratorModal
        isOpen={isBatchSlotModalOpen}
        onClose={() => setIsBatchSlotModalOpen(false)}
      />
    </div>
  );
};
