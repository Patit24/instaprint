import { Product, StoreReview, CategoryMeta, Coupon, UserProfile, OrderRecord } from '../types';
import { GENERATED_EMPTY_IMAGE_PRODUCTS, MEGA_MENU_CATEGORIES } from './navigationCatalog';
export { GENERATED_EMPTY_IMAGE_PRODUCTS, MEGA_MENU_CATEGORIES };

export const STORE_INFO = {
  name: "INSTAPRINT",
  tagline: "Baranagar's Premier Custom Print & Corporate Merchandising Studio",
  subtext: "High-quality commercial printing, corporate merchandising, illuminated photo keepsakes, and rapid 24-hour turnaround.",
  rating: 4.9,
  reviewsCount: 158,
  phone: "082406 38595",
  whatsapp: "918240638595",
  email: "orders@instaprintkolkata.com",
  address: "Ground Floor, Shop 106/B, Gopal Lal Tagore Rd, Joyshree, Baranagar, Kolkata, West Bengal 700036",
  landmark: "Near Joyshree More / Locomotor Disabilities Institute Road",
  googleMapsUrl: "https://maps.google.com/?q=INSTAPRINT+Baranagar+Kolkata",
  hours: {
    weekdays: "11:00 AM – 09:30 PM",
    sunday: "12:00 PM – 08:00 PM"
  },
  turnaroundGuarantees: [
    "Express 24-Hour Production in Baranagar Studio",
    "Same-Day Store Pickup Available for urgent gifts & corporate cards",
    "Ultra-Vibrant 1200 DPI Commercial Offset & UV Pigment Printing",
    "Breakage-Free Protected Bubble & Wooden Crate Packing",
    "Pan-India Tracked Courier & Kolkata Hyperlocal Delivery"
  ]
};

export const CATEGORIES_CONFIG: CategoryMeta[] = [
  {
    id: 'visiting-cards',
    label: 'Visiting Cards',
    icon: 'Briefcase',
    count: 29,
    subcategories: ['Visiting Cards', 'Digital Visiting Cards', 'Brilliant Finishes', 'Standard Papers', 'Reorder Visiting Cards', 'Specialty Cards', 'Premium Papers', 'Design and Logo', 'Visiting Cards Holder'],
    bannerImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    description: 'First impressions that last. Stiff 350-450 GSM cards, luxury textures, and rapid turnaround.'
  },
  {
    id: 'stationery-notebooks',
    label: 'Stationery, Letterheads & Notebooks',
    icon: 'FileText',
    count: 38,
    subcategories: ['Custom Stationery', 'Office Supplies', 'Notebooks & Diaries', 'Custom Keychains', 'Wedding Stationery', 'Invitations & Announcements', 'Files and Folders'],
    bannerImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    description: 'Complete corporate stationery, personalized executive notebooks, files, and branded pens.'
  },
  {
    id: 'calendars-diaries',
    label: 'Calendars, Notebooks & Diaries',
    icon: 'Calendar',
    count: 35,
    subcategories: ['Bestsellers', 'Calendars', 'Diaries', 'Notebooks'],
    bannerImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Personalized desk & wall calendars, leather executive planners, and bound notebooks.'
  },
  {
    id: 'signs-posters-marketing',
    label: 'Signs, Posters & Marketing Materials',
    icon: 'Flag',
    count: 54,
    subcategories: ['Signs and Posters', 'Marketing Materials', 'More in Signs', 'More in Marketing', 'Table Coverings', 'New Arrivals'],
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'Promotional standees, illuminated LED translites, waterproof banners, posters, and canopy tents.'
  },
  {
    id: 'stickers-labels',
    label: 'Labels, Stickers & Packaging',
    icon: 'Zap',
    count: 51,
    subcategories: ['Custom Packaging', 'Custom Stickers', 'Custom Labels & Laptop Skin', 'Tags', 'Packaging Boxes', 'Newly Launched'],
    bannerImage: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1200&q=80',
    description: 'Waterproof, oil-proof, and outdoor vinyl stickers contour cut to any shape, plus product boxes.'
  },
  {
    id: 'clothing-caps-bags',
    label: 'Clothing, Caps & Bags',
    icon: 'Shirt',
    count: 60,
    subcategories: ['Custom T-Shirts', 'Custom Polo T-Shirts', 'Custom Dress Shirts', 'Custom Bags', 'Tote Bags', 'Custom Activewear', 'Custom Caps'],
    bannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    description: 'Heavyweight bio-wash cotton tees, pique polo shirts, corporate dress shirts, and backpacks.'
  },
  {
    id: 'mugs-albums-gifts',
    label: 'Mugs, Albums & Gifts',
    icon: 'Gift',
    count: 55,
    subcategories: ['Bestsellers & Corporate Gifts', 'Mugs & Gift Hampers', 'Custom Magnets & Coasters', 'Custom Pens', 'Looking for more?', 'Custom Photo Frame', 'Custom Calendars'],
    bannerImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    description: 'Personalized mugs, acrylic photo frames, corporate hampers, fridge magnets, and photo gifts.'
  },
  {
    id: 'pens',
    label: 'Pens',
    icon: 'PenTool',
    count: 45,
    subcategories: ['Bestsellers', 'Value Pens', 'Executive Pens', 'Premium Pens', 'Luxury Pens', 'Newly Launched'],
    bannerImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80',
    description: 'Executive metal pens, luxury SwissBrand pens, Parker ballpoint pens, and custom branded pens.'
  },
  {
    id: 'drinkware',
    label: 'Drinkware',
    icon: 'Coffee',
    count: 38,
    subcategories: ['BestSellers', 'Water Bottles', 'Sippers & Tumblers', 'Looking for more?', 'New in Drinkware'],
    bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    description: 'Stainless steel thermal flasks, vacuum bottles, tumblers, and temperature display mugs.'
  },
  {
    id: 'custom-winterwear',
    label: 'Custom Winterwear',
    icon: 'Sparkles',
    count: 50,
    subcategories: ['Bestsellers', 'Branded', 'Hoodies & Sweatshirts', 'Jackets & Outerwear', 'Explore More'],
    bannerImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    description: 'Fleece hoodies, puffer jackets, varsity jackets, windbreakers, and beanies.'
  },
  {
    id: 'stamps-ink',
    label: 'Stamps and Ink',
    icon: 'Stamp',
    count: 5,
    subcategories: ['Self Inking Stamps', 'Basic Rubber Stamps', 'Pocket Stamps', 'Name Stamps', 'Paper Embosser'],
    bannerImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    description: 'Official self-inking stamps, company seal embossers, and pocket stamps with instant refill ink.'
  },
  {
    id: 'letterheads-envelopes',
    label: 'Letterheads & Envelopes',
    icon: 'FileText',
    count: 2,
    subcategories: ['Executive A4 Letterheads', 'Self-Seal Corporate Envelopes', 'Window Envelopes'],
    bannerImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    description: 'Alabaster bond stationery for legal, medical, and corporate correspondence.'
  },
  {
    id: 'flyers-brochures',
    label: 'Flyers & Brochures',
    icon: 'Layers',
    count: 2,
    subcategories: ['Tri-Fold Pamphlets', 'Bi-Fold Company Profiles', 'A5 Promotional Leaflets'],
    bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    description: 'Vibrant 170-300 GSM marketing collaterals with clean machine creasing.'
  },
  {
    id: 'posters-banners',
    label: 'Posters & Banners',
    icon: 'Flag',
    count: 2,
    subcategories: ['Aluminium Roll-Up Standees', 'Heavy Flex Banners', 'Glossy Photo Posters'],
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'Event standees, showroom backdrops, and exhibition promotional displays.'
  },
  {
    id: 'stickers-labels',
    label: 'Stickers & Labels',
    icon: 'Zap',
    count: 6,
    subcategories: ['Sheet Stickers', 'Packaging Labels', 'Custom Die-Cut', 'Transparent Clear', 'Branded Security Tape'],
    bannerImage: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1200&q=80',
    description: 'Waterproof, oil-proof, and outdoor vinyl stickers contour cut to any shape.'
  },
  {
    id: 'packaging-boxes',
    label: 'Packaging & Boxes',
    icon: 'Package',
    count: 2,
    subcategories: ['Full-Print Corrugated Mailers', 'Sweet & Food Boxes', 'Rigid Gift Hampers'],
    bannerImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    description: 'Elevate your unboxing experience with E-flute self-locking branded boxes.'
  },
  {
    id: 'custom-tshirts',
    label: 'Custom T-Shirts',
    icon: 'Shirt',
    count: 3,
    subcategories: ['Heavyweight 240 GSM Tees', 'Honeycomb Pique Polos', 'Multi-Location Fleets'],
    bannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    description: '100% bio-washed combed cotton with stretchable high-definition DTF graphics.'
  },
  {
    id: 'caps-bags',
    label: 'Caps & Bags',
    icon: 'ShoppingBag',
    count: 4,
    subcategories: ['Embroidered Laptop Bags', 'Harissons Nemesis', 'American Tourister TROT', 'Twill Caps'],
    bannerImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    description: 'Durable employee welcome backpacks and corporate headwear with Madeira embroidery.'
  },
  {
    id: 'mugs-bottles',
    label: 'Mugs & Bottles',
    icon: 'Coffee',
    count: 2,
    subcategories: ['Magic Heat Reveal Mugs', 'Matt Black Steel Bottles', 'Ceramic Desktop Mugs'],
    bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    description: 'Insulated vacuum thermal flasks and color-changing ceramic photo mugs.'
  },
  {
    id: 'diaries-notebooks',
    label: 'Diaries & Notebooks',
    icon: 'BookOpen',
    count: 1,
    subcategories: ['PU Leather Hardbound', 'Elastic Pen Holder', 'Corporate Planners'],
    bannerImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    description: 'Natural 80 GSM cream paper notebooks with magnetic clasps and blind debossing.'
  },
  {
    id: 'id-cards-lanyards',
    label: 'ID Cards & Lanyards',
    icon: 'CreditCard',
    count: 1,
    subcategories: ['20mm Satin Lanyards', 'PVC RFID Cards', 'Retractable Badges'],
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Silky smooth sublimation neck lanyards with heavy-duty metal dog-hooks.'
  },
  {
    id: 'invitations-cards',
    label: 'Invitations & Cards',
    icon: 'Mail',
    count: 2,
    subcategories: ['Wedding Suites', 'Festive Greeting Cards', 'Round Tablecloths'],
    bannerImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    description: 'Gold foil invitations, celebratory announcements, and banquet exhibition spreads.'
  },
  {
    id: 'promotional-gifts',
    label: 'Promotional Gifts & Keepsakes',
    icon: 'Gift',
    count: 4,
    subcategories: ['Romantic LED Silhouette Frames', 'Spotify Music Plaques', 'Gallery Canvas', 'Photo Albums'],
    bannerImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    description: 'Baranagar studio signature optical acrylic nightlights, moon lamps, and wall art.'
  },
  {
    id: 'rubber-stamps',
    label: 'Rubber Stamps & Seals',
    icon: 'Stamp',
    count: 3,
    subcategories: ['Self-Inking Rectangular', 'Round Company Seals', 'Pocket Mobile Stamps', 'Date & Numberer Stamps'],
    bannerImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    description: 'Instant self-inking stamps for bank deposits, doctor prescriptions, GST approvals, and official company seals.'
  },
  {
    id: 'bill-books',
    label: 'Bill Books & Invoices',
    icon: 'Receipt',
    count: 3,
    subcategories: ['Duplicate NCR Books', 'Triplicate Tax Invoices', 'Cash Receipts & Vouchers', 'Delivery Challans'],
    bannerImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    description: 'Carbonless multi-copy numbered invoice books (White, Pink, Yellow) custom-printed with your business GST details.'
  },
  {
    id: 'calendars',
    label: 'Desk & Wall Calendars',
    icon: 'Calendar',
    count: 3,
    subcategories: ['Spiral Desk Tent Calendars', '12-Page Hanging Wall Calendars', 'Laminated Year Planners', 'Pocket Calendars'],
    bannerImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Keep your brand visible 365 days a year with personalized company desk calendars and high-gloss wall planners.'
  },
  {
    id: 'engraved-pens',
    label: 'Engraved Metal Pens',
    icon: 'PenTool',
    count: 3,
    subcategories: ['Parker Vector Laser Engraved', 'Heavy Metal Stylus Pens', 'Parker Jotter Luxury Gift Sets', 'Executive Rollerballs'],
    bannerImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80',
    description: 'Premium metallic and branded Parker® pens laser etched with individual names, designations, and corporate emblems.'
  },
  {
    id: 'office-accessories',
    label: 'Office & Tech Accessories',
    icon: 'MousePointer',
    count: 3,
    subcategories: ['Precision Fabric Mousepads', 'Acrylic & Wooden Coasters', 'Laser Engraved Keychains', 'Mobile Stands'],
    bannerImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
    description: 'Enhance desks with custom dye-sublimated non-slip mousepads, heat-resistant branded coasters, and alloy keyrings.'
  },
  {
    id: 'certificates',
    label: 'Certificates & Award Folders',
    icon: 'Award',
    count: 2,
    subcategories: ['Gold Foil Border Certificates', 'Velvet Presentation Folders', 'Hackathon Participation Awards', 'Diploma Holders'],
    bannerImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    description: 'Honor achievements with heavy 300 GSM archival parchment certificates featuring embossed gold foil crests and velvet holders.'
  },
  {
    id: 'badges-nameplates',
    label: 'Employee Badges & Plates',
    icon: 'BadgeCheck',
    count: 2,
    subcategories: ['Magnetic Metallic Badges', 'Acrylic Desk Nameplates', 'Pin Badges', 'Doctor & Executive Badges'],
    bannerImage: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1200&q=80',
    description: 'Professional clothing-safe magnetic metallic employee tags and optical bevel-edge acrylic desk nameplates.'
  }
];

export const SAMPLE_TEMPLATES = [
  { id: 'minimal-clean', name: 'Minimalist Studio', theme: 'clean-mono', previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80' },
  { id: 'gold-luxury', name: 'Executive Gold Foil', theme: 'luxury-gold', previewUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80' },
  { id: 'startup-vibrant', name: 'Modern Tech Gradient', theme: 'tech-cyan', previewUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80' },
  { id: 'festive-celebration', name: 'Festive Royal Floral', theme: 'festive-crimson', previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80' }
];

// All products are now purely the ~360 real products from the 10 Vistaprint categories (without demo images)
// Loaded directly from Firebase Cloud Firestore!
export const SAMPLE_PRODUCTS: Product[] = GENERATED_EMPTY_IMAGE_PRODUCTS;

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'BARANAGAR10', discountType: 'percentage', value: 10, minOrder: 500, active: true, description: '10% off for Baranagar residents and first orders' },
  { code: 'FIRSTORDER', discountType: 'flat', value: 150, minOrder: 800, active: true, description: 'Flat ₹150 off on your first order' },
  { code: 'FESTIVE25', discountType: 'percentage', value: 25, minOrder: 2500, active: true, description: '25% festive discount on bulk gift orders' },
  { code: 'BULKPRINT', discountType: 'flat', value: 500, minOrder: 3000, active: true, description: 'Flat ₹500 off on corporate bulk printing' }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-101',
  name: 'Debashis Mukherjee',
  email: 'debashis.mukherjee@gmail.com',
  phone: '082406 38595',
  company: 'Bengal Creative Labs',
  wishlistProductIds: ['led-romantic-heart-frame', 'standard-visiting-cards', 'matt-black-stainless-bottles'],
  addresses: [
    {
      id: 'addr-1',
      label: 'Office',
      fullName: 'Debashis Mukherjee',
      phone: '082406 38595',
      addressLine1: 'Ground Floor, Shop 106/B, Gopal Lal Tagore Rd, Joyshree',
      landmark: 'Near Locomotor Disabilities Institute Road',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700036',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Home',
      fullName: 'Debashis Mukherjee',
      phone: '082406 38595',
      addressLine1: 'Flat 4B, Baranagar Heights, Tobin Road',
      landmark: 'Near Dunlop Bridge',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700036',
      isDefault: false
    }
  ]
};

export const REAL_REVIEWS: StoreReview[] = [
  {
    id: "rev-1",
    author: "Deblina Mukherjee",
    rating: 5,
    date: "3 days ago",
    comment: "Ordered an acrylic LED frame with our wedding photo for our 1st anniversary. The finish was breathtaking! The red LOVE base and warm lighting make our living room look like a boutique cafe. Collected directly from their Baranagar shop within 24 hours. Super polite staff!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    location: "Baranagar, Kolkata",
    productPurchased: "Romantic LED Acrylic Silhouette Frame",
    verified: true,
    photoAttached: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rev-2",
    author: "Soumyadeep Ghosh",
    rating: 5,
    date: "1 week ago",
    comment: "Printed 500 spot UV visiting cards for my dental clinic near Dunlop. The velvet feel with raised 3D shine is so luxurious. Clients constantly compliment the cards. Instaprint is by far the most reliable print hub in North Kolkata.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    location: "Dunlop, Kolkata",
    productPurchased: "Spot UV Visiting Cards",
    verified: true
  },
  {
    id: "rev-3",
    author: "Ananya Banerjee",
    rating: 5,
    date: "2 weeks ago",
    comment: "The scannable Spotify plaque with our favorite Rabindra Sangeet was such an emotional gift for my father's 60th birthday. Scans flawlessly on phone! Will definitely order our Diwali corporate gifts from Instaprint.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    location: "Belgharia, Kolkata",
    productPurchased: "Illuminated Spotify Song Plaque",
    verified: true
  },
  {
    id: "rev-4",
    author: "Rohan Sen",
    rating: 5,
    date: "3 weeks ago",
    comment: "Ordered 25 embroidered laptop bags and polo t-shirts for our startup team. Delivered in 48 hours right to Salt Lake with crisp embroidery. Having Vistaprint variety with local Baranagar speed is game changing!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    location: "Salt Lake, Kolkata",
    productPurchased: "Embroidered Laptop Bags & Polos",
    verified: true
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderId: "IP-KOL-89214",
    createdAt: "Nov 02, 2026 at 03:15 PM",
    customer: {
      fullName: "Debashis Mukherjee",
      email: "debashis.mukherjee@gmail.com",
      phone: "082406 38595",
      deliveryMethod: "express-delivery",
      addressLine1: "Ground Floor, Shop 106/B, Gopal Lal Tagore Rd, Joyshree",
      landmark: "Near Locomotor Disabilities Institute Road",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700036",
      specialInstructions: "Please call 10 mins before arrival. Handle fragile acrylic frame with care."
    },
    items: [
      {
        id: "item-ord-1",
        productId: "led-romantic-heart-frame",
        name: "Romantic LED Acrylic Silhouette Frame with 'LOVE' Base",
        price: 899,
        originalPrice: 1499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
        size: "12 x 8 in",
        finish: "Crimson LOVE Base",
        ledColor: "Warm Amber Glow",
        customText: "Debashis & Sharmila",
        customSubtitle: "Always & Forever • 2026",
        uploadedPhotoUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
        isCustomized: true
      },
      {
        id: "item-ord-2",
        productId: "standard-visiting-cards",
        name: "Standard Visiting Cards (Velvet Matte)",
        price: 450,
        originalPrice: 600,
        quantity: 500,
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
        size: "Standard 3.5 x 2 in",
        customText: "Bengal Creative Labs - Debashis Mukherjee",
        backText: "Web & Graphic Design Studio • Baranagar, Kolkata",
        isCustomized: true,
        bulkBadge: "BUY 500 @ Rs. 450"
      }
    ],
    subtotal: 1349,
    discount: 100,
    shipping: 0,
    total: 1249,
    paymentMethod: "upi-qr",
    paymentStatus: "paid",
    orderStatus: "printing",
    trackingNumber: "BLUEDART-KOL-89214"
  },
  {
    orderId: "IP-KOL-73105",
    createdAt: "Oct 28, 2026 at 11:45 AM",
    customer: {
      fullName: "Debashis Mukherjee",
      email: "debashis.mukherjee@gmail.com",
      phone: "082406 38595",
      deliveryMethod: "store-pickup",
      specialInstructions: "Pick up directly at Baranagar counter."
    },
    items: [
      {
        id: "item-ord-3",
        productId: "matt-black-stainless-bottles",
        name: "Matt Black Insulated Stainless Steel Bottle",
        price: 980,
        originalPrice: 1200,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
        size: "750ml Thermo Flask",
        customText: "Bengal Creative Labs",
        isCustomized: true
      }
    ],
    subtotal: 1960,
    discount: 200,
    shipping: 0,
    total: 1760,
    paymentMethod: "card",
    paymentStatus: "paid",
    orderStatus: "delivered",
    trackingNumber: "INSTA-PICKUP-106B"
  },
  {
    orderId: "IP-KOL-90412",
    createdAt: "Nov 03, 2026 at 10:10 AM",
    customer: {
      fullName: "Priya Sengupta",
      email: "priya.sen@outlook.com",
      phone: "098301 22445",
      deliveryMethod: "express-delivery",
      addressLine1: "Tower 3, Flat 1204, Uniworld City, Action Area III",
      landmark: "Near Downtown Mall",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700156",
      specialInstructions: "Deliver between 10am to 5pm."
    },
    items: [
      {
        id: "item-ord-4",
        productId: "full-print-mailer-boxes",
        name: "Full-Print Corrugated Mailer Boxes",
        price: 3150,
        originalPrice: 3800,
        quantity: 100,
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
        size: "Medium (10 x 7 x 3 in)",
        customText: "Aromatique Herbal Teas",
        uploadedPhotoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
        isCustomized: true,
        bulkBadge: "BUY 100 @ Rs. 3150"
      }
    ],
    subtotal: 3150,
    discount: 300,
    shipping: 100,
    total: 2950,
    paymentMethod: "upi-qr",
    paymentStatus: "paid",
    orderStatus: "artwork-review",
    trackingNumber: "DELHIVERY-KOL-90412"
  }
];

