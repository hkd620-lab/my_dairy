import { getAuth, signInAnonymously } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

// 앱 시작 시 자동 익명 로그인 (에러 나도 앱은 유지)
signInAnonymously(auth).catch((error) => {
  console.warn("익명 로그인 실패:", error.code);
});

