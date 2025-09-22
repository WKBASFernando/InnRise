@echo off
echo ==================== FORCE RESTART SPRING BOOT ====================
echo.

echo Step 1: Killing all Java processes...
taskkill /f /im java.exe >nul 2>&1

echo Step 2: Waiting 3 seconds for processes to terminate...
timeout /t 3 /nobreak >nul

echo Step 3: Checking if port 8080 is free...
netstat -an | findstr :8080
if %ERRORLEVEL% EQU 0 (
    echo Port 8080 is still in use. Waiting 2 more seconds...
    timeout /t 2 /nobreak >nul
)

echo Step 4: Starting Spring Boot application...
echo This will open in a new window. Check that window for startup logs.
start "Spring Boot App" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo Application restart initiated!
echo Please wait for the application to start (usually takes 30-60 seconds).
echo Check the new window for "Started InnRiseBackendApplication" message.
echo.
pause
