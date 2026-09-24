import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Clock } from 'lucide-react';
import { SHOWROOM_CONTACT } from '../../lib/utils';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="relative bg-slate-100 dark:bg-obsidian-950 border-t border-slate-200 dark:border-white/[0.08] pt-12 sm:pt-16 pb-28 sm:pb-12 overflow-hidden text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/5 dark:bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-white/[0.08]">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-2xl p-0.5 shadow-md dark:shadow-glow-gold border border-amber-400/40 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-1">
                  <img
                    src="/ayyan-emblem.png"
                    alt="Bunny Brand"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white block">
                  AYYAN <span className="gold-gradient-text">FIREWORKS</span>
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
                  Bunny Brand • Since 1987
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Andhra Pradesh and Visakhapatnam&apos;s trusted festive destination. Authentic Bunny Brand Fancy Fireworks, PESO certified green pyrotechnics, and direct showroom pricing.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold text-[11px]">{SHOWROOM_CONTACT.pesoLicense}</span>
            </div>
          </div>

          {/* Quick Discovery Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-wider uppercase mb-4 text-amber-700 dark:text-gold-400">
              Customer Portal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-amber-700 dark:hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>Home & Safety Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-amber-700 dark:hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>2026 Digital Price Catalogue</span>
                </Link>
              </li>
              <li>
                <Link to="/book-slot" className="hover:text-amber-700 dark:hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>Book VIP Showroom Visiting Slot</span>
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="hover:text-amber-700 dark:hover:text-gold-300 transition-colors flex items-center gap-2">
                  <span>Visakhapatnam Showroom & Directions</span>
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-amber-700 dark:hover:text-gold-300 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <span>Owner & Staff Management Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Logistics */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-wider uppercase mb-4 text-amber-700 dark:text-gold-400">
              Visakhapatnam Flagship Showroom
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SHOWROOM_CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
                <span>{SHOWROOM_CONTACT.operationalHours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
                <span>{SHOWROOM_CONTACT.phone}</span>
              </li>
            </ul>
          </div>

          {/* Legal Compliance Disclaimer */}
          <div className="space-y-3 bg-white dark:bg-obsidian-900/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Statutory Disclaimer
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              Ayyan Fireworks strictly complies with Supreme Court directives (Civil Appeal No. 23517/2017) and PESO Explosives Rules 2008. No online delivery is conducted. Customers can reserve consultation slots and personally collect certified items at our licensed Visakhapatnam showroom.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Ayyan Fireworks (Bunny Brand Since 1987). Visakhapatnam, Andhra Pradesh 530012.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 dark:text-slate-400 font-medium">CSIR-NEERI Green Certified</span>
            <span>•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Zero Barium Nitrate Formulation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
