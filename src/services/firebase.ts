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
import { Product } from "../types";

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDTUNg5I_bukvBhRUasfvcjrK_fnlmRjVg",
  authDomain: "instaprint-b374d.firebaseapp.com",
  projectId: "instaprint-b374d",
  storageBucket: "instaprint-b374d.firebasestorage.app",
  messagingSenderId: "197899370662",
  appId: "1:197899370662:web:08af1b14b31d1fa8f3f467",
  measurementId: "G-DEXEE1V905"
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
 * Seed initial catalog to Firestore if the collection is empty
 */
export const seedInitialCatalogToFirestore = async (defaultProducts: Product[]): Promise<boolean> => {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCol, limit(1));
    const checkSnap = await getDocs(q);
    
    if (checkSnap.empty && defaultProducts.length > 0) {
      console.log(`[Firestore] Seeding ${defaultProducts.length} initial products to Firestore...`);
      // Use batches of 450 (Firestore limit is 500 per batch)
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
  } catch (error) {
    console.warn("[Firestore] Auto-seed failed or skipped (network/rules):", error);
    return false;
  }
};
