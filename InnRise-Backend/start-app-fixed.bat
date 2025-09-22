@echo off
echo Starting Spring Boot Application...

REM Set environment variables to handle spaces in paths
set "MAVEN_HOME=C:\Users\NITRO 15\.m2\wrapper\dists\apache-maven-3.9.11\d6d3cbd4012d4c1d840e93277aca316c"
set "PATH=%MAVEN_HOME%\bin;%PATH%"

REM Try to run with Maven directly
echo Attempting to start with Maven...
mvn spring-boot:run

if %ERRORLEVEL% neq 0 (
    echo Maven failed, trying alternative method...
    echo Please ensure MySQL is running and database 'innRise' exists
    echo You can create the database by running the database_setup.sql script
    pause
)
