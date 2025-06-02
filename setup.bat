@echo off
setlocal enabledelayedexpansion

REM Sober Pal - Project Setup Script (Windows)
REM This script sets up the development environment for the Sober Pal application

echo.
echo 🚀 Setting up Sober Pal Development Environment
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo [INFO] Node.js and npm found!

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Docker not found. You'll need to set up PostgreSQL and Redis manually.
) else (
    echo [INFO] Docker found!
)

REM Check if Expo CLI is installed
expo --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Expo CLI not found. Installing globally...
    npm install -g @expo/cli
)

echo.
echo [INFO] Setting up backend...
cd backend

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

REM Copy environment file
if not exist .env (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo [WARNING] Please update the .env file with your actual configuration values!
)

REM Generate Prisma client
echo [INFO] Generating Prisma client...
npx prisma generate
if errorlevel 1 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)

REM Create logs directory
if not exist logs mkdir logs

echo [SUCCESS] Backend setup completed!
cd ..

echo.
echo [INFO] Setting up mobile app...
cd mobile

REM Install mobile dependencies
echo [INFO] Installing mobile app dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install mobile dependencies
    pause
    exit /b 1
)

REM Copy environment file
if not exist .env (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo [WARNING] Please update the .env file with your actual configuration values!
)

REM Create assets directory
if not exist assets mkdir assets

echo [SUCCESS] Mobile app setup completed!
cd ..

echo.
echo [INFO] Setting up database with Docker...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Docker Compose not available. Please set up PostgreSQL and Redis manually.
    echo [WARNING] Database URL: postgresql://postgres:postgres@localhost:5432/sober_pal
    echo [WARNING] Redis URL: redis://localhost:6379
) else (
    REM Start database services
    docker-compose up -d postgres redis
    
    REM Wait for database to be ready
    echo [INFO] Waiting for database to be ready...
    timeout /t 10 /nobreak >nul
    
    REM Run database migrations
    cd backend
    echo [INFO] Running database migrations...
    npx prisma migrate dev --name init
    cd ..
    
    echo [SUCCESS] Database setup completed!
)

echo.
echo [INFO] Creating development scripts...

REM Create start script
echo @echo off > start-dev.bat
echo echo 🚀 Starting Sober Pal Development Environment >> start-dev.bat
echo. >> start-dev.bat
echo REM Start database services >> start-dev.bat
echo docker-compose up -d postgres redis >> start-dev.bat
echo timeout /t 5 /nobreak ^>nul >> start-dev.bat
echo. >> start-dev.bat
echo echo Starting backend server... >> start-dev.bat
echo start "Backend" cmd /k "cd backend && npm run dev" >> start-dev.bat
echo. >> start-dev.bat
echo echo Starting mobile app... >> start-dev.bat
echo start "Mobile" cmd /k "cd mobile && npm start" >> start-dev.bat
echo. >> start-dev.bat
echo echo ✅ Development environment started! >> start-dev.bat
echo echo Backend API: http://localhost:3000 >> start-dev.bat
echo echo Mobile App: http://localhost:19006 >> start-dev.bat
echo echo pgAdmin: http://localhost:5050 >> start-dev.bat
echo pause >> start-dev.bat

REM Create stop script
echo @echo off > stop-dev.bat
echo echo 🛑 Stopping Sober Pal Development Environment >> stop-dev.bat
echo. >> stop-dev.bat
echo REM Stop Docker services >> stop-dev.bat
echo docker-compose down >> stop-dev.bat
echo. >> stop-dev.bat
echo echo ✅ Development environment stopped! >> stop-dev.bat
echo pause >> stop-dev.bat

echo [SUCCESS] Development scripts created!

echo.
echo [SUCCESS] 🎉 Sober Pal setup completed successfully!
echo.
echo Next steps:
echo 1. Update backend\.env with your configuration
echo 2. Update mobile\.env with your configuration  
echo 3. Get Claude API key from Anthropic and add to backend\.env
echo 4. Run 'start-dev.bat' to start the development environment
echo.
echo Useful commands:
echo - Start development: start-dev.bat
echo - Stop development: stop-dev.bat
echo - Backend only: cd backend ^&^& npm run dev
echo - Mobile only: cd mobile ^&^& npm start
echo - Run tests: cd backend ^&^& npm test
echo - Database admin: http://localhost:5050 (pgAdmin)
echo.
echo Documentation: See README.md for detailed information
echo.
echo [SUCCESS] Happy coding! 🚀
echo.
pause
