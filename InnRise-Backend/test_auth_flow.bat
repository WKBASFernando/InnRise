@echo off
echo ==================== TEST AUTHENTICATION FLOW ====================
echo.

echo Step 1: Checking if user exists in database...
mysql -u root -pIjse@1234 -e "USE innRise; SELECT COUNT(*) as user_count FROM user WHERE email = 'angelofernando1609@gmail.com';"

echo.
echo Step 2: Checking user details...
mysql -u root -pIjse@1234 -e "USE innRise; SELECT email, role, CASE WHEN password IS NULL THEN 'NULL' WHEN password = '' THEN 'EMPTY' ELSE 'HAS_PASSWORD' END as pwd_status FROM user WHERE email = 'angelofernando1609@gmail.com';"

echo.
echo Step 3: Testing login endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/auth/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"angelofernando1609@gmail.com\",\"password\":\"password123\"}'; Write-Host 'SUCCESS: Status Code' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host 'ERROR: Login failed'; Write-Host 'Error:' $_.Exception.Message }"

echo.
echo Step 4: Testing with a simple endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/test' -Method GET; Write-Host 'SUCCESS: Test endpoint works' } catch { Write-Host 'ERROR: Test endpoint failed -' $_.Exception.Message }"

echo.
echo Authentication flow test completed.
pause
