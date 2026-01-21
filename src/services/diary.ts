import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

/**
 * App.tsx (5718867) 기준 엔트리 타입
 */
export interface DiaryEntry {
  id: string;
  dateKey: string;   // YYYY-MM-DD
  title?: string;
  content?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * 새 ID 생성
 */
export function newDiaryId(): string {
  return crypto.randomUUID();
}

/**
 * 일기 생성
 */
export async function createDiary(entry: DiaryEntry): Promise<void> {
  const uid = "demo"; // ⚠️ 지금은 고정 (다음 단계에서 auth.uid로 교체)

  const ref = doc(db, "users", uid, "diaries", entry.id);
  await setDoc(ref, {
    ...entry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * 일기 목록 조회
 */
export async function listDiaries(max: number): Promise<DiaryEntry[]> {
  const uid = "demo"; // ⚠️ 지금은 고정

  const q = query(
    collection(db, "users", uid, "diaries"),
    orderBy("dateKey", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));
}

/**
 * 일기 수정
 */
export async function updateDiary(
  id: string,
  patch: Partial<DiaryEntry>
): Promise<void> {
  const uid = "demo";
  const ref = doc(db, "users", uid, "diaries", id);
  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

/**
 * 일기 삭제
 */
export async function removeDiary(id: string): Promise<void> {
  const uid = "demo";
  const ref = doc(db, "users", uid, "diaries", id);
  await deleteDoc(ref);
}

