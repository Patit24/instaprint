import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Tag, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Product, ProductCategory, BulkTier } from '../types';
import { CATEGORIES_CONFIG } from '../data/products';

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  editingProduct?: Product | null;
}

// Sample presets for quick testing if admin has no image file handy
const SAMPLE_PRESETS = [
  {
    name: "Visiting Cards",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    category: "visiting-cards" as ProductCategory
  },
  {
    name: "Custom T-Shirt",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    category: "custom-tshirts" as ProductCategory
  },
  {
    name: "Mailer Packaging Box",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    category: "packaging-boxes" as ProductCategory
  },
  {
    name: "LED Acrylic Frame",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    category: "promotional-gifts" as ProductCategory
  }
];

export const ProductUploadModal: React.FC<ProductUploadModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  editingProduct
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ProductCategory>('visiting-cards');
  const [subCategory, setSubCategory] = useState('');
  const [sectionCollection, setSectionCollection] = useState<'popular' | 'trending' | 'labels-packaging' | 'explore-more' | 'new-arrivals' | 'gifts'>('popular');
  const [badge, setBadge] = useState('Bestseller');
  const [tag, setTag] = useState('Express Dispatch');

  // Pricing & Inventory
  const [price, setPrice] = useState<number>(299);
  const [originalPrice, setOriginalPrice] = useState<number>(499);
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [unitLabel, setUnitLabel] = useState('1 Piece');
  const [bulkPricingBadge, setBulkPricingBadge] = useState('BUY 1 @ Rs. 299');
  const [inStock, setInStock] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);

  // Media
  const [image, setImage] = useState<string>('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Specs
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [turnaround, setTurnaround] = useState('24-Hour Production in Baranagar Studio');
  const [materials, setMaterials] = useState('Premium Commercial Print Media');

  // Features list
  const [features, setFeatures] = useState<string[]>([
    'Ultra-vibrant 1200 DPI commercial offset/UV print',
    'Tactile velvet matte finish with scratch-resistant coating',
    'Same-day store counter pickup available at Shop 106/B'
  ]);
  const [newFeature, setNewFeature] = useState('');

  // Sizes / Packs
  const [sizes, setSizes] = useState<{ id: string; label: string; dimensions: string; price: number }[]>([
    { id: 'size-1', label: 'Standard Pack', dimensions: 'Standard', price: 299 }
  ]);
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newSizeDims, setNewSizeDims] = useState('');
  const [newSizePrice, setNewSizePrice] = useState<number>(299);

  // Bulk Tiers
  const [bulkTiers, setBulkTiers] = useState<BulkTier[]>([
    { minQty: 10, pricePerUnit: 260, discountPct: 13 },
    { minQty: 50, pricePerUnit: 220, discountPct: 26 },
    { minQty: 100, pricePerUnit: 180, discountPct: 40 }
  ]);
  const [newTierQty, setNewTierQty] = useState<number>(25);
  const [newTierPrice, setNewTierPrice] = useState<number>(240);
  const [newTierDiscount, setNewTierDiscount] = useState<number>(20);

  // Customizer options
  const [allowCustomPhoto, setAllowCustomPhoto] = useState<boolean>(true);
  const [allowCustomText, setAllowCustomText] = useState<boolean>(true);
  const [allowFrontBack, setAllowFrontBack] = useState<boolean>(false);
  const [defaultTextPrompt, setDefaultTextPrompt] = useState('Enter Custom Brand or Personalized Text');

  // Error validation
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSection, setActiveSection] = useState<'info' | 'media' | 'pricing' | 'specs' | 'variants' | 'customizer'>('info');

  // Auto slug generator helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Populate form if editing
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setSlug(editingProduct.slug || slugify(editingProduct.name || ''));
      setCategory(editingProduct.category || 'visiting-cards');
      setSubCategory(editingProduct.subCategory || '');
      setSectionCollection(editingProduct.sectionCollection || 'popular');
      setBadge(editingProduct.badge || 'Bestseller');
      setTag(editingProduct.tag || 'Express Dispatch');
      setPrice(editingProduct.price || 299);
      setOriginalPrice(editingProduct.originalPrice || 499);
      setMinQuantity(editingProduct.minQuantity || 1);
      setUnitLabel(editingProduct.unitLabel || '1 Piece');
      setBulkPricingBadge(editingProduct.bulkPricingBadge || `BUY ${editingProduct.minQuantity || 1} @ Rs. ${editingProduct.price || 299}`);
      setInStock(editingProduct.inStock !== false);
      setIsFeatured(editingProduct.isFeatured || false);
      setImage(editingProduct.image || '');
      setGallery(editingProduct.gallery && editingProduct.gallery.length > 0 ? editingProduct.gallery : (editingProduct.image ? [editingProduct.image] : []));
      setShortDescription(editingProduct.shortDescription || '');
      setDescription(editingProduct.description || '');
      setTurnaround(editingProduct.turnaround || '24-Hour Production in Baranagar Studio');
      setMaterials(editingProduct.materials || 'Premium Commercial Print Media');
      setFeatures(editingProduct.features || []);
      setSizes(editingProduct.sizes || []);
      setBulkTiers(editingProduct.bulkTiers || []);
      setAllowCustomPhoto(editingProduct.allowCustomPhoto !== false);
      setAllowCustomText(editingProduct.allowCustomText !== false);
      setAllowFrontBack(editingProduct.allowFrontBack || false);
      setDefaultTextPrompt(editingProduct.defaultTextPrompt || 'Enter Custom Brand or Personalized Text');
    } else {
      // Default new product state
      setName('');
      setSlug('');
      setCategory('visiting-cards');
      setSubCategory('Standard Matte/Gloss');
      setPrice(299);
      setOriginalPrice(499);
      setMinQuantity(1);
      setUnitLabel('1 Piece');
      setBulkPricingBadge('BUY 1 @ Rs. 299');
      setImage('');
      setGallery([]);
      setShortDescription('');
      setDescription('');
    }
  }, [editingProduct, isOpen]);

  // Sync Vistaprint badge whenever minQuantity or price changes
  useEffect(() => {
    if (!editingProduct) {
      setBulkPricingBadge(`BUY ${minQuantity} @ Rs. ${price}`);
    }
  }, [minQuantity, price, editingProduct]);

  // Auto-fill subcategories when category changes
  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    const catConfig = CATEGORIES_CONFIG.find(c => c.id === newCat);
    if (catConfig && catConfig.subcategories.length > 0) {
      setSubCategory(catConfig.subcategories[0]);
    }
  };

  // Image compressor & reader
  const processImageFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Compress large image via canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImage(compressedDataUrl);
          if (gallery.length === 0) {
            setGallery([compressedDataUrl]);
          }
          setErrorMsg('');
        } else {
          setImage(event.target?.result as string);
        }
      };
      img.onerror = () => {
        setImage(event.target?.result as string);
      };
    };
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleGalleryFilesAdd = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const res = e.target?.result as string;
        if (res) {
          setGallery(prev => {
            if (prev.length >= 5) return prev;
            const updated = [...prev, res];
            if (!image) setImage(res);
            return updated;
          });
        }
      };
    });
  };

  // Add bullet point feature
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures(prev => [...prev, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  // Add Size Variant
  const handleAddSize = () => {
    if (!newSizeLabel.trim()) return;
    const newId = `size-${Date.now()}`;
    setSizes(prev => [
      ...prev,
      {
        id: newId,
        label: newSizeLabel.trim(),
        dimensions: newSizeDims.trim() || newSizeLabel.trim(),
        price: Number(newSizePrice) || price
      }
    ]);
    setNewSizeLabel('');
    setNewSizeDims('');
  };

  const handleRemoveSize = (id: string) => {
    setSizes(prev => prev.filter(s => s.id !== id));
  };

  // Add Bulk Tier
  const handleAddTier = () => {
    if (!newTierQty || !newTierPrice) return;
    setBulkTiers(prev => [
      ...prev,
      {
        minQty: Number(newTierQty),
        pricePerUnit: Number(newTierPrice),
        discountPct: Number(newTierDiscount)
      }
    ].sort((a, b) => a.minQty - b.minQty));
  };

  const handleRemoveTier = (minQty: number) => {
    setBulkTiers(prev => prev.filter(t => t.minQty !== minQty));
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Product Title is required.');
      setActiveSection('info');
      return;
    }

    // Images are optional at creation/edit time per user requirement:
    // If no image is provided, product is marked as "Photo Pending" and Buy button is disabled
    // until admin uploads a photo.
    const finalImage = image.trim();
    const finalGallery = gallery.filter(g => Boolean(g && g.trim()));
    if (finalImage && finalGallery.length === 0) {
      finalGallery.push(finalImage);
    }

    if (price <= 0) {
      setErrorMsg('Selling Price must be greater than zero.');
      setActiveSection('pricing');
      return;
    }

    const calculatedSlug = slug.trim() || slugify(name);
    const finalId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;

    const newProduct: Product = {
      id: finalId,
      name: name.trim(),
      slug: calculatedSlug,
      category,
      subCategory: subCategory.trim() || undefined,
      sectionCollection,
      badge: badge.trim() || undefined,
      tag: tag.trim() || undefined,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 12,
      bulkPricingBadge: bulkPricingBadge.trim() || `BUY ${minQuantity} @ Rs. ${price}`,
      minQuantity: Number(minQuantity) || 1,
      unitLabel: unitLabel.trim() || '1 Piece',
      inStock,
      isFeatured,
      image: finalImage,
      gallery: finalGallery,
      shortDescription: shortDescription.trim() || `${name.trim()} crafted with high-definition precision in Baranagar, Kolkata.`,
      description: description.trim() || `${name.trim()} offers professional quality printing engineered for corporate, commercial, and personal needs. Printed using archival pigment inks with sharp clarity and durability.`,
      turnaround: turnaround.trim() || '24-Hour Production in Baranagar Studio',
      materials: materials.trim() || 'Archival Cast Media & Premium Stock',
      features: features.length > 0 ? features : ['High-definition commercial print', 'Same-day store pickup at Shop 106/B'],
      sizes: sizes.length > 0 ? sizes : undefined,
      bulkTiers: bulkTiers.length > 0 ? bulkTiers : undefined,
      allowCustomPhoto,
      allowCustomText,
      allowFrontBack,
      defaultTextPrompt: defaultTextPrompt.trim() || 'Enter Custom Brand or Personalized Text',
      relatedProductIds: editingProduct?.relatedProductIds || []
    };

    onSaveProduct(newProduct);
    onClose();
  };

  const selectedCategoryMeta = CATEGORIES_CONFIG.find(c => c.id === category);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0d101a] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#121624] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-rose-600 flex items-center justify-center text-white shadow-glow-rose">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {editingProduct ? 'Edit Existing Product' : 'Upload New Product to Catalog'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase font-mono font-bold">
                  Instaprint Studio Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure photos, volume discount matrix, print specs, and dual-sided customizer options.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Bar */}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-rose-950/80 border-b border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-800/80 bg-[#0e121e] flex items-center gap-1 overflow-x-auto scrollbar-none text-xs shrink-0">
          {[
            { id: 'info', label: '1. Identity & Category' },
            { id: 'media', label: '2. Product Image & Gallery' },
            { id: 'pricing', label: '3. Pricing & Volume Badges' },
            { id: 'specs', label: '4. Specs & Turnaround' },
            { id: 'variants', label: '5. Sizes & Bulk Tiers' },
            { id: 'customizer', label: '6. Customizer Toggles' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeSection === sec.id
                  ? 'bg-brand-600 text-white shadow-glow-rose'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Main Body with Form + Live Preview Card */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form Column (7 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 1: IDENTITY & CATEGORY */}
            {activeSection === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Product Title / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!editingProduct) setSlug(slugify(e.target.value));
                      }}
                      placeholder="e.g. Luxury Velvet Gold Foil Visiting Cards"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Print Category (20 Classes) *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 text-xs"
                    >
                      {CATEGORIES_CONFIG.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Subcategory / Process
                    </label>
                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder="e.g. Spot UV 3D, DTF Combed Cotton"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                    {selectedCategoryMeta?.subcategories && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {selectedCategoryMeta.subcategories.slice(0, 4).map((sub) => (
                          <button
                            type="button"
                            key={sub}
                            onClick={() => setSubCategory(sub)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            + {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. velvet-gold-foil-cards"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-xs text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Storefront Section Placement
                    </label>
                    <select
                      value={sectionCollection}
                      onChange={(e) => setSectionCollection(e.target.value as any)}
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    >
                      <option value="popular">Our Most Popular Products</option>
                      <option value="trending">Trending in Kolkata</option>
                      <option value="labels-packaging">Labels, Stickers & Packaging</option>
                      <option value="explore-more">Explore More & Office Essentials</option>
                      <option value="new-arrivals">New Arrivals & Luxury Brands</option>
                      <option value="gifts">Flagship Illuminated Gifts</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Badge Ribbon
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. Bestseller, New Arrival, Hot"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Production Tag
                    </label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="e.g. Express 24h, Premium 450 GSM"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: PRODUCT IMAGE & GALLERY */}
            {activeSection === 'media' && (
              <div className="space-y-4">
                {/* Dynamic Photo & Buying Status Indicator */}
                <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  image.trim() 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${image.trim() ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                    <span>
                      {image.trim() ? (
                        <strong>Active for Purchasing:</strong>
                      ) : (
                        <strong>Awaiting Photo (Buy Button Disabled):</strong>
                      )}
                      {' '}
                      {image.trim() 
                        ? 'Customers can now customize, add to cart, and buy this product.' 
                        : 'User Buy button is disabled on the storefront until you upload a product photo.'}
                    </span>
                  </div>
                  {image.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setGallery([]);
                      }}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-brand-400" />
                        <span>Primary Product Photo</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Upload high-resolution image from your computer or provide a direct image link
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#141824] p-1 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setImageTab('upload')}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          imageTab === 'upload' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('url')}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          imageTab === 'url' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageTab === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processImageFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-brand-500 bg-brand-500/10'
                            : 'border-slate-700 hover:border-brand-500 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-6 h-6 animate-pulse" />
                        </div>
                        <p className="text-sm font-bold text-white">Click to Browse or Drag Image Here</p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG, WebP, or SVG (Automatically optimized for fast loading)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          placeholder="Paste direct image URL (https://...)"
                          className="flex-1 bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (imageUrlInput.trim()) {
                              setImage(imageUrlInput.trim());
                              if (gallery.length === 0) setGallery([imageUrlInput.trim()]);
                              setImageUrlInput('');
                            }
                          }}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
                        >
                          Apply URL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Preset Sample Images for Fast Testing */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Or Pick Quick High-Res Studio Preset:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SAMPLE_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset.name}
                          onClick={() => {
                            setImage(preset.image);
                            setCategory(preset.category);
                            if (gallery.length === 0) setGallery([preset.image]);
                          }}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-[#141824] hover:bg-slate-800 border border-slate-700 text-left text-xs text-slate-300 hover:text-white transition-colors"
                        >
                          <img src={preset.image} alt={preset.name} className="w-7 h-7 rounded object-cover" />
                          <span className="text-[11px] font-semibold truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Primary Image Preview */}
                  {image && (
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-brand-500/50 shadow-md" />
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Photo Attached Successfully
                          </span>
                          <p className="text-xs text-slate-300 font-mono mt-0.5 truncate max-w-xs">
                            {image.startsWith('data:') ? 'Local file processed (Base64)' : image}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 5-Photo Gallery Manager */}
                <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span>Multi-Photo Showcase ({gallery.length}/5 Photos)</span>
                        <span className="text-[10px] text-brand-400 font-mono">Upload 4 to 5 Angles</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Upload up to 5 photos (angles, in-use, dimensions, closeups) for customer product browsing
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={galleryInputRef}
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          handleGalleryFilesAdd(e.target.files);
                          if (e.target) e.target.value = '';
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Photos (Up to 5)</span>
                      </button>
                    </div>
                  </div>

                  {/* 5 Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {[0, 1, 2, 3, 4].map((slotIdx) => {
                      const imgAtSlot = gallery[slotIdx];
                      const isCover = slotIdx === 0 || imgAtSlot === image;
                      return (
                        <div
                          key={slotIdx}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 flex flex-col items-center justify-center transition-all ${
                            imgAtSlot
                              ? isCover
                                ? 'border-brand-500 bg-slate-900 shadow-md ring-2 ring-brand-500/20'
                                : 'border-slate-700 bg-slate-900'
                              : 'border-dashed border-slate-700 bg-slate-900/40 hover:border-brand-500/60 cursor-pointer'
                          }`}
                          onClick={() => {
                            if (!imgAtSlot) galleryInputRef.current?.click();
                          }}
                        >
                          {imgAtSlot ? (
                            <>
                              <img src={imgAtSlot} alt={`Photo ${slotIdx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                                #{slotIdx + 1} {slotIdx === 0 && '★ Cover'}
                              </div>
                              <div className="absolute inset-0 bg-black/75 opacity-0 hover:opacity-100 flex flex-col items-center justify-center gap-1.5 p-1 transition-opacity">
                                {slotIdx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setImage(imgAtSlot);
                                      setGallery(prev => [imgAtSlot, ...prev.filter((_, i) => i !== slotIdx)]);
                                    }}
                                    className="px-2 py-1 rounded bg-brand-600 text-white text-[10px] font-bold"
                                  >
                                    Set as Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setGallery(prev => prev.filter((_, i) => i !== slotIdx));
                                    if (image === imgAtSlot) {
                                      setImage(gallery[1] || '');
                                    }
                                  }}
                                  className="p-1 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2">
                              <Plus className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                              <span className="text-[10px] font-bold text-slate-400 block">
                                Photo #{slotIdx + 1}
                              </span>
                              <span className="text-[9px] text-slate-500">
                                {slotIdx === 0 ? 'Primary' : 'Gallery'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: PRICING & VOLUME BADGES */}
            {activeSection === 'pricing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Selling Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-[#141824] text-white pl-8 pr-4 py-2.5 rounded-xl border border-slate-700 font-mono font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      MRP / Original Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        className="w-full bg-[#141824] text-white pl-8 pr-4 py-2.5 rounded-xl border border-slate-700 font-mono text-sm"
                      />
                    </div>
                    {originalPrice > price && (
                      <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                        Shows {Math.round(((originalPrice - price) / originalPrice) * 100)}% Discount on storefront
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Minimum Order Quantity (MOQ)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={minQuantity}
                      onChange={(e) => setMinQuantity(Number(e.target.value))}
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Unit Label (Display on card)
                    </label>
                    <input
                      type="text"
                      value={unitLabel}
                      onChange={(e) => setUnitLabel(e.target.value)}
                      placeholder="e.g. 100 Cards, 1 Piece, 24 Stickers"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Vistaprint Badge Style Text (Card Ribbon)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bulkPricingBadge}
                        onChange={(e) => setBulkPricingBadge(e.target.value)}
                        placeholder="BUY 100 @ Rs. 200"
                        className="flex-1 bg-[#141824] text-sky-400 font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setBulkPricingBadge(`BUY ${minQuantity} @ Rs. ${price}`)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-semibold shrink-0"
                      >
                        Auto-Format
                      </button>
                    </div>
                  </div>

                  {/* Stock and Featured Toggles */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#121624] border border-slate-800">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Item In Stock</span>
                        <span className="text-[10px] text-slate-400">Available for customer checkout</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Feature on Homepage</span>
                        <span className="text-[10px] text-slate-400">Highlight in top bestsellers showcase</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: SPECS & TURNAROUND */}
            {activeSection === 'specs' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Short Subtitle / Teaser Description
                  </label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="e.g. 350 GSM stiff velvet cards with razor-sharp foiling"
                    className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Full Detailed Product Overview
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the commercial print quality, resolution, coatings, and applications..."
                    className="w-full bg-[#141824] text-white p-3 rounded-xl border border-slate-700 text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Production Turnaround Guarantee
                    </label>
                    <input
                      type="text"
                      value={turnaround}
                      onChange={(e) => setTurnaround(e.target.value)}
                      placeholder="e.g. 24-Hour Production in Baranagar Studio"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Materials & Substrates Used
                    </label>
                    <input
                      type="text"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="e.g. 450 GSM Heavy Board, Roland UV Flatbed Inks"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>
                </div>

                {/* Bullet Features */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Key Feature Bullet Points ({features.length})
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                      placeholder="Add a bullet feature point..."
                      className="flex-1 bg-[#141824] text-white px-3.5 py-2 rounded-xl border border-slate-700 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl shrink-0"
                    >
                      Add Point
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#141824] border border-slate-800 text-xs">
                        <span className="text-slate-300">• {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: SIZES & BULK TIERS */}
            {activeSection === 'variants' && (
              <div className="space-y-6">
                {/* Size Variants */}
                <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Product Dimensions / Size Options
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Allow customers to select from standard dimensions or volume packs
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={newSizeLabel}
                      onChange={(e) => setNewSizeLabel(e.target.value)}
                      placeholder="Label (e.g. Standard 3.5x2 in)"
                      className="bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs sm:col-span-2"
                    />
                    <input
                      type="text"
                      value={newSizeDims}
                      onChange={(e) => setNewSizeDims(e.target.value)}
                      placeholder="Dimensions (3.5 x 2 in)"
                      className="bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                    />
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={newSizePrice}
                        onChange={(e) => setNewSizePrice(Number(e.target.value))}
                        placeholder="Price ₹"
                        className="w-20 bg-[#141824] text-white px-2 py-2 rounded-xl border border-slate-700 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="flex-1 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {sizes.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      {sizes.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-[#141824] text-xs">
                          <div>
                            <span className="font-bold text-white">{s.label}</span>
                            <span className="text-slate-400 text-[11px] ml-2 font-mono">({s.dimensions})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-amber-400 font-bold">₹{s.price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSize(s.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bulk Discount Matrix */}
                <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Volume Discount Tiers (B2B Bulk Pricing)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Lower unit prices encourage higher quantity commercial orders
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Min Quantity</span>
                      <input
                        type="number"
                        value={newTierQty}
                        onChange={(e) => setNewTierQty(Number(e.target.value))}
                        placeholder="e.g. 50"
                        className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Unit Price (₹)</span>
                      <input
                        type="number"
                        value={newTierPrice}
                        onChange={(e) => setNewTierPrice(Number(e.target.value))}
                        placeholder="e.g. 220"
                        className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Discount %</span>
                      <input
                        type="number"
                        value={newTierDiscount}
                        onChange={(e) => setNewTierDiscount(Number(e.target.value))}
                        placeholder="e.g. 20"
                        className="w-full bg-[#141824] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-mono"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddTier}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
                      >
                        Add Tier
                      </button>
                    </div>
                  </div>

                  {bulkTiers.length > 0 && (
                    <div className="overflow-x-auto pt-2 border-t border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-800">
                            <th className="py-1">Min Quantity</th>
                            <th className="py-1">Unit Price</th>
                            <th className="py-1">Savings</th>
                            <th className="py-1 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {bulkTiers.map((t) => (
                            <tr key={t.minQty}>
                              <td className="py-1.5 font-bold text-white">{t.minQty}+ units</td>
                              <td className="py-1.5 text-amber-400">₹{t.pricePerUnit} / unit</td>
                              <td className="py-1.5 text-emerald-400">{t.discountPct}% OFF</td>
                              <td className="py-1.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTier(t.minQty)}
                                  className="text-slate-500 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 6: CUSTOMIZER TOGGLES */}
            {activeSection === 'customizer' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    InstaStudio 3D Customizer Features
                  </h4>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowCustomPhoto}
                      onChange={(e) => setAllowCustomPhoto(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Allow Customer Artwork & Logo Upload</span>
                      <span className="text-[11px] text-slate-400">Enables high-res PDF, PNG, JPG file uploader on storefront</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowCustomText}
                      onChange={(e) => setAllowCustomText(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Allow Custom Personalized Text</span>
                      <span className="text-[11px] text-slate-400">Customers can enter their name, designation, slogan, or quotes</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowFrontBack}
                      onChange={(e) => setAllowFrontBack(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Enable Dual-Sided (Front & Back) Design Mode</span>
                      <span className="text-[11px] text-slate-400">Essential for visiting cards, double-sided flyers, and printed T-Shirts</span>
                    </div>
                  </label>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Default Text Prompt Placeholder
                    </label>
                    <input
                      type="text"
                      value={defaultTextPrompt}
                      onChange={(e) => setDefaultTextPrompt(e.target.value)}
                      placeholder="e.g. Enter your company name, designation & phone number"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live Storefront Card Preview (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-0 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-400" /> Live Storefront Preview
              </span>

              {/* The Mock Product Card */}
              <div className="rounded-2xl bg-[#121624] border border-slate-800 overflow-hidden shadow-2xl flex flex-col group">
                <div className="relative aspect-square w-full bg-[#090b10] overflow-hidden">
                  {image ? (
                    <img src={image} alt={name || "Product Preview"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4">
                      <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                      <span className="text-xs mt-2">No photo attached yet</span>
                    </div>
                  )}

                  {/* Vistaprint Badge Pill */}
                  <div className="absolute top-3 left-3 bg-sky-950/90 text-sky-300 border border-sky-400/30 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono shadow-md backdrop-blur-sm">
                    {bulkPricingBadge || `BUY ${minQuantity} @ Rs. ${price}`}
                  </div>

                  {/* Top Right Ribbon */}
                  {badge && (
                    <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase shadow-md">
                      {badge}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-brand-400 uppercase tracking-wider">{selectedCategoryMeta?.label || category}</span>
                    <span className={`font-bold ${inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {inStock ? '● In Stock' : '● Out of Stock'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1">
                    {name || "Untitled Print Product"}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {shortDescription || "High-quality print media manufactured with 1200 DPI clarity in Baranagar, Kolkata."}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-white font-mono">₹{price}</span>
                      {originalPrice > price && (
                        <span className="text-xs text-slate-500 line-through font-mono ml-1.5">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">
                      {unitLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Info Box */}
              <div className="p-3 rounded-xl bg-brand-950/30 border border-brand-500/20 text-xs text-brand-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Local Storage Sync
                </p>
                <p className="text-[11px] text-slate-400">
                  When you save this product, it immediately appears on the Homepage, All Products Catalog, and Category pages.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#121624] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {image ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Ready to publish
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Photo upload required before saving
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white text-xs font-bold shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Update Product' : 'Save & Publish Product'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
