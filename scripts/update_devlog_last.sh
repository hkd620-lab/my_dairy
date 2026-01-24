#!/bin/bash
set -e

DEVLOG_DIR="DEVLOG"

latest=$(ls "$DEVLOG_DIR"/DEVLOG_*.md 2>/dev/null \
  | grep -v DEVLOG_LAST.md \
  | sort \
  | tail -n 1)

if [ -z "$latest" ]; then
  echo "No DEVLOG files found."
  exit 0
fi

ln -sfn "$(basename "$latest")" "$DEVLOG_DIR/DEVLOG_LAST.md"
echo "DEVLOG_LAST.md -> $(basename "$latest")"
