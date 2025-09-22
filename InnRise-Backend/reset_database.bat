@echo off
echo ==================== INNRISE DATABASE RESET ====================
echo.
echo This script will:
echo 1. Drop the existing innRise database
echo 2. Create a new innRise database
echo 3. Start the Spring Boot application (which will create tables via Hibernate)
echo.
echo Make sure MySQL is running before proceeding.
echo.
pause

echo.
echo Step 1: Resetting database...
mysql -u root -p < reset_database.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database reset failed. Please check your MySQL connection.
    echo Make sure MySQL is running and the root password is correct.
    pause
    exit /b 1
)

echo.
echo Step 2: Database reset successful!
echo.
echo Step 3: Starting Spring Boot application...
echo The application will create the tables automatically via Hibernate.
echo After the application starts successfully, you can run the sample_data.sql script.
echo.

REM Try to start the application
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
echo You can now run the sample_data.sql script to populate the database with sample data.
pause
