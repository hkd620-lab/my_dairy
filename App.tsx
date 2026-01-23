import { useEffect, useRef, useState } from "react";
import { addDiary, getMyDiaries, Diary } from "./services/diaryService";
import { auth } from "./firebase";

function App() {
  const [content, setContent] = useState("");
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const listTopRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getMyDiaries(user.uid);
    setDiaries(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
    if (!content.trim() || isSaving) return;

    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다");
      return;
    }

    try {
      setIsSaving(true);
      await addDiary({ uid: user.uid, content });
      setContent("");
      await load();

      setTimeout(() => {
        listTopRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>My Diary</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="오늘의 생각을 적어보세요"
        style={{ width: "100%", padding: 8 }}
        disabled={isSaving}
      />

      <button onClick={onSave} disabled={isSaving} style={{ marginTop: 10 }}>
        {isSaving ? "저장 중..." : "저장"}
      </button>

      <div ref={listTopRef} style={{ marginTop: 30 }} />

      {diaries.map((d) => (
        <div
          key={d.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "8px 0",
            whiteSpace: "pre-wrap",
          }}
        >
          {d.content}
        </div>
      ))}
    </div>
  );
}

export default App;

