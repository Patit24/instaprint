import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  ArrowLeft, 
  Check, 
  Layers, 
  Info,
  ChevronRight,
  Camera,
  Lock,
  AlertCircle,
  Upload,
  Trash2,
  FileText,
  Image as ImageIcon,
  Mic,
  Square,
  Play,
  Volume2,
  Package,
  MapPin,
  Search,
  CheckCircle2,
  Circle,
  Printer,
  Copy
} from 'lucide-react';
import { Product, CartItem, OrderRecord } from '../types';
import { STORE_INFO, SAMPLE_PRODUCTS } from '../data/products';
import { hasProductImage } from '../services/firebase';
import { getOrderStatusStageInfo } from '../services/orderTracking';

interface ProductDetailPageProps {
  product: Product;
  products?: Product[];
  orders?: OrderRecord[];
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCustomizer?: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  products,
  orders,
  onBack,
  onAddToCart,
  onSelectProduct,
  onOpenCustomizer,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label || '');
  const [selectedFinish, setSelectedFinish] = useState(product.finishes?.[0]?.label || '');
  const [quantity, setQuantity] = useState(product.minQuantity && product.minQuantity > 1 ? product.minQuantity : 1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Logo / Photo customization upload states
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [customLogoName, setCustomLogoName] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Voice note state (PrintMine reference)
  const [isVoiceNoteOpen, setIsVoiceNoteOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Live on-page order tracking states
  const [trackedOrderInput, setTrackedOrderInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | null>(() => {
    if (orders && orders.length > 0) return orders[0];
    try {
      const savedOrders: OrderRecord[] = JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
      if (savedOrders.length > 0) return savedOrders[0];
    } catch {}
    return null;
  });
  const [trackedError, setTrackedError] = useState<string | null>(null);
  const [copiedTrackId, setCopiedTrackId] = useState(false);

  // Real-time synchronization: when admin updates order status in AdminPanel, immediately update the on-page tracker
  useEffect(() => {
    if (trackedOrder && orders) {
      const liveUpdated = orders.find(o => o.orderId === trackedOrder.orderId);
      if (liveUpdated) {
        setTrackedOrder(liveUpdated);
      }
    }
  }, [orders]);

  const handleCopyTrackId = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTrackId(true);
    setTimeout(() => setCopiedTrackId(false), 2000);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackedOrderInput.trim().toUpperCase();
    if (!query) return;

    const allOrders: OrderRecord[] = [
      ...(orders || []),
      ...(() => {
        try {
          return JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
        } catch {
          return [];
        }
      })()
    ];

    const match = allOrders.find(
      o => o.orderId.toUpperCase() === query ||
           o.trackingNumber.toUpperCase() === query ||
           o.customer.phone.includes(query)
    );

    if (match) {
      setTrackedOrder(match);
      setTrackedError(null);
    } else {
      if (query.includes('DEMO') || query.startsWith('IP') || query.startsWith('INP')) {
        const demoOrder: OrderRecord = {
          orderId: query.startsWith('IP-') || query.startsWith('INP-') ? query : `INP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: 'Today, Live Session',
          customer: {
            fullName: 'Valued Customer',
            phone: '082406 38595',
            email: 'customer@instaprintkolkata.com',
            deliveryMethod: 'store-pickup',
            city: 'Baranagar, Kolkata',
            pincode: '700036'
          },
          items: [
            {
              id: `${product.id}-track-demo`,
              productId: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              quantity: product.minQuantity && product.minQuantity > 1 ? product.minQuantity : 1,
              image: product.image,
              isCustomized: true
            }
          ],
          subtotal: product.price,
          discount: 0,
          shipping: 0,
          total: product.price,
          paymentMethod: 'upi-qr',
          paymentStatus: 'paid',
          orderStatus: 'printing',
          trackingNumber: `INP-TRK-${Math.floor(1000 + Math.random() * 9000)}`
        };
        setTrackedOrder(demoOrder);
        setTrackedError(null);
      } else {
        setTrackedError(`No order found matching "${query}". Check your Order ID or click "Test Live Demo" below.`);
      }
    }
  };

  const loadDemoOrder = () => {
    const demoOrder: OrderRecord = {
      orderId: `INP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Today, Production Floor',
      customer: {
        fullName: 'Debashis Mukherjee',
        phone: '082406 38595',
        email: 'debashis@instaprintkolkata.com',
        deliveryMethod: 'store-pickup',
        city: 'Baranagar, Kolkata',
        pincode: '700036'
      },
      items: [
        {
          id: `${product.id}-demo-preview`,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: product.minQuantity && product.minQuantity > 1 ? product.minQuantity : 1,
          image: product.image,
          isCustomized: true
        }
      ],
      subtotal: product.price,
      discount: 0,
      shipping: 0,
      total: product.price,
      paymentMethod: 'upi-qr',
      paymentStatus: 'paid',
      orderStatus: 'printing',
      trackingNumber: `INP-TRK-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setTrackedOrder(demoOrder);
    setTrackedError(null);
  };

  // Consolidate all available product images
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
    setQuantity(product.minQuantity && product.minQuantity > 1 ? product.minQuantity : 1);
    setCustomLogo(null);
    setCustomLogoName('');
    setCustomText('');
    setCustomInstructions('');
    setAudioUrl(null);
    setIsVoiceNoteOpen(false);
  }, [allImages, product]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomLogo(reader.result);
        setCustomLogoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Base unit rate for selected size (without quantity discount)
  const baseSizePrice = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) {
      const foundSize = product.sizes.find(s => s.label === selectedSize);
      if (foundSize) return foundSize.price;
    }
    return product.price;
  }, [product, selectedSize]);

  // Base unit MRP (original / comparison price)
  const baseUnitMrp = useMemo(() => {
    return Math.max(product.originalPrice, Math.round(baseSizePrice * 1.25));
  }, [product.originalPrice, baseSizePrice]);

  // Compute unit rate for any given quantity
  const getUnitRateForQty = (qty: number) => {
    let rate = baseSizePrice;
    if (product.bulkTiers && product.bulkTiers.length > 0) {
      const applicableTier = [...product.bulkTiers].reverse().find(t => qty >= t.minQty);
      if (applicableTier) {
        rate = Math.round(baseSizePrice * (1 - applicableTier.discountPct / 100));
      }
    } else {
      if (qty >= 100) rate = Math.round(baseSizePrice * 0.62);
      else if (qty >= 50) rate = Math.round(baseSizePrice * 0.72);
      else if (qty >= 25) rate = Math.round(baseSizePrice * 0.80);
      else if (qty >= 10) rate = Math.round(baseSizePrice * 0.88);
      else if (qty >= 5) rate = Math.round(baseSizePrice * 0.92);
    }
    return rate;
  };

  // Quantity pill tiers options
  const quantityTiers = useMemo(() => {
    let quantities: number[] = [];
    if (product.bulkTiers && product.bulkTiers.length > 0) {
      const baseMin = product.minQuantity && product.minQuantity > 1 ? product.minQuantity : 1;
      const tierQtys = product.bulkTiers.map(t => t.minQty);
      quantities = Array.from(new Set([baseMin, ...tierQtys])).sort((a, b) => a - b);
    } else {
      const baseMin = product.minQuantity && product.minQuantity > 1 ? product.minQuantity : 5;
      if (baseMin === 1) {
        quantities = [1, 5, 10, 25, 50, 100];
      } else {
        quantities = [baseMin, baseMin * 2, baseMin * 5, baseMin * 10, baseMin * 20];
      }
    }
    return quantities.map(qty => ({
      qty,
      unitPrice: getUnitRateForQty(qty),
    }));
  }, [product, baseSizePrice]);

  // Current selected unit price
  const currentUnitPrice = getUnitRateForQty(quantity);
  const totalPay = currentUnitPrice * quantity;
  const mrpTotal = baseUnitMrp * quantity;
  const discountAmount = Math.max(0, mrpTotal - totalPay);
  const discountPct = mrpTotal > 0 ? Math.round((discountAmount / mrpTotal) * 100) : 0;

  // Next tier upsell calculation (PrintMine: "Add X more to pay ₹Y/pc")
  const nextTierUpsell = useMemo(() => {
    const nextTier = quantityTiers.find(t => t.qty > quantity);
    if (!nextTier) return null;
    const diff = nextTier.qty - quantity;
    const nextRate = nextTier.unitPrice;
    return {
      nextQty: nextTier.qty,
      diff,
      nextRate
    };
  }, [quantityTiers, quantity]);

  // Voice recording handlers
  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported in this browser');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Voice recording failed:", err);
      alert("Microphone permission was not granted or not supported. You can record and send your voice note directly to our WhatsApp hotline (082406 38595)!");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const deleteVoiceRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingSeconds(0);
  };

  // WhatsApp Enquiry Link Generator (Every Product Feature)
  const getWhatsAppInquiryUrl = () => {
    const lines = [
      `Hi Instaprint Baranagar! I would like to enquire about:`,
      `📦 *Product:* ${product.name}`,
      `🔢 *Quantity:* ${quantity} ${product.unitLabel || 'pcs'}`,
      selectedSize ? `📐 *Size:* ${selectedSize}` : '',
      selectedFinish ? `✨ *Finish/Ink:* ${selectedFinish}` : '',
      `💰 *Estimated Price:* ₹${totalPay.toLocaleString('en-IN')} (MRP: ₹${mrpTotal.toLocaleString('en-IN')}, ${discountPct}% OFF @ ₹${currentUnitPrice.toFixed(2)}/pc)`,
      customText ? `✍️ *Custom Text:* "${customText}"` : '',
      customLogoName ? `🖼️ *Logo/Artwork:* Attached file "${customLogoName}"` : '',
      customInstructions ? `📝 *Special Instructions:* ${customInstructions}` : '',
      audioUrl ? `🎙️ *Voice Note:* Recorded on website (sending audio message)` : '',
      ``,
      `Please confirm sample proof timeline, express dispatch in Kolkata, and payment details!`
    ].filter(Boolean).join('\n');

    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(lines)}`;
  };

  const handleAdd = () => {
    const isCustomized = Boolean(customLogo || customText.trim() || customInstructions.trim() || audioUrl);
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: currentUnitPrice,
      originalPrice: baseUnitMrp,
      quantity,
      image: activeImage || product.image,
      size: selectedSize || undefined,
      finish: selectedFinish || undefined,
      customText: customText.trim() || undefined,
      uploadedLogoUrl: customLogo || undefined,
      uploadedLogoName: customLogoName || undefined,
      customInstructions: [
        customInstructions.trim(),
        audioUrl ? `[Voice Note: ${recordingSeconds}s recorded]` : ''
      ].filter(Boolean).join(' • ') || undefined,
      isCustomized,
      bulkBadge: product.bulkPricingBadge
    };

    onAddToCart(item);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  // Related products in the same category
  const catalogToUse = products && products.length > 0 ? products : SAMPLE_PRODUCTS;
  const relatedProducts = catalogToUse.filter(p => p.id !== product.id && (p.category === product.category || product.relatedProductIds?.includes(p.id))).slice(0, 4);

  // Live order status and physical location calculation
  const trackedStageInfo = trackedOrder ? getOrderStatusStageInfo(trackedOrder) : null;

  return (
    <div className="py-8 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </button>

          <span className="font-mono text-slate-500">
            Category: <strong className="text-white uppercase">{product.category.replace('-', ' ')}</strong>
          </span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Gallery Left */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {hasProductImage(product) ? (
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c0f17] via-[#121624] to-[#0a0d14] p-8 text-center select-none">
                  <div className="w-20 h-20 rounded-3xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
                    <Camera className="w-10 h-10 text-amber-400" />
                  </div>
                  <span className="text-base font-bold text-slate-200">Product Photography Pending</span>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    This product is waiting for official photos to be uploaded from the Baranagar print studio admin panel.
                  </p>
                </div>
              )}

              {product.bulkPricingBadge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight bg-sky-500 text-slate-950 shadow-lg border border-sky-300 font-mono">
                    {product.bulkPricingBadge}
                  </span>
                </div>
              )}

              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-rose-500 transition-colors"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Row (Up to 5 images) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-brand-500 scale-105 shadow-md ring-2 ring-brand-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-white font-bold">
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Trust Seals */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{product.turnaround} in Baranagar</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                <span>100% Quality Assurance Guarantee</span>
              </div>
            </div>
          </div>

          {/* Details & Actions Right */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} Google Reviews)</span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  {product.inStock !== false ? 'In Stock' : 'Pre-Order'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Tiered Pills (PrintMine Reference) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Quantity:
                </span>
                <div className="flex items-center gap-2 bg-[#141824] px-3 py-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-400 hover:text-white font-bold text-sm px-1.5"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white font-mono w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-400 hover:text-white font-bold text-sm px-1.5"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Quantity Tier Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                {quantityTiers.map((tier) => {
                  const isSelected = quantity === tier.qty;
                  return (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => setQuantity(tier.qty)}
                      className={`px-3 py-2 rounded-xl border shrink-0 text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                          : 'bg-[#141824] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <p className="text-xs font-extrabold font-mono">
                        {tier.qty >= 100 ? `${tier.qty}+ Pcs` : `${tier.qty} Pcs`}
                      </p>
                      <p className={`text-[11px] font-bold font-mono ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                        ₹{tier.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-[9px] text-slate-500">per piece</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Breakdown Card (PrintMine Reference) */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-2.5">
              {/* MRP Row */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>MRP ({quantity} {product.unitLabel || 'Pcs'})</span>
                <span className="line-through font-mono">₹{mrpTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Discount Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Discount</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                    {discountPct}% OFF
                  </span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-700/80 pt-2.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">You pay</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {quantity} Pcs × ₹{currentUnitPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    ₹{totalPay.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Next-Tier Upsell Banner (PrintMine Reference) */}
            {nextTierUpsell && (
              <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/40 flex items-center justify-between gap-3 text-xs">
                <p className="text-orange-200">
                  Add <strong className="text-white">{nextTierUpsell.diff} more</strong> to pay{' '}
                  <strong className="text-amber-400 font-mono">₹{nextTierUpsell.nextRate.toFixed(2)}/pc</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setQuantity(nextTierUpsell.nextQty)}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shrink-0 transition-colors shadow-sm"
                >
                  Make it {nextTierUpsell.nextQty}
                </button>
              </div>
            )}

            {/* Design & Instant Upload CTAs (PrintMine Reference) */}
            <div className="space-y-2.5">
              {/* Primary Vibrant Button: Design Your Product */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenCustomizer) {
                    onOpenCustomizer(product);
                  } else {
                    logoFileInputRef.current?.click();
                  }
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-slate-950 font-black text-center shadow-lg hover:shadow-orange-500/25 transition-all group flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2 text-slate-950">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Design Your {product.name.split(' ').slice(0, 3).join(' ')}
                </span>
                <span className="text-[11px] font-bold text-slate-900/90 mt-0.5">
                  Upload logo & preview instantly in 3D
                </span>
              </button>

              {/* Secondary Card Button: Just Upload Your Logo */}
              <button
                type="button"
                onClick={() => logoFileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl bg-[#141824] hover:bg-slate-800 border border-slate-700/80 text-center transition-all flex flex-col items-center justify-center group cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-brand-400 group-hover:-translate-y-0.5 transition-transform" />
                  Just Upload Your Logo
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Our team will design & share preview on WhatsApp for approval
                </span>
              </button>
            </div>

            {/* Voice Note / Audio Instructions (PrintMine Reference) */}
            <div className="rounded-2xl bg-[#141824] border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsVoiceNoteOpen(!isVoiceNoteOpen)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : audioUrl 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                  }`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Record a voice note</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-400">
                        Optional
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {audioUrl ? `Voice note recorded (${recordingSeconds}s - Click to listen)` : 'Additional instructions, if any'}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isVoiceNoteOpen ? 'rotate-90' : ''}`} />
              </button>

              {isVoiceNoteOpen && (
                <div className="p-4 pt-1 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
                  {!isRecording && !audioUrl && (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Recording Audio</span>
                      </button>
                      <span className="text-[11px] text-slate-400">Speak instructions for placement, sizing or colors</span>
                    </div>
                  )}

                  {isRecording && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/40">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-xs font-mono font-bold text-white">
                          Recording: {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Done</span>
                      </button>
                    </div>
                  )}

                  {audioUrl && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          Voice note ready ({recordingSeconds}s)
                        </span>
                        <button
                          type="button"
                          onClick={deleteVoiceRecording}
                          className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Discard</span>
                        </button>
                      </div>
                      <audio src={audioUrl} controls className="w-full h-8" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Prefer WhatsApp voice messages?</span>
                    <a
                      href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! I would like to send a voice note for my order of ${product.name} (Qty: ${quantity}). Sending audio note here!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Send on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Customization Details: Upload Logo / Photo & Custom Text */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121624] to-[#151a2d] border border-brand-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Artwork & Inscriptions
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                  Free Digital Proof Included
                </span>
              </div>

              {/* Upload Logo or Photo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  1. Upload Your Logo or Photo (Optional)
                </label>
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,.pdf,.ai,.psd"
                  className="hidden"
                />

                {customLogo ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-brand-500/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={customLogo}
                        alt="Uploaded preview"
                        className="w-12 h-12 object-contain rounded-lg bg-black/40 border border-slate-700 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                          {customLogoName || "Uploaded file"}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Ready for print placement</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomLogo(null);
                          setCustomLogoName('');
                          if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove uploaded image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="w-full p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-brand-500/70 bg-slate-900/50 hover:bg-slate-900/80 transition-all flex flex-col items-center justify-center gap-1.5 group text-center cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                      Click to upload Logo / Artwork / Photo
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Supports PNG, JPG, WebP, SVG, PDF (Max 15MB)
                    </span>
                  </button>
                )}
              </div>

              {/* Custom Text / Business Inscription */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  2. Custom Text / Inscription / Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Acme Studio, +91 98765 43210, est. 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-brand-500 focus:outline-none text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Special Printing Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  3. Printing Instructions / Placement Notes (Optional)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={2}
                  placeholder="e.g. Place logo on top-left, keep background white, send WhatsApp proof before printing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-brand-500 focus:outline-none text-xs text-white placeholder-slate-500 resize-none"
                />
              </div>
            </div>

            {/* Sizes & Variations */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Dimension / Pack Size:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.label)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedSize === s.label
                          ? 'bg-slate-800 text-white border-brand-500 font-bold shadow-sm'
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

            {/* Finishes */}
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
                      className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                        selectedFinish === f.label
                          ? 'bg-slate-800 text-white border-brand-400 font-bold'
                          : 'bg-[#141824] text-slate-400 border-slate-800'
                      }`}
                    >
                      {f.previewColor && (
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: f.previewColor }} />
                      )}
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications List */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Features & Materials:</p>
              <ul className="space-y-1.5 text-slate-300">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 mt-2">
                Materials: <strong className="text-slate-200">{product.materials}</strong>
              </p>
            </div>

            {/* Photo Pending Status Banner */}
            {!hasProductImage(product) && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Online Purchasing Temporarily Locked</h4>
                  <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
                    Per studio policy, online checkout and instant ordering are locked until the studio administrator uploads photography for this product. You can still reach us directly on WhatsApp below for inquiries!
                  </p>
                </div>
              </div>
            )}

            {/* Main Action Strip: ADD TO CART & ENQUIRE AT WHATSAPP (PrintMine Reference) */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ADD TO CART */}
                {!hasProductImage(product) ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                    title="Purchasing locked until store admin uploads product photos"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Buy Locked (Photo Pending)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={addedSuccess}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD TO CART (₹{totalPay.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>
                )}

                {/* ENQUIRE AT WHATSAPP (Primary User Request!) */}
                <a
                  href={getWhatsAppInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                  <span>Enquire at WhatsApp</span>
                </a>
              </div>

              <p className="text-center text-[11px] text-slate-400">
                💬 Need custom bulk quote or design help? Click <strong className="text-emerald-400">Enquire at WhatsApp</strong> for immediate 5-minute assistance!
              </p>
            </div>

            {/* Sticky Bottom Floating Bar (PrintMine Reference) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e121e]/95 backdrop-blur-xl border-t border-slate-800 px-4 py-3 shadow-2xl">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                    {hasProductImage(product) ? (
                      <img src={activeImage || product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-md">
                      {product.name} • {quantity} pcs {selectedSize ? `• ${selectedSize}` : ''}
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-sm font-black text-amber-400 font-mono">
                        ₹{totalPay.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-500 line-through font-mono">
                        ₹{mrpTotal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-black text-emerald-400 font-mono">
                        {discountPct}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getWhatsAppInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    title="Enquire on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  {!hasProductImage(product) ? (
                    <button
                      disabled
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs cursor-not-allowed opacity-80 flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Locked</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={addedSuccess}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-glow-amber transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addedSuccess ? 'Added!' : 'Add to cart'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* STEP-BY-STEP CUSTOMER PRODUCTION & LIVE REAL-TIME TRACKING SECTION (User Core Request) */}
        <div className="pt-10 border-t border-slate-800 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              <Clock className="w-3.5 h-3.5" /> 100% Real-Time Order Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How Your Order Works: Step-by-Step Production & Live Tracking
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              When you place an order for <strong className="text-white">{product.name}</strong>, a unique Tracking ID (<span className="text-amber-400 font-mono font-bold">INP-2026-XXXX</span>) is generated immediately. Follow the actual workshop journey from pre-press approval to the active printing floor and instant Kolkata dispatch.
            </p>
          </div>

          {/* 5-Step Visual Production Lifecycle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 relative group hover:border-brand-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black font-mono">
                  01
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 1</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>Order Placed & Tracking ID</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Job ticket logged in our digital press queue. You receive an instant SMS/WhatsApp confirmation with your unique tracking reference.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                <span className="truncate">Intake Registry Desk, Baranagar</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 relative group hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black font-mono">
                  02
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 2</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Pre-Press Artwork & WhatsApp Proof</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Designers verify 1200 DPI resolution, bleed edges, and custom text. A digital visual mockup is sent to WhatsApp for your sign-off.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate">Pre-Press Studio, Shop 106/B</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 relative group hover:border-amber-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black font-mono">
                  03
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 3</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>UV & Digital Offset Printing</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Substrate queued on our Roland TrueVIS UV flatbed or Heidelberg offset press with instant LED curing and laser contour trimming.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">Roland UV Bay, Workshop Floor</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 relative group hover:border-indigo-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black font-mono">
                  04
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 4</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>5-Point QC & Packaging</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Quality controllers check color fidelity, cutting margins, and LED illumination. Packed in tamper-proof bubble wrap with your GST invoice.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">QC & Packaging Desk, Baranagar</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 relative group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black font-mono">
                  05
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">STAGE 5</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>24h Dispatch / Store Pickup</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Immediate counter pickup at Shop 106/B Gopal Lal Tagore Rd, Baranagar (11 AM - 9:30 PM) or out for express courier delivery to your address.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">Store Front Counter / Courier</span>
              </div>
            </div>

          </div>

          {/* INTERACTIVE LIVE ORDER & WORKSHOP LOCATION TRACKER WIDGET */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0e121e] to-[#14192b] border border-amber-500/30 shadow-2xl space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Live Workshop Order & Physical Location Tracker
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Track where your product currently is in the Baranagar facility or in transit. Updates in real time when production technicians change the order status.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleTrackSubmit} className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackedOrderInput}
                    onChange={(e) => setTrackedOrderInput(e.target.value)}
                    placeholder="Enter Tracking ID / Phone"
                    className="w-full bg-[#181d2f] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  Track Order
                </button>
              </form>
            </div>

            {/* Error Message */}
            {trackedError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-2">
                <span>{trackedError}</span>
                <button
                  type="button"
                  onClick={loadDemoOrder}
                  className="text-amber-300 underline font-bold shrink-0"
                >
                  Test with Live Demo Order
                </button>
              </div>
            )}

            {/* Active Tracked Order Display */}
            {trackedOrder && trackedStageInfo ? (
              <div className="space-y-6">
                
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181d2f] p-4 rounded-2xl border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-mono">Tracking Reference ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                        {trackedOrder.orderId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTrackId(trackedOrder.orderId)}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Copy Tracking ID"
                      >
                        {copiedTrackId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="text-[11px] text-slate-400 block font-mono">Real-Time Workshop Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${trackedStageInfo.badgeClass}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                      <span>{trackedStageInfo.statusLabel}</span>
                    </span>
                  </div>
                </div>

                {/* REAL PHYSICAL LOCATION OF PRODUCT (Exact user requirement) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/40 border-2 border-amber-500/50 shadow-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                      <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                        Current Physical Location of Product
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      BARANAGAR WORKSHOP LIVE
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-extrabold text-amber-300 font-mono pl-7">
                    {trackedStageInfo.location}
                  </p>

                  <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                    {trackedStageInfo.locationDetail}
                  </p>
                </div>

                {/* 5-Step Dynamic Progress Stepper */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Production Timeline & Station Checkpoints:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {trackedStageInfo.steps.map((st, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border transition-all ${
                          st.current
                            ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                            : st.done
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                              : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {st.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : st.current ? (
                            <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className={`text-xs font-bold truncate ${st.current ? 'text-amber-300' : st.done ? 'text-white' : 'text-slate-400'}`}>
                            {st.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                          {st.desc}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-800/60 truncate">
                          📍 {st.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Support & Status Query Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">
                    Need instant priority dispatch or pre-press revisions for this order?
                  </span>
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! Please update me on my order ${trackedOrder.orderId} (Current Status: ${trackedStageInfo.statusLabel}, Location: ${trackedStageInfo.location}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                    <span>Ask Workshop Master on WhatsApp</span>
                  </a>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Package className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No order has been placed in this browser session yet. You can preview how our live production tracking works by clicking below!
                </p>
                <button
                  type="button"
                  onClick={loadDemoOrder}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
                >
                  ⚡ Preview Live Tracking Demo (See Real Location & Status)
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-800 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Related Products You May Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="p-4 rounded-2xl bg-[#121622] border border-slate-800 hover:border-slate-700 cursor-pointer group space-y-3 flex flex-col justify-between transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    {hasProductImage(rel) ? (
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                        <Camera className="w-6 h-6 text-amber-400/70 mb-1" />
                        <span className="text-[9px] font-bold text-amber-400/90 uppercase tracking-wider">Photo Pending</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs truncate group-hover:text-brand-400">{rel.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{rel.shortDescription}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-mono font-black text-amber-400 text-sm">₹{rel.price.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-brand-400 font-bold group-hover:underline">View ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
