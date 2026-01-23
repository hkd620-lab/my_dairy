import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "../services/firebase";
import { upgradeAnonymousToGoogle } from "../services/authUpgrade";

const containerStyle: React.CSSProperties = {
  marginTop: "32px",
  padding: "16px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const titleStyle: React.CSSProperties = {
  marginBottom: "8px",
};

const statusStyle: React.CSSProperties = {
  marginBottom: "12px",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: "16px",
  cursor: "pointer",
};

const descStyle: React.CSSProperties = {
  marginTop: "12px",
  fontSize: "14px",
  color: "#555",
};

const successStyle: React.CSSProperties = {
  marginTop: "12px",
  color: "green",
};

export default function AccountSection() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const onUpgrade = async () => {
    try {
      await upgradeAnonymousToGoogle();
      setMessage("Google 계정으로 안전하게 저장되었습니다.");
    } catch (e: any) {
      alert(e.message || "계정 업그레이드 중 오류가 발생했습니다.");
    }
  };

  return (
    <section style={containerStyle}>
      <h3 style={titleStyle}>계정</h3>

      <div style={statusStyle}>
        {user
          ? user.isAnonymous
            ? "현재 로그인 상태: 익명 사용자"
            : `로그인 계정: ${user.email}`
          : "로그인 상태 확인 중..."}
      </div>

      {user && user.isAnonymous && (
        <button style={buttonStyle} onClick={onUpgrade}>
          Google 계정으로 저장하기
        </button>
      )}

      {message && <div style={successStyle}>{message}</div>}

      {user && user.isAnonymous && (
        <p style={descStyle}>
          지금은 로그인 없이 사용 중입니다.<br />
          Google 계정으로 전환하면 기록이 안전하게 보관됩니다.
        </p>
      )}
    </section>
  );
}

