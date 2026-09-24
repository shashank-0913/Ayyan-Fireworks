import React, { useState } from 'react';
import { MessageCircle, X, Send, MapPin, FileText, Calendar } from 'lucide-react';
import { getWhatsAppUrl } from '../../lib/utils';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const QUICK_PROMPTS = [
    {
      icon: Calendar,
      label: "Check Slot Availability",
      text: "Hello Ayyan Showroom! I would like to inquire about today's visiting slots for my family."
    },
    {
      icon: FileText,
      label: "2026 Price List / Catalogue",
      text: "Namaste! Please send me the official Ayyan Fireworks 2026 Festive Catalogue and Safety Guide."
    },
    {
      icon: MapPin,
      label: "Showroom Directions & Parking",
      text: "Hi, I am planning a visit to your Sivakasi showroom. Could you share directions and parking instructions?"
    },
  ];

  const handleSendPrompt = (text: string) => {
    window.open(getWhatsAppUrl(text), '_blank');
    setIsOpen(false);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    window.open(getWhatsAppUrl(customMsg), '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-out Assistant Modal */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl glass-panel-gold border border-gold-500/30 p-4 shadow-glow-gold-lg backdrop-blur-2xl animate-float transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  Ayyan VIP Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium">Online • Instant Showroom Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-slate-300">
            <p className="mb-2.5 text-slate-300/90">
              Welcome to Ayyan Fireworks direct customer advisory. Select a quick inquiry below or type a custom message:
            </p>

            <div className="space-y-1.5">
              {QUICK_PROMPTS.map((prompt, i) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSendPrompt(prompt.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-obsidian-900/80 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 text-xs text-slate-200 transition-all flex items-center gap-2.5 group"
                  >
                    <Icon className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="flex-1 font-medium group-hover:text-gold-300">{prompt.label}</span>
                    <Send className="w-3 h-3 text-slate-500 group-hover:text-gold-400 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSendCustom} className="pt-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Ask showroom team..."
              className="flex-1 bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center justify-center shrink-0"
              title="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/80 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/30 backdrop-blur-md"
        aria-label="Ayyan Fireworks WhatsApp Showroom Concierge"
      >
        <span className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-400 rounded-full border-2 border-obsidian-900" />
        </span>
        <span className="tracking-wide hidden sm:inline">WhatsApp Concierge</span>
      </button>
    </div>
  );
};
