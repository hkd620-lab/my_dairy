import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// TODO: .env 로 이동 (지금은 임시)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// 인증 초기화
export function initAuth(onReady: (user: User) => void) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      const cred = await signInAnonymously(auth);
      onReady(cred.user);
    } else {
      onReady(user);
    }
  });
}

// 컬렉션 헬퍼
export function journalCollection(uid: string) {
  return collection(db, "users", uid, "journalEntries");
}

export function journalQuery(uid: string) {
  return query(
    journalCollection(uid),
    orderBy("timestamp", "desc")
  );
}

export {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
};
