@echo off
echo Stopping application on port 8080...

REM Find and kill the Java process running on port 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo Starting application...
start "Spring Boot App" cmd /k "mvnw.cmd spring-boot:run"

echo Application restart initiated!
echo Check the new window for startup logs.
