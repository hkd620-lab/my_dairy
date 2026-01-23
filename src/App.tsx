import { useEffect, useState } from "react";
import { saveDiary, getDiaries } from "./services/diaryService";

function App() {
  const [content, setContent] = useState("");
  const [diaries, setDiaries] = useState<any[]>([]);

  const load = async () => {
    const data = await getDiaries();
    setDiaries(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
    if (!content.trim()) return;
    await saveDiary(content);
    setContent("");
    load();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>My Diary</h2>

      {/* 입력 영역 */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={4}
        placeholder="오늘의 생각을 적어보세요"
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={onSave} style={{ marginTop: 8 }}>
        Save
      </button>

      <hr />

      {/* Empty State */}
      {diaries.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666", marginTop: 40 }}>
          <p style={{ fontSize: 16 }}>
            아직 작성된 일기가 없습니다.
          </p>
          <p style={{ fontSize: 14 }}>
            오늘의 첫 기록을 남겨보세요.
          </p>
        </div>
      ) : (
        diaries.map(d => (
          <div key={d.id} style={{ marginBottom: 16 }}>
            <p>{d.content}</p>
            <small>
              {new Date(d.createdAt.seconds * 1000).toLocaleString()}
            </small>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;

