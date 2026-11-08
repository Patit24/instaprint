/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_USERNAME?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_STORE_NAME?: string;
  readonly VITE_STORE_PHONE?: string;
  readonly VITE_STORE_WHATSAPP?: string;
  readonly VITE_STORE_EMAIL?: string;
  readonly VITE_STORE_ADDRESS?: string;
  readonly VITE_STORE_CITY?: string;
  readonly VITE_STORE_STATE?: string;
  readonly VITE_STORE_PINCODE?: string;
  readonly VITE_STORE_HOURS_WEEKDAY?: string;
  readonly VITE_STORE_HOURS_SUNDAY?: string;
  readonly VITE_UPI_ID?: string;
  readonly VITE_UPI_PAYEE_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
