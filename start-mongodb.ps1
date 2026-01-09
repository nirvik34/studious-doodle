# MongoDB Integration - Quick Start

# 1. Start MongoDB (if not already running as a service)
Write-Host "Starting MongoDB..." -ForegroundColor Green
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "MongoDB is already running!" -ForegroundColor Yellow
} else {
    Write-Host "Attempting to start MongoDB service..." -ForegroundColor Cyan
    try {
        Start-Service MongoDB -ErrorAction Stop
        Write-Host "MongoDB service started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "MongoDB service not found. Please start MongoDB manually:" -ForegroundColor Red
        Write-Host "  Option 1: mongod --dbpath C:\data\db" -ForegroundColor Yellow
        Write-Host "  Option 2: Install MongoDB as a service" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter when MongoDB is running..."
    }
}

Write-Host ""
Write-Host "=======================" -ForegroundColor Cyan
Write-Host "MongoDB Integration" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ MongoDB driver installed" -ForegroundColor Green
Write-Host "✅ API routes created (/api/scans, /api/stats)" -ForegroundColor Green
Write-Host "✅ Dashboard updated with real data" -ForegroundColor Green
Write-Host "✅ Scan results now saved to database" -ForegroundColor Green
Write-Host ""
Write-Host "To use the system:" -ForegroundColor Yellow
Write-Host "1. Ensure MongoDB is running (check above)" -ForegroundColor White
Write-Host "2. Start model API: cd model; python api.py" -ForegroundColor White
Write-Host "3. Start client: cd client2; npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Database Info:" -ForegroundColor Cyan
Write-Host "  - Database: stroke_detection" -ForegroundColor White
Write-Host "  - Collection: scans" -ForegroundColor White
Write-Host "  - URI: mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
