@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Chua co Node.js. Tai ban LTS tai https://nodejs.org, cai xong chay lai file nay.
  pause
  exit /b 1
)
node scripts\play.mjs %*
pause
