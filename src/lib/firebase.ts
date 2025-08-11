// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  inMemoryPersistence,
  signInWithPopup,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics in browser environment and when supported
let analytics;
if (typeof window !== "undefined") {
  // Some browsers (Safari Private Mode, iOS) don't support Analytics. Guard it.
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // No-op: analytics not supported in this environment
    });
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Prefer IndexedDB persistence (more reliable on Safari/iOS). Fallbacks keep auth usable.
if (typeof window !== "undefined") {
  setPersistence(auth, indexedDBLocalPersistence)
    .catch(() => setPersistence(auth, browserLocalPersistence))
    .catch(() => setPersistence(auth, inMemoryPersistence))
    .catch(() => {
      // Final fallback failed; allow Firebase to use default in-memory behavior
    });
}

const googleProvider = new GoogleAuthProvider();
// Optional UX improvement; does not affect Safari fix
googleProvider.setCustomParameters({ prompt: "select_account" });

export { app, analytics, db, storage, auth, googleProvider, signInWithPopup };