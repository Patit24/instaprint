import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  MessageCircle, 
  Tag, 
  Check,
  Lock
} from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (appliedDiscount: number, couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();

    if (code === 'BARANAGAR10' || code === 'BARANAGAR') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code, discount });
    } else if (code === 'INSTAPRINT100' || code === 'INSTA100') {
      setAppliedCoupon({ code, discount: 100 });
    } else if (code === 'FIRSTORDER') {
      setAppliedCoupon({ code, discount: 150 });
    } else {
      setCouponError('Invalid coupon. Try BARANAGAR10 or FIRSTORDER');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 70;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleWhatsAppCheckout = () => {
    let message = `*NEW ORDER INQUIRY - INSTAPRINT BARANAGAR*%0A%0A`;
    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* x ${item.quantity} - ₹${item.price * item.quantity}%0A`;
      if (item.bulkBadge) message += `   • Tier: ${item.bulkBadge}%0A`;
      if (item.size) message += `   • Size/Pack: ${item.size}%0A`;
      if (item.finish) message += `   • Finish: ${item.finish}%0A`;
      if (item.uploadedLogoName) message += `   • Artwork File: ${item.uploadedLogoName}%0A`;
      if (item.customText) message += `   • Inscription: "${item.customText}"%0A`;
      if (item.customInstructions) message += `   • Instructions: "${item.customInstructions}"%0A`;
    });
    message += `%0A*Subtotal:* ₹${subtotal}%0A`;
    if (appliedCoupon) message += `*Coupon (${appliedCoupon.code}):* -₹${appliedCoupon.discount}%0A`;
    message += `*Total Order Value:* ₹${finalTotal}%0A%0A`;
    message += `I would like to confirm my order and arrange pickup / delivery from your Baranagar shop (082406 38595).`;

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#0d101a] border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090b10] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-400" />
            <h3 className="font-extrabold text-base text-white">Your Shopping Bag</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#121624] px-5 py-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {amountNeededForFreeShip === 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Free Express Delivery unlocked for Kolkata!
              </span>
            ) : (
              <span className="text-slate-300">
                Add <strong className="text-amber-400 font-mono">₹{amountNeededForFreeShip}</strong> more for Free Shipping
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-mono">Goal: ₹999</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-white text-base">Your bag is empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore visiting cards, corporate winter jackets, hoodies, stickers, and illuminated LED frames.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-glow-rose"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#121624] border border-slate-800/80 flex gap-3 relative group"
              >
                {/* Thumbnail Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {item.isCustomized && (
                    <span className="absolute bottom-1 right-1 bg-brand-500 text-[8px] font-bold text-white px-1 py-0.2 rounded shadow">
                      CUSTOM
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate pr-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bulk Badge and Custom details */}
                    <div className="text-[11px] text-slate-400 space-y-1 mt-1">
                      {item.bulkBadge && (
                        <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-sky-500 text-slate-950 font-mono mb-0.5">
                          {item.bulkBadge}
                        </span>
                      )}
                      {item.size && <p>Option: <span className="text-slate-300 font-medium">{item.size}</span></p>}
                      {item.finish && <p>Finish: <span className="text-slate-300 font-medium">{item.finish}</span></p>}

                      {item.uploadedLogoUrl && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium pt-0.5">
                          <img 
                            src={item.uploadedLogoUrl} 
                            alt="Logo preview" 
                            className="w-5 h-5 rounded object-contain bg-black/50 border border-slate-700 shrink-0" 
                          />
                          <span className="truncate text-[10px] font-mono">
                            {item.uploadedLogoName || 'Custom Artwork Attached'}
                          </span>
                        </div>
                      )}

                      {item.customText && (
                        <p className="truncate text-amber-300 font-mono text-[10px]">
                          Text: "{item.customText}"
                        </p>
                      )}

                      {item.customInstructions && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                          Note: {item.customInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2 bg-[#090b10] px-2 py-0.5 rounded-lg border border-slate-800">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-amber-400 font-mono">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-[#090b10] space-y-4">
            
            {/* Promo Coupon Form */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. BARANAGAR10)"
                    className="w-full bg-[#141824] text-xs text-white uppercase placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Applied {appliedCoupon.code}: Saved ₹{appliedCoupon.discount}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-mono">-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping (Kolkata & Pan-India)</span>
                <span className="text-slate-200 font-mono">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Estimated Total</span>
                <span className="text-amber-400 font-mono text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* PRIMARY WHATSAPP CHECKOUT */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
                <span>Complete Order on WhatsApp</span>
              </button>

              {/* DISABLED ONLINE BUY BUTTON (RAZORPAY INTEGRATION PENDING) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Online Razorpay Gateway:</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Integration Pending
                </span>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-500">
              🔒 Safe & Secure Checkout • UPI QR, COD & Store Pickup Available
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
