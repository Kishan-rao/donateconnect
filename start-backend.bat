@echo off
title DonateConnect - Spring Boot Backend
echo Starting DonateConnect Backend (Java 21 + Spring Boot 3)...
cd /d "%~dp0backend"
if exist "mvnw.cmd" (
    call .\mvnw.cmd spring-boot:run
) else (
    call mvn spring-boot:run
)
pause
