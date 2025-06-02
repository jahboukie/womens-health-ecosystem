#!/bin/bash

# Sober Pal - Project Setup Script
# This script sets up the development environment for the Sober Pal application

set -e  # Exit on any error

echo "🚀 Setting up Sober Pal Development Environment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker found: $(docker --version)"
    else
        print_warning "Docker not found. You'll need to set up PostgreSQL and Redis manually."
    fi
    
    # Check Expo CLI
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found. Installing globally..."
        npm install -g @expo/cli
    fi
    
    print_success "Prerequisites check completed!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please update the .env file with your actual configuration values!"
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Create logs directory
    mkdir -p logs
    
    print_success "Backend setup completed!"
    cd ..
}

# Setup mobile app
setup_mobile() {
    print_status "Setting up mobile app..."
    
    cd mobile
    
    # Install dependencies
    print_status "Installing mobile app dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please update the .env file with your actual configuration values!"
    fi
    
    # Create assets directory if it doesn't exist
    mkdir -p assets
    
    print_success "Mobile app setup completed!"
    cd ..
}

# Setup database with Docker
setup_database() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Setting up database with Docker..."
        
        # Start database services
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        # Run database migrations
        cd backend
        print_status "Running database migrations..."
        npx prisma migrate dev --name init
        cd ..
        
        print_success "Database setup completed!"
    else
        print_warning "Docker not available. Please set up PostgreSQL and Redis manually."
        print_warning "Database URL: postgresql://postgres:postgres@localhost:5432/sober_pal"
        print_warning "Redis URL: redis://localhost:6379"
    fi
}

# Create development scripts
create_scripts() {
    print_status "Creating development scripts..."
    
    # Create start script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Sober Pal Development Environment"

# Start database services
if command -v docker-compose &> /dev/null; then
    echo "Starting database services..."
    docker-compose up -d postgres redis
    sleep 5
fi

# Start backend in background
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Start mobile app
echo "Starting mobile app..."
cd ../mobile && npm start &
MOBILE_PID=$!

echo "✅ Development environment started!"
echo "Backend PID: $BACKEND_PID"
echo "Mobile PID: $MOBILE_PID"
echo ""
echo "Backend API: http://localhost:3000"
echo "Mobile App: http://localhost:19006"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'kill $BACKEND_PID $MOBILE_PID; docker-compose down; exit' INT
wait
EOF

    chmod +x start-dev.sh
    
    # Create stop script
    cat > stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping Sober Pal Development Environment"

# Kill Node.js processes
pkill -f "npm run dev"
pkill -f "expo start"

# Stop Docker services
if command -v docker-compose &> /dev/null; then
    docker-compose down
fi

echo "✅ Development environment stopped!"
EOF

    chmod +x stop-dev.sh
    
    print_success "Development scripts created!"
}

# Main setup function
main() {
    echo ""
    print_status "Starting Sober Pal setup process..."
    echo ""
    
    check_prerequisites
    echo ""
    
    setup_backend
    echo ""
    
    setup_mobile
    echo ""
    
    setup_database
    echo ""
    
    create_scripts
    echo ""
    
    print_success "🎉 Sober Pal setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update backend/.env with your configuration"
    echo "2. Update mobile/.env with your configuration"
    echo "3. Get Claude API key from Anthropic and add to backend/.env"
    echo "4. Run './start-dev.sh' to start the development environment"
    echo ""
    echo "Useful commands:"
    echo "- Start development: ./start-dev.sh"
    echo "- Stop development: ./stop-dev.sh"
    echo "- Backend only: cd backend && npm run dev"
    echo "- Mobile only: cd mobile && npm start"
    echo "- Run tests: cd backend && npm test"
    echo "- Database admin: http://localhost:5050 (pgAdmin)"
    echo ""
    echo "Documentation: See README.md for detailed information"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main
