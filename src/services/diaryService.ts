import {
  collection,
  doc,
  setDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * 기분 → 점수 매핑
 */
function mapMoodToScore(mood: string): number {
  const table: Record<string, number> = {
    "very good": 5,
    good: 4,
    normal: 3,
    bad: 2,
    "very bad": 1,
  };

  return table[mood] ?? 3;
}

/**
 * 구조화된 일기 데이터 타입
 */
export type DiaryEntry = {
  id: string;
  date: string;

  mood: {
    value: string;
    score: number;
  };

  weather: {
    type: string;
  };

  gratitude: {
    text: string;
  };

  regret: {
    text: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * 일기 저장 (날짜 = 문서 ID)
 */
export async function saveDiary(
  date: string,
  payload: {
    mood: string;
    weather: string;
    gratitude: string;
    regret: string;
  }
) {
  if (typeof date !== "string") {
    throw new Error("date must be string YYYY-MM-DD");
  }

  const ref = doc(db, "diaries", date);

  await setDoc(
    ref,
    {
      date,
      mood: {
        value: payload.mood,
        score: mapMoodToScore(payload.mood),
      },
      weather: {
        type: payload.weather,
      },
      gratitude: {
        text: payload.gratitude,
      },
      regret: {
        text: payload.regret,
      },
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * 일기 목록 조회
 */
export async function getDiaries(): Promise<DiaryEntry[]> {
  const q = query(
    collection(db, "diaries"),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      date: String(data.date ?? docSnap.id),

      mood: {
        value: data.mood?.value ?? "",
        score: data.mood?.score ?? 0,
      },

      weather: {
        type: data.weather?.type ?? "",
      },

      gratitude: {
        text: data.gratitude?.text ?? "",
      },

      regret: {
        text: data.regret?.text ?? "",
      },

      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : undefined,

      updatedAt: data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : undefined,
    };
  });
}
