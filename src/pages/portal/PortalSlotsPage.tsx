import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Lock, 
  Unlock, 
  Clock
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Slot } from '../../types';
import { formatTime, formatDateReadable } from '../../lib/utils';
import { BatchSlotGeneratorModal } from '../../components/portal/BatchSlotGeneratorModal';

export const PortalSlotsPage: React.FC = () => {
  const { slots, updateSlotCapacity, toggleSlotBlock } = useAyyanStore();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingCapacitySlotId, setEditingCapacitySlotId] = useState<string | null>(null);
  const [tempCapacity, setTempCapacity] = useState<number>(15);

  // Group slots by unique dates
  const availableDates = useMemo(() => {
    const set = new Set<string>();
    slots.forEach(s => set.add(s.slot_date));
    return Array.from(set).sort();
  }, [slots]);

  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Slots for the selected date
  const dateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots
      .filter(s => s.slot_date === selectedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [slots, selectedDate]);

  const handleStartEditCapacity = (slot: Slot) => {
    setEditingCapacitySlotId(slot.id);
    setTempCapacity(slot.total_capacity);
  };

  const handleSaveCapacity = async (slotId: string) => {
    await updateSlotCapacity(slotId, tempCapacity);
    setEditingCapacitySlotId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-amber-400" />
            Showroom Slot & Capacity Controller
          </h1>
          <p className="text-xs text-slate-400">
            Dynamically adjust visitor density, lock time windows, and generate batch schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Batch Generate Slots</span>
          </button>
        </div>
      </div>

      {/* Date Selector Tabs */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
          Select Operating Date:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {availableDates.map((dateStr) => {
            const active = selectedDate === dateStr;
            const count = slots.filter(s => s.slot_date === dateStr).length;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex flex-col items-center min-w-[100px] border ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <span>{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-sm font-extrabold">
                  {new Date(dateStr).getDate()} {new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className={`text-[10px] mt-0.5 ${active ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {count} Windows
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="text-xs text-slate-300">
            Configured visiting windows for <strong className="text-white">{formatDateReadable(selectedDate)}</strong>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Filling Fast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Blocked
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-6 py-4">Time Window</th>
                <th className="px-4 py-4">Current Bookings</th>
                <th className="px-4 py-4">Max Capacity</th>
                <th className="px-4 py-4">Occupancy</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Quick Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dateSlots.map((slot) => {
                const remaining = slot.total_capacity - slot.booked_capacity;
                const percentage = Math.min(100, Math.round((slot.booked_capacity / slot.total_capacity) * 100));
                const isEditingThis = editingCapacitySlotId === slot.id;

                return (
                  <tr key={slot.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Time Window */}
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</span>
                      </div>
                    </td>

                    {/* Booked Guests */}
                    <td className="px-4 py-4">
                      <span className="font-mono font-bold text-slate-200">
                        {slot.booked_capacity} Visitors
                      </span>
                    </td>

                    {/* Capacity Editor */}
                    <td className="px-4 py-4">
                      {isEditingThis ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={slot.booked_capacity}
                            max="50"
                            value={tempCapacity}
                            onChange={(e) => setTempCapacity(Number(e.target.value))}
                            className="w-16 bg-slate-950 border border-amber-500 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                          />
                          <button
                            onClick={() => handleSaveCapacity(slot.id)}
                            className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-300">{slot.total_capacity} Slots</span>
                          <button
                            onClick={() => handleStartEditCapacity(slot)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Occupancy bar */}
                    <td className="px-4 py-4 w-48">
                      <div className="space-y-1">
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              slot.is_blocked ? 'bg-red-500' : percentage >= 100 ? 'bg-slate-500' : percentage > 70 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {percentage}% ({remaining} Remaining)
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      {slot.is_blocked ? (
                        <span className="px-2.5 py-1 rounded-md bg-red-950/60 border border-red-500/30 text-red-300 font-bold text-[10px]">
                          LOCKED / CLOSED
                        </span>
                      ) : remaining <= 0 ? (
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 font-bold text-[10px]">
                          FULLY BOOKED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                          AVAILABLE
                        </span>
                      )}
                    </td>

                    {/* Quick Lock / Unlock Toggle */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleSlotBlock(slot.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto transition-colors ${
                          slot.is_blocked
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300'
                        }`}
                        title={slot.is_blocked ? 'Reopen this slot to the public' : 'Lock this slot to prevent public booking'}
                      >
                        {slot.is_blocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{slot.is_blocked ? 'Unlock Slot' : 'Lock Slot'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Generator Modal */}
      <BatchSlotGeneratorModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
      />
    </div>
  );
};
