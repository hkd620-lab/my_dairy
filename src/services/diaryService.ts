import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./auth";

/**
 * 일기 저장
 */
export const saveDiary = async (content: string) => {
  if (!auth.currentUser) {
    throw new Error("Not authenticated");
  }

  await addDoc(collection(db, "diaries"), {
    uid: auth.currentUser.uid,
    content,
    createdAt: new Date(),
  });
};

/**
 * 내 일기 목록 조회 (최신순)
 */
export const getDiaries = async () => {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "diaries"),
    where("uid", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/**
 * 일기 삭제
 */
export const deleteDiary = async (id: string) => {
  if (!auth.currentUser) {
    throw new Error("Not authenticated");
  }

  await deleteDoc(doc(db, "diaries", id));
};

