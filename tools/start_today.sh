#!/bin/zsh

TODAY=$(date '+%Y-%m-%d')
NOW=$(date '+%Y-%m-%d %H:%M:%S')

DEVLOG_DIR="DEVLOG"
TODAY_LOG="$DEVLOG_DIR/DEVLOG_$TODAY.md"
LAST_LINK="$DEVLOG_DIR/DEVLOG_LAST.md"

echo "📅 Today: $NOW"
echo "📂 Project: $(basename "$PWD")"
echo

mkdir -p "$DEVLOG_DIR"

if [ ! -f "$TODAY_LOG" ]; then
cat > "$TODAY_LOG" << EOF
# DEVLOG $TODAY

## 오늘 목표
- 

## 작업 내용
- 

## 메모
- 
EOF
echo "📝 New DEVLOG created: $TODAY_LOG"
fi

ln -sf "$(basename "$TODAY_LOG")" "$LAST_LINK"

echo
git status
echo
echo "✅ Ready to work"
#!/bin/zsh

echo "📅 Today: $(date '+%Y-%m-%d %H:%M:%S')"
echo "📂 Project: my_diary"

git status

echo "✅ Ready to work"
