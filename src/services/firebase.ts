import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

if (typeof window === 'undefined') {
  throw new Error('[firebase] Web SDK must run in browser/WebView only. Do not run in Node.');
}

const firebaseConfig = {
  apiKey: "AIzaSyCoqL62b_FbJiWf4LRTK6L2_bLyP7-umPo",
  authDomain: "my-diary-app-2026.firebaseapp.com",
  projectId: "my-diary-app-2026",
  storageBucket: "my-diary-app-2026.firebasestorage.app",
  messagingSenderId: "96897454543",
  appId: "1:96897454543:web:b5b0304dc79f46e8ee82ba"
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
