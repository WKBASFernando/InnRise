Write-Host "Starting Spring Boot Application..." -ForegroundColor Green

# Set environment variable to handle spaces in paths
$env:MVNW_VERBOSE = "true"

# Run the application using Maven wrapper
try {
    & ".\mvnw.cmd" spring-boot:run
} catch {
    Write-Host "Error starting application: $_" -ForegroundColor Red
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Try to run with Java directly if Maven wrapper fails
    if (Test-Path "target\classes") {
        Write-Host "Running with Java directly..." -ForegroundColor Yellow
        java -cp "target\classes;target\dependency\*" com.ijse.innrisebackend.Application
    } else {
        Write-Host "Please compile the project first using: .\mvnw.cmd clean compile" -ForegroundColor Red
    }
}

Read-Host "Press Enter to continue..."
