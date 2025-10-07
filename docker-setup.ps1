# IdeaBoard Docker Setup Script for Windows
# Usage: .\docker-setup.ps1 [prod|dev|stop|logs|clean]

param(
    [string]$Command = "help"
)

function Write-Header {
    Write-Host "🐳 IdeaBoard Docker Setup" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
}

function Test-Docker {
    try {
        docker info | Out-Null
        Write-Host "✅ Docker is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        return $false
    }
}

function Start-Production {
    Write-Host "🚀 Starting production environment..." -ForegroundColor Yellow
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
    Write-Host "✅ Production environment started!" -ForegroundColor Green
    Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Blue
    Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Blue
    Write-Host "🗄️  Database: PostgreSQL on localhost:5432" -ForegroundColor Blue
}

function Start-Development {
    Write-Host "🛠️  Starting development environment..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d
    
    Write-Host "✅ Development environment started!" -ForegroundColor Green
    Write-Host "🗄️  Database: PostgreSQL on localhost:5432" -ForegroundColor Blue
    Write-Host "Run backend and frontend manually for development" -ForegroundColor Yellow
}

function Stop-All {
    Write-Host "🛑 Stopping all containers..." -ForegroundColor Yellow
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    Write-Host "✅ All containers stopped" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "📋 Showing container logs..." -ForegroundColor Yellow
    docker-compose logs -f
}

function Clean-Up {
    Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow
    docker-compose down -v --remove-orphans
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
}

function Show-Help {
    Write-Host "Usage: .\docker-setup.ps1 [Command]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  prod  - Start production environment (full stack)" -ForegroundColor Gray
    Write-Host "  dev   - Start development environment (database only)" -ForegroundColor Gray
    Write-Host "  stop  - Stop all containers" -ForegroundColor Gray
    Write-Host "  logs  - Show container logs" -ForegroundColor Gray
    Write-Host "  clean - Clean up all Docker resources" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\docker-setup.ps1 prod   # Start production" -ForegroundColor Gray
    Write-Host "  .\docker-setup.ps1 dev    # Start development" -ForegroundColor Gray
    Write-Host "  .\docker-setup.ps1 stop   # Stop everything" -ForegroundColor Gray
}

# Main execution
Write-Header

switch ($Command.ToLower()) {
    { $_ -in "prod", "production" } {
        if (Test-Docker) { Start-Production }
    }
    { $_ -in "dev", "development" } {
        if (Test-Docker) { Start-Development }
    }
    "stop" {
        Stop-All
    }
    "logs" {
        Show-Logs
    }
    "clean" {
        Clean-Up
    }
    default {
        Show-Help
    }
}