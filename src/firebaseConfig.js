// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjVULBQ65h8k8vfUcgoQ4gsIpSRLX17Pc",
  authDomain: "leil-4af40.firebaseapp.com",
  databaseURL: "https://leil-4af40-default-rtdb.firebaseio.com",
  projectId: "leil-4af40",
  storageBucket: "leil-4af40.firebasestorage.app",
  messagingSenderId: "947172822818",
  appId: "1:947172822818:web:f34c3dd6bec318f644df7b",
  measurementId: "G-VD5GR6JM07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
