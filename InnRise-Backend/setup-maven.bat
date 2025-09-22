@echo off
echo Setting up Maven for InnRise Backend...

REM Create .m2 directory if it doesn't exist
if not exist "%USERPROFILE%\.m2" mkdir "%USERPROFILE%\.m2"
if not exist "%USERPROFILE%\.m2\wrapper" mkdir "%USERPROFILE%\.m2\wrapper"
if not exist "%USERPROFILE%\.m2\wrapper\dists" mkdir "%USERPROFILE%\.m2\wrapper\dists"

REM Download Maven if not exists
set "MAVEN_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.11"
if not exist "%MAVEN_DIR%" (
    echo Downloading Maven 3.9.11...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.zip' -OutFile 'maven.zip'}"
    if exist "maven.zip" (
        echo Extracting Maven...
        powershell -Command "& {Expand-Archive -Path 'maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists\' -Force}"
        del maven.zip
        echo Maven setup completed!
    ) else (
        echo Failed to download Maven. Please check your internet connection.
        pause
        exit /b 1
    )
) else (
    echo Maven already exists at %MAVEN_DIR%
)

REM Set environment variables
set "MAVEN_HOME=%MAVEN_DIR%"
set "PATH=%MAVEN_HOME%\bin;%PATH%"

echo Maven setup completed successfully!
echo You can now run: mvn spring-boot:run
pause
