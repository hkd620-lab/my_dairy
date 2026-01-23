import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export async function upgradeAnonymousToGoogle() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("로그인된 사용자가 없습니다.");
  }

  if (!user.isAnonymous) {
    alert("이미 계정이 연결되어 있습니다.");
    return;
  }

  const provider = new GoogleAuthProvider();

  try {
    await linkWithPopup(user, provider);
    alert("Google 계정으로 안전하게 저장되었습니다.");
  } catch (e: any) {
    if (e.code === "auth/credential-already-in-use") {
      alert("이미 다른 계정에 사용 중인 Google 계정입니다.");
    } else {
      console.error(e);
      alert("계정 연결 중 오류가 발생했습니다.");
    }
  }
}

