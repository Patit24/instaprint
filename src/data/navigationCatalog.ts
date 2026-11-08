import { Product, ProductCategory, CategoryMeta } from '../types';

export interface MegaMenuItem {
  name: string;
  isNew?: boolean;
  subCategory: string;
  category: ProductCategory;
}

export interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuCategory {
  id: ProductCategory;
  label: string;
  shortLabel?: string;
  iconName?: string;
  sections: MegaMenuSection[];
  featuredImage?: string;
}

// Complete Mega Menu Navigation Config matching the Vistaprint India screenshots exactly
export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  // 1. VISITING CARDS
  {
    id: 'visiting-cards',
    label: 'Visiting Cards',
    shortLabel: 'Visiting Cards',
    sections: [
      {
        title: 'Visiting Cards',
        items: [
          { name: 'Standard Visiting Cards', subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Classic Visiting Cards', subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Rounded Corner Visiting Cards', subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Square Visiting Cards', subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Leaf Visiting Cards', isNew: true, subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Oval Visiting Cards', isNew: true, subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Circle Visiting Cards', isNew: true, subCategory: 'Visiting Cards', category: 'visiting-cards' },
          { name: 'Custom Shape Visiting Cards', isNew: true, subCategory: 'Visiting Cards', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Digital Visiting Cards',
        items: [
          { name: 'QR Code Visiting Cards', subCategory: 'Digital Visiting Cards', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Brilliant Finishes',
        items: [
          { name: 'Spot UV Visiting Cards', subCategory: 'Brilliant Finishes', category: 'visiting-cards' },
          { name: 'Raised Foil Visiting Cards', subCategory: 'Brilliant Finishes', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Standard Papers',
        items: [
          { name: 'Glossy Visiting Cards', subCategory: 'Standard Papers', category: 'visiting-cards' },
          { name: 'Matte Visiting Cards', subCategory: 'Standard Papers', category: 'visiting-cards' },
          { name: 'Bulk Visiting Cards', isNew: true, subCategory: 'Standard Papers', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Reorder Visiting Cards',
        items: [
          { name: 'Reorder Visiting Cards', subCategory: 'Reorder Visiting Cards', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Specialty Cards',
        items: [
          { name: 'Magnetic Visiting Cards', subCategory: 'Specialty Cards', category: 'visiting-cards' },
          { name: 'Transparent Visiting Cards', subCategory: 'Specialty Cards', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Premium Papers',
        items: [
          { name: 'Premium Plus Visiting Cards', subCategory: 'Premium Papers', category: 'visiting-cards' },
          { name: 'Non-Tearable Visiting Cards', subCategory: 'Premium Papers', category: 'visiting-cards' },
          { name: 'Velvet Touch Visiting Cards', subCategory: 'Premium Papers', category: 'visiting-cards' },
          { name: 'Pearl Visiting Cards', isNew: true, subCategory: 'Premium Papers', category: 'visiting-cards' },
          { name: 'Kraft Visiting Cards', isNew: true, subCategory: 'Premium Papers', category: 'visiting-cards' },
          { name: 'Diamond Visiting Cards', isNew: true, subCategory: 'Premium Papers', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Design and Logo',
        items: [
          { name: 'Design Services', isNew: true, subCategory: 'Design and Logo', category: 'visiting-cards' },
          { name: 'Logo Maker', subCategory: 'Design and Logo', category: 'visiting-cards' }
        ]
      },
      {
        title: 'Visiting Cards Holder',
        items: [
          { name: 'Engraved Metal Visiting Card Holders', subCategory: 'Visiting Cards Holder', category: 'visiting-cards' },
          { name: 'Metal Visiting Card Holder', subCategory: 'Visiting Cards Holder', category: 'visiting-cards' },
          { name: 'Leatherite Visiting Cards Holder', subCategory: 'Visiting Cards Holder', category: 'visiting-cards' },
          { name: 'Premium Metal Card Holders', isNew: true, subCategory: 'Visiting Cards Holder', category: 'visiting-cards' }
        ]
      }
    ]
  },

  // 2. STATIONERY, LETTERHEADS & NOTEBOOKS
  {
    id: 'stationery-notebooks',
    label: 'Stationery, Letterheads & Notebooks',
    shortLabel: 'Stationery & Notebooks',
    sections: [
      {
        title: 'Custom Stationery',
        items: [
          { name: 'Letterheads', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Custom Letterhead Pads', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Bill Books', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Envelopes', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Custom Mouse Pads', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Envelope Seals', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Custom Pen Drive', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Laptop Skins', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Bulk Letterheads', subCategory: 'Custom Stationery', category: 'stationery-notebooks' },
          { name: 'Custom Pens', subCategory: 'Custom Stationery', category: 'stationery-notebooks' }
        ]
      },
      {
        title: 'Office Supplies',
        items: [
          { name: 'Lanyards', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'ID Cards', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Invoice Books', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Note Cards', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Custom Certificates', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Awards', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Coasters', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Employee Welcome Kit', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Cash Vouchers', subCategory: 'Office Supplies', category: 'stationery-notebooks' },
          { name: 'Paper Identity Cards', subCategory: 'Office Supplies', category: 'stationery-notebooks' }
        ]
      },
      {
        title: 'Notebooks & Diaries',
        items: [
          { name: 'Personalised Notebooks', subCategory: 'Notebooks & Diaries', category: 'stationery-notebooks' },
          { name: 'Diary with Pen Holder', subCategory: 'Notebooks & Diaries', category: 'stationery-notebooks' },
          { name: 'Personalised A5 Diary', subCategory: 'Notebooks & Diaries', category: 'stationery-notebooks' },
          { name: 'Personalised Diary with Magnetic Lock', subCategory: 'Notebooks & Diaries', category: 'stationery-notebooks' },
          { name: 'Notebook A4 Size', subCategory: 'Notebooks & Diaries', category: 'stationery-notebooks' },
          { name: 'Custom Notepads', isNew: true, subCategory: 'Notebooks & Diaries', category: 'stationery-notebooks' }
        ]
      },
      {
        title: 'Custom Keychains',
        items: [
          { name: 'Keychain with Light', subCategory: 'Custom Keychains', category: 'stationery-notebooks' },
          { name: 'Acrylic Keychains', subCategory: 'Custom Keychains', category: 'stationery-notebooks' },
          { name: 'Oval Metal Keychains', subCategory: 'Custom Keychains', category: 'stationery-notebooks' }
        ]
      },
      {
        title: 'Wedding Stationery',
        items: [
          { name: 'Wedding Invitations', subCategory: 'Wedding Stationery', category: 'stationery-notebooks' },
          { name: 'Save The Date Cards', subCategory: 'Wedding Stationery', category: 'stationery-notebooks' },
          { name: 'Wedding Menu', subCategory: 'Wedding Stationery', category: 'stationery-notebooks' },
          { name: 'Wedding Programmes', subCategory: 'Wedding Stationery', category: 'stationery-notebooks' }
        ]
      },
      {
        title: 'Invitations & Announcements',
        items: [
          { name: 'Thank You Cards', subCategory: 'Invitations & Announcements', category: 'stationery-notebooks' },
          { name: 'Birthday Invitations', subCategory: 'Invitations & Announcements', category: 'stationery-notebooks' },
          { name: 'Party invitations', subCategory: 'Invitations & Announcements', category: 'stationery-notebooks' },
          { name: 'Moving Announcements', subCategory: 'Invitations & Announcements', category: 'stationery-notebooks' },
          { name: 'Gift Tags', subCategory: 'Invitations & Announcements', category: 'stationery-notebooks' }
        ]
      },
      {
        title: 'Files and Folders',
        items: [
          { name: 'Presentation Folders', subCategory: 'Files and Folders', category: 'stationery-notebooks' },
          { name: 'Ring Binder File', subCategory: 'Files and Folders', category: 'stationery-notebooks' },
          { name: 'Presentation File with Pocket', subCategory: 'Files and Folders', category: 'stationery-notebooks' },
          { name: 'Custom Document File', isNew: true, subCategory: 'Files and Folders', category: 'stationery-notebooks' }
        ]
      }
    ]
  },

  // 3. CALENDARS, NOTEBOOKS & DIARIES
  {
    id: 'calendars-diaries',
    label: 'Calendars, Notebooks & Diaries',
    shortLabel: 'Calendars & Diaries',
    featuredImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    sections: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Desk Calendars', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Wall Calendars', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Personalised A5 Diary', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Personalised Notebooks', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Diary With Pen Holder', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Personalised Diary with Magnetic Lock', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Flip Desk Calendars', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Classic Executive Diary', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Diary with Strap', subCategory: 'Bestsellers', category: 'calendars-diaries' },
          { name: 'Perpetual Desk Calendar', subCategory: 'Bestsellers', category: 'calendars-diaries' }
        ]
      },
      {
        title: 'Calendars',
        items: [
          { name: 'Magnet Calendars', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Poster Calendars', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Pocket Calendars', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Perpetual Calendars', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Desk Calendar with Photo Frame', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Four Sheeter Wall Calendars', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Perpetual Desk Calendar with Clock', subCategory: 'Calendars', category: 'calendars-diaries' },
          { name: 'Acrylic Photo Calendars', subCategory: 'Calendars', category: 'calendars-diaries' }
        ]
      },
      {
        title: 'Diaries',
        items: [
          { name: 'Worldview 2027 Leather Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Executive Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Luxury Leather 2026 Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Executive Daily Planner with Pen Holder', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'A5 Soft Leather Cover Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'A5 Hard Bound Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Personalised Diary with Magnetic Lock', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Leather Edge Executive Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Pocket Size Diary', subCategory: 'Diaries', category: 'calendars-diaries' },
          { name: 'Faux Leather Diaries', subCategory: 'Diaries', category: 'calendars-diaries' }
        ]
      },
      {
        title: 'Notebooks',
        items: [
          { name: 'Notebook A4 Size', subCategory: 'Notebooks', category: 'calendars-diaries' },
          { name: 'Writing Pads', subCategory: 'Notebooks', category: 'calendars-diaries' },
          { name: 'Perfect Bound Notebooks', subCategory: 'Notebooks', category: 'calendars-diaries' },
          { name: 'myPAPERCLIP A5 Notebooks', subCategory: 'Notebooks', category: 'calendars-diaries' },
          { name: 'Annual Planners', subCategory: 'Notebooks', category: 'calendars-diaries' },
          { name: 'Custom Long Notebooks', subCategory: 'Notebooks', category: 'calendars-diaries' },
          { name: 'myPAPERCLIP Executive A4 Notebooks', subCategory: 'Notebooks', category: 'calendars-diaries' }
        ]
      }
    ]
  },

  // 4. SIGNS, POSTERS & MARKETING MATERIALS
  {
    id: 'signs-posters-marketing',
    label: 'Signs, Posters & Marketing Materials',
    shortLabel: 'Signs & Marketing',
    sections: [
      {
        title: 'Signs and Posters',
        items: [
          { name: 'Standees', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Posters', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Bulk Posters', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Banners', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Tabletop Standees', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Foam Boards', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Tabletop Signs', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Tent Cards', subCategory: 'Signs and Posters', category: 'signs-posters-marketing' },
          { name: 'Acrylic Sign Holder', isNew: true, subCategory: 'Signs and Posters', category: 'signs-posters-marketing' }
        ]
      },
      {
        title: 'Marketing Materials',
        items: [
          { name: 'Flyers', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Presentation Folders', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Brochures', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Booklets', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Bulk Flyers', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Postcards', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Customized Portable Backdrops', isNew: true, subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Custom Mouse Pads', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Custom Bookmarks', subCategory: 'Marketing Materials', category: 'signs-posters-marketing' },
          { name: 'Promotional Canopy Tents', isNew: true, subCategory: 'Marketing Materials', category: 'signs-posters-marketing' }
        ]
      },
      {
        title: 'More in Signs',
        items: [
          { name: 'Acrylic signs', subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'Outdoor Signs', subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'Plastic Signboards', subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'Board Signs', subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'Canvas Signs', subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'Magnetic Signs', subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'LED Translite Sign Boards', isNew: true, subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'LED Lollipop Display', isNew: true, subCategory: 'More in Signs', category: 'signs-posters-marketing' },
          { name: 'LED Clip-On Displays', isNew: true, subCategory: 'More in Signs', category: 'signs-posters-marketing' }
        ]
      },
      {
        title: 'More in Marketing',
        items: [
          { name: 'Custom Car Door Decals', subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Customised Promo Tables', isNew: true, subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Custom Logo Flags', isNew: true, subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Menu Cards', subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Foldable Pop Up Banners', isNew: true, subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Loyalty Cards', subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Custom Gift Certificates', subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Button Badges', subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Paper Bags', subCategory: 'More in Marketing', category: 'signs-posters-marketing' },
          { name: 'Custom Keychains', subCategory: 'More in Marketing', category: 'signs-posters-marketing' }
        ]
      },
      {
        title: 'Table Coverings',
        items: [
          { name: 'Custom Tablecloths', subCategory: 'Table Coverings', category: 'signs-posters-marketing' },
          { name: 'Table Runners', subCategory: 'Table Coverings', category: 'signs-posters-marketing' },
          { name: 'Table Mats', subCategory: 'Table Coverings', category: 'signs-posters-marketing' },
          { name: 'Place Mats', subCategory: 'Table Coverings', category: 'signs-posters-marketing' },
          { name: 'Stretch Table Covers', isNew: true, subCategory: 'Table Coverings', category: 'signs-posters-marketing' },
          { name: 'Round Tablecloths', isNew: true, subCategory: 'Table Coverings', category: 'signs-posters-marketing' }
        ]
      },
      {
        title: 'New Arrivals',
        items: [
          { name: 'Full-Print Paper Bags', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Elegant Fabric Standees', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Customised QR Code Stand', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'LED Display Stands', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'X-Banners', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Fabric Banners', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Mesh Banners', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Tension Fabric Displays', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Sail Flags', subCategory: 'New Arrivals', category: 'signs-posters-marketing' },
          { name: 'Mini X Banners', isNew: true, subCategory: 'New Arrivals', category: 'signs-posters-marketing' }
        ]
      }
    ]
  },

  // 5. LABELS, STICKERS & PACKAGING
  {
    id: 'stickers-labels',
    label: 'Labels, Stickers & Packaging',
    shortLabel: 'Labels & Packaging',
    sections: [
      {
        title: 'Custom Packaging',
        items: [
          { name: 'Self Adhesive Tapes', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Custom Paper Bags', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Printed Carry Bags', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Premium Gift Bags', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Courier Bags', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Corrugated Boxes', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Flat Mailer Boxes', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Metallic Shopping Bags', subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Customised Ribbons', isNew: true, subCategory: 'Custom Packaging', category: 'stickers-labels' },
          { name: 'Die Cut Handle Bags', subCategory: 'Custom Packaging', category: 'stickers-labels' }
        ]
      },
      {
        title: 'Custom Stickers',
        items: [
          { name: 'Sheet Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Custom Shape Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Sticker Singles', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'UV Ink Transfer Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Window Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Dome Stickers', isNew: true, subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'QR Code Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Custom Car Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Visiting Card Stickers', subCategory: 'Custom Stickers', category: 'stickers-labels' },
          { name: 'Kraft Stickers', isNew: true, subCategory: 'Custom Stickers', category: 'stickers-labels' }
        ]
      },
      {
        title: 'Custom Labels',
        items: [
          { name: 'Product and Packaging Labels', subCategory: 'Custom Labels', category: 'stickers-labels' },
          { name: 'Return Address Labels', subCategory: 'Custom Labels', category: 'stickers-labels' },
          { name: 'Custom Iron-on Labels', subCategory: 'Custom Labels', category: 'stickers-labels' },
          { name: 'Transparent Labels', subCategory: 'Custom Labels', category: 'stickers-labels' },
          { name: 'Industrial Labels', subCategory: 'Custom Labels', category: 'stickers-labels' },
          { name: 'Shipping and Mailing Labels', subCategory: 'Custom Labels', category: 'stickers-labels' },
          { name: 'Laptop Skin', subCategory: 'Custom Labels', category: 'stickers-labels' }
        ]
      },
      {
        title: 'Tags',
        items: [
          { name: 'Hang Tags', subCategory: 'Tags', category: 'stickers-labels' },
          { name: 'Folded Hang Tags', subCategory: 'Tags', category: 'stickers-labels' },
          { name: 'Baggage Tags', subCategory: 'Tags', category: 'stickers-labels' },
          { name: 'Name Tags', subCategory: 'Tags', category: 'stickers-labels' },
          { name: 'Raised Foil Hang Tags', isNew: true, subCategory: 'Tags', category: 'stickers-labels' }
        ]
      },
      {
        title: 'Packaging Boxes',
        items: [
          { name: 'Promotional Product Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Tuck Top Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Lock Bottom Boxes', subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Auto Lock Bottom Boxes', subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Chocolate Bar Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Soap Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Pull Out Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Popcorn Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' },
          { name: 'Burger Boxes', isNew: true, subCategory: 'Packaging Boxes', category: 'stickers-labels' }
        ]
      },
      {
        title: 'Newly Launched',
        items: [
          { name: 'Frosted Slider Bags', subCategory: 'Newly Launched', category: 'stickers-labels' },
          { name: 'Holographic Stickers', subCategory: 'Newly Launched', category: 'stickers-labels' },
          { name: 'Metal Stickers', subCategory: 'Newly Launched', category: 'stickers-labels' },
          { name: 'Transparent Seal Bags', subCategory: 'Newly Launched', category: 'stickers-labels' },
          { name: 'Designer Shopping Bags', subCategory: 'Newly Launched', category: 'stickers-labels' },
          { name: 'Roll Label Stickers', isNew: true, subCategory: 'Newly Launched', category: 'stickers-labels' },
          { name: 'Luxury Shopping Bags', isNew: true, subCategory: 'Newly Launched', category: 'stickers-labels' }
        ]
      }
    ]
  },

  // 6. CLOTHING, CAPS & BAGS
  {
    id: 'clothing-caps-bags',
    label: 'Clothing, Caps & Bags',
    shortLabel: 'Apparel & Bags',
    sections: [
      {
        title: 'Custom T-Shirts',
        items: [
          { name: "Men's T-Shirts", subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Polyester T-shirts', subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: "Premium Men's Cotton T-Shirts", subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: "Women's T-Shirts", subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Full Sleeves T-Shirts', subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Limited Edition Cotton T-Shirts', subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Jack and Jones® Printed T-Shirts', subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: "Kid's T-shirts", subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Basic Polyester T-shirts - Colours', subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Mark & Spencer ® Round Neck T-Shirts', isNew: true, subCategory: 'Custom T-Shirts', category: 'clothing-caps-bags' }
        ]
      },
      {
        title: 'Custom Polo T-Shirts',
        items: [
          { name: "Men's Polo T-Shirts", subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Premium Polo T-Shirts', subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: "Men's Scott Polo T-Shirts", subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Puma® Polo T-shirts', subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: "Women's Polo T-shirts", subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: "Women's Scott Polo T-Shirts", subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Parx® Premium Polo T-Shirts', subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Printed Polos - Multi Location', isNew: true, subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Mark & Spencer ® Polo T-Shirts', isNew: true, subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' },
          { name: 'Skechers ® Tipping Polo T-Shirts', subCategory: 'Custom Polo T-Shirts', category: 'clothing-caps-bags' }
        ]
      },
      {
        title: 'Custom Dress Shirts',
        items: [
          { name: "Men's Dress Shirts", subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: "Women's Embroidered Dress Shirts", subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: 'Cambridge® Dress Shirts', subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: "Men's Dress Shirts - Half Sleeves", subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: 'Fil-A-Fil Shirts', isNew: true, subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: 'Mark & Spencer ® Office Shirts', isNew: true, subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: "Men's Arrow® Dress Shirts", subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: 'Park Avenue® Shirts', subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' },
          { name: 'Cambridge® Oxford Dress Shirt', subCategory: 'Custom Dress Shirts', category: 'clothing-caps-bags' }
        ]
      },
      {
        title: 'Custom Bags',
        items: [
          { name: 'Embroidered Laptop Bags', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Harissons® Embroidered Laptop Bags', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'American Tourister® Laptop Bags', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Harissons® Nemesis Office Laptop Bags', isNew: true, subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'American Tourister® Backpacks', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Custom Targus® Intellect Advanced Laptop Bags', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Adidas Duffle Bags', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Waterproof Bag Covers', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Harissons® Dexter Laptop Backpacks', subCategory: 'Custom Bags', category: 'clothing-caps-bags' },
          { name: 'Lavie Sport Duke Laptop Backpacks', isNew: true, subCategory: 'Custom Bags', category: 'clothing-caps-bags' }
        ]
      },
      {
        title: 'Tote Bags',
        items: [
          { name: 'Cotton Tote Bags', subCategory: 'Tote Bags', category: 'clothing-caps-bags' },
          { name: 'Custom Jute Bags', subCategory: 'Tote Bags', category: 'clothing-caps-bags' },
          { name: 'Colored Canvas Tote Bags', subCategory: 'Tote Bags', category: 'clothing-caps-bags' },
          { name: 'Pocket Tote Bags', isNew: true, subCategory: 'Tote Bags', category: 'clothing-caps-bags' },
          { name: 'Premium Jute Bags', isNew: true, subCategory: 'Tote Bags', category: 'clothing-caps-bags' }
        ]
      },
      {
        title: 'Custom Activewear',
        items: [
          { name: 'Sports Jersey', subCategory: 'Custom Activewear', category: 'clothing-caps-bags' },
          { name: 'Custom Polo Jerseys', subCategory: 'Custom Activewear', category: 'clothing-caps-bags' },
          { name: 'India T20 Cricket Fan Jersey', isNew: true, subCategory: 'Custom Activewear', category: 'clothing-caps-bags' },
          { name: 'Personalised Adidas Track Suit', isNew: true, subCategory: 'Custom Activewear', category: 'clothing-caps-bags' },
          { name: 'Personalised U.S. Polo Track Suit', isNew: true, subCategory: 'Custom Activewear', category: 'clothing-caps-bags' }
        ]
      },
      {
        title: 'Custom Caps',
        items: [
          { name: 'Embroidered Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Printed Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Cotton Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Puma Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Embroidered Denim Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Promotional Plain Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Woodland® Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Chef Caps', isNew: true, subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Premium Cotton Caps', subCategory: 'Custom Caps', category: 'clothing-caps-bags' },
          { name: 'Freedom Rain Caps', isNew: true, subCategory: 'Custom Caps', category: 'clothing-caps-bags' }
        ]
      }
    ]
  },

  // 7. MUGS, ALBUMS & GIFTS
  {
    id: 'mugs-albums-gifts',
    label: 'Mugs, Albums & Gifts',
    shortLabel: 'Mugs & Gifts',
    sections: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Photo Albums', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Layflat Photo Albums', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Custom Mouse Pads', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Canvas Prints', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Photo With Frame', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Employee Welcome Kit', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Premium Photo with Frame', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Custom Pen Drive', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Customised Tumblers', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' },
          { name: 'Corporate Gifts', subCategory: 'Bestsellers', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Mugs',
        items: [
          { name: 'Personalised Mugs', subCategory: 'Mugs', category: 'mugs-albums-gifts' },
          { name: 'Colour Changing Magic Mugs', subCategory: 'Mugs', category: 'mugs-albums-gifts' },
          { name: 'Custom Mugs Black', subCategory: 'Mugs', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Gift Hampers',
        items: [
          { name: 'Travel Accessories Hampers', subCategory: 'Gift Hampers', category: 'mugs-albums-gifts' },
          { name: 'Welcome Kit (Polo T-Shirt, Water Bottle, Coffee Mug, Diary, Pen)', subCategory: 'Gift Hampers', category: 'mugs-albums-gifts' },
          { name: 'Hamper with Stainless Steel Bottle, Tea Coaster, White Mug & more', subCategory: 'Gift Hampers', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Custom Magnets',
        items: [
          { name: 'Fridge Magnets', subCategory: 'Custom Magnets', category: 'mugs-albums-gifts' },
          { name: 'Photo Magnets', subCategory: 'Custom Magnets', category: 'mugs-albums-gifts' },
          { name: 'Magnetic Visiting Cards', subCategory: 'Custom Magnets', category: 'mugs-albums-gifts' },
          { name: 'Acrylic Photo Magnets', subCategory: 'Custom Magnets', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Coasters',
        items: [
          { name: 'Customized Coasters', subCategory: 'Coasters', category: 'mugs-albums-gifts' },
          { name: 'Custom Printed Acrylic Coasters', subCategory: 'Coasters', category: 'mugs-albums-gifts' },
          { name: 'Soft Coasters', subCategory: 'Coasters', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Custom Pens',
        items: [
          { name: 'Customized Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Personalised Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Premium Magnetic Metal Roller Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Wooden Finish Metal Ball Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Premium Matte Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Premium Brass Metal Golden Ball Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Triangle Wire Clip Ball Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Submarine Sleek Metal Roller Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Submarine Artistic Plastic Pens with Round Ring', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' },
          { name: 'Premium Brush Stone Black Ballpoint Pens', subCategory: 'Custom Pens', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Looking for more?',
        items: [
          { name: 'Acrylic Photo Blocks', subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Laptop Skins', subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Acrylic Display Stands', subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Acrylic Photo Magnets', subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Acrylic Photo Prints', subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Customized Daily Journal LED Lamp', isNew: true, subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Personalized Wall Clocks', isNew: true, subCategory: 'Looking for more?', category: 'mugs-albums-gifts' },
          { name: 'Round Photo Mouse Pads', isNew: true, subCategory: 'Looking for more?', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Custom Photo Frame',
        items: [
          { name: 'LED Photo Frames', subCategory: 'Custom Photo Frame', category: 'mugs-albums-gifts' },
          { name: 'Acrylic Photo Frame', subCategory: 'Custom Photo Frame', category: 'mugs-albums-gifts' }
        ]
      },
      {
        title: 'Custom Calendars',
        items: [
          { name: 'Desk Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Wall Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Desk Calendar - New Size', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Wall Calendar - New Size', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Magnet Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Flip Desk Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Poster Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Perpetual Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Desk Calendar with Photo Frame', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' },
          { name: 'Four Sheeter Wall Calendars', subCategory: 'Custom Calendars', category: 'mugs-albums-gifts' }
        ]
      }
    ]
  },

  // 8. PENS
  {
    id: 'pens',
    label: 'Pens',
    shortLabel: 'Pens',
    sections: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Customized Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Personalised Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Premium Magnetic Metal Roller Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Submarine Sleek Metal Roller Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Plastic Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Sleek Metal Ballpoint Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Premium Brass Metal Golden Ball Pens', subCategory: 'Bestsellers', category: 'pens' },
          { name: 'Black Matte Ball Pens', subCategory: 'Bestsellers', category: 'pens' }
        ]
      },
      {
        title: 'Value Pens',
        items: [
          { name: 'Triangle Wire Clip Ball Pens', subCategory: 'Value Pens', category: 'pens' },
          { name: 'Grand Opaque Ballpoint Pen', subCategory: 'Value Pens', category: 'pens' },
          { name: 'New Getz Cap-Type Ballpoint Pens', subCategory: 'Value Pens', category: 'pens' },
          { name: 'Twist Plastic Ball Pens', subCategory: 'Value Pens', category: 'pens' },
          { name: 'New Cap Plastic Ball Pens', subCategory: 'Value Pens', category: 'pens' },
          { name: 'Getz Opaque Push Type Ballpoint Pen', subCategory: 'Value Pens', category: 'pens' },
          { name: 'Custom Full White Ball Pens', isNew: true, subCategory: 'Value Pens', category: 'pens' },
          { name: 'White Opaque Assorted Color Pens', subCategory: 'Value Pens', category: 'pens' }
        ]
      },
      {
        title: 'Executive Pens',
        items: [
          { name: 'Submarine Sleek Metal Roller Pens', subCategory: 'Executive Pens', category: 'pens' },
          { name: 'Submarine Artistic Plastic Pens with Round Ring', subCategory: 'Executive Pens', category: 'pens' },
          { name: 'Submarine Mini Flat Clip Rose Gold Tip Metal Pens', subCategory: 'Executive Pens', category: 'pens' },
          { name: 'Executive Metal Ball Pen', subCategory: 'Executive Pens', category: 'pens' },
          { name: 'Black Matte Roller Pens', subCategory: 'Executive Pens', category: 'pens' },
          { name: 'Submarine Premium Xylo Steel Finish Roller Pens', subCategory: 'Executive Pens', category: 'pens' },
          { name: 'Submarine Gold Plated Ball Pens', subCategory: 'Executive Pens', category: 'pens' }
        ]
      },
      {
        title: 'Premium Pens',
        items: [
          { name: 'Premium Matte Pens', subCategory: 'Premium Pens', category: 'pens' },
          { name: 'Black Matte Ball Pens', subCategory: 'Premium Pens', category: 'pens' },
          { name: 'Premium Brush Stone Black Ballpoint Pens', subCategory: 'Premium Pens', category: 'pens' },
          { name: 'Submarine Roller Pens with Swarovski Crystal', subCategory: 'Premium Pens', category: 'pens' },
          { name: 'Marble Design Metal Ball Pens', subCategory: 'Premium Pens', category: 'pens' },
          { name: 'Submarine Fountain Pens', subCategory: 'Premium Pens', category: 'pens' },
          { name: 'Submarine Liberty Watermark Ball Pens', subCategory: 'Premium Pens', category: 'pens' }
        ]
      },
      {
        title: 'Luxury Pens',
        items: [
          { name: 'Parker Odyssey Laque Black Gold Trim Roller Ball Pen', subCategory: 'Luxury Pens', category: 'pens' },
          { name: 'Parker Odyssey Laque Black Chrome Trim Ball Pen', subCategory: 'Luxury Pens', category: 'pens' },
          { name: 'SwissBrand ® Legacy Trim Roller Ball Pens', subCategory: 'Luxury Pens', category: 'pens' },
          { name: 'SwissBrand ® Eternia Fountain Pens', subCategory: 'Luxury Pens', category: 'pens' },
          { name: 'SwissBrand ® Zenith Trim Roller Ball Pens', subCategory: 'Luxury Pens', category: 'pens' },
          { name: 'Parker Aster Deluxe Roller Ball Pens', subCategory: 'Luxury Pens', category: 'pens' }
        ]
      },
      {
        title: 'Newly Launched',
        items: [
          { name: 'Promotional Pens', subCategory: 'Newly Launched', category: 'pens' },
          { name: 'Gold Click Pens', subCategory: 'Newly Launched', category: 'pens' },
          { name: 'Bulk Ball Pens', subCategory: 'Newly Launched', category: 'pens' },
          { name: 'Green with Silver Ball Pens', subCategory: 'Newly Launched', category: 'pens' },
          { name: 'Multicolor Ball Pens', subCategory: 'Newly Launched', category: 'pens' }
        ]
      }
    ]
  },

  // 9. DRINKWARE
  {
    id: 'drinkware',
    label: 'Drinkware',
    shortLabel: 'Drinkware',
    sections: [
      {
        title: 'BestSellers',
        items: [
          { name: 'Custom Water Bottles', subCategory: 'BestSellers', category: 'drinkware' },
          { name: 'Customised Tumblers', subCategory: 'BestSellers', category: 'drinkware' },
          { name: 'Cello Duro Kent Water Bottles', subCategory: 'BestSellers', category: 'drinkware' },
          { name: 'Temperature Display Bottles', subCategory: 'BestSellers', category: 'drinkware' },
          { name: 'Stainless Steel Sipper Bottles', subCategory: 'BestSellers', category: 'drinkware' }
        ]
      },
      {
        title: 'Water Bottles',
        items: [
          { name: 'Custom Sipper Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Vacuum Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Cello Swift Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Inox Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Gym Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Thermal Suction Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Pexpo Flamingo Vacuum Bottles', subCategory: 'Water Bottles', category: 'drinkware' },
          { name: 'Matt Black Stainless Steel Bottles', isNew: true, subCategory: 'Water Bottles', category: 'drinkware' }
        ]
      },
      {
        title: 'Sippers & Tumblers',
        items: [
          { name: 'Personalised Skinny Tumbler 600ml', subCategory: 'Sippers & Tumblers', category: 'drinkware' },
          { name: 'Aluminium Water Bottles', subCategory: 'Sippers & Tumblers', category: 'drinkware' },
          { name: 'Wine Tumbler', subCategory: 'Sippers & Tumblers', category: 'drinkware' },
          { name: 'Personalized Travel Tumbler', subCategory: 'Sippers & Tumblers', category: 'drinkware' },
          { name: 'Pexpo Cocoa Vacuum Steel Tumblers', isNew: true, subCategory: 'Sippers & Tumblers', category: 'drinkware' },
          { name: 'Pexpo Stanzy Tumblers', subCategory: 'Sippers & Tumblers', category: 'drinkware' }
        ]
      },
      {
        title: 'Looking for more?',
        items: [
          { name: 'Vacuum Insulation Cup', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Water Bottle with Wireless Speaker', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Cello Flip Style Water Flasks', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Insulated Vacuum Coffee Flasks', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Frosted Beer Mugs', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Hip Flask - 7 OZ - Black', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Printed Cola Bottles 600ml', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Custom Matt Vacuum Bottles', subCategory: 'Looking for more?', category: 'drinkware' },
          { name: 'Vacuum Coffee Mugs', isNew: true, subCategory: 'Looking for more?', category: 'drinkware' }
        ]
      },
      {
        title: 'New in Drinkware',
        items: [
          { name: 'Temperature Display Mugs', subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Customised Beer Mugs', subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Personalised Champagne Glasses', subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Personalised Wine Glasses', subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Personalised Vacuum Insulated Tumbler', subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Pexpo Austin Steel Water Bottles', isNew: true, subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Pexpo Cameo Compact Steel Bottles', isNew: true, subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Pexpo Morocco Thermo Steel Bottles', isNew: true, subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Pexpo Orio Thermo Steel Bottles', isNew: true, subCategory: 'New in Drinkware', category: 'drinkware' },
          { name: 'Pexpo Bravo Vacuum Bottles', isNew: true, subCategory: 'New in Drinkware', category: 'drinkware' }
        ]
      }
    ]
  },

  // 10. STAMPS AND INK
  {
    id: 'stamps-ink',
    label: 'Stamps and Ink',
    shortLabel: 'Stamps & Ink',
    sections: [
      {
        title: 'Stamps and Ink',
        items: [
          { name: 'Self Inking Stamps', subCategory: 'Stamps and Ink', category: 'stamps-ink' },
          { name: 'Basic Rubber Stamps', subCategory: 'Stamps and Ink', category: 'stamps-ink' },
          { name: 'Pocket Stamps', subCategory: 'Stamps and Ink', category: 'stamps-ink' },
          { name: 'Name Stamps', subCategory: 'Stamps and Ink', category: 'stamps-ink' },
          { name: 'Paper Embosser', subCategory: 'Stamps and Ink', category: 'stamps-ink' }
        ]
      }
    ]
  },

  // 11. CUSTOM WINTERWEAR
  {
    id: 'custom-winterwear',
    label: 'Custom Winterwear',
    shortLabel: 'Winterwear',
    featuredImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
    sections: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Customised Hoodies', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Fleece Jackets', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Puffer Jackets', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Winter Jacket - Sleeveless', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Custom Adidas® Hoodies', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'High Neck Jacket', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Hooded Crewneck Sweatshirts', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Scott I-Dry Jackets', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Fleece Pullover Jackets', subCategory: 'Bestsellers', category: 'custom-winterwear' },
          { name: 'Beanies Caps', subCategory: 'Bestsellers', category: 'custom-winterwear' }
        ]
      },
      {
        title: 'Branded',
        items: [
          { name: 'Scott Sleeveless Jackets', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'Adidas® Jackets', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: "Levi's® High Neck Zipper Jackets", subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'AWG Sport Varsity Winter Jackets', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: "Levi's® Zipper Hoodies", subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'Torch Jacket', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'Indian Terrain Bomber Jackets', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'Scott Stripe Jackets', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'Swiss Military® Hoodies', subCategory: 'Branded', category: 'custom-winterwear' },
          { name: 'Pepe Jeans® Piccadilly Jackets', isNew: true, subCategory: 'Branded', category: 'custom-winterwear' }
        ]
      },
      {
        title: 'Hoodies & Sweatshirts',
        items: [
          { name: 'Zero Degree Hoodie Sweatshirt', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Crewneck Sweatshirts', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Embroidered Sleeveless Sweaters', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Embroidered Sweaters', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Zero Degree Pullover Sweatshirt with Hood', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Premium Sweatshirt with Hood', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'North Pole High Neck Sweatshirt', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Swiss Military® Zipper Hoodies', isNew: true, subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Marks & Spencer® Full-Zip Hoodies', isNew: true, subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' },
          { name: 'Zero Degree Crew Neck Sweatshirts', subCategory: 'Hoodies & Sweatshirts', category: 'custom-winterwear' }
        ]
      },
      {
        title: 'Jackets & Outerwear',
        items: [
          { name: 'Sleeveless Winter Jackets - Multi Location', subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'Indian Terrain Zipper Lycra Jackets', subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: "Women's Puffer Jacket", subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'AWG JKT 4 Jacket', subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'Foldable Waterproof Jackets', subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'Winbarg Bonded Fleece Jacket', subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'Swiss Military® Alpine Full Zipper Jackets', isNew: true, subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'Convertible Zipper Hoodie Jackets', subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: 'Ranger Full-Zip Jackets', isNew: true, subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' },
          { name: "Scott Men's Casual Winter Jackets", subCategory: 'Jackets & Outerwear', category: 'custom-winterwear' }
        ]
      },
      {
        title: 'Explore More',
        items: [
          { name: 'Fleece Jackets - Multi Location', subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Embroidered Hoodies - Multi Location', subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Oversized Hoodies', subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Terry Zipper Jacket', subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: "Men's Sleeveless Puffer Jacket", subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: "Men's Puffer Jackets - Multi Location", subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Cosmo Full-Zip Hoodies', isNew: true, subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Bulk Hoodies', subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Eco Square Winter Scarfs', isNew: true, subCategory: 'Explore More', category: 'custom-winterwear' },
          { name: 'Eco Square Bandanas', isNew: true, subCategory: 'Explore More', category: 'custom-winterwear' }
        ]
      }
    ]
  }
];

// Helper to convert a string to slug
const toSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Generates default price based on product category & name
const getSuggestedPrice = (name: string, cat: ProductCategory): { price: number; original: number; minQty: number; unitLabel: string } => {
  const n = name.toLowerCase();
  
  if (n.includes('visiting card') || (cat === 'visiting-cards' && !n.includes('holder') && !n.includes('logo') && !n.includes('service'))) {
    if (n.includes('uv') || n.includes('foil') || n.includes('velvet') || n.includes('pearl') || n.includes('diamond') || n.includes('kraft')) {
      return { price: 499, original: 799, minQty: 100, unitLabel: 'Pack of 100' };
    }
    return { price: 200, original: 350, minQty: 100, unitLabel: 'Pack of 100' };
  }
  if (n.includes('holder')) {
    return { price: 249, original: 399, minQty: 1, unitLabel: '1 Piece' };
  }
  if (n.includes('standee') || n.includes('banner') || n.includes('canopy') || n.includes('backdrop') || n.includes('display')) {
    return { price: 1199, original: 1899, minQty: 1, unitLabel: '1 Unit' };
  }
  if (n.includes('stamp') || n.includes('embosser')) {
    return { price: 299, original: 499, minQty: 1, unitLabel: '1 Stamp' };
  }
  if (n.includes('calendar') || n.includes('diary') || n.includes('planner')) {
    return { price: 349, original: 599, minQty: 1, unitLabel: '1 Unit' };
  }
  if (n.includes('parker') || n.includes('swissbrand') || n.includes('luxury')) {
    return { price: 899, original: 1499, minQty: 1, unitLabel: '1 Pen' };
  }
  if (n.includes('pen')) {
    return { price: 199, original: 350, minQty: 1, unitLabel: '1 Pen' };
  }
  if (n.includes('jacket') || n.includes('track suit') || n.includes('hoodie')) {
    return { price: 1299, original: 2199, minQty: 1, unitLabel: '1 Piece' };
  }
  if (n.includes('shirt') || n.includes('polo') || n.includes('jersey') || n.includes('t-shirt')) {
    return { price: 549, original: 899, minQty: 1, unitLabel: '1 Piece' };
  }
  if (n.includes('backpack') || n.includes('duffle') || n.includes('laptop bag')) {
    return { price: 1299, original: 1999, minQty: 1, unitLabel: '1 Bag' };
  }
  if (n.includes('tote') || n.includes('jute')) {
    return { price: 199, original: 350, minQty: 1, unitLabel: '1 Bag' };
  }
  if (n.includes('cap')) {
    return { price: 249, original: 450, minQty: 1, unitLabel: '1 Cap' };
  }
  if (n.includes('bottle') || n.includes('flask') || n.includes('pexpo') || n.includes('sipper') || n.includes('tumbler')) {
    return { price: 499, original: 899, minQty: 1, unitLabel: '1 Piece' };
  }
  if (n.includes('mug')) {
    return { price: 299, original: 499, minQty: 1, unitLabel: '1 Mug' };
  }
  if (n.includes('box')) {
    return { price: 45, original: 75, minQty: 50, unitLabel: 'Pack of 50' };
  }
  if (n.includes('sticker') || n.includes('label')) {
    return { price: 149, original: 299, minQty: 50, unitLabel: 'Pack of 50' };
  }
  if (n.includes('tag')) {
    return { price: 199, original: 350, minQty: 100, unitLabel: 'Pack of 100' };
  }
  if (n.includes('hamper') || n.includes('welcome kit')) {
    return { price: 1499, original: 2499, minQty: 1, unitLabel: '1 Kit' };
  }
  if (n.includes('frame') || n.includes('album') || n.includes('plaque') || n.includes('canvas')) {
    return { price: 699, original: 1199, minQty: 1, unitLabel: '1 Piece' };
  }
  return { price: 299, original: 499, minQty: 1, unitLabel: '1 Unit' };
};

// Generate all products WITHOUT images for all items in the mega menu
export const GENERATED_EMPTY_IMAGE_PRODUCTS: Product[] = (() => {
  const products: Product[] = [];
  const seenIds = new Set<string>();

  for (const cat of MEGA_MENU_CATEGORIES) {
    for (const section of cat.sections) {
      for (const item of section.items) {
        // Skip generic "Shop all..." links as products
        if (item.name.toLowerCase().startsWith('shop all')) continue;

        const slug = toSlug(item.name);
        const id = `${cat.id}-${slug}`;

        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const pricing = getSuggestedPrice(item.name, item.category);

        products.push({
          id,
          name: item.name,
          slug,
          category: item.category,
          subCategory: item.subCategory,
          sectionCollection: item.isNew ? 'new-arrivals' : 'popular',
          price: pricing.price,
          originalPrice: pricing.original,
          rating: 4.85,
          reviewsCount: 18,
          bulkPricingBadge: `BUY ${pricing.minQty} @ Rs.${pricing.price}`,
          minQuantity: pricing.minQty,
          unitLabel: pricing.unitLabel,
          badge: item.isNew ? 'NEW' : undefined,
          tag: item.isNew ? 'New Addition' : 'Popular Choice',
          shortDescription: `${item.name} custom crafted with precision at Instaprint Baranagar Studio.`,
          description: `Custom ${item.name} for business and personal branding. High-definition commercial printing with rich color reproduction and durable premium materials. Ready for fast store pickup or courier delivery.`,
          // Explicitly empty image per user instructions:
          // "add all product without images, every product need to editable from admin panel.. add product without images, when admin add images then this product can buy a user, untill product buy btn is not working, after upload product image buy btn working"
          image: '',
          gallery: [],
          turnaround: '24-48 Hours Express Dispatch',
          materials: 'Archival Cast Media & Premium Stock',
          features: [
            'Ultra-vibrant 1200 DPI commercial offset/UV print',
            'Full customization support with logo & text etching',
            'Same-day store counter pickup available at Shop 106/B'
          ],
          inStock: true,
          isFeatured: false,
          allowCustomPhoto: true,
          allowCustomText: true
        });
      }
    }
  }

  return products;
})();
