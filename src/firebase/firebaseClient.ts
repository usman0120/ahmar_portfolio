import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6Ptt_sxiydIZwH0TZvGJgbdJJP_3ci0Q",
  authDomain: "ahmar-portfolio.firebaseapp.com",
  projectId: "ahmar-portfolio",
  storageBucket: "ahmar-portfolio.firebasestorage.app",
  messagingSenderId: "745137997812",
  appId: "1:745137997812:web:ebd0d7837efa334106dba1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
