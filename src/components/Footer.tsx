import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  ShieldAlert,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { STORE_INFO, CATEGORIES_CONFIG } from '../data/products';
import { AppPage } from '../types';

interface FooterProps {
  onOpenCustomizer?: () => void;
  onOpenTrackOrder: () => void;
  onSelectCategory: (cat: string) => void;
  onNavigate: (page: AppPage) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCustomizer,
  onOpenTrackOrder,
  onSelectCategory,
  onNavigate,
  theme = 'dark',
  onToggleTheme,
}) => {
  return (
    <footer className="bg-[#06080c] border-t border-slate-900 text-slate-400 text-xs">
      
      {/* Top Value Assurance Strip */}
      <div className="border-b border-slate-900/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-brand-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">4.9★ Google Rated</h4>
                <p className="text-[11px] text-slate-500">158+ verified client reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold">24-Hour Production</h4>
                <p className="text-[11px] text-slate-500">Fastest turnaround in Kolkata</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold">Breakage Insurance</h4>
                <p className="text-[11px] text-slate-500">Zero-risk bubble & crate transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold">Baranagar Studio</h4>
                <p className="text-[11px] text-slate-500">Direct store counter pickup</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="bg-white/95 hover:bg-white px-3 py-1.5 rounded-2xl shadow-md border border-white/20 transition-all inline-block">
                <img
                  src="/logo.png"
                  alt="Instaprint - Best Printing. Best Price."
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Baranagar’s premier custom print and corporate merchandising studio. Powered by high-speed Heidelberg offset printing, Roland UV flatbeds, optical cast acrylic lasers, and precision DTF garment machinery.
            </p>

            <div className="space-y-1.5 pt-2 text-xs">
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white font-mono font-bold">
                  {STORE_INFO.phone}
                </a>
              </p>
            </div>

            {/* Admin Back-Office Button */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all group"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
                <span>Open Store Admin Panel</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Product Categories (Section 2) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              20 Print Categories
            </h4>
            <ul className="grid grid-cols-1 gap-1.5 text-xs">
              {CATEGORIES_CONFIG.slice(0, 8).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(item.id);
                      onNavigate('shop');
                    }}
                    className="hover:text-brand-400 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 pt-1"
                >
                  <span>View All 20 Categories →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Essential Website Pages (Section 9) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Us (Our Story)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Us & Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  FAQs & Artwork Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping-policy')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund-policy')} className="hover:text-white transition-colors">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Customer Support & Connect */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Support Desk
            </h4>
            <p className="text-[11px] text-slate-400">
              Hours: 11:00 AM – 9:30 PM (Mon-Sat)<br />
              Sunday: 12:00 PM – 8:00 PM
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Hello Instaprint Baranagar! I need support with an order or custom quote.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant Support</span>
              </a>

              <button
                onClick={onOpenTrackOrder}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#141824] border border-slate-700/80 text-slate-200 font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Track Live Order</span>
              </button>

              <button
                onClick={() => onNavigate('categories')}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600/40 to-rose-600/40 border border-brand-500/40 text-brand-300 font-bold text-xs hover:from-brand-600 hover:to-rose-600 hover:text-white transition-all"
              >
                <Star className="w-4 h-4 text-amber-400" />
                <span>Explore Catalog</span>
              </button>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                Accepted Secure Payments
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                UPI QR (GPay, PhonePe, Paytm) • Visa & Mastercard • Net Banking • Cash on Store Pickup
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} INSTAPRINT Studio. All rights reserved. Shop 106/B, Gopal Lal Tagore Rd, Joyshree, Baranagar, Kolkata 700036.</p>
          
          <div className="flex items-center gap-4">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                title={`Switch to ${theme === 'light' ? 'Dark Neon Studio' : 'Clean Light Studio'}`}
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
              </button>
            )}

            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
              <span>in Baranagar, Kolkata</span>
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
};
