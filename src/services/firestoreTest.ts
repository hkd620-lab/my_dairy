import { db } from './firebase';
import { ensureSignedIn } from './auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function testWriteDiary(): Promise<{ uid: string; path: string }> {
  const user = await ensureSignedIn();
  const uid = user.uid;

  const id = `test-${Date.now()}`;
  const ref = doc(db, 'users', uid, 'diaries', id);

  await setDoc(ref, {
    dateKey: new Date().toISOString().slice(0, 10),
    title: 'Test Diary',
    content: 'Hello Firestore',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return { uid, path: `users/${uid}/diaries/${id}` };
}
