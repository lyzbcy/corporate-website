@echo off
echo ============================================
echo       Starting Agency Website Server
echo ============================================
echo.
cd /d "%~dp0"

echo [1/2] Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start "" "http://127.0.0.1:4001/corporate-website/"

echo [2/2] Launching Jekyll Server...
echo Please wait for "Server running..." message.
echo.
bundle exec jekyll serve --port 4001

pause
