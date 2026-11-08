import React from 'react';
import { Shield, Truck, RotateCcw, Lock, FileCheck } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface PolicyPageProps {
  type: 'shipping-policy' | 'refund-policy' | 'privacy-policy' | 'terms';
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type }) => {
  if (type === 'shipping-policy') {
    return (
      <div className="py-12 bg-[#090b10] min-h-[85vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-brand-400 font-bold mb-2">
            <Truck className="w-5 h-5" />
            <span className="uppercase tracking-widest text-[11px]">Official Policy</span>
          </div>
          <h1 className="text-3xl font-black text-white">Shipping & Delivery Policy</h1>
          <p className="text-slate-400">Last updated: November 2026</p>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white">1. Baranagar Store Pickup (100% Free)</h3>
            <p>
              Clients may select Free Store Pickup at our primary workshop: <strong>{STORE_INFO.address}</strong>. You will receive an SMS and WhatsApp notification once your artwork is printed, cured, and packed.
            </p>

            <h3 className="text-base font-bold text-white">2. Kolkata Hyperlocal Express</h3>
            <p>
              For orders across Kolkata, Dunlop, Belgharia, Salt Lake, New Town, and Howrah, delivery is handled within 24-36 hours via specialized courier partners. Orders above ₹999 qualify for <strong>FREE DELIVERY</strong>. Flat delivery charge of ₹70 applies below ₹999.
            </p>

            <h3 className="text-base font-bold text-white">3. Pan-India Secure Express Courier</h3>
            <p>
              All outstation parcels are packed in shock-absorbing bubble envelopes or customized rigid wooden crates for optical acrylic frames and ceramic mugs. Tracked via DTDC, Bluedart, or Delhivery with active AWB tracking numbers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'refund-policy') {
    return (
      <div className="py-12 bg-[#090b10] min-h-[85vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <RotateCcw className="w-5 h-5" />
            <span className="uppercase tracking-widest text-[11px]">Satisfaction Assurance</span>
          </div>
          <h1 className="text-3xl font-black text-white">Return & Replacement Policy</h1>
          <p className="text-slate-400">Last updated: November 2026</p>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white">1. 100% Zero-Breakage Guarantee</h3>
            <p>
              If your LED acrylic silhouette frame, glass plaque, or ceramic mug is damaged or scratched during transit, we provide an immediate free reprint and dispatch. Simply share a photo or video within 48 hours of delivery to our WhatsApp hotline: <strong>{STORE_INFO.phone}</strong>.
            </p>

            <h3 className="text-base font-bold text-white">2. Personalized Print Proofs</h3>
            <p>
              Because customized goods feature individual photographs, names, or corporate branding, refunds cannot be issued for typographical errors approved during pre-press proofs. We always recommend reviewing spelling and image clarity in the InstaStudio preview before placing orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'privacy-policy') {
    return (
      <div className="py-12 bg-[#090b10] min-h-[85vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Lock className="w-5 h-5" />
            <span className="uppercase tracking-widest text-[11px]">Privacy & Confidentiality</span>
          </div>
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: November 2026</p>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white">1. Personal Photographs & Corporate Artwork Security</h3>
            <p>
              We treat your family pictures, couple photographs, and proprietary company branding with utmost confidentiality. Uploaded design assets are accessible only to authorized printing technicians and are never shared, sold, or used for unsolicited public advertising without explicit consent.
            </p>

            <h3 className="text-base font-bold text-white">2. Payment Security</h3>
            <p>
              All online transactions are processed through encrypted 256-bit SSL protocols. We do not store credit card numbers or UPI PINs on our servers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Terms and conditions
  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
          <FileCheck className="w-5 h-5" />
          <span className="uppercase tracking-widest text-[11px]">Legal Terms</span>
        </div>
        <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
        <p className="text-slate-400">Last updated: November 2026</p>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-base font-bold text-white">1. Service Agreement</h3>
          <p>
            By placing an order on instaprintkolkata.com or via our Baranagar studio counter, you confirm that you hold intellectual property rights or permission for all images, logos, and trademarks submitted for printing.
          </p>

          <h3 className="text-base font-bold text-white">2. Color Calibration & Tolerances</h3>
          <p>
            Computer and phone screens display in RGB light, while professional offset, flatbed UV, and DTF machines print in CMYK pigments. Slight hue differences within standard commercial printing industry tolerances (ISO 12647) may occur.
          </p>
        </div>
      </div>
    </div>
  );
};
