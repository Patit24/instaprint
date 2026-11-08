import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  ShieldCheck, 
  Upload, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Package, 
  Layers, 
  ChevronRight, 
  Camera, 
  Lock, 
  AlertCircle,
  Trash2,
  FileText,
  CreditCard
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { STORE_INFO } from '../data/products';
import { hasProductImage } from '../services/firebase';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onDirectCheckout?: (item: CartItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label || '');
  const [selectedFinish, setSelectedFinish] = useState(product.finishes?.[0]?.label || '');
  const [selectedLed, setSelectedLed] = useState(product.ledColors?.[0]?.label || '');
  const [customText, setCustomText] = useState('');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadedLogoName, setUploadedLogoName] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  
  // Set default quantity based on minQuantity
  const [quantity, setQuantity] = useState(product.minQuantity && product.minQuantity > 1 ? 1 : 1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consolidate all available product images (primary + up to 4-5 gallery images)
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (product.image && hasProductImage(product)) {
      list.push(product.image);
    }
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach(img => {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list;
  }, [product]);

  useEffect(() => {
    setActiveImage(allImages[0] || product.image);
    setSelectedSize(product.sizes?.[0]?.label || '');
    setSelectedFinish(product.finishes?.[0]?.label || '');
    setSelectedLed(product.ledColors?.[0]?.label || '');
    setCustomText('');
    setUploadedPhotoUrl(null);
    setUploadedLogoName('');
    setCustomInstructions('');
    setQuantity(1);
  }, [product, allImages]);

  // Compute price based on size option
  const getSelectedPrice = () => {
    if (!product.sizes || product.sizes.length === 0) return product.price;
    const sizeObj = product.sizes.find(s => s.label === selectedSize);
    return sizeObj ? sizeObj.price : product.price;
  };

  const currentPrice = getSelectedPrice();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedPhotoUrl(reader.result);
          setUploadedLogoName(file.name);
          setActiveImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    const isCustomized = Boolean(uploadedPhotoUrl || customText.trim() || customInstructions.trim());
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: product.originalPrice,
      quantity,
      image: uploadedPhotoUrl || activeImage || product.image,
      size: selectedSize || undefined,
      finish: selectedFinish || undefined,
      ledColor: selectedLed || undefined,
      customText: customText.trim() || undefined,
      uploadedLogoUrl: uploadedPhotoUrl || undefined,
      uploadedLogoName: uploadedLogoName || undefined,
      customInstructions: customInstructions.trim() || undefined,
      isCustomized,
      bulkBadge: product.bulkPricingBadge
    };

    onAddToCart(item);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0e121e] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12">
          
          {/* Gallery / Image Left */}
          <div className="md:col-span-6 bg-[#080a10] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div className="space-y-4">
              
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                {hasProductImage(product) || uploadedPhotoUrl ? (
                  <img
                    src={uploadedPhotoUrl || activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c0f17] via-[#121624] to-[#0a0d14] p-6 text-center select-none">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                      <Camera className="w-8 h-8 text-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-200">Product Photo Pending</span>
                    <span className="text-xs text-slate-500 mt-1 max-w-xs">
                      Official photography for this product is awaiting upload by store admin.
                    </span>
                  </div>
                )}

                {/* Vistaprint-Style Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight bg-sky-500 text-slate-950 shadow-md border border-sky-300 font-mono">
                    {product.bulkPricingBadge || `BUY 1 @ Rs. ${product.price}`}
                  </span>
                </div>

                {uploadedPhotoUrl && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white shadow-md">
                    ✓ Custom Artwork Attached
                  </span>
                )}
              </div>

              {/* Thumbnail Selector (Up to 5 images) */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImage === img ? 'border-brand-500 scale-105 shadow-md ring-2 ring-brand-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[8px] font-mono bg-black/70 text-white font-bold">
                        {i + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Key Features Bullet List */}
              <div className="p-4 rounded-xl bg-[#121622] border border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Specifications:</p>
                <ul className="text-xs space-y-1.5 text-slate-300">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold shrink-0">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Turnaround & Baranagar Quality Seal */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Clock className="w-4 h-4" />
                <span>{product.turnaround} in Baranagar Workshop</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>100% Quality & Print Accuracy Guarantee</span>
              </div>
            </div>
          </div>

          {/* Details & Actions Right */}
          <div className="md:col-span-6 p-6 space-y-5 overflow-y-auto bg-[#0d1019]">
            
            {/* Header / Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} Google Reviews)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {product.name}
              </h2>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#141824] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">
                  {product.unitLabel ? `Price per ${product.unitLabel}:` : "Unit Price:"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
                Save ₹{(product.originalPrice - currentPrice).toLocaleString('en-IN')}
              </span>
            </div>



            {/* Size / Quantity Pack Options */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {product.category === 'visiting-cards' || product.category === 'stickers-labels' || product.category === 'packaging-boxes' ? 'Select Volume / Pack Size:' : 'Select Size:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.label)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        selectedSize === s.label
                          ? 'bg-slate-800 text-white border-brand-500 font-bold'
                          : 'bg-[#141824] text-slate-300 border-slate-800'
                      }`}
                    >
                      <p className="font-semibold">{s.label}</p>
                      <p className="text-[11px] text-amber-400 font-mono">₹{s.price.toLocaleString('en-IN')}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Base / Fabric Finish */}
            {product.finishes && product.finishes.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Color / Finish:
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.finishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFinish(f.label)}
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                        selectedFinish === f.label
                          ? 'bg-slate-800 text-white border-brand-400 font-bold'
                          : 'bg-[#141824] text-slate-400 border-slate-800'
                      }`}
                    >
                      {f.previewColor && (
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.previewColor }} />
                      )}
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options: Upload Logo / Photo & Custom Text */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121624] border border-slate-200 dark:border-brand-500/30 shadow-sm dark:shadow-md space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Customization & Print Details
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-mono">
                  Free Digital Proof
                </span>
              </div>

              {/* Upload Logo or Photo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block">
                  1. Upload Logo or Photo (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,.pdf,.ai,.psd"
                  className="hidden"
                />

                {uploadedPhotoUrl ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-brand-500/40 dark:border-brand-500/50 shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={uploadedPhotoUrl}
                        alt="Uploaded preview"
                        className="w-10 h-10 object-contain rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-xs">
                          {uploadedLogoName || "Uploaded file"}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Ready for print proof</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPhotoUrl(null);
                          setUploadedLogoName('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove uploaded image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500/70 bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-900/50 dark:hover:bg-slate-900/80 transition-all flex items-center justify-center gap-2 group text-center cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-white">
                      Click to upload Logo / Artwork / Photo
                    </span>
                  </button>
                )}
              </div>

              {/* Custom Text / Business Inscription */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block">
                  2. Custom Text / Business Details (Optional)
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Hexa Technologies • +91 98765 43210"
                  className="w-full bg-slate-50 dark:bg-[#141824] text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block">
                  3. Printing Instructions / Placement Notes (Optional)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={2}
                  placeholder="e.g. Center logo, send WhatsApp preview before printing..."
                  className="w-full bg-slate-50 dark:bg-[#141824] text-xs text-slate-900 dark:text-white px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Photo Pending Status Notice */}
            {!hasProductImage(product) && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-300 text-xs flex items-start gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-amber-950 dark:text-white text-xs">Online Purchasing Temporarily Locked</p>
                  <p className="text-[11px] text-amber-900/90 dark:text-slate-300 mt-0.5 leading-relaxed">
                    This product is waiting for store admin to upload product photos. The Buy / Add to Bag button will unlock as soon as photos are published.
                  </p>
                </div>
              </div>
            )}

            {/* Quantity Selector & Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">Quantity:</span>
                  <span className="text-[10px] text-slate-500">
                    {product.unitLabel ? `(${product.unitLabel} each)` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#141824] px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-sm px-1"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-900 dark:text-white w-6 text-center font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-sm px-1"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Buy Now via Razorpay Standard Checkout */}
                <button
                  type="button"
                  onClick={() => {
                    const item: CartItem = {
                      id: `${product.id}-${Date.now()}`,
                      productId: product.id,
                      name: product.name,
                      price: currentPrice,
                      originalPrice: product.originalPrice,
                      quantity,
                      image: product.image,
                      size: selectedSize,
                      finish: selectedFinish,
                      customText,
                      uploadedLogoUrl: uploadedPhotoUrl || undefined,
                      uploadedLogoName: uploadedLogoName || undefined,
                      customInstructions: customInstructions || undefined,
                      isCustomized: !!(customText || uploadedPhotoUrl || customInstructions),
                      bulkBadge: product.bulkPricingBadge
                    };
                    onClose();
                    if (onDirectCheckout) {
                      onDirectCheckout(item);
                    } else {
                      onAddToCart(item);
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-rose-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Now with Razorpay (₹{(currentPrice * quantity).toLocaleString('en-IN')})</span>
                </button>

                {/* PRIMARY WHATSAPP ENQUIRY */}
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint Baranagar! I want to order/inquire: ${product.name} (Qty: ${quantity}, ${selectedSize || 'Standard'}). Total: ₹${(currentPrice * quantity).toLocaleString('en-IN')}. Please share sample proof.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                  <span>Enquire & Order on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
