import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoqL62b_FbJiWf4LRTK6L2_bLyP7-umPo",
  authDomain: "my-diary-app-2026.firebaseapp.com",
  projectId: "my-diary-app-2026",
  storageBucket: "my-diary-app-2026.firebasestorage.app",
  messagingSenderId: "96897454543",
  appId: "1:96897454543:web:b5b0304dc79f46e8ee82ba",
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
