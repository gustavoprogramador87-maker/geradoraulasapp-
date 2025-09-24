Write-Host "Setting up Capacitor Android platform..." -ForegroundColor Green

# Add Android platform to Capacitor
Write-Host "Adding Android platform..." -ForegroundColor Yellow
npx cap add android

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Android platform added successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add Android platform" -ForegroundColor Red
    exit 1
}

# Copy GitHub workflows to www directory
Write-Host "Copying GitHub workflows to www directory..." -ForegroundColor Yellow

# Create .github/workflows directory in www
if (!(Test-Path "www\.github")) {
    New-Item -ItemType Directory -Path "www\.github" -Force | Out-Null
}

if (!(Test-Path "www\.github\workflows")) {
    New-Item -ItemType Directory -Path "www\.github\workflows" -Force | Out-Null
}

# Copy workflow files
if (Test-Path ".github\workflows") {
    Copy-Item ".github\workflows\*" "www\.github\workflows\" -Force
    Write-Host "✅ GitHub workflows copied to www directory!" -ForegroundColor Green
}

# Sync Capacitor again to ensure everything is updated
Write-Host "Running final Capacitor sync..." -ForegroundColor Yellow
npx cap sync

Write-Host "🎉 Setup complete! You can now:" -ForegroundColor Green
Write-Host "  - Build Android: npx cap build android" -ForegroundColor Cyan
Write-Host "  - Open Android Studio: npx cap open android" -ForegroundColor Cyan
