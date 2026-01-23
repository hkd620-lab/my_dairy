import { useEffect, useRef, useState } from "react";
import { saveDiary, getDiaries } from "./services/diaryService";
import AccountSection from "./components/AccountSection";

/**
 * 메인 App 컴포넌트
 */
export default function App() {
  const [content, setContent] = useState("");
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const listTopRef = useRef<HTMLDivElement | null>(null);

  /** 일기 목록 로드 */
  const loadDiaries = async () => {
    const data = await getDiaries();
    setDiaries(data);
  };

  useEffect(() => {
    loadDiaries();
  }, []);

  /** 저장 */
  const onSave = async () => {
    if (!content.trim() || isSaving) return;

    try {
      setIsSaving(true);
      await saveDiary(content);
      setContent("");
      await loadDiaries();

      // 저장 후 리스트 상단으로 이동
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

      {/* 계정 관리 섹션 (추가된 부분) */}
      <AccountSection />

      {/* 입력 영역 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        style={{ width: "100%", marginTop: 12 }}
        placeholder="오늘의 기록을 남겨보세요."
      />

      <button
        onClick={onSave}
        disabled={isSaving}
        style={{ marginTop: 8 }}
      >
        {isSaving ? "저장 중..." : "저장"}
      </button>

      <div ref={listTopRef} style={{ marginTop: 24 }} />

      {/* 일기 목록 */}
      <ul>
        {diaries.map((d, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            {d.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

