# setup-dev.ps1
Write-Host "Setting up Women's Health Ecosystem Development Environment" -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow

if (Test-Path mobile/package.json) {
    Push-Location mobile
    npm install
    Pop-Location
}

if (Test-Path web/soberpal-web/package.json) {
    Push-Location web/soberpal-web
    npm install 
    Pop-Location
}

if (Test-Path backend/package.json) {
    Push-Location backend
    npm install
    Pop-Location
}

Write-Host "Development environment is ready!" -ForegroundColor Green
