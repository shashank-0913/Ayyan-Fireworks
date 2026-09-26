import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Calendar,
  CalendarCheck,
  History,
  Timer
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { formatTime, formatDateReadable, exportToCSV } from '../../lib/utils';
import { Booking } from '../../types';

export const PortalBookingsPage: React.FC = () => {
  const { bookings, slots, updateBookingStatus } = useAyyanStore();

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [timelineTab, setTimelineTab] = useState<'all' | 'present' | 'upcoming' | 'past'>('all');

  // Today's YYYY-MM-DD
  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Helper to determine whether a booking is Present (Today), Upcoming (Future), or Past
  const getBookingTimeline = (b: Booking): 'present' | 'upcoming' | 'past' => {
    const s = b.slot || slots.find(slot => slot.id === b.slot_id);
    if (!s?.slot_date) return 'present';
    if (s.slot_date === todayStr) return 'present';
    if (s.slot_date > todayStr) return 'upcoming';
    return 'past';
  };

  // Dates present in bookings
  const uniqueDates = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach(b => {
      const s = b.slot || slots.find(slot => slot.id === b.slot_id);
      if (s?.slot_date) set.add(s.slot_date);
    });
    return Array.from(set).sort();
  }, [bookings, slots]);

  // Counts for Timeline tabs
  const timelineCounts = useMemo(() => {
    const counts = { all: bookings.length, present: 0, upcoming: 0, past: 0 };
    bookings.forEach(b => {
      const t = getBookingTimeline(b);
      counts[t]++;
    });
    return counts;
  }, [bookings, slots, todayStr]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => {
        const s = b.slot || slots.find(slot => slot.id === b.slot_id);
        const slotDate = s?.slot_date;
        const timeline = getBookingTimeline(b);

        // Timeline Filter Tab
        if (timelineTab !== 'all' && timeline !== timelineTab) {
          return false;
        }

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchCode = b.booking_code.toLowerCase().includes(q);
          const matchName = b.customer_name.toLowerCase().includes(q);
          const matchPhone = b.customer_phone.includes(q);
          if (!matchCode && !matchName && !matchPhone) return false;
        }

        // Date filter
        if (selectedDate !== 'all' && slotDate !== selectedDate) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && b.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const sA = a.slot || slots.find(slot => slot.id === a.slot_id);
        const sB = b.slot || slots.find(slot => slot.id === b.slot_id);
        const dateA = sA?.slot_date || '';
        const dateB = sB?.slot_date || '';
        // If sorting within tabs, sort by slot date ascending for future, descending for past
        if (timelineTab === 'past') {
          return dateB.localeCompare(dateA) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return dateA.localeCompare(dateB) || (sA?.start_time || '').localeCompare(sB?.start_time || '');
      });
  }, [bookings, slots, search, selectedDate, selectedStatus, timelineTab, todayStr]);

  const handleExportCSV = () => {
    const data = filteredBookings.map(b => {
      const s = b.slot || slots.find(slot => slot.id === b.slot_id);
      const timeline = getBookingTimeline(b);
      return {
        'Booking Ref': b.booking_code,
        'Visitor Name': b.customer_name,
        'Mobile Number': b.customer_phone,
        'Visiting Period': timeline === 'present' ? 'PRESENT (TODAY)' : timeline === 'upcoming' ? 'UPCOMING (FUTURE)' : 'PAST (COMPLETED)',
        'Guest Count': b.visitor_count,
        'Visiting Date': s ? s.slot_date : '',
        'Time Window': s ? `${formatTime(s.start_time)} - ${formatTime(s.end_time)}` : '',
        'Booking Status': b.status.toUpperCase(),
        'Notes': b.notes || 'N/A',
        'Booked Timestamp': b.created_at
      };
    });
    exportToCSV(`Ayyan_Guest_Manifest_${todayStr}`, data);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Live Guest Manifest & VIP Security Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time showroom visitor attendance log, timeline classification (Present & Past), and security export.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md min-h-[40px] active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Manifest (CSV)</span>
        </button>
      </div>

      {/* Timeline Tabs: All, Today (Present), Upcoming, Past */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setTimelineTab('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            timelineTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40 font-black'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>All Bookings</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-950/15 dark:bg-white/10 text-[10px] font-mono">
            {timelineCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTimelineTab('present')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            timelineTab === 'present'
              ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/40 font-black'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Timer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Today / Present (Live)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
            {timelineCounts.present}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTimelineTab('upcoming')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            timelineTab === 'upcoming'
              ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-400/40 font-black'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Upcoming / Future</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300 text-[10px] font-mono font-bold">
            {timelineCounts.upcoming}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTimelineTab('past')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            timelineTab === 'past'
              ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-500/40 font-black'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span>Past Bookings</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
            {timelineCounts.past}
          </span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Pass Code (AYN-...), Name, or Mobile..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[38px]"
          />
        </div>

        {/* Date Filter */}
        <div className="space-y-1">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 min-h-[38px]"
          >
            <option value="all">All Dates</option>
            {uniqueDates.map(d => (
              <option key={d} value={d}>
                {formatDateReadable(d)} {d === todayStr ? '★ (Today)' : d < todayStr ? '(Past)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 min-h-[38px]"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked-In</option>
            <option value="no_show">No-Show</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Manifest Table with Dedicated Past & Present Column */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-4">Unique Pass ID</th>
                <th className="px-4 py-4">Timeline Period</th>
                <th className="px-4 py-4">Visitor Details</th>
                <th className="px-4 py-4">Reserved Window</th>
                <th className="px-4 py-4">Party Size</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-5 py-4 text-right">Floor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const s = b.slot || slots.find(slot => slot.id === b.slot_id);
                  const timeline = getBookingTimeline(b);

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Unique Pass Code */}
                      <td className="px-5 py-4">
                        <span className="font-mono font-black text-amber-800 dark:text-amber-300 bg-amber-500/15 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/40 text-xs whitespace-nowrap">
                          {b.booking_code}
                        </span>
                      </td>

                      {/* Timeline Period Column (Past / Present / Upcoming) */}
                      <td className="px-4 py-4">
                        {timeline === 'present' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Present (Today)</span>
                          </span>
                        )}
                        {timeline === 'upcoming' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30 whitespace-nowrap">
                            <CalendarCheck className="w-3 h-3 text-blue-500" />
                            <span>Upcoming</span>
                          </span>
                        )}
                        {timeline === 'past' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                            <History className="w-3 h-3 text-slate-400" />
                            <span>Past Booking</span>
                          </span>
                        )}
                      </td>

                      {/* Visitor Name & Mobile */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-white text-sm block">{b.customer_name}</span>
                          <span className="font-mono text-slate-500 dark:text-slate-400 text-xs">+91 {b.customer_phone}</span>
                          {b.notes && (
                            <p className="text-[10px] text-amber-700 dark:text-amber-300/80 italic mt-0.5">
                              "{b.notes}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Time Window */}
                      <td className="px-4 py-4">
                        {s ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{formatDateReadable(s.slot_date)}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              {formatTime(s.start_time)} – {formatTime(s.end_time)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">N/A</span>
                        )}
                      </td>

                      {/* Party Count */}
                      <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {b.visitor_count} {b.visitor_count === 1 ? 'Guest' : 'Guests'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {b.status === 'checked_in' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Checked-In
                          </span>
                        )}
                        {b.status === 'confirmed' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1 w-fit">
                            Confirmed
                          </span>
                        )}
                        {b.status === 'no_show' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                            No-Show
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30 flex items-center gap-1 w-fit">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Floor Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status !== 'checked_in' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'checked_in')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors min-h-[30px]"
                              title="Mark customer as Checked-In"
                            >
                              Check-In
                            </button>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'no_show')}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] transition-colors border border-slate-200 dark:border-transparent min-h-[30px]"
                              title="Mark as No-Show"
                            >
                              No-Show
                            </button>
                          )}

                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'cancelled')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No visitor records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
