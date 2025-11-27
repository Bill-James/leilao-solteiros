import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "leil-4af40.firebaseapp.com",
  databaseURL: "https://leil-4af40-default-rtdb.firebaseio.com",
  projectId: "leil-4af40",
  storageBucket: "leil-4af40.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
