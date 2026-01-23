import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Firebase 설정 (기존 값 그대로 유지)
const firebaseConfig = {
  apiKey: "기존값",
  authDomain: "기존값",
  projectId: "기존값",
  storageBucket: "기존값",
  messagingSenderId: "기존값",
  appId: "기존값",
};

// ✅ 중복 초기화 방지
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ export
export const auth = getAuth(app);
export const db = getFirestore(app);

