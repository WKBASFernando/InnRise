@echo off
echo Testing compilation...

REM Set Java environment
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Try to compile a simple test
echo Testing Java compilation...
javac -version

REM Try to run the application with a simple approach
echo Attempting to start application...
java -cp "target\classes;target\dependency\*" com.ijse.innrisebackend.Application

pause
