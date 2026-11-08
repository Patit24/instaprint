import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut, 
  Clock, 
  Printer, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  ShoppingBag, 
  Phone, 
  Mail, 
  Building, 
  MessageCircle,
  FileText,
  X
} from 'lucide-react';
import { UserProfile, OrderRecord, CustomerAddress, Product, CartItem } from '../types';
import { STORE_INFO, SAMPLE_PRODUCTS } from '../data/products';

interface CustomerAccountProps {
  user: UserProfile;
  orders: OrderRecord[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onReorder: (items: CartItem[]) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (item: CartItem) => void;
  onTrackOrderClick: (orderId: string) => void;
}

export const CustomerAccount: React.FC<CustomerAccountProps> = ({
  user,
  orders,
  onUpdateUser,
  onLogout,
  onReorder,
  onSelectProduct,
  onAddToCart,
  onTrackOrderClick
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile' | 'support'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRecord | null>(null);

  // Address Modal form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Studio'>('Office');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('700036');

  // Profile edit state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [company, setCompany] = useState(user.company || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      phone,
      company
    };
    onUpdateUser(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    const newAddr: CustomerAddress = {
      id: `addr-${Date.now()}`,
      label: addressLabel,
      fullName: user.name,
      phone: user.phone,
      addressLine1: addressLine,
      landmark,
      city,
      state: 'West Bengal',
      pincode,
      isDefault: user.addresses.length === 0
    };

    onUpdateUser({
      ...user,
      addresses: [...user.addresses, newAddr]
    });

    setAddressLine('');
    setLandmark('');
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    onUpdateUser({
      ...user,
      addresses: user.addresses.filter(a => a.id !== id)
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    onUpdateUser({
      ...user,
      addresses: user.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    });
  };

  const handleRemoveWishlist = (productId: string) => {
    onUpdateUser({
      ...user,
      wishlistProductIds: user.wishlistProductIds.filter(id => id !== productId)
    });
  };

  const wishlistProducts = SAMPLE_PRODUCTS.filter(p => user.wishlistProductIds.includes(p.id));

  return (
    <div className="py-10 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Hero Banner */}
        <div className="bg-[#121624] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-glow-rose shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-brand-400" /> {user.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {user.phone}</span>
                {user.company && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-cyan-400" /> {user.company}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! I am ${user.name} checking on my account.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Studio Desk</span>
            </a>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, badge: user.addresses.length },
              { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: user.wishlistProductIds.length },
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'support', label: 'Customer Support', icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-glow-rose'
                      : 'bg-[#121622] text-slate-300 hover:bg-[#1a2030] border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9 bg-[#111422] rounded-3xl p-6 sm:p-8 border border-slate-800 min-h-[500px]">
            
            {/* TAB 1: My Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Order History & Tracking</h3>
                  <p className="text-xs text-slate-400">Track printing stages, reorder items, or download invoice receipts</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-[#0d101a] rounded-2xl border border-slate-800">
                    <Package className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-white">No orders placed yet</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">Browse our visiting cards, acrylic LED frames, or custom apparel.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-5 rounded-2xl bg-[#141826] border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                          <div>
                            <span className="text-slate-400">Order ID:</span>
                            <span className="font-mono font-black text-amber-400 text-sm ml-1.5">{order.orderId}</span>
                            <span className="text-[11px] text-slate-500 ml-2">({order.createdAt})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.orderStatus === 'received' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              order.orderStatus === 'printing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              order.orderStatus === 'dispatched' || order.orderStatus === 'qc-packed' || order.orderStatus === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {order.orderStatus.replace('-', ' ')}
                            </span>

                            <button
                              onClick={() => onTrackOrderClick(order.orderId)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                            >
                              Track Live
                            </button>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={item.uploadedLogoUrl || item.image} alt={item.name} className="w-10 h-10 rounded-lg object-contain bg-black/40 border border-slate-700 p-0.5 shrink-0" />
                                <div className="truncate">
                                  <p className="font-bold text-white truncate">{item.name}</p>
                                  <p className="text-[11px] text-slate-400 font-mono">
                                    Qty: {item.quantity} {item.size && `• ${item.size}`} {item.bulkBadge && `• ${item.bulkBadge}`}
                                  </p>
                                  {item.uploadedLogoName && (
                                    <p className="text-[10px] text-emerald-400 font-mono truncate">
                                      Artwork: {item.uploadedLogoName}
                                    </p>
                                  )}
                                  {item.customText && (
                                    <p className="text-[10px] text-amber-300 font-mono truncate">
                                      Text: "{item.customText}"
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-mono font-extrabold text-amber-400 shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-slate-400">Total Paid:</span>
                            <span className="text-base font-black text-white font-mono ml-1.5">
                              ₹{order.total.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-slate-500 ml-2">via {order.paymentMethod.toUpperCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </button>

                            <button
                              onClick={() => onReorder(order.items)}
                              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reorder All</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Saved Delivery Addresses</h3>
                    <p className="text-xs text-slate-400">Manage addresses for fast 1-click checkout</p>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-[#0d101a] border border-slate-700 space-y-3.5 text-xs">
                    <h4 className="font-bold text-white text-sm">Add New Address</h4>
                    
                    <div className="flex gap-2">
                      {(['Office', 'Home', 'Studio'] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setAddressLabel(l)}
                          className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                            addressLabel === l
                              ? 'bg-brand-600 text-white border-brand-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="Building Name, Shop/Office No, Street"
                        className="w-full bg-[#141824] text-white px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">Landmark</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Joyshree More"
                          className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-medium block mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl bg-[#141826] border border-slate-800 space-y-3 relative flex flex-col justify-between"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] text-emerald-400 font-bold">
                              ✓ Default Address
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-white text-sm pt-1">{addr.fullName}</p>
                        <p className="text-slate-300">{addr.addressLine1}</p>
                        {addr.landmark && <p className="text-slate-400 text-[11px]">Landmark: {addr.landmark}</p>}
                        <p className="text-slate-400 font-mono text-[11px]">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-slate-400 text-[11px]">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-amber-400 hover:underline font-medium text-[11px]"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px] ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">My Saved Wishlist ({wishlistProducts.length})</h3>
                  <p className="text-xs text-slate-400">Products saved for upcoming corporate gifting or festive printing</p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-[#0d101a] rounded-2xl border border-slate-800">
                    <Heart className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Your wishlist is empty</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">Click the heart icon on any product in the catalog to save it here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-[#141826] border border-slate-800 flex flex-col justify-between space-y-3"
                      >
                        <div
                          onClick={() => onSelectProduct(p)}
                          className="cursor-pointer group"
                        >
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="font-bold text-white text-xs truncate group-hover:text-brand-400">{p.name}</h4>
                          <p className="text-sm font-black text-amber-400 font-mono mt-0.5">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-800 text-xs">
                          <button
                            onClick={() => onAddToCart({
                              id: `${p.id}-${Date.now()}`,
                              productId: p.id,
                              name: p.name,
                              price: p.price,
                              originalPrice: p.originalPrice,
                              quantity: 1,
                              image: p.image,
                              isCustomized: false
                            })}
                            className="flex-1 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-1 shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>
                          <button
                            onClick={() => handleRemoveWishlist(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-lg">
                <div>
                  <h3 className="text-xl font-bold text-white">Account Profile</h3>
                  <p className="text-xs text-slate-400">Update your contact details and business registration</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Email Address (Read-only)</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#0a0d14] text-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Bengal Creative Labs"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-glow-rose flex items-center gap-2 transition-transform"
                  >
                    {profileSaved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Profile Saved!</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: Support Desk */}
            {activeTab === 'support' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Customer Support & Help Desk</h3>
                  <p className="text-xs text-slate-400">Get direct assistance from our Baranagar studio printing team</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-emerald-300">Direct WhatsApp Hotline</p>
                    <p className="text-slate-400 text-[11px]">Instant artwork review & status inquiries: 082406 38595</p>
                  </div>
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint! I need assistance with my order.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setTicketSubmitted(true);
                    setTimeout(() => {
                      setTicketSubmitted(false);
                      setTicketSubject('');
                      setTicketMsg('');
                    }, 3000);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <h4 className="font-bold text-white text-sm">Send a Support Ticket</h4>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Custom resolution check for Visiting Cards"
                      className="w-full bg-[#141824] text-white px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Message / Question</label>
                    <textarea
                      rows={4}
                      required
                      value={ticketMsg}
                      onChange={(e) => setTicketMsg(e.target.value)}
                      placeholder="Describe your inquiry or order query..."
                      className="w-full bg-[#141824] text-white px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
                  >
                    {ticketSubmitted ? 'Ticket Submitted ✓' : 'Submit Ticket'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:p-0">
            
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Header */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-black text-slate-900">INSTAPRINT STUDIO</h2>
                <p className="text-xs text-slate-600 mt-1">{STORE_INFO.address}</p>
                <p className="text-xs text-slate-600">Phone: {STORE_INFO.phone} • GSTIN: 19AAACI1234F1Z8</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tax Invoice</span>
                <p className="font-mono font-black text-lg text-slate-900">{selectedInvoiceOrder.orderId}</p>
                <p className="text-xs text-slate-500">{selectedInvoiceOrder.createdAt}</p>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider">Billed To:</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedInvoiceOrder.customer.fullName}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.customer.phone}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.customer.email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-500 uppercase tracking-wider">Delivery Mode:</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {selectedInvoiceOrder.customer.deliveryMethod === 'store-pickup' ? 'Baranagar Store Pickup' : 'Express Courier'}
                </p>
                <p className="text-slate-600">Status: {selectedInvoiceOrder.paymentStatus.toUpperCase()}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-left">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoiceOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium">{item.name} {item.size && `(${item.size})`}</td>
                    <td className="py-2.5 text-center">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">₹{item.price}</td>
                    <td className="py-2.5 text-right font-mono font-bold">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="space-y-1.5 text-xs border-t-2 border-slate-900 pt-3 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">₹{selectedInvoiceOrder.subtotal}</span>
              </div>
              {selectedInvoiceOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{selectedInvoiceOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono">
                  {selectedInvoiceOrder.shipping === 0 ? 'FREE' : `₹${selectedInvoiceOrder.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Total Amount:</span>
                <span className="font-mono text-base">₹{selectedInvoiceOrder.total}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between print:hidden">
              <span className="text-[11px] text-slate-500">Official Computer Generated Invoice</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
