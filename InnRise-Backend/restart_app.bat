@echo off
echo ==================== RESTARTING SPRING BOOT APPLICATION ====================
echo.
echo Stopping any existing application on port 8080...

REM Kill any process using port 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Waiting 3 seconds for port to be released...
timeout /t 3 /nobreak >nul

echo.
echo Starting Spring Boot application...
call mvnw.cmd spring-boot:run

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to start the application.
    echo Please check the application logs for errors.
    pause
    exit /b 1
)

echo.
echo Application started successfully!
pause
