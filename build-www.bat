@echo off
echo Creating www directory for Capacitor...

:: Create www directory if it doesn't exist
if not exist "www" mkdir www

:: Copy main HTML file
copy "index.html" "www\" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Failed to copy index.html
    exit /b 1
)

:: Copy JavaScript files
if exist "js" (
    if not exist "www\js" mkdir "www\js"
    xcopy "js\*" "www\js\" /E /Y >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Failed to copy js directory
        exit /b 1
    )
)

:: Copy home directory (if exists)
if exist "home" (
    if not exist "www\home" mkdir "www\home"
    xcopy "home\*" "www\home\" /E /Y >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Failed to copy home directory
        exit /b 1
    )
)

:: Copy icons directory
if exist "icons" (
    if not exist "www\icons" mkdir "www\icons"
    xcopy "icons\*" "www\icons\" /E /Y >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Failed to copy icons directory
        exit /b 1
    )
)

:: Copy manifest.json
copy "manifest.json" "www\" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Failed to copy manifest.json
    exit /b 1
)

:: Copy service worker
copy "sw.js" "www\" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Failed to copy sw.js
    exit /b 1
)

echo Successfully created www directory with all web assets!
echo You can now run: npx cap sync
