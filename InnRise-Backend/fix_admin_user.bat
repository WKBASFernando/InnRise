@echo off
echo ==================== FIX ADMIN USER ====================
echo.
echo This script will:
echo 1. Check if the admin user exists in the database
echo 2. Create the admin user if it doesn't exist
echo 3. Verify the user was created successfully
echo.
echo Make sure MySQL is running before proceeding.
echo.
pause

echo.
echo Step 1: Checking and creating admin user...
mysql -u root -p < check_admin_user.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to check/create admin user.
    echo Please check your MySQL connection and try again.
    pause
    exit /b 1
)

echo.
echo Step 2: Admin user check/creation completed!
echo.
echo You can now try logging in with:
echo Email: angelofernando1609@gmail.com
echo Password: password123
echo.
pause
