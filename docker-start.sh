#!/bin/bash

echo "🐳 Starting Sober Pal Application with Docker"
echo "=============================================="

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose ps

# Show logs
echo ""
echo "📝 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "🎉 Sober Pal is starting up!"
echo ""
echo "📍 Access Points:"
echo "   🌐 Backend API: http://localhost:3000"
echo "   🔍 Health Check: http://localhost:3000/health"
echo "   📱 Mobile Dev: http://localhost:8081"
echo "   🗄️  Database: localhost:5432"
echo "   🔴 Redis: localhost:6379"
echo ""
echo "📋 Useful Commands:"
echo "   docker-compose logs -f          # Follow logs"
echo "   docker-compose ps               # Check status"
echo "   docker-compose down             # Stop all services"
echo "   docker-compose exec backend sh  # Access backend container"
echo ""
