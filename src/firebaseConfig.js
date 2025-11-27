import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDEYpuxtgQvLdoGNHjIp6v8R31cQXPfk70",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "leil-4af40.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://leil-4af40-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leil-4af40",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "leil-4af40.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "779447652746",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:779447652746:web:1639d62e7ad4dcac6c33c6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
