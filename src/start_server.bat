@echo off
echo Starting local server...
cd /d "%~dp0"
python -m http.server 8000
pause