#!/bin/bash

# 🌸 Women's Health Ecosystem - Development Setup Script
# This script sets up the complete development environment

set -e

echo "🌸✨ Women's Health Ecosystem Development Setup ✨🌸"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Check prerequisites
print_header "🔍 Checking Prerequisites..."

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
    
    # Check if version is >= 20.10.0
    REQUIRED_VERSION="20.10.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        print_success "Node.js version is compatible"
    else
        print_error "Node.js version $NODE_VERSION is too old. Please upgrade to >= $REQUIRED_VERSION"
        exit 1
    fi
else
    print_error "Node.js not found. Please install Node.js >= 20.10.0"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm"
    exit 1
fi

# Check if Expo CLI is installed
if command -v expo &> /dev/null; then
    EXPO_VERSION=$(expo --version)
    print_success "Expo CLI found: $EXPO_VERSION"
else
    print_warning "Expo CLI not found. Installing globally..."
    npm install -g @expo/cli
    print_success "Expo CLI installed"
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker found: $DOCKER_VERSION"
else
    print_warning "Docker not found. Docker is optional but recommended for backend development"
fi

print_header "📦 Installing Dependencies..."

# Install root dependencies
print_status "Installing root workspace dependencies..."
npm install
print_success "Root dependencies installed"

# Install MenoTracker dependencies
if [ -d "platforms/meno-tracker/mobile" ]; then
    print_status "Installing MenoTracker mobile dependencies..."
    cd platforms/meno-tracker/mobile
    npm install
    cd ../../..
    print_success "MenoTracker mobile dependencies installed"
fi

if [ -d "platforms/meno-tracker/backend" ]; then
    print_status "Installing MenoTracker backend dependencies..."
    cd platforms/meno-tracker/backend
    npm install
    cd ../../..
    print_success "MenoTracker backend dependencies installed"
fi

# Set up environment files
print_header "🔧 Setting Up Environment Configuration..."

# Create .env.example for MenoTracker backend
if [ -d "platforms/meno-tracker/backend" ] && [ ! -f "platforms/meno-tracker/backend/.env.example" ]; then
    print_status "Creating MenoTracker backend .env.example..."
    cat > platforms/meno-tracker/backend/.env.example << EOF
# MenoTracker Backend Environment Configuration

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/menotracker_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Claude AI
CLAUDE_API_KEY=your_claude_api_key_here

# Security
ENCRYPTION_KEY=your_encryption_key_here
BCRYPT_ROUNDS=12

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:19006

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/combined.log

# HIPAA Compliance
HIPAA_AUDIT_LOG=logs/audit.log
HIPAA_ENCRYPTION_ENABLED=true

# PIPEDA Compliance (Canada)
PIPEDA_PRIVACY_OFFICER_EMAIL=privacy@menotracker.com
PIPEDA_DATA_RETENTION_DAYS=2555
EOF
    print_success "MenoTracker backend .env.example created"
fi

# Create .env.example for MenoTracker mobile
if [ -d "platforms/meno-tracker/mobile" ] && [ ! -f "platforms/meno-tracker/mobile/.env.example" ]; then
    print_status "Creating MenoTracker mobile .env.example..."
    cat > platforms/meno-tracker/mobile/.env.example << EOF
# MenoTracker Mobile Environment Configuration

# API Configuration
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000

# Expo Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Development
DEBUG=true
LOG_LEVEL=debug

# Features
ENABLE_BIOMETRIC_AUTH=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_ANALYTICS=false
EOF
    print_success "MenoTracker mobile .env.example created"
fi

# Set up Git hooks
print_header "🔗 Setting Up Git Hooks..."

if [ -d ".git" ]; then
    print_status "Installing Husky git hooks..."
    npx husky install
    npx husky add .husky/pre-commit "lint-staged"
    npx husky add .husky/commit-msg "npx commitlint --edit \$1"
    print_success "Git hooks installed"
else
    print_warning "Not a git repository. Skipping git hooks setup."
fi

# Create development scripts
print_header "📝 Creating Development Scripts..."

# Create start script for MenoTracker
cat > scripts/start-menotracker.sh << 'EOF'
#!/bin/bash

echo "🌸 Starting MenoTracker Development Environment..."

# Start backend in background
echo "🚀 Starting MenoTracker backend..."
cd platforms/meno-tracker/backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start mobile app
echo "📱 Starting MenoTracker mobile app..."
cd ../mobile
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
EOF

chmod +x scripts/start-menotracker.sh
print_success "MenoTracker start script created"

# Final setup completion
print_header "🎉 Setup Complete!"

echo ""
echo -e "${GREEN}✅ Women's Health Ecosystem development environment is ready!${NC}"
echo ""
echo -e "${CYAN}🚀 Quick Start Commands:${NC}"
echo -e "  ${YELLOW}npm run dev:meno-tracker${NC}          - Start MenoTracker mobile app"
echo -e "  ${YELLOW}npm run dev:meno-tracker:backend${NC}  - Start MenoTracker backend"
echo -e "  ${YELLOW}npm run start:meno-tracker${NC}        - Start both mobile and backend"
echo -e "  ${YELLOW}./scripts/start-menotracker.sh${NC}    - Alternative start script"
echo ""
echo -e "${CYAN}📚 Next Steps:${NC}"
echo -e "  1. Copy ${YELLOW}.env.example${NC} files to ${YELLOW}.env${NC} and configure"
echo -e "  2. Set up your database (PostgreSQL)"
echo -e "  3. Add your Claude API key to backend .env"
echo -e "  4. Run ${YELLOW}npm run start:meno-tracker${NC} to begin development"
echo ""
echo -e "${PURPLE}🌸 Ready to serve 1 BILLION women globally! 🌸${NC}"
echo ""
