import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  ShieldCheck, 
  Calendar, 
  ExternalLink, 
  Navigation, 
  CheckCircle2, 
  Building
} from 'lucide-react';
import { SHOWROOM_CONTACT } from '../lib/utils';
import { LegalComplianceBanner } from '../components/common/LegalComplianceBanner';

export const ShowroomPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-wider">
          <Building className="w-3.5 h-3.5 text-gold-400" />
          <span>Visakhapatnam Flagship Experience Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Showroom & Visitor Protocol Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Plan your festive visit to our licensed premises in Visakhapatnam. Safe, air-conditioned viewing galleries with expert pyrotechnic guidance.
        </p>
      </div>

      <LegalComplianceBanner compact />

      {/* Main Grid: Showroom Details & Map Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Logistics Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6 border border-gold-500/25">
            <div className="flex items-center gap-3">
              <div className="h-12 w-auto bg-white/95 rounded-xl p-1 shadow-sm border border-gold-400/40 flex items-center justify-center">
                <img src="/ayyan-logo.png" alt="Ayyan Logo" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Visakhapatnam Flagship
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  Bunny Brand Since 1987
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Physical Address</span>
                <p className="text-slate-100 font-medium leading-relaxed">{SHOWROOM_CONTACT.address}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Landmark & Route</span>
                <p className="text-slate-200">Main Road / NH-16 (near Natayyapalem / Drivers Colony), Sheela Nagar</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational Hours</span>
                <p className="text-slate-100 font-medium">{SHOWROOM_CONTACT.operationalHours}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Helpline</span>
                <p className="font-mono text-gold-300 font-bold text-base">{SHOWROOM_CONTACT.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Statutory License</span>
                <p className="font-mono text-xs text-slate-300">{SHOWROOM_CONTACT.pesoLicense}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href={SHOWROOM_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-gradient-btn px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-center"
              >
                <Navigation className="w-4 h-4 text-obsidian-950" />
                <span>Open Google Maps</span>
              </a>

              <Link
                to="/book-slot"
                className="px-4 py-3 rounded-xl glass-panel hover:glass-panel-gold border border-gold-500/30 text-gold-300 text-xs font-bold flex items-center justify-center gap-2 text-center"
              >
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Book Visiting Slot</span>
              </Link>
            </div>
          </div>

          {/* Parking & Cargo Protocol */}
          <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/10 text-xs text-slate-300">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Car className="w-4 h-4 text-gold-400" />
              Parking & Loading Instructions
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Convenient NH-16 highway service road access with ample customer car parking.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Dedicated loading assistance for direct vehicle boot transfer.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>PESO-certified safety packaging provided for secure personal transportation.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Map Graphic & Showroom Floor Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Simulated Interactive Map */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-obsidian-900 border-2 border-gold-500/30 shadow-glass">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-obsidian-950 to-slate-900">
              {/* Grid Roads */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Simulated NH-16 Highway Arterial Road */}
              <div className="absolute top-1/2 left-0 right-0 h-14 bg-slate-800/80 -translate-y-1/2 border-y border-white/10 flex items-center justify-center">
                <span className="font-mono text-[11px] text-amber-300 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span>🚗 National Highway 16 (NH-16) — Sheela Nagar Arterial Corridor</span>
                </span>
              </div>
              <div className="absolute top-0 bottom-0 left-1/3 w-12 bg-slate-800/80 border-x border-white/10 flex items-center justify-center">
                <span className="font-mono text-[9px] text-slate-400 -rotate-90 whitespace-nowrap">
                  Drivers Colony Road
                </span>
              </div>

              {/* Showroom Pin */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500 text-obsidian-950 flex items-center justify-center shadow-glow-gold-lg animate-bounce">
                    <Building className="w-7 h-7" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-gold-400/40 absolute -bottom-2 left-1/2 -translate-x-1/2 animate-ping" />
                </div>
                <div className="mt-2 px-3 py-1 rounded-xl bg-obsidian-950/95 border border-gold-400 text-gold-300 font-bold text-xs shadow-xl whitespace-nowrap">
                  AYYAN FIREWORKS SHOWROOM
                </div>
              </div>

              {/* Nearby Landmarks */}
              <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-obsidian-900/90 border border-white/10 text-[11px] text-slate-300">
                📍 Visakhapatnam Airport (~4.5 km)
              </div>
              <div className="absolute bottom-6 left-6 px-3 py-1.5 rounded-lg bg-obsidian-900/90 border border-white/10 text-[11px] text-slate-300">
                📍 Natayyapalem / Gajuwaka Junction
              </div>
            </div>

            {/* Direct Directions Overlay */}
            <div className="absolute bottom-4 right-4 z-20">
              <a
                href={SHOWROOM_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-gold hover:bg-gold-400 transition-colors"
              >
                <span>Navigate via GPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Showroom Visiting Protocols */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              In-Store Visitor Safety Protocols
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
                <strong className="text-gold-300 block">1. Priority Entry with VIP Pass</strong>
                <p className="text-slate-400">Present your digital QR pass at the security desk to bypass general waiting queues.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
                <strong className="text-gold-300 block">2. Strict Safety Compliance</strong>
                <p className="text-slate-400">Matchboxes, lighters, and inflammable items must remain outside the exhibition premises.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
                <strong className="text-gold-300 block">3. Air-Conditioned Sample Gallery</strong>
                <p className="text-slate-400">Inspect dummy effect mockups, box sizes, and video demonstrations comfortably.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
                <strong className="text-gold-300 block">4. Direct Billing & Vehicle Dispatch</strong>
                <p className="text-slate-400">Complete statutory billing directly at checkout with instant loading assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
