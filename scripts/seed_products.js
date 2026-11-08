import { createServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, collection, getDocs } from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDTUNg5I_bukvBhRUasfvcjrK_fnlmRjVg",
  authDomain: "instaprint-b374d.firebaseapp.com",
  projectId: "instaprint-b374d",
  storageBucket: "instaprint-b374d.firebasestorage.app",
  messagingSenderId: "197899370662",
  appId: "1:197899370662:web:08af1b14b31d1fa8f3f467"
};

async function main() {
  console.log("Connecting to Cloud Firestore (instaprint-b374d)...");
  const app = initializeApp(config);
  const db = getFirestore(app);

  console.log("Loading products catalog via Vite...");
  const server = await createServer();
  const mod = await server.ssrLoadModule("./src/data/navigationCatalog.ts");
  const products = mod.GENERATED_EMPTY_IMAGE_PRODUCTS;
  await server.close();

  console.log(`Loaded ${products.length} products. Starting batch writes...`);

  const chunkSize = 200;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    for (const item of chunk) {
      const docRef = doc(db, "products", item.id);
      batch.set(docRef, JSON.parse(JSON.stringify(item)), { merge: true });
    }
    console.log(`Writing batch ${i / chunkSize + 1} (${chunk.length} products)...`);
    await batch.commit();
    console.log(`Batch ${i / chunkSize + 1} committed successfully!`);
  }

  // Verify count in Firestore
  const snap = await getDocs(collection(db, "products"));
  console.log(`VERIFICATION COMPLETE: Total products now in Cloud Firestore: ${snap.size}`);
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error during Firestore seeding:", err);
  process.exit(1);
});
