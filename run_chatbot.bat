@echo off

start cmd /k python ./backend/server.py

cd frontend
start cmd /k npm run dev

@REM open default browser at localhost:3000
start http://localhost:3000