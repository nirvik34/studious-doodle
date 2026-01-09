# Start Python Flask API
Write-Host "Starting Python Model API on port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd model; .\env\Scripts\Activate.ps1; python api.py"

# Wait a bit for Python server to start
Start-Sleep -Seconds 3

# Start Node.js server
Write-Host "Starting Node.js server on port 8081..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start"

# Wait a bit for Node server to start
Start-Sleep -Seconds 2

# Start React client
Write-Host "Starting React client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "`nAll servers started!" -ForegroundColor Cyan
Write-Host "Python API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Node.js API: http://localhost:8081" -ForegroundColor Yellow
Write-Host "React Client: http://localhost:5173 (check client terminal for actual port)" -ForegroundColor Yellow
