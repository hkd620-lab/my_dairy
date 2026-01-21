import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("AUTH STATE:", user.uid);
        setUid(user.uid);
      } else {
        console.log("AUTH STATE: no user");
        setUid(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Diary App</h1>

      <p>Auth check console 확인</p>

      {uid ? (
        <p>
          현재 UID: <strong>{uid}</strong>
        </p>
      ) : (
        <p>로그인된 사용자 없음</p>
      )}
    </div>
  );
}

export default App;

