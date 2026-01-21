import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import type { User } from 'firebase/auth';

const msg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export function ensureSignedIn(timeoutMs = 12000): Promise<User> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`[auth] timeout after ${timeoutMs}ms`)), timeoutMs);

    const unsub = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          if (user) {
            clearTimeout(timer);
            unsub();
            resolve(user);
            return;
          }
          const res = await signInAnonymously(auth);
          clearTimeout(timer);
          unsub();
          resolve(res.user);
        } catch (e: any) {
          clearTimeout(timer);
          unsub();
          console.error('[auth] signInAnonymously failed', { code: e?.code, e });
          reject(new Error(`[auth] ${e?.code || 'unknown'} ${msg(e)}`));
        }
      },
      (e) => {
        clearTimeout(timer);
        unsub();
        reject(new Error(`[auth] onAuthStateChanged error: ${msg(e)}`));
      }
    );
  });
}
