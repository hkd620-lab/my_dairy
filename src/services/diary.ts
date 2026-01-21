import { db, auth } from './firebase'
import { ensureSignedIn } from './auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp
} from 'firebase/firestore'

export type DiaryEntry = {
  id: string
  dateKey: string // YYYY-MM-DD
  title: string
  content: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

function getUidOrThrow(): string {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('[diary] auth.currentUser is null. Did you sign in?')
  return uid
}

export async function ensureUserDoc(): Promise<string> {
  const user = await ensureSignedIn()
  const uid = user.uid

  // users/{uid} 문서가 없으면 생성 (규칙에서 본인만 쓰기 가능)
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, { uid, createdAt: serverTimestamp() })
  }
  return uid
}

export function newDiaryId(): string {
  // 브라우저 환경에선 randomUUID 가능
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = globalThis.crypto
  if (c?.randomUUID) return c.randomUUID()
  return `d-${Date.now()}`
}

export async function listDiaries(max = 50): Promise<DiaryEntry[]> {
  await ensureUserDoc()
  const uid = getUidOrThrow()

  const col = collection(db, 'users', uid, 'diaries')
  const q = query(col, orderBy('dateKey', 'desc'), limit(max))
  const snap = await getDocs(q)

  return snap.docs.map((d) => {
    const data = d.data() as any
    return {
      id: d.id,
      dateKey: String(data.dateKey || ''),
      title: String(data.title || ''),
      content: String(data.content || ''),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  })
}

export async function createDiary(entry: Omit<DiaryEntry, 'createdAt' | 'updatedAt'>): Promise<void> {
  await ensureUserDoc()
  const uid = getUidOrThrow()

  const ref = doc(db, 'users', uid, 'diaries', entry.id)
  await setDoc(ref, {
    ...entry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function updateDiary(entry: Omit<DiaryEntry, 'createdAt' | 'updatedAt'>): Promise<void> {
  await ensureUserDoc()
  const uid = getUidOrThrow()

  const ref = doc(db, 'users', uid, 'diaries', entry.id)
  await updateDoc(ref, {
    ...entry,
    updatedAt: serverTimestamp()
  })
}

export async function removeDiary(id: string): Promise<void> {
  await ensureUserDoc()
  const uid = getUidOrThrow()

  const ref = doc(db, 'users', uid, 'diaries', id)
  await deleteDoc(ref)
}
