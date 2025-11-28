import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCjVULBQ65h8k8vfUcgoQ4gsIpSRLX17Pc",
  authDomain: "leil-4af40.firebaseapp.com",
  databaseURL: "https://leil-4af40-default-rtdb.firebaseio.com",
  projectId: "leil-4af40",
  storageBucket: "leil-4af40.firebasestorage.app",
  messagingSenderId: "947172822818",
  appId: "1:947172822818:web:f34c3dd6bec318f644df7b"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
