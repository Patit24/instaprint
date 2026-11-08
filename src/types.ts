export type ProductCategory = 
  | 'all'
  | 'visiting-cards'
  | 'stationery-notebooks'
  | 'letterheads-envelopes'
  | 'calendars-diaries'
  | 'signs-posters-marketing'
  | 'flyers-brochures'
  | 'posters-banners'
  | 'stickers-labels'
  | 'packaging-boxes'
  | 'clothing-caps-bags'
  | 'custom-tshirts'
  | 'caps-bags'
  | 'mugs-albums-gifts'
  | 'mugs-bottles'
  | 'diaries-notebooks'
  | 'id-cards-lanyards'
  | 'invitations-cards'
  | 'promotional-gifts'
  | 'stamps-ink'
  | 'rubber-stamps'
  | 'bill-books'
  | 'calendars'
  | 'pens'
  | 'engraved-pens'
  | 'drinkware'
  | 'custom-winterwear'
  | 'office-accessories'
  | 'certificates'
  | 'badges-nameplates';

export type AppTheme = 'dark' | 'light';

export type AppPage = 
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'track-order'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping-policy'
  | 'refund-policy'
  | 'privacy-policy'
  | 'terms'
  | 'admin';

export interface BulkTier {
  minQty: number;
  pricePerUnit: number;
  discountPct: number;
}

export interface DesignTemplate {
  id: string;
  name: string;
  previewUrl: string;
  theme: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  bulkPricingBadge?: string;
  minQuantity?: number;
  unitLabel?: string;
  tag?: string;
  badge?: string;
  sectionCollection?: 'popular' | 'trending' | 'labels-packaging' | 'explore-more' | 'new-arrivals' | 'gifts';
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  turnaround: string;
  features: string[];
  materials: string;
  sizes?: { id: string; label: string; dimensions: string; price: number }[];
  finishes?: { id: string; label: string; previewColor?: string }[];
  ledColors?: { id: string; label: string; glowHex: string; colorName: string }[];
  bulkTiers?: BulkTier[];
  templates?: DesignTemplate[];
  allowCustomPhoto: boolean;
  allowCustomText: boolean;
  allowFrontBack?: boolean;
  defaultTextPrompt?: string;
  relatedProductIds?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
}

export interface CustomDesignState {
  productId: string;
  productName: string;
  activeSide: 'front' | 'back';
  frontPhotoUrl: string | null;
  backPhotoUrl: string | null;
  frontText: string;
  backText: string;
  frontSubtitle: string;
  backSubtitle: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'display';
  textColor: string;
  selectedTemplateId?: string;
  photoFilter: 'normal' | 'warm-vintage' | 'high-contrast-bw' | 'cyber-punch';
  selectedSize: string;
  selectedFinish: string;
  selectedLedColor: string;
  isLedLit: boolean;
  orientation: 'portrait' | 'landscape' | 'square';
  calculatedPrice: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  size?: string;
  finish?: string;
  ledColor?: string;
  customText?: string;
  customSubtitle?: string;
  uploadedPhotoUrl?: string;
  uploadedLogoUrl?: string;
  uploadedLogoName?: string;
  customInstructions?: string;
  backPhotoUrl?: string;
  backText?: string;
  isCustomized: boolean;
  bulkBadge?: string;
  fontFamily?: string;
  textColor?: string;
}

export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Office' | 'Studio' | 'Other';
  fullName: string;
  phone: string;
  addressLine1: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  addresses: CustomerAddress[];
  wishlistProductIds: string[];
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    deliveryMethod: 'store-pickup' | 'express-delivery';
    addressLine1?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    state?: string;
    specialInstructions?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'upi-qr' | 'card' | 'cod-pickup' | 'whatsapp';
  paymentStatus: 'paid' | 'pending-verification' | 'pay-at-shop';
  orderStatus: 'received' | 'artwork-review' | 'printing' | 'qc-packed' | 'dispatched' | 'delivered' | 'cancelled';
  trackingNumber: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  active: boolean;
  description: string;
}

export interface StoreReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  location: string;
  productPurchased: string;
  verified: boolean;
  photoAttached?: string;
}

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  icon: string;
  count: number;
  subcategories: string[];
  bannerImage: string;
  description: string;
}
