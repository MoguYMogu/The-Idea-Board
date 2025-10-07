#!/bin/bash

# IdeaBoard Docker Setup Script

echo "🐳 IdeaBoard Docker Setup"
echo "========================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build and start production environment
start_production() {
    echo "🚀 Starting production environment..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ Production environment started!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:5000"
    echo "🗄️  Database: PostgreSQL on localhost:5432"
}

# Function to start development environment
start_development() {
    echo "🛠️  Starting development environment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d
    echo "✅ Development environment started!"
    echo "🗄️  Database: PostgreSQL on localhost:5432"
    echo "Run backend and frontend manually for development"
}

# Function to stop all containers
stop_all() {
    echo "🛑 Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All containers stopped"
}

# Function to show logs
show_logs() {
    echo "📋 Showing container logs..."
    docker-compose logs -f
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    echo "✅ Cleanup complete"
}

# Main menu
case "$1" in
    "prod" | "production")
        check_docker
        start_production
        ;;
    "dev" | "development")
        check_docker
        start_development
        ;;
    "stop")
        stop_all
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        cleanup
        ;;
    *)
        echo "Usage: $0 {prod|dev|stop|logs|clean}"
        echo ""
        echo "Commands:"
        echo "  prod  - Start production environment (full stack)"
        echo "  dev   - Start development environment (database only)"
        echo "  stop  - Stop all containers"
        echo "  logs  - Show container logs"
        echo "  clean - Clean up all Docker resources"
        echo ""
        echo "Examples:"
        echo "  $0 prod   # Start production"
        echo "  $0 dev    # Start development"
        echo "  $0 stop   # Stop everything"
        exit 1
        ;;
esac