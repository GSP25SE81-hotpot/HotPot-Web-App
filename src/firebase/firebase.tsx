import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBFzlw5rRnI16yQEIVJeRRMBs6Kd5rJWVI",
  authDomain: "hot-pot-to-you.firebaseapp.com",
  projectId: "hot-pot-to-you",
  storageBucket: "hot-pot-to-you.firebasestorage.app",
  messagingSenderId: "277605613910",
  appId: "1:277605613910:web:d84588fdb9a4eb8b2f16f7",
  measurementId: "G-BHDSQJ359N",
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_apiKey_FIREBASE,
//   authDomain: import.meta.env.VITE_authDOMAIN_FIREBASE,
//   projectId: import.meta.env.VITE_projectId_FIREBASE,
//   storageBucket: import.meta.env.VITE_storageBucket_FIREBASE,
//   messagingSenderId: import.meta.env.VITE_messagingSenderId_FIREBASE,
//   appId: import.meta.env.VITE_appId_FIREBASE,
//   measurementId: import.meta.env.VITE_measurementId_FIREBASE,
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const messaging = getMessaging(app);
