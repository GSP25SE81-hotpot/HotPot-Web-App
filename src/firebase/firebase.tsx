import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCpN1p41BRr68PoR4NUn1bPtvh6hAdihfc",
  authDomain: "foodshop-aa498.firebaseapp.com",
  databaseURL: "https://foodshop-aa498-default-rtdb.firebaseio.com",
  projectId: "foodshop-aa498",
  storageBucket: "foodshop-aa498.appspot.com",
  messagingSenderId: "22691377717",
  appId: "1:22691377717:web:266abceaa2985b48ff777c",
  measurementId: "G-8MQ0JK7G2V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const messaging = getMessaging(app);
