// src/services/diaryReadService.ts

export interface Diary {
  id: string;
  date: string;
  content: string;
}

// 임시 더미 데이터 (Firestore 연결 전 테스트용)
export async function loadDiaries(): Promise<Diary[]> {
  return [
    {
      id: "1",
      date: "2026-01-23",
      content: "첫 번째 일기입니다",
    },
  ];
}

