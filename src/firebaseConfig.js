import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDEYpuxtgQvLdoGNHjIp6v8R31cQXPfk70",
  authDomain: "leil-4af40.firebaseapp.com",
  databaseURL: "https://leil-4af40-default-rtdb.firebaseio.com",
  projectId: "leil-4af40",
  storageBucket: "leil-4af40.firebasestorage.app",
  messagingSenderId: "779447652746",
  appId: "1:779447652746:web:1639d62e7ad4dcac6c33c6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
