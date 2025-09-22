@echo off
echo ==================== TEST LOGIN ENDPOINT ====================
echo.

echo Testing login with:
echo Email: angelofernando1609@gmail.com
echo Password: password123
echo.

powershell -Command "$body = '{\"email\":\"angelofernando1609@gmail.com\",\"password\":\"password123\"}'; try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/auth/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body; Write-Host 'SUCCESS: Login response received'; Write-Host 'Status Code:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host 'ERROR: Login failed'; Write-Host 'Error:' $_.Exception.Message; if ($_.Exception.Response) { Write-Host 'Response Status:' $_.Exception.Response.StatusCode } }"

echo.
echo Test completed.
pause
