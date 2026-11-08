import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Sun, 
  Moon, 
  Heart, 
  Music, 
  Check, 
  ShoppingBag, 
  MessageCircle, 
  X, 
  Palette,
  Layers,
  Type,
  FileUp,
  Lock
} from 'lucide-react';
import { STORE_INFO, SAMPLE_TEMPLATES } from '../data/products';
import { CartItem } from '../types';

interface LiveCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  initialProductId?: string;
}

export const LiveCustomizer: React.FC<LiveCustomizerProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  initialProductId = 'led-romantic-heart-frame'
}) => {
  if (!isOpen) return null;

  // Selected Product State
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);

  // Front & Back Design Switcher (Section 3 Requirement)
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  
  // Customization Options - Front Side
  const [frontPhotoUrl, setFrontPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
  );
  const [frontText, setFrontText] = useState("Rahul & Priya");
  const [frontSubtitle, setFrontSubtitle] = useState("Together Forever • 14.02.2024");
  
  // Customization Options - Back Side
  const [backPhotoUrl, setBackPhotoUrl] = useState<string | null>(null);
  const [backText, setBackText] = useState("Crafted with Love in Kolkata");
  const [backSubtitle, setBackSubtitle] = useState("Instaprint Studio Edition");

  // Spotify / Music Specific
  const [spotifySong, setSpotifySong] = useState("Kesariya • Arijit Singh");

  // Typography & Color Engine (Section 3 Requirement)
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono' | 'display'>('sans');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('minimal-clean');
  
  // Frame & Lighting States
  const [isLedLit, setIsLedLit] = useState(true);
  const [ledColor, setLedColor] = useState<'amber' | 'rose' | 'cyan' | 'white'>('amber');
  const [selectedSize, setSelectedSize] = useState<'8x6' | '12x8' | '16x12'>('12x8');
  const [selectedBaseFinish, setSelectedBaseFinish] = useState<'love-red' | 'matte-carbon' | 'birch-wood'>('love-red');
  const [photoFilter, setPhotoFilter] = useState<'none' | 'warm' | 'bw' | 'vibrant'>('warm');
  
  const [addedSuccess, setAddedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Price Calculation
  const calculatePrice = () => {
    let basePrice = 899;
    if (selectedProductId === 'spotify-song-acrylic-plaque') basePrice = 649;
    if (selectedProductId === 'gallery-canvas-wrap-print') basePrice = 1199;
    if (selectedProductId === 'dtf-graphic-apparel-tee') basePrice = 499;
    if (selectedProductId === 'standard-visiting-cards') basePrice = 200;

    if (selectedSize === '12x8') basePrice += 400;
    if (selectedSize === '16x12') basePrice += 900;
    if (backPhotoUrl || (backText && backText !== "Crafted with Love in Kolkata")) {
      basePrice += 150; // Dual side print add-on
    }
    return basePrice;
  };

  const currentPrice = calculatePrice();

  // Photo Upload Handler (PNG, JPG, PDF)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (activeSide === 'front') {
            setFrontPhotoUrl(reader.result);
          } else {
            setBackPhotoUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getLedGlowStyles = () => {
    if (!isLedLit) return 'border-slate-800 shadow-none';
    switch (ledColor) {
      case 'amber':
        return 'border-amber-400/90 shadow-[0_0_55px_15px_rgba(245,158,11,0.55)]';
      case 'rose':
        return 'border-rose-400/90 shadow-[0_0_55px_15px_rgba(244,63,94,0.6)]';
      case 'cyan':
        return 'border-cyan-400/90 shadow-[0_0_55px_15px_rgba(6,182,212,0.6)]';
      case 'white':
        return 'border-white/90 shadow-[0_0_55px_15px_rgba(255,255,255,0.65)]';
    }
  };

  const getFilterStyle = () => {
    switch (photoFilter) {
      case 'warm': return 'sepia(25%) contrast(108%) brightness(105%)';
      case 'bw': return 'grayscale(100%) contrast(125%)';
      case 'vibrant': return 'saturate(135%) contrast(110%)';
      default: return 'none';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'display': return 'font-serif italic font-black';
      default: return 'font-sans font-extrabold';
    }
  };

  const currentActivePhoto = activeSide === 'front' ? frontPhotoUrl : (backPhotoUrl || frontPhotoUrl);
  const currentActiveText = activeSide === 'front' ? frontText : backText;
  const currentActiveSubtitle = activeSide === 'front' ? (selectedProductId === 'spotify-song-acrylic-plaque' ? spotifySong : frontSubtitle) : backSubtitle;

  const handleAddToCart = () => {
    const customizedItem: CartItem = {
      id: `custom-${Date.now()}`,
      productId: selectedProductId,
      name: `Customized ${selectedProductId === 'spotify-song-acrylic-plaque' ? 'Spotify Song Plaque' : 'LED Acrylic Photo Frame'}`,
      price: currentPrice,
      originalPrice: currentPrice + 600,
      quantity: 1,
      image: frontPhotoUrl,
      size: selectedSize === '8x6' ? '8 x 6 in' : selectedSize === '12x8' ? '12 x 8 in' : '16 x 12 in',
      finish: selectedBaseFinish === 'love-red' ? 'Crimson LOVE Base' : selectedBaseFinish === 'matte-carbon' ? 'Matte Carbon' : 'Natural Birch Oak',
      ledColor: isLedLit ? ledColor.toUpperCase() + ' Glow' : 'LED Disabled',
      customText: frontText,
      customSubtitle: frontSubtitle,
      uploadedPhotoUrl: frontPhotoUrl,
      backPhotoUrl: backPhotoUrl || undefined,
      backText: backText || undefined,
      fontFamily,
      textColor,
      isCustomized: true
    };

    onAddToCart(customizedItem);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleWhatsAppOrder = () => {
    const text = `Hi Instaprint Baranagar! I customized an item in InstaStudio:%0A%0A*Product:* ${selectedProductId}%0A*Size:* ${selectedSize}%0A*Base:* ${selectedBaseFinish}%0A*LED Light:* ${isLedLit ? ledColor : 'OFF'}%0A*Front Text:* ${frontText} (${frontSubtitle})%0A${backText ? `*Back Text:* ${backText}%0A` : ''}*Calculated Total:* ₹${currentPrice}%0A%0APlease let me know where to send my raw high-res artwork files!`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#0c0f18] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Studio Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#090b10] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center shadow-glow-rose">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  InstaStudio™ Dual-Side 3D Customizer
                </h3>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full border border-brand-500/30">
                  Ready-Made Templates & Front/Back Curing
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Crafted in Baranagar Studio • 24-Hour Express Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Live 3D Interactive Stage */}
          <div className="lg:col-span-7 bg-[#07090e] p-6 flex flex-col items-center justify-center relative min-h-[440px] lg:min-h-[580px] border-b lg:border-b-0 lg:border-r border-slate-800 select-none">
            
            {/* Ambient Background Glow when LED is Lit */}
            {isLedLit && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-40 blur-3xl"
                style={{
                  background: ledColor === 'amber' 
                    ? 'radial-gradient(circle at center, rgba(245, 158, 11, 0.25) 0%, transparent 70%)'
                    : ledColor === 'rose'
                    ? 'radial-gradient(circle at center, rgba(244, 63, 94, 0.25) 0%, transparent 70%)'
                    : ledColor === 'cyan'
                    ? 'radial-gradient(circle at center, rgba(6, 182, 212, 0.25) 0%, transparent 70%)'
                    : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)'
                }}
              />
            )}

            {/* Quick Preview Toggles (Top Bar) */}
            <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
              {/* Dual-Side Toggle Tabs */}
              <div className="flex items-center gap-1 bg-[#121624] p-1 rounded-xl border border-slate-700 shadow-lg">
                <button
                  onClick={() => setActiveSide('front')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeSide === 'front'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Front Side
                </button>
                <button
                  onClick={() => setActiveSide('back')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeSide === 'back'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Back Side {backPhotoUrl && '✓'}
                </button>
              </div>

              {/* Day / Night LED Light switch */}
              <button
                onClick={() => setIsLedLit(!isLedLit)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg ${
                  isLedLit
                    ? 'bg-amber-500 text-black shadow-glow-amber'
                    : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                }`}
              >
                {isLedLit ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isLedLit ? 'LED ON' : 'LED OFF'}</span>
              </button>
            </div>

            {/* Visual Frame Render Area */}
            <div className="relative flex flex-col items-center justify-center my-auto transition-transform duration-300 hover:scale-[1.02] pt-6">
              
              {/* The Acrylic Plate */}
              <div 
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 border-2 ${getLedGlowStyles()} ${
                  selectedSize === '8x6' 
                    ? 'w-56 sm:w-64 aspect-[3/4]' 
                    : selectedSize === '12x8' 
                    ? 'w-64 sm:w-72 aspect-[3/4.2]' 
                    : 'w-72 sm:w-80 aspect-[3/4.5]'
                }`}
                style={{
                  backgroundColor: isLedLit ? '#0d101a' : '#080a0f'
                }}
              >
                {/* Active Photo Layer */}
                <img
                  src={currentActivePhoto}
                  alt="Custom Print Preview"
                  className="w-full h-full object-cover object-center transition-all duration-500"
                  style={{
                    filter: `${getFilterStyle()} ${isLedLit ? 'brightness(1.06)' : 'brightness(0.68) contrast(0.92)'}`
                  }}
                />

                {/* Laser Heart Cutout Badge (if Romantic Frame) */}
                {selectedProductId === 'led-romantic-heart-frame' && (
                  <div className="absolute top-3 right-3 bg-brand-600/90 backdrop-blur-md p-1.5 rounded-full shadow-lg">
                    <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
                  </div>
                )}

                {/* Inset Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Micro Fairy LED Sparkles when Illuminated */}
                {isLedLit && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-75"
                    style={{
                      backgroundImage: `radial-gradient(circle at 18% 28%, white 0%, transparent 12%),
                                        radial-gradient(circle at 82% 24%, white 0%, transparent 14%),
                                        radial-gradient(circle at 45% 72%, white 0%, transparent 16%),
                                        radial-gradient(circle at 78% 76%, white 0%, transparent 14%)`
                    }}
                  />
                )}

                {/* Lower Plate Inscription with Dynamic Font & Color */}
                <div className="absolute bottom-3 inset-x-3 text-center bg-black/65 backdrop-blur-md py-2.5 px-3 rounded-xl border border-white/10">
                  <p 
                    className={`text-sm truncate ${getFontFamilyClass()}`}
                    style={{ color: textColor }}
                  >
                    {currentActiveText || "Your Inscription Here"}
                  </p>
                  <p className="text-[11px] text-amber-300 font-medium tracking-wider font-mono truncate mt-0.5">
                    {currentActiveSubtitle || "Special Date or Quote"}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-widest font-mono">
                    Viewing: {activeSide.toUpperCase()} SIDE
                  </span>
                </div>
              </div>

              {/* Wooden / Laser Cut Stand Base */}
              <div 
                className={`relative -mt-3.5 z-10 rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between transition-all duration-300 ${
                  selectedSize === '8x6' ? 'w-64 sm:w-72' : selectedSize === '12x8' ? 'w-72 sm:w-80' : 'w-80 sm:w-88'
                } ${
                  selectedBaseFinish === 'love-red'
                    ? 'bg-gradient-to-r from-[#24050c] via-[#4c0515] to-[#24050c] border border-rose-500/50'
                    : selectedBaseFinish === 'matte-carbon'
                    ? 'bg-gradient-to-r from-[#0d0f17] via-[#1a1f30] to-[#0d0f17] border border-slate-700'
                    : 'bg-gradient-to-r from-[#291708] via-[#48280f] to-[#291708] border border-amber-700/60'
                }`}
              >
                {selectedBaseFinish === 'love-red' ? (
                  <div className="flex items-center gap-1">
                    <span className="font-serif font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
                      L ❤ VE
                    </span>
                    <span className="text-[9px] text-rose-300 font-bold uppercase tracking-widest pl-1">
                      STAND
                    </span>
                  </div>
                ) : selectedBaseFinish === 'birch-wood' ? (
                  <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs">
                    <span>NORDIC TEAKWOOD</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs font-semibold">
                    <span>MATTE CARBON</span>
                  </div>
                )}

                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                    Precision Cured
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    INSTAPRINT 4MM
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-4 text-center z-10 text-xs text-slate-400">
              Dual-Side Ready • 1200 DPI Optical UV Print • Optical-Grade Cast Acrylic
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-6 overflow-y-auto bg-[#0d1019]">
            
            {/* Step 1: Ready-Made Design Templates */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center justify-between">
                <span>1. Ready-Made Design Templates</span>
                <span className="text-brand-400 font-mono text-[11px]">Step 1 of 5</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {SAMPLE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      if (tmpl.id === 'gold-luxury') {
                        setFontFamily('serif');
                        setTextColor('#f59e0b');
                      } else if (tmpl.id === 'startup-vibrant') {
                        setFontFamily('mono');
                        setTextColor('#06b6d4');
                      } else {
                        setFontFamily('sans');
                        setTextColor('#ffffff');
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2 transition-all ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-slate-800 text-white border-brand-500 font-bold shadow-sm'
                        : 'bg-[#141824] text-slate-300 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <img src={tmpl.previewUrl} alt={tmpl.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <span className="truncate">{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Upload Artwork / Logo (PDF, PNG, JPG) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center justify-between">
                <span>2. Upload Design & Logo ({activeSide.toUpperCase()})</span>
                <span className="text-emerald-400 font-mono text-[11px]">PDF, PNG, JPG</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, application/pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-semibold text-xs border border-slate-700 transition-all shadow-md"
                >
                  <FileUp className="w-4 h-4 text-brand-400" />
                  <span>Attach File to {activeSide.toUpperCase()} Side</span>
                </button>
              </div>

              {/* Sample Preset Photos */}
              <div className="mt-2.5">
                <p className="text-[11px] text-slate-400 mb-1.5">Or choose a pre-loaded sample:</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { label: "Couple", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" },
                    { label: "Family", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80" },
                    { label: "Portrait", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
                    { label: "Logo Art", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80" }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (activeSide === 'front') setFrontPhotoUrl(preset.url);
                        else setBackPhotoUrl(preset.url);
                      }}
                      className="shrink-0 group relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700"
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-[9px] text-white font-bold opacity-0 group-hover:opacity-100">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Typography & Colors */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                3. Fonts & Color Styling
              </label>

              {/* Font Family Selector */}
              <div className="grid grid-cols-4 gap-1.5 text-xs mb-3">
                {[
                  { id: 'sans', label: 'Modern Sans' },
                  { id: 'serif', label: 'Luxury Serif' },
                  { id: 'mono', label: 'Clean Mono' },
                  { id: 'display', label: 'Script Calligraphy' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id as any)}
                    className={`py-1.5 rounded-lg border text-center transition-all ${
                      fontFamily === f.id
                        ? 'bg-slate-700 text-white border-brand-500 font-bold'
                        : 'bg-[#141824] text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="text-[11px] truncate block">{f.label}</span>
                  </button>
                ))}
              </div>

              {/* Text Color Swatches */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-slate-400">Color:</span>
                {[
                  { hex: '#ffffff', name: 'White' },
                  { hex: '#f59e0b', name: 'Gold' },
                  { hex: '#f43f5e', name: 'Rose' },
                  { hex: '#06b6d4', name: 'Cyan' },
                  { hex: '#10b981', name: 'Mint' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setTextColor(c.hex)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      textColor === c.hex ? 'scale-125 border-white ring-2 ring-white/20' : 'border-transparent opacity-80'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Text Inputs for Active Side */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Primary Line ({activeSide.toUpperCase()}):
                  </span>
                  <input
                    type="text"
                    value={activeSide === 'front' ? frontText : backText}
                    onChange={(e) => {
                      if (activeSide === 'front') setFrontText(e.target.value);
                      else setBackText(e.target.value);
                    }}
                    placeholder="e.g. Rahul & Sneha / Company Name"
                    maxLength={32}
                    className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Secondary Line / Subtitle ({activeSide.toUpperCase()}):
                  </span>
                  <input
                    type="text"
                    value={activeSide === 'front' ? frontSubtitle : backSubtitle}
                    onChange={(e) => {
                      if (activeSide === 'front') setFrontSubtitle(e.target.value);
                      else setBackSubtitle(e.target.value);
                    }}
                    placeholder="e.g. Together Forever • 14.02.2024"
                    maxLength={40}
                    className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Dimensions & Stand Base */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                4. Dimensions & Base Stand
              </label>
              
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                {[
                  { id: '8x6', label: '8 x 6 in', extra: 'Compact' },
                  { id: '12x8', label: '12 x 8 in', extra: 'Studio (+₹400)' },
                  { id: '16x12', label: '16 x 12 in', extra: 'Grand (+₹900)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.id as any)}
                    className={`py-2 px-2 rounded-xl text-center transition-all ${
                      selectedSize === s.id
                        ? 'bg-slate-700 text-white border-2 border-brand-500 font-bold'
                        : 'bg-[#141824] text-slate-300 border border-slate-800'
                    }`}
                  >
                    <p className="font-bold">{s.label}</p>
                    <p className="text-[10px] text-slate-400">{s.extra}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'love-red', label: 'Crimson LOVE', color: '#dc2626' },
                  { id: 'matte-carbon', label: 'Matte Carbon', color: '#1e293b' },
                  { id: 'birch-wood', label: 'Nordic Oak', color: '#b45309' }
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBaseFinish(b.id as any)}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      selectedBaseFinish === b.id
                        ? 'bg-slate-800 text-white border-2 border-brand-400 font-bold'
                        : 'bg-[#141824] text-slate-400 border border-slate-800'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="truncate">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Action Section */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Customized Total:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹{(currentPrice + 600).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <p className="text-emerald-400 font-semibold">Ready in 24 Hours</p>
                  <p>Store Pickup in Baranagar</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                  <span>Send Custom Order to WhatsApp</span>
                </button>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Online Checkout (Razorpay):</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Integration Pending
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
