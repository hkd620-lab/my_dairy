import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * 일기 데이터 타입
 */
export type Diary = {
  id: string;
  content: string;
  createdAt: number;
};

/**
 * 일기 저장
 */
export async function saveDiary(content: string) {
  await addDoc(collection(db, "diaries"), {
    content,
    createdAt: serverTimestamp(),
  });
}

/**
 * 일기 목록 조회
 */
export async function getDiaries(): Promise<Diary[]> {
  const q = query(
    collection(db, "diaries"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      content: data.content ?? "",
      createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    };
  });
}

