import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdoxjWAXHIg3CViRRHkLlzS9M3-XA0ahk",
  authDomain: "qoura-clone-aa4f5.firebaseapp.com",
  projectId: "qoura-clone-aa4f5",
  storageBucket: "qoura-clone-aa4f5.firebasestorage.app",
  messagingSenderId: "193898297106",
  appId: "1:193898297106:web:0e466e2411bd6a0d7ce5cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
