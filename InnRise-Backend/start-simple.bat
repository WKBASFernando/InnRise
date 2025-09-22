@echo off
echo Starting InnRise Backend Application...

REM Set environment variables
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Check if target directory exists
if not exist "target\classes" (
    echo Error: Classes not found. Please compile the project first.
    echo You can try running: mvn clean compile
    pause
    exit /b 1
)

REM Try to start the application
echo Starting Spring Boot application...
java -cp "target\classes;target\dependency\*" com.ijse.innrisebackend.Application

if %ERRORLEVEL% neq 0 (
    echo.
    echo Application failed to start. Common issues:
    echo 1. MySQL database is not running
    echo 2. Database 'innRise' does not exist
    echo 3. Wrong database credentials
    echo.
    echo Please check:
    echo - MySQL is running on localhost:3306
    echo - Database 'innRise' exists
    echo - Username: root, Password: Ijse@1234
    echo.
    pause
)
