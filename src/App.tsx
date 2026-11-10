import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoriesDirectory } from './components/CategoriesDirectory';
import { CustomerAccount } from './components/CustomerAccount';
import { GuestOrderHub } from './components/GuestOrderHub';
import { AdminPanel } from './components/AdminPanel';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { FAQ } from './components/FAQ';
import { PolicyPages } from './components/PolicyPages';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BulkPricingCalculator } from './components/BulkPricingCalculator';
import { StoreLocationReviews } from './components/StoreLocationReviews';
import { TrackOrderModal } from './components/TrackOrderModal';
import { LiveCustomizer } from './components/LiveCustomizer';
import { Footer } from './components/Footer';
import { Product, CartItem, OrderRecord, AppPage, UserProfile, Coupon, ProductCategory } from './types';
import { 
  SAMPLE_PRODUCTS, 
  STORE_INFO, 
  INITIAL_COUPONS, 
  INITIAL_USER 
} from './data/products';
import { 
  subscribeToFirestoreProducts, 
  subscribeToFirestoreOrders,
  seedInitialCatalogToFirestore 
} from './services/firebase';
import { 
  dbGetAllProducts, 
  dbSaveProduct, 
  dbDeleteProduct, 
  dbGetAllOrders, 
  dbSaveOrder, 
  dbUpdateOrderStatus, 
  dbGetAllCoupons, 
  dbSaveCoupon, 
  dbDeleteCoupon 
} from './services/db';
import { ShoppingBag, MessageCircle, Phone, ArrowLeft, Sun, Moon } from 'lucide-react';

export const App: React.FC = () => {
  // Page routing state
  const [activePage, setActivePage] = useState<AppPage>('home');

  // 1-Click Dark and Light Theme State (persisted to localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('instaprint_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark'; // signature dark-luxe neon theme by default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    try {
      localStorage.setItem('instaprint_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Products state - Initialized with all distinct products across all categories
  const [products, setProducts] = useState<Product[]>(() => {
    return SAMPLE_PRODUCTS;
  });

  // User state - All customers checkout as guests (no mandatory user profile)
  const [user, setUser] = useState<UserProfile | null>(null);

  // Wishlist state (starts clean with no demo data)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('instaprint_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Orders state (starts clean with no demo data, sanitizes corrupted objects)
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('instaprint_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((o: any) => ({
            ...o,
            customer: o?.customer || {
              fullName: o?.customerName || 'Customer',
              phone: o?.customerPhone || '082406 38595',
              email: o?.customerEmail || 'orders@instaprintkolkata.com',
              deliveryMethod: o?.deliveryMethod || 'store-pickup',
              city: 'Kolkata',
              pincode: '700036'
            }
          }));
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('instaprint_coupons');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COUPONS;
  });

  // Cart state - starts clean with no demo items
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('instaprint_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        // Exclude any obsolete sample items
        return parsed.filter(item => item.id !== 'initial-sample-led');
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Modals & Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerProductId, setCustomizerProductId] = useState<string>('led-romantic-heart-frame');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout discount & Direct Buy Now Item
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem('instaprint_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('instaprint_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('instaprint_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('instaprint_user', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('instaprint_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  // Real-time Master Database Sync (IndexedDB + Cloud Firestore)
  // Ensures products, uploaded photos, orders, and coupons are permanently saved
  useEffect(() => {
    // 1. Load permanent products from master database
    dbGetAllProducts().then(storedProducts => {
      if (storedProducts && storedProducts.length > 0) {
        setProducts(storedProducts.map(p => 
          p.image?.includes('unsplash.com') ? { ...p, image: '', gallery: [] } : p
        ));
      }
    });

    // 2. Load permanent orders from master database
    dbGetAllOrders().then(storedOrders => {
      if (storedOrders && storedOrders.length > 0) {
        setOrders(storedOrders);
      }
    });

    // 3. Load coupons from master database
    dbGetAllCoupons().then(storedCoupons => {
      if (storedCoupons && storedCoupons.length > 0) {
        setCoupons(storedCoupons);
      }
    });

    // 4. Real-time Cloud Firestore synchronization
    let unsubProducts: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;

    try {
      unsubProducts = subscribeToFirestoreProducts((firestoreProducts) => {
        if (firestoreProducts && firestoreProducts.length > 0) {
          setProducts((prev) => {
            const productMap = new Map<string, Product>();
            SAMPLE_PRODUCTS.forEach(p => productMap.set(p.id, p));
            prev.forEach(p => {
              const clean = p.image?.includes('unsplash.com') ? { ...p, image: '', gallery: [] } : p;
              productMap.set(p.id, clean);
            });
            firestoreProducts.forEach(p => {
              const clean = p.image?.includes('unsplash.com') ? { ...p, image: '', gallery: [] } : p;
              productMap.set(p.id, clean);
            });
            return Array.from(productMap.values());
          });
        }
      });
    } catch (err) {
      console.warn('Firestore products subscription notice:', err);
    }

    try {
      unsubOrders = subscribeToFirestoreOrders((firestoreOrders) => {
        if (firestoreOrders && firestoreOrders.length > 0) {
          setOrders(prev => {
            const map = new Map<string, OrderRecord>();
            prev.forEach(o => map.set(o.orderId, o));
            firestoreOrders.forEach(o => map.set(o.orderId, o));
            return Array.from(map.values()).sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      });
    } catch (err) {
      console.warn('Firestore orders subscription notice:', err);
    }

    // 5. Automatically seed catalog to Cloud Firestore so the cloud DB is pre-populated
    seedInitialCatalogToFirestore(SAMPLE_PRODUCTS).catch(err => {
      console.warn('Firestore auto-seed notice:', err);
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  // Navigation router
  const handleNavigate = (page: AppPage, categoryId?: string) => {
    setActivePage(page);
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      if (newItem.isCustomized) {
        return [newItem, ...prev];
      }
      const existingIdx = prev.findIndex(item => item.productId === newItem.productId && !item.isCustomized);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      }
      return [newItem, ...prev];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleProceedToCheckout = (discount: number, coupon: string) => {
    setDirectCheckoutItem(null); // Full cart checkout
    setCheckoutDiscount(discount);
    setAppliedCouponCode(coupon);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleDirectCheckout = (item: CartItem) => {
    setDirectCheckoutItem(item); // Buy Now for ONLY this specific item!
    setCheckoutDiscount(0);
    setAppliedCouponCode('');
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: OrderRecord) => {
    setOrders(prev => [newOrder, ...prev]);
    dbSaveOrder(newOrder);
    if (directCheckoutItem) {
      setCart(prev => prev.filter(i => i.productId !== directCheckoutItem.productId));
      setDirectCheckoutItem(null);
    } else {
      setCart([]);
    }
    setIsCheckoutOpen(false);
  };

  const handleQuickAdd = (product: Product) => {
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.image,
      size: product.sizes?.[0]?.label,
      isCustomized: false,
      bulkBadge: product.bulkPricingBadge
    };
    handleAddToCart(item);
  };

  const handleOpenCustomizerForProduct = (productId: string) => {
    setCustomizerProductId(productId);
    setIsCustomizerOpen(true);
  };

  const handleOpenCustomizer = (product: Product) => {
    setCustomizerProductId(product.id);
    setIsCustomizerOpen(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      if (user) {
        setUser({ ...user, wishlistProductIds: updated });
      }
      return updated;
    });
  };

  // Reorder items from past orders
  const handleReorder = (items: CartItem[]) => {
    setCart(prev => [...items, ...prev]);
    setIsCartOpen(true);
  };

  // Admin order status update - Saved to Master Database permanently
  const handleUpdateOrderStatus = (orderId: string, status: OrderRecord['orderStatus']) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: status } : o));
    dbUpdateOrderStatus(orderId, status);
  };

  // Admin product updates synced with Master Database permanently
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    dbSaveProduct(updatedProduct);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    dbSaveProduct(newProduct);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    dbDeleteProduct(productId);
  };

  // Admin manual cloud DB sync
  const handleSyncDatabase = async (): Promise<void> => {
    await seedInitialCatalogToFirestore(products, true);
  };

  // Admin coupon operations - Saved to Master Database permanently
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    dbSaveCoupon(newCoupon);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    dbDeleteCoupon(code);
  };

  // View dedicated product page
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#090b10] text-[#e2e8f0]'} flex flex-col font-sans selection:bg-brand-500 selection:text-white transition-colors duration-250`}>
      
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setActivePage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => handleNavigate('account')}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => handleNavigate('account')}
        theme={theme}
        onToggleTheme={toggleTheme}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Main Dynamic Page Switcher */}
      <main className="flex-1">
        {/* HOME PAGE */}
        {activePage === 'home' && (
          <div>
            <Hero
              onExploreCatalog={() => handleNavigate('shop')}
            />

            {/* Featured & Bestsellers Catalog */}
            <ProductCatalog
              products={products}
              onSelectProduct={handleSelectProduct}
              onOpenCustomizerForProduct={handleOpenCustomizerForProduct}
              onQuickAddToCart={handleQuickAdd}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
            />

            {/* Bulk Volume Discount Calculator */}
            <BulkPricingCalculator />

            {/* Google Reviews & Baranagar Store Info */}
            <StoreLocationReviews />
          </div>
        )}

        {/* SHOP / ALL PRODUCTS PAGE */}
        {activePage === 'shop' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    Custom Print Catalog & Corporate Shop
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Explore all 20 commercial printing categories with live quantity pricing, dual-side customization & express 24h Kolkata dispatch.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('categories')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors shrink-0"
                >
                  <span>Browse 20 Category Cards →</span>
                </button>
              </div>
            </div>

            <ProductCatalog
              products={products}
              onSelectProduct={handleSelectProduct}
              onOpenCustomizerForProduct={handleOpenCustomizerForProduct}
              onQuickAddToCart={handleQuickAdd}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
            />

            <BulkPricingCalculator />
          </div>
        )}

        {/* 20 CATEGORIES DIRECTORY PAGE */}
        {activePage === 'categories' && (
          <div className="py-8">
            <CategoriesDirectory
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setActivePage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* DEDICATED PRODUCT DETAILS PAGE */}
        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            products={products}
            orders={orders}
            onBack={() => handleNavigate('shop')}
            onAddToCart={handleAddToCart}
            onDirectCheckout={handleDirectCheckout}
            onSelectProduct={handleSelectProduct}
            onOpenCustomizer={handleOpenCustomizer}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* GUEST ORDER HUB & ORDER TRACKING DASHBOARD */}
        {activePage === 'account' && (
          <div>
            {user ? (
              <CustomerAccount
                user={user}
                orders={orders}
                onUpdateUser={(updated) => setUser(updated)}
                onLogout={() => {
                  setUser(null);
                  localStorage.removeItem('instaprint_user');
                  setActivePage('home');
                }}
                onReorder={handleReorder}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onTrackOrderClick={(orderId) => {
                  setIsTrackOrderOpen(true);
                }}
              />
            ) : (
              <GuestOrderHub
                orders={orders}
                onReorder={handleReorder}
                onSelectProduct={handleSelectProduct}
                onTrackOrderClick={(orderId) => {
                  setIsTrackOrderOpen(true);
                }}
                onStartShopping={() => handleNavigate('shop')}
              />
            )}
          </div>
        )}

        {/* ADMIN BACK OFFICE PANEL */}
        {activePage === 'admin' && (
          <AdminPanel
            orders={orders}
            products={products}
            coupons={coupons}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onBackToStore={() => handleNavigate('home')}
            onSelectProduct={handleSelectProduct}
            onSyncDatabase={handleSyncDatabase}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}

        {/* ABOUT US PAGE */}
        {activePage === 'about' && (
          <div className="py-8">
            <AboutUs />
          </div>
        )}

        {/* CONTACT US PAGE */}
        {activePage === 'contact' && (
          <div className="py-8">
            <ContactUs />
          </div>
        )}

        {/* FAQ PAGE */}
        {activePage === 'faq' && (
          <div className="py-8">
            <FAQ />
          </div>
        )}

        {/* LEGAL & POLICY PAGES */}
        {(activePage === 'shipping-policy' || 
          activePage === 'refund-policy' || 
          activePage === 'privacy-policy' || 
          activePage === 'terms') && (
          <div className="py-8">
            <PolicyPages type={activePage} />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          handleNavigate('shop');
        }}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        onClearCart={() => setCart([])}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        cart={directCheckoutItem ? [directCheckoutItem] : cart}
        discount={checkoutDiscount}
        couponCode={appliedCouponCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Interactive 3D Live Customizer Studio */}
      <LiveCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onAddToCart={handleAddToCart}
        initialProductId={customizerProductId}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          if (loggedInUser.wishlistProductIds) {
            setWishlist(loggedInUser.wishlistProductIds);
          }
          setIsAuthOpen(false);
        }}
      />

      {/* Mobile Sticky Floating Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#090b10]/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 500, behavior: 'smooth' });
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 text-white font-bold text-xs shadow-glow-rose"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Products</span>
        </button>

        <a
          href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Hello Instaprint Baranagar! I would like to inquire about customized prints.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-xs shrink-0 flex items-center justify-center"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl border shrink-0 flex items-center justify-center transition-all ${
            theme === 'light'
              ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
              : 'bg-[#141824] text-amber-400 border-slate-700'
          }`}
          title={`Switch to ${theme === 'light' ? 'Dark Neon Mode' : 'Clean Light Mode'}`}
        >
          {theme === 'light' ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 rounded-xl bg-[#141824] border border-slate-700 text-white shrink-0"
          title="View Cart"
        >
          <ShoppingBag className="w-5 h-5 text-brand-400" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </div>

    </div>
  );
};
