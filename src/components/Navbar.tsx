import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Phone, 
  MapPin, 
  Search, 
  Clock, 
  MessageCircle, 
  Menu, 
  X,
  Star,
  Heart,
  User,
  ShieldAlert,
  ChevronDown,
  Layers,
  HelpCircle,
  Info,
  Mail,
  Compass,
  Sun,
  Moon,
  Lock,
  Package
} from 'lucide-react';
import { STORE_INFO, CATEGORIES_CONFIG, MEGA_MENU_CATEGORIES, SAMPLE_PRODUCTS } from '../data/products';
import { CartItem, AppPage, UserProfile, Product, ProductCategory } from '../types';

interface NavbarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage, categoryId?: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenCustomizer?: () => void;
  onOpenTrackOrder: () => void;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  cart,
  onOpenCart,
  onOpenCustomizer,
  onOpenTrackOrder,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  user,
  onOpenAuth,
  onOpenAccount,
  wishlistCount,
  onOpenWishlist,
  theme = 'dark',
  onToggleTheme,
  products,
  onSelectProduct,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [activeMegaMenuId, setActiveMegaMenuId] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    onNavigate('shop', categoryId);
    setActiveMegaMenuId(null);
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleItemClick = (item: { name: string; category: ProductCategory; subCategory?: string }) => {
    if (onSelectProduct) {
      const cleanItemName = item.name.toLowerCase().trim();
      const slug = cleanItemName.replace(/[^a-z0-9]+/g, '-');
      const allAvailable = [
        ...(products || []),
        ...(SAMPLE_PRODUCTS || [])
      ];

      // 1. Direct name or slug match
      let found = allAvailable.find(p => 
        p.name.toLowerCase().trim() === cleanItemName ||
        p.id.toLowerCase() === `${item.category}-${slug}` ||
        p.id.toLowerCase().endsWith(slug) ||
        p.slug === slug
      );

      // 2. Substring matching
      if (!found) {
        found = allAvailable.find(p => 
          p.name.toLowerCase().includes(cleanItemName) ||
          cleanItemName.includes(p.name.toLowerCase())
        );
      }

      // 3. Guaranteed distinct product creation if not already in catalog
      if (!found) {
        found = {
          id: `${item.category}-${slug}`,
          name: item.name,
          slug,
          category: item.category,
          subCategory: item.subCategory || 'Custom Prints',
          price: 199,
          originalPrice: 299,
          rating: 4.9,
          reviewsCount: 28,
          unitLabel: 'pcs',
          minQuantity: 5,
          bulkPricingBadge: `BUY 5 @ Rs.199`,
          shortDescription: `${item.name} custom crafted with precision at Instaprint Baranagar Studio.`,
          description: `Custom ${item.name} printed on high-grade commercial archival stock with rich color fidelity. Ready for store pickup or express Kolkata courier dispatch.`,
          image: '',
          gallery: [],
          turnaround: '24-48 Hours Express Dispatch',
          materials: 'Commercial 350-450 GSM Stock / Industrial UV Inks',
          features: [
            'Ultra-vibrant 1200 DPI commercial offset/UV print',
            'Full personalization with logo & custom typography',
            'Free digital pre-press proof on WhatsApp (082406 38595)',
            'Store counter pickup available at Shop 106/B Baranagar'
          ],
          inStock: true,
          allowCustomPhoto: true,
          allowCustomText: true
        };
      }

      if (found) {
        onSelectProduct(found);
        setActiveMegaMenuId(null);
        setMobileMenuOpen(false);
        return;
      }
    }

    onSelectCategory(item.category);
    onNavigate('shop', item.category);
    setActiveMegaMenuId(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090b10]/95 backdrop-blur-md border-b border-[#1f2639]">
      {/* Top Notification & Utility Bar */}
      <div className="bg-gradient-to-r from-brand-950/70 via-[#0d111a] to-amber-950/40 text-xs py-1.5 px-4 text-slate-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
              <Star className="w-3 h-3 fill-amber-400" /> 4.9 ★ (158 Google Reviews)
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              Baranagar's Premier Custom Print & Illuminated Gift Studio (Shop 106/B)
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Open Today: 11:00 AM – 9:30 PM
            </span>

            <a 
              href={`tel:${STORE_INFO.phone}`} 
              className="inline-flex items-center gap-1 hover:text-white transition-colors text-slate-300 font-medium"
            >
              <Phone className="w-3 h-3 text-brand-400" />
              <span>{STORE_INFO.phone}</span>
            </a>

            {/* 1-Click Dark/Light Theme Quick Pill */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border ${
                  theme === 'light'
                    ? 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : 'bg-slate-800/80 text-amber-300 hover:bg-amber-500/20 border-amber-500/30'
                }`}
                title={`Click to switch to ${theme === 'light' ? 'Dark Neon Studio' : 'Clean Light Studio'}`}
                aria-label="Toggle Dark and Light theme"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3 h-3 text-indigo-600" />
                    <span>Dark Theme</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Light Theme</span>
                  </>
                )}
              </button>
            )}

            {/* Quick Admin Portal Pill */}
            <button
              onClick={() => onNavigate('admin')}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border ${
                activePage === 'admin'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow-amber'
                  : 'bg-slate-800/80 text-amber-300 hover:bg-amber-500/20 border-amber-500/30'
              }`}
              title="Admin Back Office Dashboard & Orders Workflow"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Nav Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => onNavigate('home')}
          >
            {/* Official Instaprint Logo */}
            <div className="bg-white/95 hover:bg-white px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-md border border-white/30 transition-all group-hover:scale-[1.02]">
              <img
                src="/logo.png"
                alt="Instaprint - Best Printing. Best Price."
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>

            <div className="hidden xl:block">
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                STUDIO
              </span>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                <span>Baranagar, Kolkata 700036</span>
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'shop' && activePage !== 'home') {
                    onNavigate('shop');
                  }
                }}
                placeholder="Search visiting cards, LED frames, t-shirts, packaging..."
                className="w-full bg-[#121622] text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-full border border-slate-700/60 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Track Order Button */}
            <button
              onClick={onOpenTrackOrder}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                activePage === 'track-order'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order</span>
            </button>

            {/* 1-Click Dark/Light Theme Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center group ${
                  theme === 'light'
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300 shadow-sm'
                    : 'bg-[#141824] hover:bg-[#1a2030] text-amber-400 hover:text-amber-300 border-slate-700/80 shadow-inner'
                }`}
                title={`Click to switch to ${theme === 'light' ? 'Dark Neon Studio' : 'Clean Light Studio'}`}
                aria-label="Toggle Dark and Light theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
                )}
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl bg-[#141824] hover:bg-[#1a2030] border border-slate-700/80 text-slate-300 hover:text-rose-400 transition-all"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-glow-rose">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Studio Admin Portal with Lock Icon (Staff Access) */}
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                activePage === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-glow-amber'
                  : 'bg-[#141824] hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-amber-500/40'
              }`}
              title="Staff Admin Portal (Protected with Username & Password)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1a2030] border border-slate-700/80 text-white font-medium text-xs sm:text-sm transition-all group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-500 text-white font-bold text-[10px] flex items-center justify-center shadow-glow-rose animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400">Cart</span>
                <span className="font-semibold text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards, t-shirts, frames, boxes..."
              className="w-full bg-[#121622] text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-full border border-slate-700/60 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Vistaprint-Style Mega Menu Navigation Bar */}
      <nav 
        className="hidden md:block bg-white border-t border-b border-gray-200 text-xs relative shadow-xs"
        onMouseLeave={() => setActiveMegaMenuId(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
            
            {/* Offers in Red Font (matches screenshot) */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onNavigate('shop');
                setActiveMegaMenuId(null);
              }}
              onMouseEnter={() => setActiveMegaMenuId(null)}
              className="px-2.5 py-2.5 text-xs font-bold text-red-600 hover:text-red-700 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Offers</span>
            </button>

            {/* Category Mega Menu Links */}
            {MEGA_MENU_CATEGORIES.map((cat) => {
              const isActive = activeMegaMenuId === cat.id;
              return (
                <div 
                  key={cat.id} 
                  className="relative shrink-0"
                  onMouseEnter={() => setActiveMegaMenuId(cat.id)}
                >
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-2.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 border-b-2 ${
                      isActive
                        ? 'text-gray-900 border-[#0070ba] bg-gray-50'
                        : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <span>{cat.shortLabel || cat.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                      isActive ? 'rotate-180 text-[#0070ba]' : 'text-gray-400'
                    }`} />
                  </button>
                </div>
              );
            })}

            {/* Quick Directory & Admin Shortcuts */}
            <div className="flex items-center gap-1 ml-auto pl-2 border-l border-gray-200 shrink-0">
              <button
                onClick={() => onNavigate('categories')}
                className="px-2.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                title="All 20 Categories Directory"
              >
                All Categories
              </button>
              
              <button
                onClick={() => onNavigate('admin')}
                className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-xs"
                title="Open Admin Portal"
              >
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                <span>Admin</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mega Menu Dropdown Panel - Clean White Background matching Vistaprint */}
        {activeMegaMenuId && (() => {
          const cat = MEGA_MENU_CATEGORIES.find(c => c.id === activeMegaMenuId);
          if (!cat) return null;

          return (
            <div 
              className="absolute left-0 right-0 top-full z-50 bg-white border-b border-gray-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-1 duration-150 text-gray-900"
              onMouseEnter={() => setActiveMegaMenuId(cat.id)}
              onMouseLeave={() => setActiveMegaMenuId(null)}
            >
              <div className="max-w-7xl mx-auto px-8 pt-7 pb-6">
                
                {/* Specific card layout for stamps and ink matching screenshot 5 */}
                {cat.id === 'stamps-ink' ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {cat.sections.flatMap(s => s.items).map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleItemClick(item)}
                          className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-400 text-center flex flex-col items-center justify-between space-y-3 group transition-all shadow-xs"
                        >
                          <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-2 group-hover:scale-105 transition-transform text-amber-500 shadow-xs">
                            <Sparkles className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Same Day Delivery • Kolkata
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Multi-column layout matching screenshots 1, 2, 3, 4 */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
                    {cat.sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-2.5 min-w-0">
                        <h4 className="text-[13px] font-bold text-gray-900 pb-1.5 border-b border-gray-200/80 tracking-tight">
                          {section.title}
                        </h4>
                        <ul className="space-y-1.5">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              <button
                                onClick={() => handleItemClick(item)}
                                className="w-full text-left py-0.5 text-[12px] text-gray-700 hover:text-[#0070ba] hover:underline transition-colors flex items-center justify-between group"
                              >
                                <span className="truncate">{item.name}</span>
                                {item.isNew && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#009fd9] text-white shadow-xs shrink-0 ml-1.5">
                                    NEW
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Featured Image preview (e.g. for Calendars, Notebooks & Diaries) */}
                    {cat.featuredImage && (
                      <div className="hidden lg:flex col-span-2 flex-col items-center justify-center rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-4 text-center shadow-xs">
                        <img 
                          src={cat.featuredImage} 
                          alt={cat.label} 
                          className="w-full max-h-48 object-cover rounded-lg shadow-sm mb-2.5" 
                        />
                        <span className="text-xs font-bold text-gray-900">{cat.label}</span>
                        <span className="text-[10px] text-gray-500">Customized with company logos & personalized names</span>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Full-width light gray footer bar: See All [Category] matching Vistaprint screenshots */}
              <div className="bg-[#f3f4f6] px-8 py-3.5 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onNavigate('shop', cat.id);
                    setActiveMegaMenuId(null);
                  }}
                  className="text-[13px] font-bold text-gray-900 hover:text-[#0070ba] hover:underline flex items-center gap-1.5 group"
                >
                  <span>See All {cat.label}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <span className="text-[11px] text-gray-500 hidden sm:inline font-medium">
                  100% Quality Assurance • Commercial Offset & UV Digital Print • Baranagar Kolkata Studio
                </span>
              </div>
            </div>
          );
        })()}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1017] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">

          {/* 1-Click Mobile Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={() => {
                onToggleTheme();
              }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                theme === 'light'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-[#141824] text-amber-300 border-slate-700/80'
              }`}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Switch to Dark Neon Theme</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Clean Light Theme</span>
                </>
              )}
            </button>
          )}

          {/* Quick Page Links Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#141824] border border-slate-800 text-slate-200"
            >
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Home Page</span>
            </button>

            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#141824] border border-slate-800 text-slate-200"
            >
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              <span>Shop All</span>
            </button>

            <button
              onClick={() => {
                onNavigate('categories');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#141824] border border-slate-800 text-slate-200"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => {
                onOpenTrackOrder();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#141824] border border-slate-800 text-slate-200"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Track Order</span>
            </button>
            
            <button
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#141824] border border-slate-800 text-slate-200"
            >
              <Package className="w-4 h-4 text-purple-400" />
              <span>Guest Orders</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Mega Menu Categories Accordion for Mobile */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Explore Categories & Products
            </p>
            
            {MEGA_MENU_CATEGORIES.map((cat) => {
              const isExpanded = mobileExpandedCat === cat.id;
              return (
                <div key={cat.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-gray-900 hover:text-black"
                  >
                    <span>{cat.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-3">
                      {cat.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <p className="text-[11px] font-bold uppercase text-gray-900 tracking-wider">
                            {sec.title}
                          </p>
                          <div className="grid grid-cols-1 gap-1">
                            {sec.items.map((item) => (
                              <button
                                key={item.name}
                                onClick={() => handleItemClick(item)}
                                className="text-left py-1 text-xs text-gray-700 hover:text-blue-600 flex items-center justify-between"
                              >
                                <span className="truncate">{item.name}</span>
                                {item.isNew && (
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#009fd9] text-white">
                                    NEW
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full py-2 rounded-lg bg-[#0070ba] hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors mt-2 shadow-xs"
                      >
                        See All {cat.label} →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Informational Links */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-300">
            <button 
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }} 
              className="hover:text-white"
            >
              About Studio
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }} 
              className="hover:text-white"
            >
              Contact Us
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                onNavigate('faq');
                setMobileMenuOpen(false);
              }} 
              className="hover:text-white"
            >
              FAQ
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>{STORE_INFO.address}</span>
            </p>
            <p className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Call us: {STORE_INFO.phone}</span>
            </p>
          </div>

        </div>
      )}
    </header>
  );
};
