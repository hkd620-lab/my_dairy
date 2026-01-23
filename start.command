#!/bin/zsh

# ===== My Diary App start script =====

echo "🚀 My Diary App starting..."

# 1. 프로젝트 루트로 이동 (start.command가 있는 위치 기준)
cd "$(dirname "$0")" || exit 1

# 2. node_modules 없으면 설치
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found. Installing..."
  npm install || exit 1
fi

# 3. 개발 서버 실행
echo "🔥 Starting Vite dev server..."
npm run dev

echo "🛑 Server stopped."

