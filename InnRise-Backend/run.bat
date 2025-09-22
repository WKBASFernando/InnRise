@echo off
cd /d "%~dp0"
set "MAVEN_OPTS=-Xmx1024m"
call mvnw.cmd spring-boot:run
