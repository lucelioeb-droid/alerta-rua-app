// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvejGw1o2ZmBk5pHERRpqyfkSw8tPjNZI",
  authDomain: "iris-assistant-ffaf3.firebaseapp.com",
  projectId: "iris-assistant-ffaf3",
  storageBucket: "iris-assistant-ffaf3.firebasestorage.app",
  messagingSenderId: "563587252826",
  appId: "1:563587252826:web:617aa4eacb472d5bcd4e63"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;