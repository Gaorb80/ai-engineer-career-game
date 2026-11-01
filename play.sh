#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Chưa có Node.js. Tải bản LTS tại https://nodejs.org, cài xong chạy lại."
  exit 1
fi
exec node scripts/play.mjs "$@"
