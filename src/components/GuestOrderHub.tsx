import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  MessageCircle, 
  Phone, 
  Copy, 
  Check, 
  AlertCircle,
  Truck,
  Printer,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { OrderRecord, CartItem, Product } from '../types';
import { STORE_INFO } from '../data/products';
import { getOrderStatusStageInfo } from '../services/orderTracking';

interface GuestOrderHubProps {
  orders: OrderRecord[];
  onReorder: (items: CartItem[]) => void;
  onSelectProduct: (product: Product) => void;
  onTrackOrderClick: (orderId: string) => void;
  onStartShopping: () => void;
}

export const GuestOrderHub: React.FC<GuestOrderHubProps> = ({
  orders,
  onReorder,
  onSelectProduct,
  onTrackOrderClick,
  onStartShopping
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRecord | null>(null);

  // All orders from props + localStorage
  const allOrders: OrderRecord[] = [
    ...(orders || []),
    ...(() => {
      try {
        return JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
      } catch {
        return [];
      }
    })()
  ].filter((order, idx, arr) => arr.findIndex(o => o.orderId === order.orderId) === idx);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const found = allOrders.find(
      o => o.orderId.toUpperCase() === query ||
           (o.trackingNumber && o.trackingNumber.toUpperCase() === query) ||
           (o.customer?.phone && o.customer.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')))
    );

    if (found) {
      setSearchedOrder(found);
      setSearchError(null);
    } else {
      setSearchError(`No order found matching "${query}". Check your Order ID or phone number.`);
      setSearchedOrder(null);
    }
  };

  const handleCreateTestDemo = () => {
    const demoId = `INP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const demoOrder: OrderRecord = {
      orderId: demoId,
      createdAt: 'Today, Live Session',
      customer: {
        fullName: 'Valued Customer',
        phone: STORE_INFO.phone,
        email: 'customer@instaprintkolkata.com',
        deliveryMethod: 'store-pickup',
        city: 'Baranagar, Kolkata',
        pincode: '700036'
      },
      items: [
        {
          id: 'demo-visiting-card-item',
          productId: 'visiting-cards-standard-visiting-cards',
          name: 'Standard Visiting Cards',
          price: 299,
          originalPrice: 499,
          quantity: 100,
          image: '',
          isCustomized: true,
          customText: 'Instaprint Guest Order Demo'
        }
      ],
      subtotal: 299,
      discount: 30,
      shipping: 0,
      total: 269,
      paymentMethod: 'upi-qr',
      paymentStatus: 'paid',
      orderStatus: 'printing',
      trackingNumber: `INP-TRK-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setSearchedOrder(demoOrder);
    setSearchError(null);
    setSearchInput(demoId);
  };

  const renderOrderCard = (order: OrderRecord) => {
    const stageInfo = getOrderStatusStageInfo(order);
    const isCopied = copiedId === order.orderId;

    return (
      <div 
        key={order.orderId}
        className="p-5 sm:p-6 rounded-3xl bg-[#121624] border border-slate-800 shadow-xl space-y-5 transition-all hover:border-slate-700"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">ORDER ID:</span>
              <strong className="text-base sm:text-lg font-black text-white font-mono">{order.orderId}</strong>
              <button
                onClick={() => handleCopy(order.orderId)}
                className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy Order ID"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Placed on {order.createdAt} • Guest Profile</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${stageInfo.badgeClass}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{stageInfo.statusLabel}</span>
            </span>
          </div>
        </div>

        {/* Real-time Workshop Physical Location */}
        <div className="p-3.5 rounded-2xl bg-[#0c0f17] border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Physical Production Bay:</p>
              <p className="font-bold text-white text-xs">{stageInfo.location}</p>
            </div>
          </div>
          <button
            onClick={() => onTrackOrderClick(order.orderId)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition-colors shadow-sm"
          >
            Live Stage View
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ordered Items:</p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div 
                key={i} 
                className="p-3 rounded-xl bg-[#161a29] border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-amber-400 shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate max-w-[200px] sm:max-w-md">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Qty: {item.quantity} {item.size ? `• ${item.size}` : ''} {item.finish ? `• ${item.finish}` : ''}
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-amber-400 shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary & Actions Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Total Paid:</span>
            <span className="text-xl font-black text-white font-mono">₹{order.total.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">({order.paymentMethod.toUpperCase()})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedInvoiceOrder(order)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Tax Invoice</span>
            </button>

            <button
              onClick={() => onReorder(order.items)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-brand-600 text-brand-300 hover:text-white text-xs font-bold border border-brand-500/30 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder</span>
            </button>

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! Inquiring about my Order ${order.orderId} (Guest Order). Please update on production status.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Help</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] py-10 bg-[#090b10] text-[#e2e8f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
            <Package className="w-3.5 h-3.5" /> Guest Order Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Track Orders & Manage Print Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            All orders on Instaprint are placed as instant guest orders—no forced account sign-ins or passwords required. Enter your unique Order ID or mobile number below to monitor your print production in real time.
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-6 rounded-3xl bg-[#0e121e] border border-slate-800 shadow-2xl space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. IP-KOL-10293 or INP-2026-7842) or Phone Number"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:border-brand-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 text-slate-950 font-black text-xs sm:text-sm shadow-glow-amber transition-all shrink-0 cursor-pointer"
            >
              Find Order
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Don't have an order yet?</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCreateTestDemo}
                className="text-amber-400 hover:underline font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Live Order Tracking Demo</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onStartShopping}
                className="text-brand-400 hover:underline font-bold flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {searchError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Searched Order Result */}
        {searchedOrder && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Search Result:</span>
              </h3>
              <button
                onClick={() => setSearchedOrder(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Search
              </button>
            </div>
            {renderOrderCard(searchedOrder)}
          </div>
        )}

        {/* Recent Session Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Recent Guest Orders ({allOrders.length})</span>
            </h3>
            {allOrders.length > 0 && (
              <span className="text-xs text-slate-400">Stored in this browser session</span>
            )}
          </div>

          {allOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#0e121e] rounded-3xl border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">No Previous Orders in this Browser</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                When you place an order with guest checkout, it will automatically appear here with real-time status updates from our Baranagar print floor.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onStartShopping}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-rose"
                >
                  Start Shopping Now
                </button>
                <button
                  onClick={handleCreateTestDemo}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                >
                  Load Sample Order
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {allOrders.map(order => renderOrderCard(order))}
            </div>
          )}
        </div>

        {/* Baranagar Studio Hotline & Counter Pickup Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#121624] to-[#14192b] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-white text-sm flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Instaprint Studio & Production Bay</span>
            </h4>
            <p className="text-xs text-slate-400">
              Ground Floor, Shop 106/B, Gopal Lal Tagore Rd, Joyshree, Baranagar, Kolkata 700036
            </p>
            <p className="text-[11px] text-amber-300 font-mono">
              Open Mon–Sat: 11:00 AM – 9:30 PM • Hotline: {STORE_INFO.phone}
            </p>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! I have an order query regarding guest checkout.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
            <span>WhatsApp Studio</span>
          </a>
        </div>

      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-red.png"
                  alt="Instaprint"
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">TAX INVOICE</h3>
                  <p className="text-xs text-slate-500">Instaprint Commercial Print Studio, Baranagar</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-900">Billed To (Guest Customer):</p>
                <p className="text-slate-700">{selectedInvoiceOrder.customer?.fullName || 'Valued Customer'}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.customer?.phone || STORE_INFO.phone}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.customer?.city || 'Kolkata'}, {selectedInvoiceOrder.customer?.pincode || '700036'}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">Invoice Details:</p>
                <p className="text-slate-700 font-mono">Invoice #: INV-{selectedInvoiceOrder.orderId}</p>
                <p className="text-slate-600">Date: {selectedInvoiceOrder.createdAt}</p>
                <p className="text-slate-600 font-mono">GSTIN: 19AAACI1234F1Z8</p>
              </div>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-700">
                  <th className="py-2 text-left px-2">Item Description</th>
                  <th className="py-2 text-center px-2">Qty</th>
                  <th className="py-2 text-right px-2">Rate</th>
                  <th className="py-2 text-right px-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoiceOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-2">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      {item.isCustomized && <p className="text-[10px] text-slate-500">Customized Artwork Job</p>}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 px-2 text-right font-mono">₹{item.price.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{selectedInvoiceOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedInvoiceOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-mono">- ₹{selectedInvoiceOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping / Dispatch:</span>
                <span className="font-mono">{selectedInvoiceOrder.shipping === 0 ? 'FREE (Store Pickup / Express)' : `₹${selectedInvoiceOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t">
                <span>Total Amount Paid:</span>
                <span className="font-mono">₹{selectedInvoiceOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
