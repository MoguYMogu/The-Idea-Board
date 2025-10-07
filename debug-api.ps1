# IdeaBoard API Debugging Script
# Run this script to diagnose API connectivity issues

param(
    [string]$Action = "check"
)

function Write-Header {
    Write-Host "🔍 IdeaBoard API Diagnostics" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
}

function Test-APIEndpoint {
    param($url, $description)
    
    Write-Host "🌐 Testing: $description" -ForegroundColor Yellow
    Write-Host "   URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10
        Write-Host "✅ SUCCESS: $description" -ForegroundColor Green
        Write-Host "   Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
        return $true
    }
    catch {
        Write-Host "❌ FAILED: $description" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        return $false
    }
}

function Test-Port {
    param($port, $description)
    
    Write-Host "🔌 Testing port $port ($description)..." -ForegroundColor Yellow
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connection = $tcpClient.BeginConnect("localhost", $port, $null, $null)
        $wait = $connection.AsyncWaitHandle.WaitOne(3000, $false)
        
        if ($wait) {
            $tcpClient.EndConnect($connection)
            $tcpClient.Close()
            Write-Host "✅ Port $port is OPEN" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Port $port is CLOSED or not responding" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Cannot connect to port $port" -ForegroundColor Red
        return $false
    }
}

function Get-DockerStatus {
    Write-Host "🐳 Checking Docker containers..." -ForegroundColor Yellow
    
    try {
        $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        Write-Host $containers -ForegroundColor Gray
        
        # Check specific containers
        $backendStatus = docker ps --filter "name=ideaboard-backend" --format "{{.Status}}"
        $frontendStatus = docker ps --filter "name=ideaboard-frontend" --format "{{.Status}}"
        $dbStatus = docker ps --filter "name=ideaboard-postgres" --format "{{.Status}}"
        
        Write-Host "`n📊 Container Status:" -ForegroundColor Cyan
        Write-Host "   Backend:  $(if($backendStatus) { $backendStatus } else { 'NOT RUNNING' })" -ForegroundColor $(if($backendStatus) { 'Green' } else { 'Red' })
        Write-Host "   Frontend: $(if($frontendStatus) { $frontendStatus } else { 'NOT RUNNING' })" -ForegroundColor $(if($frontendStatus) { 'Green' } else { 'Red' })
        Write-Host "   Database: $(if($dbStatus) { $dbStatus } else { 'NOT RUNNING' })" -ForegroundColor $(if($dbStatus) { 'Green' } else { 'Red' })
        
        return ($backendStatus -and $frontendStatus -and $dbStatus)
    }
    catch {
        Write-Host "❌ Cannot get Docker status. Is Docker running?" -ForegroundColor Red
        return $false
    }
}

function Get-ContainerLogs {
    param($containerName)
    
    Write-Host "📋 Getting logs for $containerName..." -ForegroundColor Yellow
    try {
        $logs = docker logs $containerName --tail 20 2>&1
        Write-Host $logs -ForegroundColor Gray
    }
    catch {
        Write-Host "❌ Cannot get logs for $containerName" -ForegroundColor Red
    }
}

function Test-NetworkConnectivity {
    Write-Host "🌐 Testing network connectivity..." -ForegroundColor Yellow
    
    # Test localhost resolution
    try {
        $localhost = [System.Net.Dns]::GetHostAddresses("localhost")
        Write-Host "✅ localhost resolves to: $($localhost -join ', ')" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Cannot resolve localhost" -ForegroundColor Red
    }
    
    # Test if ports are available
    $ports = @(3000, 5000, 5432)
    foreach ($port in $ports) {
        $portOpen = Test-Port -port $port -description $(switch($port) { 3000 {"Frontend"} 5000 {"Backend API"} 5432 {"Database"} })
    }
}

function Start-FullDiagnostics {
    Write-Header
    
    Write-Host "🚀 Starting comprehensive API diagnostics...`n" -ForegroundColor Yellow
    
    # 1. Check Docker status
    $dockerOk = Get-DockerStatus
    Write-Host ""
    
    # 2. Test network connectivity
    Test-NetworkConnectivity
    Write-Host ""
    
    # 3. Test API endpoints
    Write-Host "🔍 Testing API endpoints..." -ForegroundColor Cyan
    $healthOk = Test-APIEndpoint -url "http://localhost:5000/health" -description "Health Check Endpoint"
    $ideasOk = Test-APIEndpoint -url "http://localhost:5000/api/ideas" -description "Ideas API Endpoint"
    $frontendOk = Test-APIEndpoint -url "http://localhost:3000" -description "Frontend Application"
    Write-Host ""
    
    # 4. If API endpoints fail, check container logs
    if (-not $ideasOk -or -not $healthOk) {
        Write-Host "🔍 Checking backend container logs..." -ForegroundColor Yellow
        Get-ContainerLogs -containerName "ideaboard-backend"
        Write-Host ""
    }
    
    # 5. Summary and recommendations
    Write-Host "📊 DIAGNOSIS SUMMARY" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "Docker Containers: $(if($dockerOk) { '✅ Running' } else { '❌ Issues detected' })" -ForegroundColor $(if($dockerOk) { 'Green' } else { 'Red' })
    Write-Host "Health Endpoint:   $(if($healthOk) { '✅ Working' } else { '❌ Not responding' })" -ForegroundColor $(if($healthOk) { 'Green' } else { 'Red' })
    Write-Host "Ideas API:         $(if($ideasOk) { '✅ Working' } else { '❌ Not responding' })" -ForegroundColor $(if($ideasOk) { 'Green' } else { 'Red' })
    Write-Host "Frontend:          $(if($frontendOk) { '✅ Working' } else { '❌ Not responding' })" -ForegroundColor $(if($frontendOk) { 'Green' } else { 'Red' })
    
    Write-Host "`n💡 RECOMMENDATIONS:" -ForegroundColor Yellow
    
    if (-not $dockerOk) {
        Write-Host "   1. Restart Docker containers: docker-compose down && docker-compose up -d" -ForegroundColor White
    }
    
    if (-not $healthOk) {
        Write-Host "   2. Check backend container logs: docker logs ideaboard-backend" -ForegroundColor White
        Write-Host "   3. Verify database connection is working" -ForegroundColor White
    }
    
    if (-not $ideasOk) {
        Write-Host "   4. Backend may be starting - wait 30 seconds and try again" -ForegroundColor White
        Write-Host "   5. Check if database migrations ran successfully" -ForegroundColor White
    }
    
    if (-not $frontendOk) {
        Write-Host "   6. Frontend container may need rebuild: docker-compose build frontend" -ForegroundColor White
    }
    
    Write-Host "`n🆘 QUICK FIXES:" -ForegroundColor Red
    Write-Host "   • Full restart: .\docker-setup.ps1 prod" -ForegroundColor White
    Write-Host "   • Clean rebuild: docker-compose down && docker-compose build --no-cache && docker-compose up -d" -ForegroundColor White
    Write-Host "   • Check logs: docker-compose logs -f" -ForegroundColor White
}

function Start-QuickCheck {
    Write-Host "⚡ Quick API Check..." -ForegroundColor Yellow
    
    $healthOk = Test-APIEndpoint -url "http://localhost:5000/health" -description "Backend Health"
    $ideasOk = Test-APIEndpoint -url "http://localhost:5000/api/ideas" -description "Ideas API"
    
    if ($healthOk -and $ideasOk) {
        Write-Host "`n🎉 API is working correctly!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ API has issues. Run full diagnostics with: .\debug-api.ps1 full" -ForegroundColor Red
    }
}

# Main execution
switch ($Action.ToLower()) {
    "full" { Start-FullDiagnostics }
    "quick" { Start-QuickCheck }
    "check" { Start-QuickCheck }
    "containers" { Get-DockerStatus }
    "logs" { 
        Get-ContainerLogs -containerName "ideaboard-backend"
        Write-Host "`n"
        Get-ContainerLogs -containerName "ideaboard-frontend"
    }
    default {
        Write-Host "🔍 IdeaBoard API Debug Tool" -ForegroundColor Cyan
        Write-Host "Usage: .\debug-api.ps1 [action]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Actions:" -ForegroundColor White
        Write-Host "  check     - Quick API connectivity check (default)" -ForegroundColor Gray
        Write-Host "  full      - Comprehensive diagnostics" -ForegroundColor Gray
        Write-Host "  containers- Check Docker container status" -ForegroundColor Gray
        Write-Host "  logs      - Show container logs" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor White
        Write-Host "  .\debug-api.ps1" -ForegroundColor Gray
        Write-Host "  .\debug-api.ps1 full" -ForegroundColor Gray
        Write-Host "  .\debug-api.ps1 logs" -ForegroundColor Gray
    }
}