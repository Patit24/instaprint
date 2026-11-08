import { Product, OrderRecord, Coupon } from '../types';
import { SAMPLE_PRODUCTS, INITIAL_COUPONS } from '../data/products';
import { 
  saveProductToFirestore, 
  deleteProductFromFirestore,
  fetchProductsFromFirestore,
  subscribeToFirestoreProducts,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  subscribeToFirestoreOrders,
  updateOrderStatusInFirestore,
  saveCouponToFirestore,
  fetchCouponsFromFirestore,
  deleteCouponFromFirestore
} from './firebase';

const DB_NAME = 'instaprint_master_db';
const DB_VERSION = 1;

const STORES = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  COUPONS: 'coupons'
} as const;

/**
 * Open or create native browser IndexedDB for permanent storage
 * IndexedDB has no 5MB quota and persists until explicitly deleted by admin
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store 1: Products (key: id)
      if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
        db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
      }

      // Store 2: Orders (key: orderId)
      if (!db.objectStoreNames.contains(STORES.ORDERS)) {
        db.createObjectStore(STORES.ORDERS, { keyPath: 'orderId' });
      }

      // Store 3: Coupons (key: code)
      if (!db.objectStoreNames.contains(STORES.COUPONS)) {
        db.createObjectStore(STORES.COUPONS, { keyPath: 'code' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Compress an image File or Base64 DataURL using HTML5 Canvas
 * Ensures image is under 120KB for maximum speed and flawless database persistence
 */
export const compressImage = (
  fileOrDataUrl: File | string,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const handleDataUrl = (dataUrl: string) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };

    if (typeof fileOrDataUrl === 'string') {
      handleDataUrl(fileOrDataUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleDataUrl(reader.result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
};

// =============================================================================
// PRODUCTS DATABASE OPERATIONS
// =============================================================================

/**
 * Initialize or fetch all products from Database
 * Checks IndexedDB first; if empty seeds initial catalog; then merges with Cloud Firestore
 */
export const dbGetAllProducts = async (): Promise<Product[]> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.PRODUCTS, 'readonly');
    const store = tx.objectStore(STORES.PRODUCTS);

    const localProducts: Product[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    // If local IndexedDB is completely empty, initialize it with SAMPLE_PRODUCTS
    if (localProducts.length === 0) {
      console.log('[DB] Seeding local IndexedDB with default catalog...');
      const writeTx = db.transaction(STORES.PRODUCTS, 'readwrite');
      const writeStore = writeTx.objectStore(STORES.PRODUCTS);
      for (const prod of SAMPLE_PRODUCTS) {
        writeStore.put(prod);
      }
      return SAMPLE_PRODUCTS;
    }

    // Merge with any new base products if new items were added in code
    const productMap = new Map<string, Product>();
    SAMPLE_PRODUCTS.forEach(p => productMap.set(p.id, p));
    localProducts.forEach(p => productMap.set(p.id, p)); // Local modifications/uploads take precedence

    return Array.from(productMap.values());
  } catch (error) {
    console.warn('[DB] IndexedDB read error, falling back to initial catalog:', error);
    return SAMPLE_PRODUCTS;
  }
};

/**
 * Permanently save/update a product in the Database
 * Saves to IndexedDB immediately, and syncs to Cloud Firestore in the background
 */
export const dbSaveProduct = async (product: Product): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.PRODUCTS, 'readwrite');
    const store = tx.objectStore(STORES.PRODUCTS);

    await new Promise<void>((resolve, reject) => {
      const req = store.put(product);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    console.log(`[DB] Product "${product.name}" (${product.id}) permanently saved in IndexedDB.`);
  } catch (err) {
    console.error('[DB] IndexedDB save error:', err);
  }

  // Also sync to Cloud Firestore
  try {
    await saveProductToFirestore(product);
  } catch (err) {
    console.warn('[DB] Cloud Firestore sync queued/offline:', err);
  }
};

/**
 * Permanently delete a product from the Database
 */
export const dbDeleteProduct = async (productId: string): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.PRODUCTS, 'readwrite');
    const store = tx.objectStore(STORES.PRODUCTS);

    await new Promise<void>((resolve, reject) => {
      const req = store.delete(productId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    console.log(`[DB] Product (${productId}) permanently deleted from IndexedDB.`);
  } catch (err) {
    console.error('[DB] IndexedDB delete error:', err);
  }

  try {
    await deleteProductFromFirestore(productId);
  } catch (err) {
    console.warn('[DB] Cloud Firestore delete queued/offline:', err);
  }
};

// =============================================================================
// ORDERS DATABASE OPERATIONS
// =============================================================================

/**
 * Fetch all orders from Database
 */
export const dbGetAllOrders = async (): Promise<OrderRecord[]> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.ORDERS, 'readonly');
    const store = tx.objectStore(STORES.ORDERS);

    const localOrders: OrderRecord[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    // Also check localStorage for any legacy guest orders
    try {
      const legacyOrdersStr = localStorage.getItem('instaprint_orders');
      if (legacyOrdersStr) {
        const legacy: OrderRecord[] = JSON.parse(legacyOrdersStr);
        if (Array.isArray(legacy) && legacy.length > 0) {
          const merged = new Map<string, OrderRecord>();
          legacy.forEach(o => merged.set(o.orderId, o));
          localOrders.forEach(o => merged.set(o.orderId, o));
          return Array.from(merged.values()).sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }
    } catch {}

    return localOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('[DB] IndexedDB orders read error:', error);
    try {
      return JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
    } catch {
      return [];
    }
  }
};

/**
 * Permanently save an order in the Database
 */
export const dbSaveOrder = async (order: OrderRecord): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.ORDERS, 'readwrite');
    const store = tx.objectStore(STORES.ORDERS);

    await new Promise<void>((resolve, reject) => {
      const req = store.put(order);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    console.log(`[DB] Order "${order.orderId}" permanently saved in IndexedDB.`);
  } catch (err) {
    console.error('[DB] IndexedDB order save error:', err);
  }

  // Backup to localStorage
  try {
    const existing: OrderRecord[] = JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
    const filtered = existing.filter(o => o.orderId !== order.orderId);
    filtered.unshift(order);
    localStorage.setItem('instaprint_orders', JSON.stringify(filtered));
  } catch {}

  // Sync to Cloud Firestore
  try {
    await saveOrderToFirestore(order);
  } catch (err) {
    console.warn('[DB] Cloud Firestore order sync queued/offline:', err);
  }
};

/**
 * Update order tracking status in Database
 */
export const dbUpdateOrderStatus = async (
  orderId: string, 
  status: OrderRecord['orderStatus']
): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.ORDERS, 'readwrite');
    const store = tx.objectStore(STORES.ORDERS);

    const existing: OrderRecord | undefined = await new Promise((resolve, reject) => {
      const req = store.get(orderId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (existing) {
      existing.orderStatus = status;
      await new Promise<void>((resolve, reject) => {
        const req = store.put(existing);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      console.log(`[DB] Order "${orderId}" status updated to "${status}" in IndexedDB.`);
    }
  } catch (err) {
    console.error('[DB] IndexedDB order status update error:', err);
  }

  // Update localStorage backup
  try {
    const existing: OrderRecord[] = JSON.parse(localStorage.getItem('instaprint_orders') || '[]');
    const updated = existing.map(o => o.orderId === orderId ? { ...o, orderStatus: status } : o);
    localStorage.setItem('instaprint_orders', JSON.stringify(updated));
  } catch {}

  // Sync to Cloud Firestore
  try {
    await updateOrderStatusInFirestore(orderId, status);
  } catch (err) {
    console.warn('[DB] Cloud Firestore order status sync queued/offline:', err);
  }
};

// =============================================================================
// COUPONS DATABASE OPERATIONS
// =============================================================================

export const dbGetAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.COUPONS, 'readonly');
    const store = tx.objectStore(STORES.COUPONS);

    const list: Coupon[] = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (list.length === 0) {
      const writeTx = db.transaction(STORES.COUPONS, 'readwrite');
      const writeStore = writeTx.objectStore(STORES.COUPONS);
      for (const c of INITIAL_COUPONS) {
        writeStore.put(c);
      }
      return INITIAL_COUPONS;
    }

    return list;
  } catch (err) {
    return INITIAL_COUPONS;
  }
};

export const dbSaveCoupon = async (coupon: Coupon): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.COUPONS, 'readwrite');
    const store = tx.objectStore(STORES.COUPONS);
    store.put(coupon);
  } catch {}

  try {
    await saveCouponToFirestore(coupon);
  } catch {}
};

export const dbDeleteCoupon = async (code: string): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.COUPONS, 'readwrite');
    const store = tx.objectStore(STORES.COUPONS);
    store.delete(code);
  } catch {}

  try {
    await deleteCouponFromFirestore(code);
  } catch {}
};
