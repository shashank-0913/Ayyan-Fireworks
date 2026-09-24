import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldCheck, MapPin, Phone, Clock } from 'lucide-react';
import { SHOWROOM_CONTACT } from '../../lib/utils';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="relative bg-obsidian-950 border-t border-white/[0.08] pt-16 pb-12 overflow-hidden text-slate-400 text-xs">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 shadow-glow-gold">
                <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white">
                AYYAN <span className="text-gold-400">FIREWORKS</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              India's premier certified fireworks house crafting memories since 1923. Dedicated to green pyrotechnic science, statutory compliance, and unmatched festive brilliance.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold text-[11px]">PESO Reg. E/HQ/TN/20/1982</span>
            </div>
          </div>

          {/* Quick Discovery Navigation */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4 text-gold-400">
              Customer Portal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>Home & Safety Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>2026 Digital Price Catalogue</span>
                </Link>
              </li>
              <li>
                <Link to="/book-slot" className="hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>Book VIP Showroom Visiting Slot</span>
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>Showroom Directions & Parking</span>
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-gold-300 transition-colors flex items-center gap-2 text-slate-300">
                  <span>Staff & Management Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Logistics */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4 text-gold-400">
              Flagship Showroom
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{SHOWROOM_CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{SHOWROOM_CONTACT.operationalHours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{SHOWROOM_CONTACT.phone}</span>
              </li>
            </ul>
          </div>

          {/* Legal Compliance Disclaimer */}
          <div className="space-y-3 bg-obsidian-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="font-bold text-slate-200 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Statutory Disclaimer
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Ayyan Fireworks strictly complies with Supreme Court orders (Civil Appeal No. 23517/2017) and Explosives Rules 2008. No ecommerce cart or remote delivery is enabled. Customers must personally collect verified orders at our licensed premises.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Ayyan Fireworks Pvt. Ltd. All Rights Reserved. Sivakasi, Tamil Nadu.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Green Pyrotechnics Certified (CSIR-NEERI)</span>
            <span>•</span>
            <span className="text-slate-400">Zero Barium Formulation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
