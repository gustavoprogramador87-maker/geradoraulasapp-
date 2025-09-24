@echo off
echo Fixing Capacitor www directory issue...

:: Create www directory
mkdir www 2>nul

:: Copy essential files
echo Copying web assets to www directory...
copy index.html www\ >nul
copy manifest.json www\ >nul
copy sw.js www\ >nul

:: Copy directories
xcopy js www\js\ /E /I /Y >nul
xcopy home www\home\ /E /I /Y >nul
xcopy icons www\icons\ /E /I /Y >nul

echo Done! Web assets copied to www directory.
echo Now running Capacitor sync...

:: Run Capacitor sync
npx cap sync

echo Capacitor sync completed!
echo You can now build your Android app.
