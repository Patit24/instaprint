import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Sun, 
  Moon, 
  Flame,
  Palette,
  Heart,
  MessageCircle,
  Eye
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface HeroProps {
  onOpenCustomizer?: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCustomizer, onExploreCatalog }) => {
  // Interactive Hero Preview state (demonstrating the exact product from user's listing photo)
  const [isLedOn, setIsLedOn] = useState(true);
  const [ledColor, setLedColor] = useState<'amber' | 'rose' | 'cyan' | 'white'>('amber');
  const [photoIndex, setPhotoIndex] = useState(0);

  const samplePhotos = [
    {
      title: "Rahul & Sneha (Couple Special)",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      caption: "Together Forever • 14.02.2024"
    },
    {
      title: "Family Memory (Anniversary)",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      caption: "Golden Moments • Kolkata"
    },
    {
      title: "Solo Aesthetic Portrait",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      caption: "Dream Big • Always"
    }
  ];

  const getGlowStyle = () => {
    if (!isLedOn) return 'shadow-none border-slate-700/60';
    switch (ledColor) {
      case 'amber':
        return 'shadow-[0_0_50px_10px_rgba(245,158,11,0.5)] border-amber-400/80';
      case 'rose':
        return 'shadow-[0_0_50px_10px_rgba(244,63,94,0.55)] border-rose-400/80';
      case 'cyan':
        return 'shadow-[0_0_50px_10px_rgba(6,182,212,0.55)] border-cyan-400/80';
      case 'white':
        return 'shadow-[0_0_50px_10px_rgba(255,255,255,0.6)] border-white/80';
    }
  };

  const getGlowColorHex = () => {
    switch (ledColor) {
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      case 'cyan': return '#06b6d4';
      case 'white': return '#ffffff';
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#090b10] via-[#0d1019] to-[#090b10]">
      {/* Background Ambient Lighting Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1e2639_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Google Rating Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141826] border border-amber-500/30 text-xs text-slate-300 shadow-inner">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5.0</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-medium">158+ Verified Google Reviews</span>
              <span className="hidden sm:inline px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                Baranagar, Kolkata
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Turn Treasured Moments Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-brand-400 to-amber-300">
                Glowing Masterpieces.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Kolkata’s favorite custom print atelier. Handcrafted 
              <span className="text-white font-medium"> 3D LED Acrylic Frames</span>, 
              museum canvas wall art, neon name signs, and executive visiting cards. 
              Produced in our Baranagar studio with rapid 24-hour turnaround.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-brand-600 via-rose-600 to-amber-500 text-white font-bold text-base shadow-glow-rose hover:shadow-glow-amber hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Browse Products & Order</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#141824] hover:bg-[#1a2030] text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all"
              >
                <span>Explore Full Catalog (150+)</span>
              </button>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left border-t border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">24h Express</h4>
                  <p className="text-[11px] text-slate-400">Fast studio turnaround</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Store Pickup</h4>
                  <p className="text-[11px] text-slate-400">Shop 106/B, Baranagar</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Breakage</h4>
                  <p className="text-[11px] text-slate-400">Bubble + crate packing</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Pan-India Ship</h4>
                  <p className="text-[11px] text-slate-400">Express air courier</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Illuminated Frame Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md bg-[#111420] p-5 sm:p-6 rounded-3xl border border-slate-700/80 shadow-2xl">
              
              {/* Simulator Header / Controls */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Studio LED Simulator
                  </span>
                </div>

                {/* Power Toggle Button */}
                <button
                  onClick={() => setIsLedOn(!isLedOn)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isLedOn
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-glow-amber'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                  title="Click to toggle LED lights on/off"
                >
                  {isLedOn ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isLedOn ? 'LED ON' : 'LED OFF'}</span>
                </button>
              </div>

              {/* The Physical Frame Container */}
              <div className="relative flex flex-col items-center">
                
                {/* Optical Acrylic Plate with Photo */}
                <div 
                  className={`relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 border-2 ${getGlowStyle()}`}
                  style={{
                    backgroundColor: isLedOn ? '#0e121e' : '#080a0f'
                  }}
                >
                  {/* Photo Layer */}
                  <img
                    src={samplePhotos[photoIndex].url}
                    alt={samplePhotos[photoIndex].title}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    style={{
                      filter: isLedOn ? 'contrast(1.08) brightness(1.05)' : 'brightness(0.65) contrast(0.95)'
                    }}
                  />

                  {/* Laser Cut Romantic Cutout Overlay (Matches the user's photo!) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Corner Heart & Laser Cutouts */}
                  <div className="absolute top-3 right-3 bg-brand-600/80 backdrop-blur-md p-1.5 rounded-full shadow-lg">
                    <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
                  </div>

                  {/* Micro Fairy LED light specks when ON */}
                  {isLedOn && (
                    <div 
                      className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
                      style={{
                        backgroundImage: `radial-gradient(circle at 20% 30%, ${getGlowColorHex()} 0%, transparent 20%),
                                          radial-gradient(circle at 80% 25%, ${getGlowColorHex()} 0%, transparent 18%),
                                          radial-gradient(circle at 40% 75%, ${getGlowColorHex()} 0%, transparent 22%),
                                          radial-gradient(circle at 75% 80%, ${getGlowColorHex()} 0%, transparent 20%)`
                      }}
                    ></div>
                  )}

                  {/* Bottom Plate Inscription */}
                  <div className="absolute bottom-3 inset-x-3 text-center bg-black/60 backdrop-blur-md py-2 px-3 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-white tracking-wide">
                      {samplePhotos[photoIndex].title}
                    </p>
                    <p className="text-[10px] text-amber-300 font-mono">
                      {samplePhotos[photoIndex].caption}
                    </p>
                  </div>
                </div>

                {/* Weighted 3D "LOVE" Base Stand (Exact signature style from user photo) */}
                <div className="relative -mt-3 z-10 w-72 sm:w-80 bg-gradient-to-r from-[#1e070d] via-[#3f0814] to-[#1e070d] rounded-2xl p-3 border border-rose-500/40 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5 pl-2">
                    <span className="font-serif font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-rose-400">
                      L ❤ VE
                    </span>
                    <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider">
                      STAND
                    </span>
                  </div>

                  {/* Price Tag & Customize Pill */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 line-through">₹1,499</span>
                      <p className="text-sm font-extrabold text-amber-400 leading-none">₹899</p>
                    </div>
                    <button
                      onClick={onExploreCatalog}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      View Products
                    </button>
                  </div>
                </div>

              </div>

              {/* Color & Photo Switcher Toolset */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">LED Lighting Mode:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'amber', label: 'Amber', hex: '#f59e0b' },
                      { id: 'rose', label: 'Rose', hex: '#f43f5e' },
                      { id: 'cyan', label: 'Cyan', hex: '#06b6d4' },
                      { id: 'white', label: 'Moon', hex: '#ffffff' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setLedColor(c.id as any);
                          setIsLedOn(true);
                        }}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          ledColor === c.id && isLedOn ? 'scale-125 border-white ring-2 ring-white/30' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`${c.label} LED Light`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">Switch Photo:</span>
                  <div className="flex items-center gap-1.5">
                    {samplePhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPhotoIndex(idx)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                          photoIndex === idx
                            ? 'bg-brand-500/30 text-brand-300 border border-brand-500/50'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        Sample #{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
