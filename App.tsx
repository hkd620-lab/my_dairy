import { useEffect, useState } from "react";
import { saveDiary, getDiaries, DiaryEntry } from "./services/diaryService";

function todayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function App() {
  const [date, setDate] = useState(todayString());
  const [mood, setMood] = useState("normal");
  const [weather, setWeather] = useState("fine");
  const [gratitude, setGratitude] = useState("");
  const [regret, setRegret] = useState("");
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const load = async () => {
    const data = await getDiaries();
    setDiaries(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
  if (isSaving) return;

  try {
    setIsSaving(true);

    // ✅ 날짜 정규화 (핵심)
    const safeDate =
      typeof date === "string" && date.includes("-")
        ? date
        : todayString();

    await saveDiary(safeDate, {
      mood,
      weather,
      gratitude,
      regret,
    });

    setLastSavedAt(new Date());
    await load();
  } catch (e) {
    alert("저장 실패");
    console.error(e);
  } finally {
    setIsSaving(false);
  }
};


  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>나의 일기</h2>

      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        기분:
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="very good">아주 좋음</option>
          <option value="good">좋음</option>
          <option value="normal">보통</option>
          <option value="bad">나쁨</option>
          <option value="very bad">아주 나쁨</option>
        </select>
      </div>

      <div>
        날씨:
        <select value={weather} onChange={(e) => setWeather(e.target.value)}>
          <option value="fine">맑음</option>
          <option value="cloudy">흐림</option>
          <option value="rain">비</option>
        </select>
      </div>

      <div>
        감사한 일
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
        />
      </div>

      <div>
        아쉬운 일
        <textarea
          value={regret}
          onChange={(e) => setRegret(e.target.value)}
        />
      </div>

      <button onClick={onSave} disabled={isSaving}>
        {isSaving ? "저장 중..." : "저장"}
      </button>

      {lastSavedAt && (
        <div style={{ marginTop: 10 }}>
          마지막 저장: {lastSavedAt.toLocaleString()}
        </div>
      )}

      <hr />

      <h3>과거 기록</h3>
      {diaries.map((d) => (
        <div key={d.id} style={{ marginBottom: 10 }}>
          <strong>{d.date}</strong> / {d.mood.value} / {d.weather.type}
        </div>
      ))}
    </div>
  );
}

export default App;
