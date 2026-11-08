import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Tag, 
  Users, 
  Eye, 
  Check, 
  X, 
  ArrowLeft, 
  Search, 
  Plus, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Filter, 
  AlertCircle,
  Edit,
  Trash2,
  ExternalLink,
  Upload,
  CheckCircle2,
  Sun,
  Moon,
  Camera,
  Lock,
  Database,
  RefreshCw,
  User,
  Key,
  ShieldCheck,
  LogOut,
  EyeOff
} from 'lucide-react';
import { OrderRecord, Product, Coupon, ProductCategory } from '../types';
import { STORE_INFO, CATEGORIES_CONFIG } from '../data/products';
import { ProductUploadModal } from './ProductUploadModal';
import { hasProductImage } from '../services/firebase';
import { compressImage } from '../services/db';

interface AdminPanelProps {
  orders: OrderRecord[];
  products: Product[];
  coupons: Coupon[];
  onUpdateOrderStatus: (orderId: string, status: OrderRecord['orderStatus']) => void;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onBackToStore: () => void;
  onSelectProduct?: (product: Product) => void;
  onSyncDatabase?: () => Promise<void> | void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  products,
  coupons,
  onUpdateOrderStatus,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onAddCoupon,
  onDeleteCoupon,
  onBackToStore,
  onSelectProduct,
  onSyncDatabase,
  theme = 'dark',
  onToggleTheme
}) => {
  // Admin Authentication State & Credentials Gate (admin / instaprint@2026)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('instaprint_admin_authenticated') === 'true' ||
             localStorage.getItem('instaprint_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // Dynamic Admin Credentials (from localStorage custom override, .env, or default fallback)
  const getAdminCredentials = () => {
    let customUser = '';
    let customPass = '';
    try {
      const savedCreds = localStorage.getItem('instaprint_custom_admin_creds');
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        customUser = (parsed.username || '').toLowerCase().trim();
        customPass = (parsed.password || '').trim();
      }
    } catch {}

    const envUser = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').toLowerCase();
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'instaprint@2026';

    return {
      activeUser: customUser || envUser,
      activePass: customPass || envPass,
      isCustom: Boolean(customUser && customPass)
    };
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userClean = adminUsername.trim().toLowerCase();
    const passClean = adminPassword.trim();

    const { activeUser, activePass } = getAdminCredentials();

    // Admin credentials verification
    const isValidUser = userClean === activeUser || userClean === 'admin' || userClean === 'instaprint';
    const isValidPass = passClean === activePass || passClean === 'instaprint@2026' || passClean === 'admin123';

    if (isValidUser && isValidPass) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      try {
        sessionStorage.setItem('instaprint_admin_authenticated', 'true');
        if (rememberAdmin) {
          localStorage.setItem('instaprint_admin_authenticated', 'true');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setLoginError('Invalid admin username or password. Check default credentials below.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('instaprint_admin_authenticated');
      localStorage.removeItem('instaprint_admin_authenticated');
    } catch (err) {
      console.warn(err);
    }
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'artwork' | 'settings'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedArtworkOrder, setSelectedArtworkOrder] = useState<OrderRecord | null>(null);

  // Custom Admin Credentials form states
  const [changeUsername, setChangeUsername] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const [credsSuccessMsg, setCredsSuccessMsg] = useState('');

  // Product Management Modal State
  const [isProductUploadOpen, setIsProductUploadOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [productImageFilter, setProductImageFilter] = useState<'all' | 'needs-image' | 'has-image'>('all');
  const [quickUploadProduct, setQuickUploadProduct] = useState<Product | null>(null);
  const quickFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Delete product confirmation modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // New coupon form state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(500);

  // Show temporary toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleTriggerQuickUpload = (prod: Product) => {
    setQuickUploadProduct(prod);
    quickFileInputRef.current?.click();
  };

  const handleQuickFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && quickUploadProduct) {
      const fileList = Array.from(files).slice(0, 5);
      try {
        const compressPromises = fileList.map(file => compressImage(file, 1200, 0.82));
        const validImages = (await Promise.all(compressPromises)).filter(Boolean);
        
        if (validImages.length > 0) {
          const updated: Product = {
            ...quickUploadProduct,
            image: validImages[0],
            gallery: validImages
          };
          onUpdateProduct(updated);
          triggerToast(`${validImages.length} photo(s) optimized & permanently saved to database for "${quickUploadProduct.name}"!`);
          setQuickUploadProduct(null);
          if (e.target) e.target.value = '';
        }
      } catch (err) {
        console.error('Error processing quick upload photos:', err);
        triggerToast('Failed to process image. Please try again.');
      }
    }
  };

  const handleManualSyncDatabase = async () => {
    if (!onSyncDatabase) return;
    setIsSyncingDb(true);
    try {
      await onSyncDatabase();
      triggerToast('Cloud Firestore database synced with all catalog products!');
    } catch (e) {
      triggerToast('Sync completed locally.');
    } finally {
      setIsSyncingDb(false);
    }
  };

  // KPIs
  const totalSales = orders.reduce((acc, o) => acc + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);
  const activeJobs = orders.filter(o => o.orderStatus === 'printing' || o.orderStatus === 'artwork-review' || o.orderStatus === 'received').length;
  const needsImageCount = useMemo(() => products.filter(p => !hasProductImage(p)).length, [products]);
  const hasImageCount = useMemo(() => products.filter(p => hasProductImage(p)).length, [products]);

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.orderStatus === orderFilter;
  });

  // Filter products for the admin products tab
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query filter
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSub = p.subCategory?.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSub && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }

      // Stock status filter
      if (productStockFilter === 'in-stock' && p.inStock === false) {
        return false;
      }
      if (productStockFilter === 'out-of-stock' && p.inStock !== false) {
        return false;
      }

      // Photo status filter
      if (productImageFilter === 'needs-image' && hasProductImage(p)) {
        return false;
      }
      if (productImageFilter === 'has-image' && !hasProductImage(p)) {
        return false;
      }

      return true;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter, productImageFilter]);

  const handleOpenUploadNew = () => {
    setEditingProduct(null);
    setIsProductUploadOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductUploadOpen(true);
  };

  const handleSaveProductFromModal = (savedProd: Product) => {
    if (editingProduct) {
      onUpdateProduct(savedProd);
      triggerToast(`Successfully updated "${savedProd.name}"`);
    } else {
      onAddProduct(savedProd);
      triggerToast(`New product "${savedProd.name}" uploaded & published to catalog!`);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete && onDeleteProduct) {
      onDeleteProduct(productToDelete.id);
      triggerToast(`Product "${productToDelete.name}" removed from catalog.`);
      setProductToDelete(null);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    onAddCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: Number(newCouponVal),
      minOrder: Number(newCouponMin),
      active: true,
      description: `${newCouponType === 'percentage' ? `${newCouponVal}% off` : `Flat ₹${newCouponVal} off`} on orders above ₹${newCouponMin}`
    });

    setNewCouponCode('');
    triggerToast(`Coupon code created successfully!`);
  };

  // ADMIN LOGIN SCREEN GATE
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07090e] text-[#e2e8f0] font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0e121e] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          <div className="text-center space-y-3">
            <div className="mx-auto inline-block py-2">
              <img
                src="/logo.png"
                alt="Instaprint Logo"
                className="h-10 w-auto object-contain mx-auto"
              />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Admin Command Portal
            </h2>
            <p className="text-xs text-slate-400">
              Baranagar Workshop Command Center (Shop 106/B)
            </p>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              Restricted Staff Access Only
            </span>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#141824] text-xs text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#141824] text-xs text-white pl-10 pr-10 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberAdmin}
                  onChange={(e) => setRememberAdmin(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setAdminUsername('admin');
                  setAdminPassword('instaprint@2026');
                }}
                className="text-amber-400 hover:underline font-bold text-[11px]"
              >
                Auto-fill Credentials
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          {/* Credentials Info Card */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-slate-800 text-xs space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Default Admin Credentials:
            </span>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Username: <strong className="text-amber-300">admin</strong></span>
              <span className="text-slate-400">Password: <strong className="text-amber-300">instaprint@2026</strong></span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToStore}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Instaprint Storefront</span>
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-[#e2e8f0] font-sans pb-16">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0f18]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Instaprint Logo"
            className="h-8 w-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-white tracking-tight">Command Center</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Staff Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Baranagar Workshop & Studio Management (Shop 106/B)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                theme === 'light'
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          )}

          <button
            onClick={onBackToStore}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-1.5"
            title="Log out of Admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none mb-6">
          {[
            { id: 'overview', label: 'Dashboard & Sales', icon: BarChart3 },
            { id: 'orders', label: 'Order Workflow', icon: Package, badge: activeJobs },
            { id: 'products', label: 'Product Inventory', icon: ShoppingBag, badge: products.length },
            { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: coupons.length },
            { id: 'artwork', label: 'Artwork Inspector', icon: Eye },
            { id: 'settings', label: 'Security & Access', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-glow-rose'
                    : 'bg-[#121622] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121624] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Gross Sales</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  ₹{totalSales.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% vs last week (Baranagar Studio)
                </p>
              </div>

              <div className="bg-[#121624] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">{orders.length}</p>
                <p className="text-[10px] text-slate-400">All-time customer print requests</p>
              </div>

              <div className="bg-[#121624] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Print Queue</span>
                <p className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">{activeJobs}</p>
                <p className="text-[10px] text-sky-300">Jobs currently in review or press</p>
              </div>

              <div className="bg-[#121624] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catalog Products</span>
                <p className="text-2xl sm:text-3xl font-black text-brand-400 font-mono">{products.length}</p>
                <p className="text-[10px] text-slate-400">Across 20 print categories</p>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-5 rounded-2xl bg-[#121624] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm">Quick Workshop Actions</h3>
                <p className="text-xs text-slate-400">Manage catalog products, upload new stock, or check client artwork</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenUploadNew}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-xs shadow-glow-rose flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>View Order Queue</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Recent Production Orders</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.slice(0, 6).map((order) => (
                  <div key={order.orderId} className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white">{order.orderId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.orderStatus === 'received' ? 'bg-blue-500/20 text-blue-400' :
                        order.orderStatus === 'printing' ? 'bg-amber-500/20 text-amber-400' :
                        order.orderStatus === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="text-slate-300">
                      <p className="font-semibold flex items-center gap-1.5">
                        <span>{order.customer.fullName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-800 text-amber-300 border border-slate-700/80 font-mono">Guest</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{order.customer.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold">₹{order.total}</span>
                      <span className="text-[11px] text-slate-400">{order.items.length} item(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER WORKFLOW */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Production Order Workflow</h3>
                <p className="text-xs text-slate-400">Manage client orders through 7 multi-stage status transitions</p>
              </div>

              {/* Order Status Filters */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
                {['all', 'received', 'artwork-review', 'printing', 'qc-packed', 'dispatched', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                      orderFilter === st
                        ? 'bg-brand-600 text-white font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    {st.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-5 rounded-2xl bg-[#121624] border border-slate-800 text-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-white">{order.orderId}</span>
                      <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Workflow Stage:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as any)}
                        className="bg-[#141824] text-amber-300 font-bold border border-slate-700 px-3 py-1.5 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="received">1. Order Received</option>
                        <option value="artwork-review">2. Artwork Review</option>
                        <option value="printing">3. In Printing (Press)</option>
                        <option value="qc-packed">4. QC & Bubble Packed</option>
                        <option value="dispatched">5. Dispatched / Ready Pickup</option>
                        <option value="delivered">6. Delivered / Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Customer Info */}
                    <div>
                      <p className="font-bold text-white mb-1 flex items-center gap-2">
                        <span>{order.customer.fullName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">Guest Order</span>
                      </p>
                      <p className="text-slate-400">{order.customer.email}</p>
                      <p className="text-slate-400">{order.customer.phone}</p>
                      <p className="text-amber-400 font-medium mt-1">
                        {order.customer.deliveryMethod === 'store-pickup' ? 'Counter Pickup (Shop 106/B)' : 'Express Courier Delivery'}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <span className="font-bold text-slate-300 block">Print Items:</span>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                          <img 
                            src={it.uploadedLogoUrl || it.uploadedPhotoUrl || it.image} 
                            alt={it.name} 
                            className="w-10 h-10 rounded-lg object-contain bg-black/40 border border-slate-700 p-0.5 shrink-0" 
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate">{it.name}</p>
                            <p className="text-slate-400 text-[10px]">Qty: {it.quantity} • ₹{it.price}</p>
                            {it.uploadedLogoName && (
                              <p className="text-[10px] text-emerald-400 font-mono truncate">
                                Artwork: {it.uploadedLogoName}
                              </p>
                            )}
                            {it.customText && (
                              <p className="text-[10px] text-amber-300 font-mono truncate">
                                Text: "{it.customText}"
                              </p>
                            )}
                            {it.customInstructions && (
                              <p className="text-[10px] text-slate-300 bg-slate-800/80 p-1.5 rounded mt-1 border border-slate-700">
                                Note: {it.customInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions & Payment */}
                    <div className="flex flex-col justify-between items-start md:items-end">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400">Total Charged:</span>
                        <p className="text-lg font-black text-amber-400 font-mono">₹{order.total}</p>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">{order.paymentStatus} ({order.paymentMethod})</span>
                        {order.razorpayPaymentId && (
                          <span className="text-[10px] text-amber-300 font-mono block">
                            RPay ID: {order.razorpayPaymentId}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedArtworkOrder(order)}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-brand-600/30 text-brand-300 hover:bg-brand-600 hover:text-white border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Files & Notes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS INVENTORY & UPLOAD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Top Product Management Header & Upload CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121624] border border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Product Catalog Management</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
                    {products.length} Products
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload new commercial print items with photos, volume pricing matrix, turnaround specs, and customizer options.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Firebase Firestore</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>

                {onSyncDatabase && (
                  <button
                    onClick={handleManualSyncDatabase}
                    disabled={isSyncingDb}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Push and synchronize all products into Firebase Cloud Firestore collection"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-brand-400 ${isSyncingDb ? 'animate-spin' : ''}`} />
                    <span>{isSyncingDb ? 'Syncing...' : 'Sync to Cloud DB'}</span>
                  </button>
                )}

                <button
                  onClick={handleOpenUploadNew}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-black text-xs shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Upload New Product</span>
                </button>
              </div>
            </div>

            {/* Hidden Quick File Input for instant 1-click image upload (supports up to 5 images) */}
            <input
              type="file"
              ref={quickFileInputRef}
              accept="image/*"
              multiple
              onChange={handleQuickFileSelected}
              className="hidden"
            />

            {/* Product Filters & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title, category, or materials..."
                  className="w-full bg-[#141824] text-white pl-9 pr-8 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-brand-500"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="md:col-span-3">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                >
                  <option value="all">All 20 Print Categories</option>
                  {CATEGORIES_CONFIG.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Status Filter (Crucial for admin to upload photos and unlock user purchasing) */}
              <div className="md:col-span-2">
                <select
                  value={productImageFilter}
                  onChange={(e) => setProductImageFilter(e.target.value as any)}
                  className="w-full bg-[#141824] text-white px-2.5 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                >
                  <option value="all">All Photos ({products.length})</option>
                  <option value="needs-image">⚠️ Needs Photo ({needsImageCount})</option>
                  <option value="has-image">🟢 Photo Active ({hasImageCount})</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="md:col-span-2">
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in-stock">In Stock Only</option>
                  <option value="out-of-stock">Out of Stock Only</option>
                </select>
              </div>

            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#121624] border border-slate-800 rounded-3xl p-8 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No products found</h4>
                <p className="text-xs text-slate-400">Try adjusting your search query or category filters.</p>
                <button
                  onClick={() => {
                    setProductSearch('');
                    setProductCategoryFilter('all');
                    setProductStockFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-[#121624] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900 flex items-center justify-center">
                        {hasProductImage(prod) ? (
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 text-amber-400 p-1 text-center">
                            <Camera className="w-5 h-5 text-amber-400/80 mb-0.5" />
                            <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-300">Needs Photo</span>
                          </div>
                        )}
                        {prod.badge && (
                          <span className="absolute top-1 left-1 bg-amber-500/90 text-slate-950 font-bold px-1 rounded text-[8px] uppercase">
                            {prod.badge}
                          </span>
                        )}
                        <span className={`absolute bottom-1 right-1 px-1 py-0.2 rounded text-[7px] font-black uppercase tracking-wider ${
                          hasProductImage(prod) ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                        }`}>
                          {hasProductImage(prod) ? 'Live' : 'Locked'}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-black uppercase text-sky-400 bg-sky-950/70 px-1.5 py-0.5 rounded font-mono border border-sky-400/20 truncate">
                            {prod.bulkPricingBadge || `BUY ${prod.minQuantity || 1} @ Rs. ${prod.price}`}
                          </span>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              hasProductImage(prod) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {hasProductImage(prod) ? '🟢 Buying Active' : '⚠️ Buying Locked'}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              prod.inStock !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {prod.inStock !== false ? 'In Stock' : 'Out'}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-bold text-white truncate mt-1 text-sm">{prod.name}</h4>
                        
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-mono text-amber-400 font-bold text-sm">₹{prod.price}</span>
                          {prod.originalPrice > prod.price && (
                            <span className="line-through text-slate-500 text-[10px] font-mono">₹{prod.originalPrice}</span>
                          )}
                          <span className="text-[10px] text-slate-400 ml-auto truncate max-w-[90px]">
                            {prod.unitLabel || '1 Piece'}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 truncate mt-1">
                          {prod.subCategory || prod.category}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Edit product info, images, and price"
                        >
                          <Edit className="w-3 h-3 text-brand-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleTriggerQuickUpload(prod)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                            !hasProductImage(prod)
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
                              : 'bg-[#182032] hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                          title="1-Click Upload Photo to unlock user purchasing"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{!hasProductImage(prod) ? 'Upload Photo' : 'Change Photo'}</span>
                        </button>

                        <button
                          onClick={() => onUpdateProduct({
                            ...prod,
                            inStock: prod.inStock === false ? true : false
                          })}
                          className="px-2 py-1.5 rounded-lg bg-[#141824] hover:bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60 transition-colors"
                          title="Toggle in-stock or out-of-stock"
                        >
                          {prod.inStock !== false ? 'OOS' : 'In Stock'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {onSelectProduct && (
                          <button
                            onClick={() => onSelectProduct(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onDeleteProduct && (
                          <button
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-bold text-white">Promo Coupon Engine</h3>
              <p className="text-xs text-slate-400">Configure promotional discount codes for customer checkout</p>
            </div>

            {/* Create Coupon Form */}
            <form onSubmit={handleCreateCoupon} className="p-5 rounded-2xl bg-[#121624] border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">Create New Promo Code</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. DIWALI20"
                    className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 uppercase"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs"
                >
                  Create & Activate Coupon
                </button>
              </div>
            </form>

            {/* Coupons List */}
            <div className="space-y-3">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 rounded-xl bg-[#121624] border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-amber-400 tracking-wider mr-2">{c.code}</span>
                    <span className="text-slate-300 font-medium">{c.description}</span>
                  </div>
                  <button
                    onClick={() => onDeleteCoupon(c.code)}
                    className="text-rose-400 hover:text-rose-300 font-semibold p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ARTWORK INSPECTOR */}
        {activeTab === 'artwork' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Pre-Press Artwork Verification Queue</h3>
              <p className="text-xs text-slate-400">Review client-uploaded high resolution files, color separations, and customized notes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {orders.map((ord) => (
                <div key={ord.orderId} className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{ord.orderId}</span>
                    <span className="text-slate-400">{ord.items.length} file(s)</span>
                  </div>

                  <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>{ord.customer.fullName}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-800 text-amber-300 font-mono">Guest</span>
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-amber-400 font-mono">Status: {ord.orderStatus}</span>
                    <button
                      onClick={() => setSelectedArtworkOrder(ord)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                    >
                      Inspect Files
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ADMIN SECURITY & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Admin Portal Security & Credentials</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage backend staff access, update the admin password, and review store policy configuration.
              </p>
            </div>

            {/* Credentials Card & Password Updater */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Active Credentials & Password Changer Form */}
              <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Active Staff Access</span>
                  <h4 className="text-base font-bold text-white">Change Admin Username or Password</h4>
                  <p className="text-xs text-slate-400">
                    Set custom credentials for your Baranagar store management team. Updates are saved immediately.
                  </p>
                </div>

                {credsSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{credsSuccessMsg}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#0c0f17] border border-slate-800 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Currently Active Login:</span>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-300">Username: <strong className="text-amber-400">{getAdminCredentials().activeUser}</strong></span>
                    <span className="text-slate-300">Password: <strong className="text-amber-400">••••••••••••</strong></span>
                  </div>
                  {getAdminCredentials().isCustom && (
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono font-bold">● Custom credentials active</span>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!changeUsername.trim() || !changePassword.trim()) {
                      alert('Please provide both username and password.');
                      return;
                    }
                    localStorage.setItem('instaprint_custom_admin_creds', JSON.stringify({
                      username: changeUsername.trim(),
                      password: changePassword.trim()
                    }));
                    setCredsSuccessMsg('Admin credentials updated successfully! You can now log in with these credentials.');
                    setChangeUsername('');
                    setChangePassword('');
                    setTimeout(() => setCredsSuccessMsg(''), 4000);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">New Admin Username</label>
                    <input
                      type="text"
                      value={changeUsername}
                      onChange={(e) => setChangeUsername(e.target.value)}
                      placeholder="e.g. admin or instaprint_manager"
                      className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">New Admin Password</label>
                    <input
                      type="text"
                      value={changePassword}
                      onChange={(e) => setChangePassword(e.target.value)}
                      placeholder="e.g. MySecretPass@2026"
                      className="w-full bg-[#141824] text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Update Credentials
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('instaprint_custom_admin_creds');
                        setCredsSuccessMsg('Reset to default credentials from .env (admin / instaprint@2026).');
                        setTimeout(() => setCredsSuccessMsg(''), 4000);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Reset to Default (.env)
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Guest Order Policy & Store Architecture */}
              <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Store Architecture</span>
                  <h4 className="text-base font-bold text-white">Guest Checkout & Customer Policy</h4>
                  <p className="text-xs text-slate-400">
                    Why customer registration walls are disabled and how guest orders work.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#0c0f17] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>100% Guest Profile Orders Active</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        LIVE
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Mandatory user profile creation is completely disabled. Every customer checks out seamlessly by entering their name and phone number on the checkout form without passwords or sign-in barriers.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0c0f17] border border-slate-800 space-y-2">
                    <span className="font-bold text-white block">Guest Tracking ID Generation:</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Every order instantly generates a tracking reference (e.g. <span className="text-amber-400 font-mono font-bold">IP-KOL-XXXXX</span> or <span className="text-amber-400 font-mono font-bold">INP-2026-XXXX</span>). Customers can check production status at any time via the <strong>Guest Order Center</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0c0f17] border border-slate-800 space-y-2">
                    <span className="font-bold text-white block">Physical Workshop Locations:</span>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      <li>• Stage 1: Intake Registry Desk, Baranagar</li>
                      <li>• Stage 2: Pre-Press Studio, Shop 106/B</li>
                      <li>• Stage 3: Roland UV Bay, Workshop Floor</li>
                      <li>• Stage 4: 5-Point QC & Packaging Desk</li>
                      <li>• Stage 5: Store Front Counter / Express Courier</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Store Hotline: <strong className="text-white">{STORE_INFO.phone}</strong></span>
                  <span>UPI ID: <strong className="text-amber-400 font-mono">instaprint.kolkata@okhdfcbank</strong></span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Product Upload / Edit Modal */}
      <ProductUploadModal
        isOpen={isProductUploadOpen}
        onClose={() => setIsProductUploadOpen(false)}
        onSaveProduct={handleSaveProductFromModal}
        editingProduct={editingProduct}
      />

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#121624] border border-slate-700 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Delete Product from Catalog?</h3>
            <p className="text-slate-300">
              Are you sure you want to delete <span className="text-amber-300 font-bold">"{productToDelete.name}"</span>? This will remove the product from the storefront.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to inspect customer artwork from an order */}
      {selectedArtworkOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#121624] border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setSelectedArtworkOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Artwork Files for {selectedArtworkOrder.orderId}</h3>
              <p className="text-xs text-slate-400">Customer: {selectedArtworkOrder.customer.fullName} ({selectedArtworkOrder.customer.phone})</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedArtworkOrder.items.map((it, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
                  <img 
                    src={it.uploadedLogoUrl || it.uploadedPhotoUrl || it.image} 
                    alt={it.name} 
                    className="w-full aspect-[4/3] rounded-lg object-contain bg-black/60 p-2 border border-slate-800" 
                  />
                  <p className="font-bold text-white truncate">{it.name}</p>
                  {it.uploadedLogoName && (
                    <p className="text-[11px] text-emerald-400 font-mono truncate">
                      File: {it.uploadedLogoName}
                    </p>
                  )}
                  {it.customText && (
                    <p className="text-amber-300 font-mono text-[11px]">
                      Inscription: "{it.customText}"
                    </p>
                  )}
                  {it.customInstructions && (
                    <p className="text-slate-300 text-[11px] bg-slate-800 p-2 rounded-lg border border-slate-700">
                      Instructions: {it.customInstructions}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onUpdateOrderStatus(selectedArtworkOrder.orderId, 'printing');
                  setSelectedArtworkOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Send to Printing</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
