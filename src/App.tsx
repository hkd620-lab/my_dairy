import { useEffect } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "./services/firebase";

export default function App() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user ? user.uid : "no user");

      if (!user) {
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Diary App</h1>
      <p>Auth check console 확인</p>
    </div>
  );
}
