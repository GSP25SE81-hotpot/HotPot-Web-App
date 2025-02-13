import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
apiKey:"AIzaSyAlkbqhhEHHVGvracWexnlXKu-qIHD2a28",
authDomain:"selling-maintainance-machinery.firebaseapp.com",
projectId:"selling-maintainance-machinery",
storageBucket:"selling-maintainance-machinery.appspot.com",
messagingSenderId:"281208452095",
appId:"1:281208452095:web:1daace5dc7b6bd0cdaedca",
measurementId:"G-MHFR6SB0Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const messaging = getMessaging(app);
