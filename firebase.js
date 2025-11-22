/* ============================================================
   Firebase Initialization Module
   AquaGuide – Modern iOS PWA
   ------------------------------------------------------------
   This module:
   ✔ Initializes Firebase App
   ✔ Sets up Auth (anonymous by default)
   ✔ Exports Firestore + Storage references
   ✔ Provides helper wrappers for callers
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


/* ============================================================
   FIREBASE CONFIG
   (Replace with your production config)
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAzN0SJ9PbUF3P94z5PefT3TlONvmhJK5U",
  authDomain: "oneminuteguide-5be62.firebaseapp.com",
  projectId: "oneminuteguide-5be62",
  storageBucket: "oneminuteguide-5be62.firebasestorage.app",
  messagingSenderId: "347193956770",
  appId: "1:347193956770:web:4b4b4864cc0384c1627afb",
  measurementId: "G-F3F81FB3DH"
};


/* ============================================================
   INITIALIZE FIREBASE APP
   ============================================================ */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global UID (set after login)
export let AQUA_UID = null;


/* ============================================================
   AUTH – Anonymous Login (Auto)
   ============================================================ */

signInAnonymously(auth)
  .catch(err => {
    console.error("Firebase anonymous auth error:", err);
  });

onAuthStateChanged(auth, user => {
  if (user) {
    AQUA_UID = user.uid;
    console.log("AquaGuide Auth → UID:", AQUA_UID);
  }
});


/* ============================================================
   EXPORTS – For all modules
   ============================================================ */

export {
  db,
  storage,
  auth,
  // Firestore helpers
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  // Storage helpers
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
};


/* ============================================================
   Helper: Device Type Detection (for logging)
   ============================================================ */
export function getDeviceType() {
  const ua = navigator.userAgent;

  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";

  return "Unknown";
}
