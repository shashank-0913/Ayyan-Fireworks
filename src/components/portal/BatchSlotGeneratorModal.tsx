import React, { useState } from 'react';
import { X, Calendar, Plus, CheckCircle2 } from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { getFormattedDateOffset } from '../../lib/initialData';

interface BatchSlotGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchSlotGeneratorModal: React.FC<BatchSlotGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { batchGenerateSlots } = useAyyanStore();

  const [startDate, setStartDate] = useState(getFormattedDateOffset(0));
  const [endDate, setEndDate] = useState(getFormattedDateOffset(7));
  const [startHour, setStartHour] = useState(9); // 09:00 AM
  const [endHour, setEndHour] = useState(21); // 09:00 PM
  const [capacity, setCapacity] = useState(120);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const count = await batchGenerateSlots(startDate, endDate, startHour, endHour, capacity);
      setResultCount(count);
      setTimeout(() => {
        onClose();
        setResultCount(null);
      }, 1500);
    } catch (err) {
      console.error('Batch generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Batch Slot Schedule Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instantly create recurring 1-hour showroom visiting windows for a date range.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {resultCount !== null ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Slots Generated Successfully!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{resultCount} new visiting windows added to the calendar.</p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Opening Hour</label>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {[8, 9, 10, 11, 12, 13, 14, 15].map(h => (
                    <option key={h} value={h}>{h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Closing Hour</label>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {[17, 18, 19, 20, 21, 22].map(h => (
                    <option key={h} value={h}>{h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Default Capacity Per Slot</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono text-sm font-extrabold">{capacity} Max Bookings</span>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>10 (Intimate)</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">120 (Standard Default)</span>
                <span>300 (Mega Rush)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              ⚡ Existing slot configurations and bookings within this range will be preserved to prevent duplicate collisions.
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Batch Generate Schedule'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
