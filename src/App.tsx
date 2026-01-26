import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { saveDiary } from "./services/diaryService";

type DiaryEntry = {
  mood: string;
  weather: string;
  gratitude: string;
  regret: string;
  updatedAt: string; // ISO
};

const STORAGE_PREFIX = "my_diary.entry.v1:";

function toISODate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function makeKey(dateStr: string) {
  return `${STORAGE_PREFIX}${dateStr}`;
}

function safeParseEntry(raw: string | null): DiaryEntry | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (
      typeof obj?.mood === "string" &&
      typeof obj?.weather === "string" &&
      typeof obj?.gratitude === "string" &&
      typeof obj?.regret === "string"
    ) {
      return {
        mood: obj.mood,
        weather: obj.weather,
        gratitude: obj.gratitude,
        regret: obj.regret,
        updatedAt:
          typeof obj.updatedAt === "string"
            ? obj.updatedAt
            : new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function App() {
  const todayStr = useMemo(() => toISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [mood, setMood] = useState("");
  const [weather, setWeather] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [regret, setRegret] = useState("");

  const [lastSavedAt, setLastSavedAt] = useState<string>("");

  // ✅ 날짜 변경 시 localStorage 로드
  useEffect(() => {
    const key = makeKey(selectedDate);
    const loaded = safeParseEntry(localStorage.getItem(key));

    setMood(loaded?.mood ?? "");
    setWeather(loaded?.weather ?? "");
    setGratitude(loaded?.gratitude ?? "");
    setRegret(loaded?.regret ?? "");
    setLastSavedAt(loaded?.updatedAt ?? "");
  }, [selectedDate]);

  // ✅ 자동 저장 (local + firestore)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const entry: DiaryEntry = {
        mood,
        weather,
        gratitude,
        regret,
        updatedAt: new Date().toISOString(),
      };

      const key = makeKey(selectedDate);
      localStorage.setItem(key, JSON.stringify(entry));
      setLastSavedAt(entry.updatedAt);

      // 🔥 Firestore 저장 (구조화된 데이터)
      try {
        await saveDiary({
          mood,
          weather,
          gratitude,
          regret,
        });
      } catch (err) {
        console.error("Firestore save failed:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedDate, mood, weather, gratitude, regret]);

  return (
    <div className="app">
      <h2>나의 일기</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div>
        <label>기분</label>
        <input value={mood} onChange={(e) => setMood(e.target.value)} />
      </div>

      <div>
        <label>날씨</label>
        <input value={weather} onChange={(e) => setWeather(e.target.value)} />
      </div>

      <div>
        <label>감사한 일</label>
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
        />
      </div>

      <div>
        <label>아쉬운 일</label>
        <textarea
          value={regret}
          onChange={(e) => setRegret(e.target.value)}
        />
      </div>

      <div className="last-saved">
        마지막 저장: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : "-"}
      </div>
    </div>
  );
}

export default App;

