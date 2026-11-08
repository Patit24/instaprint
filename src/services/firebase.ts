import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  query,
  limit
} from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { Product, OrderRecord, Coupon } from "../types";

// User's Firebase Configuration (reads from .env with verified fallbacks)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDTUNg5I_bukvBhRUasfvcjrK_fnlmRjVg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "instaprint-b374d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "instaprint-b374d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "instaprint-b374d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "197899370662",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:197899370662:web:08af1b14b31d1fa8f3f467",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEXEE1V905"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics safely with dynamic import so browser AdBlock extensions don't block the app
export let analytics: any = null;
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) => {
      isSupported()
        .then((supported) => {
          if (supported) {
            analytics = getAnalytics(app);
          }
        })
        .catch(() => {
          // Fallback if not supported
        });
    })
    .catch(() => {
      // AdBlock blocked analytics script - ignored safely so app never crashes
    });
}

/**
 * Checks if a product has an actual image uploaded by admin
 */
export const hasProductImage = (product?: Product | null): boolean => {
  if (!product || !product.image) return false;
  const img = product.image.trim();
  if (img === '' || img === '#' || img.includes('placeholder-empty')) return false;
  return true;
};

/**
 * Checks if a product can be bought by a user
 * Per user requirement:
 * "add product without images, when admin add images then this product can buy a user, untill product buy btn is not working, after upload product image buy btn working"
 */
export const isProductBuyable = (product?: Product | null): boolean => {
  if (!product) return false;
  if (!hasProductImage(product)) return false;
  if (product.inStock === false) return false;
  return true;
};

const PRODUCTS_COLLECTION = "products";

/**
 * Fetch all products from Cloud Firestore
 */
export const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      return [];
    }
    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push(docSnap.data() as Product);
    });
    return products;
  } catch (error) {
    console.warn("Firestore fetch error, falling back to local cache:", error);
    return [];
  }
};

/**
 * Real-time listener for Firestore products collection
 */
export const subscribeToFirestoreProducts = (
  onProducts: (products: Product[]) => void,
  onError?: (error: any) => void
): (() => void) => {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      productsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Product);
          });
          onProducts(list);
        }
      },
      (err) => {
        console.warn("Firestore onSnapshot error:", err);
        if (onError) onError(err);
      }
    );
  } catch (error) {
    console.warn("Failed to set up Firestore onSnapshot listener:", error);
    return () => {};
  }
};

/**
 * Save or update a product in Cloud Firestore
 */
export const saveProductToFirestore = async (product: Product): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    // Sanitize undefined fields for Firestore
    const sanitized = JSON.parse(JSON.stringify(product));
    await setDoc(docRef, sanitized, { merge: true });
    console.log(`[Firestore] Product "${product.name}" (${product.id}) saved successfully.`);
  } catch (error) {
    console.error("[Firestore] Error saving product to Firestore:", error);
    throw error;
  }
};

/**
 * Delete a product from Cloud Firestore
 */
export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Product (${productId}) deleted successfully.`);
  } catch (error) {
    console.error("[Firestore] Error deleting product from Firestore:", error);
    throw error;
  }
};

/**
 * Upload a product image to Firebase Storage (or data URL fallback)
 */
export const uploadProductImageToFirebase = async (
  productId: string,
  dataUrl: string
): Promise<string> => {
  try {
    // If it's a base64 Data URL, try uploading to Firebase Storage
    if (dataUrl.startsWith("data:image/")) {
      const timestamp = Date.now();
      const storageRef = ref(storage, `products/${productId}-${timestamp}.jpg`);
      await uploadString(storageRef, dataUrl, "data_url");
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("[Firebase Storage] Image uploaded successfully:", downloadUrl);
      return downloadUrl;
    }
    return dataUrl;
  } catch (error) {
    console.warn("[Firebase Storage] Direct storage upload error, using compressed data URL:", error);
    // If storage permissions restrict public upload or offline, return the high-efficiency dataUrl
    return dataUrl;
  }
};

/**
 * Seed initial catalog to Firestore if the collection is empty or if forced
 */
export const seedInitialCatalogToFirestore = async (defaultProducts: Product[], force: boolean = false): Promise<boolean> => {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    let shouldSeed = force;
    if (!shouldSeed) {
      const q = query(productsCol, limit(1));
      const checkSnap = await getDocs(q);
      shouldSeed = checkSnap.empty;
    }
    
    if (shouldSeed && defaultProducts.length > 0) {
      console.log(`[Firestore] Seeding ${defaultProducts.length} products to Cloud Firestore...`);
      // Use batches of 400 (Firestore limit is 500 per batch)
      const chunkSize = 400;
      for (let i = 0; i < defaultProducts.length; i += chunkSize) {
        const chunk = defaultProducts.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        for (const item of chunk) {
          const docRef = doc(db, PRODUCTS_COLLECTION, item.id);
          batch.set(docRef, JSON.parse(JSON.stringify(item)), { merge: true });
        }
        await batch.commit();
      }
      console.log("[Firestore] Seeding completed successfully!");
      return true;
    }
    return false;
  } catch (error: any) {
    console.error("[Firestore] Seed error:", error);
    if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions') || error?.message?.includes('PERMISSION_DENIED')) {
      throw new Error("Firestore Permission Denied: Please open Firebase Console -> Rules tab and publish 'allow read, write: if true;'");
    }
    throw error;
  }
};

// =============================================================================
// ORDERS CLOUD FIRESTORE OPERATIONS
// =============================================================================

const ORDERS_COLLECTION = "orders";

export const saveOrderToFirestore = async (order: OrderRecord): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.orderId);
    const sanitized = JSON.parse(JSON.stringify(order));
    await setDoc(docRef, sanitized, { merge: true });
    console.log(`[Firestore] Order "${order.orderId}" saved to Cloud Firestore.`);
  } catch (error) {
    console.warn("[Firestore] Error saving order to Firestore:", error);
    throw error;
  }
};

export const fetchOrdersFromFirestore = async (): Promise<OrderRecord[]> => {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(ordersCol);
    if (snapshot.empty) return [];
    const list: OrderRecord[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as OrderRecord);
    });
    return list;
  } catch (error) {
    console.warn("[Firestore] Error fetching orders from Firestore:", error);
    return [];
  }
};

export const subscribeToFirestoreOrders = (
  onOrders: (orders: OrderRecord[]) => void,
  onError?: (err: any) => void
): (() => void) => {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: OrderRecord[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as OrderRecord);
          });
          onOrders(list);
        }
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (error) {
    return () => {};
  }
};

export const updateOrderStatusInFirestore = async (
  orderId: string,
  status: OrderRecord['orderStatus']
): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, { orderStatus: status, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn("[Firestore] Error updating order status:", error);
  }
};

// =============================================================================
// COUPONS CLOUD FIRESTORE OPERATIONS
// =============================================================================

const COUPONS_COLLECTION = "coupons";

export const saveCouponToFirestore = async (coupon: Coupon): Promise<void> => {
  try {
    const docRef = doc(db, COUPONS_COLLECTION, coupon.code);
    await setDoc(docRef, JSON.parse(JSON.stringify(coupon)), { merge: true });
  } catch (error) {
    console.warn("[Firestore] Error saving coupon:", error);
  }
};

export const fetchCouponsFromFirestore = async (): Promise<Coupon[]> => {
  try {
    const col = collection(db, COUPONS_COLLECTION);
    const snapshot = await getDocs(col);
    if (snapshot.empty) return [];
    const list: Coupon[] = [];
    snapshot.forEach(d => list.push(d.data() as Coupon));
    return list;
  } catch (error) {
    return [];
  }
};

export const deleteCouponFromFirestore = async (code: string): Promise<void> => {
  try {
    const docRef = doc(db, COUPONS_COLLECTION, code);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("[Firestore] Error deleting coupon:", error);
  }
};
