import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./auth";

export interface DiaryEntry {
  id: string;
  date: string;
  sections: Record<string, string>;
  createdAt?: any;
}

export const loadMyDiaries = async (): Promise<DiaryEntry[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("로그인 사용자 없음");
    return [];
  }

  const q = query(
    collection(db, "users", user.uid, "diaries"),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<DiaryEntry, "id">),
  }));
};

