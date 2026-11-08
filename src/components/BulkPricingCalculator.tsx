import React, { useState } from 'react';
import { Calculator, Sparkles, MessageCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export const BulkPricingCalculator: React.FC = () => {
  const [productType, setProductType] = useState<'visiting-cards' | 'vinyl-stickers' | 'custom-tshirts' | 'standee-banners'>('visiting-cards');
  const [quantity, setQuantity] = useState(500);

  // Pricing rules
  const getCalculation = () => {
    switch (productType) {
      case 'visiting-cards': {
        // 450 GSM velvet gold foil
        let perUnit = 6;
        if (quantity >= 500) perUnit = 3.8;
        if (quantity >= 1000) perUnit = 3.0;
        if (quantity >= 2500) perUnit = 2.4;
        const total = Math.round(quantity * perUnit);
        const original = Math.round(quantity * 8);
        return { perUnit, total, savings: original - total, turnaround: "24 Hours" };
      }
      case 'vinyl-stickers': {
        // Waterproof die cut
        let perUnit = 8;
        if (quantity >= 250) perUnit = 5.5;
        if (quantity >= 500) perUnit = 4.2;
        if (quantity >= 1000) perUnit = 3.2;
        const total = Math.round(quantity * perUnit);
        const original = Math.round(quantity * 10);
        return { perUnit, total, savings: original - total, turnaround: "24 Hours" };
      }
      case 'custom-tshirts': {
        // 240 GSM French terry DTF
        let perUnit = 499;
        if (quantity >= 10) perUnit = 420;
        if (quantity >= 25) perUnit = 370;
        if (quantity >= 50) perUnit = 320;
        if (quantity >= 100) perUnit = 280;
        const total = Math.round(quantity * perUnit);
        const original = Math.round(quantity * 599);
        return { perUnit, total, savings: original - total, turnaround: "36-48 Hours" };
      }
      case 'standee-banners': {
        // Roll-up aluminum standee
        let perUnit = 1450;
        if (quantity >= 3) perUnit = 1290;
        if (quantity >= 5) perUnit = 1150;
        if (quantity >= 10) perUnit = 990;
        const total = Math.round(quantity * perUnit);
        const original = Math.round(quantity * 1800);
        return { perUnit, total, savings: original - total, turnaround: "Same-Day / 24h" };
      }
    }
  };

  const calc = getCalculation();

  const handleInquiry = () => {
    const text = `Hi Instaprint Baranagar! I would like a bulk quote for:%0A%0A*Product:* ${productType}%0A*Quantity:* ${quantity} units%0A*Estimated Price:* ₹${calc.total} (approx ₹${calc.perUnit}/unit)%0A%0APlease let me know the sample proof procedure!`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section className="py-16 bg-[#0c0f18] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Volume Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Corporate & Bulk Printing Quotation Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Instant transparent tiered pricing for Kolkata businesses, medical clinics, schools, and events.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#121624] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="md:col-span-7 space-y-6">
              {/* Product Type Tabs */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  1. Select Print Item:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'visiting-cards', label: 'Velvet Visiting Cards (450 GSM)' },
                    { id: 'vinyl-stickers', label: 'Die-Cut Waterproof Stickers' },
                    { id: 'custom-tshirts', label: 'Corporate & Fest T-Shirts' },
                    { id: 'standee-banners', label: 'Aluminium Roll-up Standees' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setProductType(p.id as any);
                        if (p.id === 'custom-tshirts') setQuantity(25);
                        else if (p.id === 'standee-banners') setQuantity(3);
                        else setQuantity(500);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        productType === p.id
                          ? 'bg-slate-800 text-white border-brand-500 font-bold shadow-sm'
                          : 'bg-[#141824] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <label className="font-bold uppercase tracking-wider text-slate-400">
                    2. Select Quantity:
                  </label>
                  <span className="font-extrabold text-base text-amber-400 font-mono">
                    {quantity} units
                  </span>
                </div>

                <input
                  type="range"
                  min={productType === 'standee-banners' ? 1 : productType === 'custom-tshirts' ? 5 : 100}
                  max={productType === 'standee-banners' ? 20 : productType === 'custom-tshirts' ? 200 : 2500}
                  step={productType === 'standee-banners' ? 1 : productType === 'custom-tshirts' ? 5 : 50}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />

                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>Min: {productType === 'standee-banners' ? 1 : productType === 'custom-tshirts' ? 5 : 100}</span>
                  <span>Max: {productType === 'standee-banners' ? 20 : productType === 'custom-tshirts' ? 200 : 2500}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Free digital artwork proof before printing starts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>Direct pickup from Baranagar shop or local Kolkata courier</span>
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="md:col-span-5 bg-[#090b10] p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                Estimated Volume Pricing
              </span>

              <div>
                <p className="text-3xl font-black text-amber-400 font-mono">
                  ₹{calc.total.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Approx. <strong className="text-white font-mono">₹{calc.perUnit}</strong> per unit
                </p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Bulk Savings:</span>
                  <span className="text-emerald-400 font-bold font-mono">₹{calc.savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Production Turnaround:</span>
                  <span className="text-slate-200 font-medium">{calc.turnaround}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GST Invoice:</span>
                  <span className="text-emerald-400 font-medium">Available on Request</span>
                </div>
              </div>

              <button
                onClick={handleInquiry}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 text-white font-bold text-xs shadow-glow-rose flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Sample / Lock Price</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
