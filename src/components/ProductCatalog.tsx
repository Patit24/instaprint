import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Star, 
  ShoppingBag, 
  Clock, 
  Zap, 
  Lightbulb, 
  Image as ImageIcon, 
  Shirt, 
  Coffee, 
  Briefcase, 
  Gift,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Tag,
  ShieldCheck,
  Flame,
  Package,
  Camera,
  Lock,
  AlertCircle,
  MessageCircle,
  Eye
} from 'lucide-react';
import { SAMPLE_PRODUCTS, CATEGORIES_CONFIG, STORE_INFO } from '../data/products';
import { Product } from '../types';
import { hasProductImage } from '../services/firebase';

interface ProductCatalogProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenCustomizerForProduct?: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onQuickAddToCart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
}) => {
  const activeCatalog = useMemo(() => {
    return products && products.length > 0 ? products : SAMPLE_PRODUCTS;
  }, [products]);

  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [only24h, setOnly24h] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Reset subcategory whenever main category changes
  useEffect(() => {
    setSelectedSubCategory('all');
  }, [selectedCategory]);

  const currentCategoryConfig = useMemo(() => {
    return CATEGORIES_CONFIG.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onQuickAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb': return <Lightbulb className="w-4 h-4" />;
      case 'Image': return <ImageIcon className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Shirt': return <Shirt className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Gift': return <Gift className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Smart category matcher to support both primary lines and specialized sub-collections
  const matchesCategory = (product: Product, selectedCat: string): boolean => {
    if (selectedCat === 'all') return true;
    if (product.category === selectedCat) return true;

    const name = product.name.toLowerCase();
    const sub = product.subCategory?.toLowerCase() || '';

    if (selectedCat === 'custom-tshirts') {
      return product.category === 'clothing-caps-bags' && 
        (sub.includes('t-shirt') || name.includes('t-shirt') || name.includes('tee') || name.includes('polo'));
    }
    if (selectedCat === 'rubber-stamps' || selectedCat === 'stamps-ink') {
      return product.category === 'stamps-ink' || product.category === 'rubber-stamps' || name.includes('stamp') || name.includes('seal');
    }
    if (selectedCat === 'bill-books') {
      return (product.category === 'stationery-notebooks' || product.category === 'bill-books') &&
        (sub.includes('invoice') || sub.includes('bill') || name.includes('bill') || name.includes('invoice') || name.includes('voucher'));
    }
    if (selectedCat === 'calendars') {
      return (product.category === 'calendars-diaries' || product.category === 'calendars') &&
        (sub.includes('calendar') || name.includes('calendar'));
    }
    if (selectedCat === 'diaries-notebooks') {
      return (product.category === 'calendars-diaries' || product.category === 'stationery-notebooks' || product.category === 'diaries-notebooks') &&
        (sub.includes('diar') || sub.includes('notebook') || name.includes('diary') || name.includes('notebook'));
    }
    if (selectedCat === 'engraved-pens' || selectedCat === 'pens') {
      return product.category === 'pens' || product.category === 'engraved-pens' || name.includes('pen');
    }
    if (selectedCat === 'packaging-boxes') {
      return (product.category === 'stickers-labels' || product.category === 'packaging-boxes') &&
        (sub.includes('packaging') || sub.includes('box') || name.includes('box') || name.includes('packaging'));
    }
    if (selectedCat === 'caps-bags') {
      return product.category === 'clothing-caps-bags' &&
        (sub.includes('bag') || sub.includes('cap') || name.includes('bag') || name.includes('cap'));
    }
    if (selectedCat === 'mugs-bottles') {
      return (product.category === 'drinkware' || product.category === 'mugs-albums-gifts') &&
        (name.includes('mug') || name.includes('bottle') || name.includes('sipper') || name.includes('flask'));
    }
    if (selectedCat === 'letterheads-envelopes') {
      return product.category === 'stationery-notebooks' &&
        (name.includes('letterhead') || name.includes('envelope'));
    }
    if (selectedCat === 'flyers-brochures') {
      return product.category === 'signs-posters-marketing' &&
        (name.includes('flyer') || name.includes('brochure') || name.includes('leaflet') || name.includes('pamphlet') || name.includes('profile') || name.includes('sheet') || name.includes('card'));
    }
    if (selectedCat === 'posters-banners') {
      return product.category === 'signs-posters-marketing' &&
        (name.includes('poster') || name.includes('banner') || name.includes('standee') || name.includes('sign'));
    }
    if (selectedCat === 'id-cards-lanyards') {
      return product.category === 'stationery-notebooks' &&
        (name.includes('id card') || name.includes('lanyard') || name.includes('badge'));
    }
    if (selectedCat === 'invitations-cards') {
      return (product.category === 'stationery-notebooks' || product.category === 'visiting-cards') &&
        (name.includes('invitation') || name.includes('announcement') || name.includes('card'));
    }
    if (selectedCat === 'promotional-gifts') {
      return (product.category === 'mugs-albums-gifts' || product.category === 'stationery-notebooks') &&
        (name.includes('gift') || name.includes('hamper') || name.includes('frame') || name.includes('plaque'));
    }
    if (selectedCat === 'office-accessories') {
      return (product.category === 'stationery-notebooks' || product.category === 'mugs-albums-gifts') &&
        (name.includes('mouse pad') || name.includes('coaster') || name.includes('keychain') || name.includes('pen drive'));
    }
    if (selectedCat === 'certificates') {
      return product.category === 'stationery-notebooks' &&
        (name.includes('certificate') || name.includes('award') || name.includes('folder'));
    }
    if (selectedCat === 'badges-nameplates') {
      return (product.category === 'stationery-notebooks' || product.category === 'visiting-cards') &&
        (name.includes('badge') || name.includes('nameplate') || name.includes('card holder'));
    }

    return false;
  };

  // Filtered list for category or search view
  const filteredProducts = useMemo(() => {
    return activeCatalog.filter((product) => {
      if (!matchesCategory(product, selectedCategory)) {
        return false;
      }
      if (selectedSubCategory !== 'all' && product.subCategory !== selectedSubCategory) {
        return false;
      }
      if (only24h && !product.turnaround.toLowerCase().includes('24') && !product.turnaround.toLowerCase().includes('same-day')) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSub = product.subCategory?.toLowerCase().includes(query) || false;
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesTag = product.tag?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesCategory && !matchesSub && !matchesDesc && !matchesTag) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [activeCatalog, selectedCategory, selectedSubCategory, only24h, searchQuery, sortBy]);

  // Section Carousels Groups - Pulling rich distinct products for all rows
  const popularSection = useMemo(() => {
    const list = activeCatalog.filter(p => p.sectionCollection === 'popular' || p.category === 'visiting-cards' || p.category === 'clothing-caps-bags');
    return list.slice(0, 12);
  }, [activeCatalog]);

  const trendingSection = useMemo(() => {
    const list = activeCatalog.filter(p => p.sectionCollection === 'trending' || p.category === 'custom-winterwear' || p.category === 'drinkware' || p.category === 'pens');
    return (list.length > 0 ? list : activeCatalog.slice(12, 24)).slice(0, 12);
  }, [activeCatalog]);

  const labelsPackagingSection = useMemo(() => {
    const list = activeCatalog.filter(p => p.category === 'stickers-labels' || p.subCategory?.toLowerCase().includes('packaging') || p.subCategory?.toLowerCase().includes('sticker') || p.subCategory?.toLowerCase().includes('box'));
    return (list.length > 0 ? list : activeCatalog.slice(24, 36)).slice(0, 12);
  }, [activeCatalog]);

  const exploreMoreSection = useMemo(() => {
    const list = activeCatalog.filter(p => p.category === 'stationery-notebooks' || p.category === 'calendars-diaries' || p.category === 'signs-posters-marketing');
    return (list.length > 0 ? list : activeCatalog.slice(36, 48)).slice(0, 12);
  }, [activeCatalog]);

  const newArrivalsSection = useMemo(() => {
    const list = activeCatalog.filter(p => p.badge === 'NEW' || p.tag === 'New Addition' || p.sectionCollection === 'new-arrivals');
    return (list.length > 0 ? list : activeCatalog.slice(48, 60)).slice(0, 12);
  }, [activeCatalog]);

  // Horizontal Carousel Component
  const ProductCarousel = ({ title, subtitle, products }: { title: string; subtitle?: string; products: Product[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const scrollAmount = clientWidth * 0.75;
        scrollRef.current.scrollTo({
          left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="mb-14">
        {/* Section Title & Navigation Arrows */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-[#141824] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors shadow-sm"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-[#141824] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors shadow-sm"
              aria-label="Next items"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Items Track */}
        <div 
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-none"
        >
          {products.map((product) => {
            const isAdded = recentlyAddedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-64 sm:w-72 shrink-0 bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl shadow-sm cursor-pointer group"
              >
                {/* Top Image & Studio Badge */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden">
                  {hasProductImage(product) ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-[#0f1420] p-4 text-center select-none group-hover:scale-105 transition-transform duration-500">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
                        <Camera className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.name}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Custom Print • Baranagar</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Modern Studio Pricing Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/85 text-white dark:bg-black/85 backdrop-blur-md shadow-md border border-white/10 tracking-tight">
                      {product.bulkPricingBadge || `From ₹${product.price}`}
                    </span>
                  </div>

                  {/* Tag or Photo Pending Status */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                    {!hasProductImage(product) ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Awaiting Photo</span>
                      </span>
                    ) : product.badge === 'NEW' || product.tag === 'New Addition' ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white shadow-sm uppercase tracking-wider">
                        NEW
                      </span>
                    ) : product.tag ? (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-white/10 shadow-sm">
                        {product.tag}
                      </span>
                    ) : null}
                  </div>

                  {/* Turnaround in studio */}
                  <div className="absolute bottom-2 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-950/80 dark:bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/20 shadow-sm">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {product.turnaround}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">Base Price:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-900 dark:text-amber-400 font-mono">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint Baranagar! I want to enquire about "${product.name}" (${product.bulkPricingBadge || `Starting at ₹${product.price}`}). Please share quick quotation, quantity discount & sample proof.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 cursor-pointer"
                        title="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Enquire</span>
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700/80 transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                        title="View product details & calculate pricing"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-amber-400" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section id="catalog-section" className="py-12 bg-[#090b10] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                Commercial Printing & Custom Merchandising
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Kolkata's Complete Print & Merch Catalog
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mt-1">
              Visiting cards, corporate apparel, labels, custom packaging, and illuminated photo keepsakes produced with 24h Baranagar dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-[#141824] border border-slate-800 text-xs text-slate-300 font-medium">
              Over <strong className="text-white">33+ Corporate & Gift Products</strong>
            </span>
          </div>
        </div>

        {/* Razorpay Integration Notice & WhatsApp Ordering Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            </div>
            <span className="leading-relaxed text-[11.5px] text-emerald-950 dark:text-emerald-100">
              <strong className="text-emerald-900 dark:text-emerald-300 font-extrabold">Direct WhatsApp Booking Active:</strong> Online Buy Now is temporarily disabled while Razorpay payment gateway integration is in progress. Please contact our Baranagar workshop through the <strong>WhatsApp Enquiry</strong> button on any product!
            </span>
          </div>
          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent("Hi Instaprint! I would like to enquire about placing a custom printing order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-amber-300 hover:text-emerald-900 dark:hover:text-white font-bold underline shrink-0 text-xs flex items-center gap-1"
          >
            <span>WhatsApp Hotline ({STORE_INFO.phone})</span>
            <span>→</span>
          </a>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-glow-rose font-bold'
                  : 'bg-[#121622] hover:bg-[#1a2030] text-slate-300 border border-slate-800'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Subcategory Pills Filter when a Category is active */}
        {selectedCategory !== 'all' && currentCategoryConfig && currentCategoryConfig.subcategories && currentCategoryConfig.subcategories.length > 0 && (
          <div className="mb-6 p-3 rounded-2xl bg-[#111422] border border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Explore Sections in {currentCategoryConfig.label}:
              </span>
              <span className="text-[11px] text-slate-500">
                {filteredProducts.length} Products Found
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubCategory === 'all'
                    ? 'bg-brand-500 text-white shadow-glow-rose'
                    : 'bg-[#181d2e] hover:bg-[#20273d] text-slate-300 border border-slate-700/80'
                }`}
              >
                All ({activeCatalog.filter(p => p.category === selectedCategory).length})
              </button>

              {currentCategoryConfig.subcategories.map((sub) => {
                const count = activeCatalog.filter(p => p.category === selectedCategory && p.subCategory === sub).length;
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedSubCategory === sub
                        ? 'bg-brand-500 text-white shadow-glow-rose font-bold'
                        : 'bg-[#181d2e] hover:bg-[#20273d] text-slate-300 border border-slate-700/80'
                    }`}
                  >
                    <span>{sub}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedSubCategory === sub ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111422] p-3 rounded-2xl border border-slate-800/80 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOnly24h(!only24h)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                only24h
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Ready in 24h Only</span>
            </button>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => onSelectCategory('all')}
                className="text-xs text-brand-400 hover:underline font-semibold"
              >
                ← Back to All Sections
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#141824] text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="popular">Most Popular & Reviewed</option>
              <option value="rating">Highest Rated (★ 4.9+)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* CONDITIONAL DISPLAY: Structured Carousels when "All" is active vs Flat Grid when Filtered */}
        {selectedCategory === 'all' && !searchQuery.trim() && !only24h ? (
          <div>
            {/* CAROUSEL 1: Our Most Popular Products */}
            <ProductCarousel
              title="Our Most Popular Products"
              subtitle="Daily workhorses trusted by Kolkata businesses and medical professionals"
              products={popularSection}
            />

            {/* CAROUSEL 2: Trending */}
            <ProductCarousel
              title="Trending"
              subtitle="Elevated textures, 3D Spot UV, and executive winter wear"
              products={trendingSection}
            />

            {/* PROMOTIONAL FEATURE BANNERS (From Screenshot 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-14">
              {/* Promo Banner 1: Festive Ready */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/80 via-rose-950/60 to-[#121622] p-8 border border-amber-500/30 flex flex-col justify-between shadow-2xl">
                <div className="space-y-3 z-10 max-w-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-black">
                    Festive & Events
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Get your business festive-ready
                  </h3>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Custom gift boxes, branded sweet packaging, full-print mailer cartons, and festive shopping bags.
                  </p>
                  <p className="text-sm font-bold text-amber-400 font-mono">
                    Starting at Rs 245
                  </p>
                </div>

                <div className="pt-6 z-10 flex items-center gap-3">
                  <button
                    onClick={() => onSelectCategory('stickers-packaging')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition-colors"
                  >
                    Shop Packaging
                  </button>
                  <button
                    onClick={() => onSelectCategory('stationery-marketing')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs border border-white/10"
                  >
                    Signage & Banners
                  </button>
                </div>
              </div>

              {/* Promo Banner 2: Wear your brand with pride */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/80 to-[#121622] p-8 border border-slate-700/80 flex flex-col justify-between shadow-2xl">
                <div className="space-y-3 z-10 max-w-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white">
                    Apparel & Uniforms
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Wear your brand with pride
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Embroidered polo t-shirts, winter puffer jackets, hoodies, and employee caps with high-density Madeira threading.
                  </p>
                  <p className="text-sm font-bold text-rose-400 font-mono">
                    1 Starting at Rs. 320
                  </p>
                </div>

                <div className="pt-6 z-10 flex items-center gap-3">
                  <button
                    onClick={() => onSelectCategory('apparel-wearables')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-glow-rose transition-all"
                  >
                    Explore Corporate Apparel
                  </button>
                </div>
              </div>
            </div>

            {/* CAROUSEL 3: Labels, Stickers and Packaging (Screenshot 3) */}
            <ProductCarousel
              title="Labels, Stickers and Packaging"
              subtitle="Food-safe jar labels, die-cut vinyl stickers, security tape, and custom mailer boxes"
              products={labelsPackagingSection}
            />

            {/* CAROUSEL 4: Explore More (Screenshot 1) */}
            <ProductCarousel
              title="Explore More"
              subtitle="Office laptop bags, executive diaries with pen holders, corporate lanyards, and brochures"
              products={exploreMoreSection}
            />

            {/* CAROUSEL 5: New Arrivals (Screenshot 1) */}
            <ProductCarousel
              title="New Arrivals"
              subtitle="Swiss Military® hoodies, American Tourister® backpacks, stainless bottles, and round tablecloths"
              products={newArrivalsSection}
            />
          </div>
        ) : (
          /* REGULAR FILTERED GRID VIEW (When category or search query is applied) */
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#111420] rounded-3xl border border-slate-800">
                <p className="text-base text-slate-300 font-semibold">No products found matching your filter</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search query or selecting another category.</p>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    setOnly24h(false);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const isAdded = recentlyAddedId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="group relative bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl shadow-sm cursor-pointer"
                    >
                      {/* Top Image Container */}
                      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden">
                        {hasProductImage(product) ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-[#0f1420] p-4 text-center select-none group-hover:scale-105 transition-transform duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
                              <Camera className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.name}</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Custom Print • Baranagar</span>
                          </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                        {/* Modern Studio Pricing Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/85 text-white dark:bg-black/85 backdrop-blur-md shadow-md border border-white/10 tracking-tight">
                            {product.bulkPricingBadge || `From ₹${product.price}`}
                          </span>
                        </div>

                        {/* Tag or Photo Pending Status */}
                        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                          {!hasProductImage(product) ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Awaiting Photo</span>
                            </span>
                          ) : product.badge === 'NEW' || product.tag === 'New Addition' ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white shadow-sm uppercase tracking-wider">
                              NEW
                            </span>
                          ) : product.tag ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-white/10 shadow-sm">
                              {product.tag}
                            </span>
                          ) : null}
                        </div>

                        <div className="absolute bottom-2 left-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-950/80 dark:bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/20 shadow-sm">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            {product.turnaround}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span className="font-bold text-slate-800 dark:text-white text-xs">{product.rating}</span>
                              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">Baranagar Studio</span>
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {product.shortDescription}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">Base Price:</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-black text-slate-900 dark:text-amber-400 font-mono">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-slate-400 line-through font-mono">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hi Instaprint Baranagar! I want to enquire about "${product.name}" (${product.bulkPricingBadge || `Starting at ₹${product.price}`}). Please share quick quotation, quantity discount & sample proof.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 cursor-pointer"
                              title="Enquire on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
                              <span>Enquire</span>
                            </a>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProduct(product);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700/80 transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                              title="View product details & calculate pricing"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-amber-400" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
