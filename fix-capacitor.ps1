Write-Host "Creating www directory for Capacitor..." -ForegroundColor Green

# Create www directory if it doesn't exist
if (!(Test-Path "www")) {
    New-Item -ItemType Directory -Name "www" | Out-Null
    Write-Host "Created www directory" -ForegroundColor Yellow
}

# Copy main files
Write-Host "Copying web assets..." -ForegroundColor Yellow

Copy-Item "index.html" "www\" -Force
Copy-Item "manifest.json" "www\" -Force
Copy-Item "sw.js" "www\" -Force

# Copy directories
if (Test-Path "js") {
    Copy-Item "js" "www\" -Recurse -Force
}

if (Test-Path "home") {
    Copy-Item "home" "www\" -Recurse -Force
}

if (Test-Path "icons") {
    Copy-Item "icons" "www\" -Recurse -Force
}

Write-Host "Web assets copied successfully!" -ForegroundColor Green
Write-Host "Running Capacitor sync..." -ForegroundColor Yellow

# Run Capacitor sync
npx cap sync

Write-Host "Done! Capacitor should now work properly." -ForegroundColor Green
