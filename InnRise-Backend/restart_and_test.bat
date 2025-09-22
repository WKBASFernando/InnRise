@echo off
echo ==================== RESTART AND TEST JWT TOKENS ====================
echo.

echo Step 1: Stopping current application...
taskkill /f /im java.exe >nul 2>&1

echo Step 2: Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Step 3: Starting application in new window...
start "Spring Boot App" cmd /k "mvnw.cmd spring-boot:run"

echo Step 4: Waiting 30 seconds for application to start...
timeout /t 30 /nobreak >nul

echo Step 5: Testing JWT token generation...
echo Testing login endpoint...

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/auth/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"angelofernando1609@gmail.com\",\"password\":\"password123\"}'; Write-Host 'SUCCESS: Login response received'; Write-Host $response.Content } catch { Write-Host 'ERROR: Login failed -' $_.Exception.Message }"

echo.
echo Test completed. Check the results above.
echo If you see SUCCESS, the JWT token is being generated correctly.
echo If you see ERROR, there might be an issue with the application startup.
echo.
pause
