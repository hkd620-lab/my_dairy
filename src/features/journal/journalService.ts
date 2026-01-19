import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export interface JournalEntry {
  id?: string;
  date: string;        // YYYY-MM-DD
  title: string;
  content: string;
  mood?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * 내부 유틸: 현재 로그인 UID 가져오기
 */
function getUID(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
}

/**
 * users/{uid}/diaries 컬렉션 참조
 */
function diariesRef() {
  const uid = getUID();
  return collection(db, 'users', uid, 'diaries');
}

/**
 * 일기 생성
 */
export async function createJournal(entry: JournalEntry) {
  const ref = await addDoc(diariesRef(), {
    date: entry.date,
    title: entry.title,
    content: entry.content,
    mood: entry.mood ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * 일기 목록 조회 (날짜 최신순)
 */
export async function fetchJournals(): Promise<JournalEntry[]> {
  const q = query(diariesRef(), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as JournalEntry),
  }));
}

/**
 * 단일 일기 조회
 */
export async function fetchJournalById(id: string): Promise<JournalEntry | null> {
  const uid = getUID();
  const ref = doc(db, 'users', uid, 'diaries', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as JournalEntry),
  };
}

/**
 * 일기 수정
 */
export async function updateJournal(id: string, entry: Partial<JournalEntry>) {
  const uid = getUID();
  const ref = doc(db, 'users', uid, 'diaries', id);

  await updateDoc(ref, {
    ...entry,
    updatedAt: serverTimestamp(),
  });
}

/**
 * 일기 삭제
 */
export async function deleteJournal(id: string) {
  const uid = getUID();
  const ref = doc(db, 'users', uid, 'diaries', id);
  await deleteDoc(ref);
}
