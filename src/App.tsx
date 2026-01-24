import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // 25분(1500초) 포커스 타이머 기본값
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // 타이머 동작 로직
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  // mm:ss 형식 변환
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Focus Timer</h1>

      <div
        style={{
          fontSize: "4rem",
          margin: "20px 0",
          letterSpacing: "2px",
        }}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;

