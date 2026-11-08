import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  MapPin, 
  Store, 
  Truck, 
  CreditCard, 
  QrCode, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  Download, 
  Copy,
  Printer,
  Lock
} from 'lucide-react';
import { CartItem, OrderRecord } from '../types';
import { STORE_INFO } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discount: number;
  couponCode: string;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discount,
  couponCode,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [deliveryMethod, setDeliveryMethod] = useState<'store-pickup' | 'express-delivery'>('store-pickup');

  // Customer Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('700036');
  const [city, setCity] = useState('Kolkata');
  const [specialNote, setSpecialNote] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'upi-qr' | 'cod-pickup' | 'whatsapp'>('upi-qr');
  const [utrNumber, setUtrNumber] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Financials
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'store-pickup' || subtotal >= 999 ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("Please provide your name and WhatsApp contact number.");
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const newOrderId = `IP-KOL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderRecord = {
      orderId: newOrderId,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: {
        fullName,
        phone,
        email: email || 'customer@instaprint.com',
        deliveryMethod,
        addressLine1: addressLine,
        landmark,
        pincode,
        city,
        state: 'West Bengal',
        specialInstructions: specialNote
      },
      items: [...cart],
      subtotal,
      discount,
      shipping: shippingFee,
      total: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi-qr' ? 'pending-verification' : 'pay-at-shop',
      orderStatus: 'received',
      trackingNumber: `TRACK-${Math.floor(100000 + Math.random() * 900000)}`
    };

    // Save to localStorage for order tracking
    try {
      const existing = JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('instaprint_orders', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    setConfirmedOrder(newOrder);
    setStep('confirmed');
    onOrderSuccess(newOrder);

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#f59e0b', '#10b981', '#38bdf8']
    });
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('instaprint.kolkata@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e121e] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#090b10] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Instaprint Logo"
              className="h-7 w-auto object-contain"
            />
            <div>
              <h3 className="font-extrabold text-base text-white">
                {step === 'details' && 'Shipping & Contact Details'}
                {step === 'payment' && 'Select Secure Payment Mode'}
                {step === 'confirmed' && 'Order Confirmed! 🎉'}
              </h3>
              <p className="text-[11px] text-slate-400">
                INSTAPRINT Studio • Baranagar, Kolkata 700036
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              {/* Delivery Choice */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Choose Fulfillment Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div
                    onClick={() => setDeliveryMethod('store-pickup')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod === 'store-pickup'
                        ? 'bg-slate-800 border-2 border-brand-500 text-white shadow-glow-rose'
                        : 'bg-[#141824] border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Store className="w-4 h-4 text-amber-400" />
                      <span>Baranagar Store Pickup (FREE)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Ready in 24 hours at Shop 106/B, Gopal Lal Tagore Rd. Free inspection!
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('express-delivery')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod === 'express-delivery'
                        ? 'bg-slate-800 border-2 border-brand-500 text-white shadow-glow-rose'
                        : 'bg-[#141824] border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Express Courier Delivery</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Kolkata & Pan-India doorstep delivery with breakage-safe wooden packing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sourav Banerjee"
                      className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98300 XXXXX"
                      className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Email Address (For Invoice Copy)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sourav@example.com"
                    className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Delivery Address fields if Courier selected */}
                {deliveryMethod === 'express-delivery' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Delivery Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="House / Flat No, Street, Building Name"
                        className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Landmark</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Joyshree"
                          className="w-full bg-[#141824] text-xs text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#141824] text-xs text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-[#141824] text-xs text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Special Instructions / Notes for Printing Studio:
                  </label>
                  <textarea
                    rows={2}
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g. Please verify image resolution before printing, or gift wrap in anniversary paper"
                    className="w-full bg-[#141824] text-xs text-white px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary and Next */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Payable:</span>
                  <p className="text-xl font-black text-amber-400 font-mono">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 text-white font-bold text-xs shadow-glow-rose hover:scale-[1.02] transition-transform"
                >
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Selection */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-[#121624] p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Order Amount to Pay:</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Razorpay Gateway Notice */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Razorpay Payment Gateway integration in progress.</span>
                </span>
                <span className="text-[10px] text-slate-400">UPI QR & WhatsApp active</span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                {/* Method 1: UPI QR */}
                <div
                  onClick={() => setPaymentMethod('upi-qr')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi-qr'
                      ? 'bg-slate-800 border-2 border-brand-500 text-white shadow-glow-rose'
                      : 'bg-[#141824] border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>Instant UPI QR Scan & Pay (GPay, PhonePe, Paytm)</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>

                  {paymentMethod === 'upi-qr' && (
                    <div className="mt-4 pt-3 border-t border-slate-700 flex flex-col sm:flex-row items-center gap-4 bg-[#090b10] p-4 rounded-xl border border-slate-700/80">
                      {/* Authentic QR SVG simulation */}
                      <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-lg flex flex-col items-center">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=instaprint.kolkata@okhdfcbank%26pn=INSTAPRINT%26am=0%26cu=INR" 
                          alt="Instaprint UPI QR Code"
                          className="w-28 h-28"
                        />
                        <span className="text-[9px] text-black font-extrabold tracking-widest mt-1">
                          INSTAPRINT UPI
                        </span>
                      </div>

                      <div className="space-y-2 text-xs flex-1 text-center sm:text-left">
                        <p className="text-slate-300 font-medium">
                          Scan with Any UPI App to pay securely directly to INSTAPRINT bank account:
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 bg-[#141824] px-3 py-1.5 rounded-lg border border-slate-700">
                          <code className="text-amber-400 font-mono text-xs">
                            instaprint.kolkata@okhdfcbank
                          </code>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="text-slate-400 hover:text-white"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copiedUpi && (
                          <span className="text-[10px] text-emerald-400 font-semibold block">
                            ✓ Copied to clipboard!
                          </span>
                        )}

                        <div className="pt-1">
                          <label className="text-[11px] text-slate-400 block mb-1">
                            Optional: Enter UTR / Txn Reference (after paying):
                          </label>
                          <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="12-digit UTR No. (e.g. 430129...)"
                            className="w-full bg-[#121622] text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Method 2: Pay at Store / COD */}
                <div
                  onClick={() => setPaymentMethod('cod-pickup')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod-pickup'
                      ? 'bg-slate-800 border-2 border-brand-500 text-white shadow-glow-rose'
                      : 'bg-[#141824] border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>Pay at Baranagar Store Counter / Cash on Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-6">
                    Inspect your illuminated frame or prints in person at our Baranagar studio before making payment.
                  </p>
                </div>

                {/* Method 3: Direct WhatsApp Confirmation */}
                <div
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-slate-800 border-2 border-brand-500 text-white shadow-glow-rose'
                      : 'bg-[#141824] border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Pay via WhatsApp Support (082406 38595)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-6">
                    Chat directly with our studio manager to finalize custom typography and share raw high-res images.
                  </p>
                </div>
              </div>

              {/* Back & Submit Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  ← Back
                </button>

                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed Screen */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you, <strong className="text-white">{confirmedOrder.customer.fullName}</strong>. Our Baranagar studio has queued your print.
                </p>
              </div>

              {/* Order ID & Tracking Card */}
              <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400">Order Reference:</span>
                    <p className="font-mono font-black text-amber-400 text-base">{confirmedOrder.orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Status:</span>
                    <p className="text-emerald-400 font-bold">Artwork Verification Queued</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-[11px] text-slate-500">Pickup / Delivery:</span>
                    <p className="font-medium">
                      {confirmedOrder.customer.deliveryMethod === 'store-pickup'
                        ? 'Shop 106/B, Gopal Lal Tagore Rd, Baranagar'
                        : `${confirmedOrder.customer.addressLine1}, Kolkata`}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Contact Number:</span>
                    <p className="font-medium font-mono">{confirmedOrder.customer.phone}</p>
                  </div>
                </div>

                {/* Items summary */}
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Items ({confirmedOrder.items.length}):
                  </p>
                    {confirmedOrder.items.map((it, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 py-1 border-b border-slate-800/40 last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          {it.uploadedLogoUrl && (
                            <img src={it.uploadedLogoUrl} alt="Logo" className="w-5 h-5 rounded object-contain bg-black/40 border border-slate-700 shrink-0" />
                          )}
                          <div className="min-w-0 text-left">
                            <span className="truncate block font-medium">{it.quantity}x {it.name}</span>
                            {it.uploadedLogoName && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                File: {it.uploadedLogoName}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-mono text-amber-400 font-semibold shrink-0">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </li>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! I just placed order ${confirmedOrder.orderId} for ₹${confirmedOrder.total}. Attaching my high-res photos here!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Photos on WhatsApp (082406 38595)</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Done & Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
