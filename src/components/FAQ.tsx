import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How fast is your standard printing turnaround?",
      a: "Most visiting cards, stickers, documents, and apparel orders are ready in 24 hours. Signature items like Romantic LED Acrylic Silhouette Frames and illuminated Spotify Plaques can be picked up from our Baranagar shop in 24 hours. Large bulk corrugated box orders take 48-72 hours."
    },
    {
      q: "Can I collect my order directly from your Baranagar shop?",
      a: "Yes! Select 'Baranagar Store Pickup (FREE)' during checkout. Once our technicians pack your order, you can visit Ground Floor, Shop 106/B, Gopal Lal Tagore Rd, Joyshree, Baranagar (near Joyshree More). Open Monday to Saturday 11:00 AM – 9:30 PM, Sunday 12:00 PM – 8:00 PM."
    },
    {
      q: "What file formats do you accept for custom printing?",
      a: "We accept PDF (press-ready CMYK with fonts outlined), high-resolution PNG (300 DPI+ with transparent background), JPEG, and TIFF. If your design needs DPI enhancement or color correction, our in-house pre-press team will assist free of charge."
    },
    {
      q: "Do you offer single-piece customized gifts and apparel?",
      a: "Yes! Unlike industrial offset printers, our modern UV flatbed and DTF technology allows single-piece printing for LED photo frames, 3D moon lamps, graphic t-shirts, hoodies, and magic photo mugs without setup penalties."
    },
    {
      q: "What are your payment methods?",
      a: "We accept instant UPI QR Code (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards, Net Banking, and Cash on Delivery / Pay on Pickup at the Baranagar shop counter."
    },
    {
      q: "What happens if my acrylic frame or mug arrives broken?",
      a: "We offer a 100% Zero-Breakage Guarantee. If an item is damaged during transit, simply share an unboxing photo on WhatsApp (+91 82406 38595) within 48 hours and we will reprint and dispatch a replacement immediately."
    }
  ];

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Frequently Asked Questions</h1>
          <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about turnaround times, files, store pickup, and delivery.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#121622] border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm hover:text-brand-400"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
