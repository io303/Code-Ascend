@echo off
setlocal

for %%I in ("%~dp0..") do set "ROOT_DIR=%%~fI"

set "JAVA_HOME="
for /d %%I in ("%ROOT_DIR%\tools\jdk-21\jdk-*") do (
    set "JAVA_HOME=%%~fI"
)

set "MAVEN_HOME="
for /d %%I in ("%ROOT_DIR%\tools\maven-extract\apache-maven-*") do (
    set "MAVEN_HOME=%%~fI"
)

if not defined JAVA_HOME (
    echo Java 21 was not found under "%ROOT_DIR%\tools\jdk-21".
    exit /b 1
)

if not defined MAVEN_HOME (
    echo Maven was not found under "%ROOT_DIR%\tools\maven-extract".
    exit /b 1
)

set "MAVEN_REPO_LOCAL=%ROOT_DIR%\.m2\repository"
if not exist "%MAVEN_REPO_LOCAL%" (
    mkdir "%MAVEN_REPO_LOCAL%"
)

set "PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%"
call "%MAVEN_HOME%\bin\mvn.cmd" -Dmaven.repo.local="%MAVEN_REPO_LOCAL%" %*
