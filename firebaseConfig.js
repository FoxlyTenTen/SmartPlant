// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Correct Firestore import

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHaUW0UFxlUK95mJlVZ2_QTgxB3HJ_n0U",
  authDomain: "smartplant-f5fd9.firebaseapp.com",
  projectId: "smartplant-f5fd9",
  storageBucket: "smartplant-f5fd9.appspot.com", // ✅ Fixed incorrect domain
  messagingSenderId: "996439698992",
  appId: "1:996439698992:web:b0cf6e47a7537d11be87f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore correctly

export { app, auth, db };
