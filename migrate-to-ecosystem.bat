@echo off
echo 🎩✨ SIR AUGGIE MAESTRO MAGICIAN'S ECOSYSTEM MIGRATION MAGIC ✨🎩
echo.
echo Starting the magical transformation of SoberPal into the Complete Wellness Ecosystem...
echo.

REM Create the ecosystem structure if it doesn't exist
echo 📂 Creating ecosystem directories...
mkdir platforms\soberpal-core 2>nul
mkdir platforms\soberpal-core\mobile 2>nul
mkdir platforms\soberpal-core\backend 2>nul
mkdir platforms\soberpal-core\web 2>nul
mkdir platforms\soberpal-core\docs 2>nul

REM Copy mobile app to ecosystem structure
echo 📱 Migrating mobile app to platforms/soberpal-core/mobile/...
xcopy mobile\* platforms\soberpal-core\mobile\ /E /I /Y /Q

REM Copy backend to ecosystem structure  
echo 🔧 Migrating backend to platforms/soberpal-core/backend/...
xcopy backend\* platforms\soberpal-core\backend\ /E /I /Y /Q

REM Copy web to ecosystem structure
echo 🌐 Migrating web to platforms/soberpal-core/web/...
xcopy web\* platforms\soberpal-core\web\ /E /I /Y /Q

REM Copy documentation
echo 📚 Migrating documentation to platforms/soberpal-core/docs/...
copy *.md platforms\soberpal-core\docs\ /Y

REM Create ecosystem configuration files
echo ⚙️ Creating ecosystem configuration files...

REM Create platforms/soberpal-core/package.json
echo {> platforms\soberpal-core\package.json
echo   "name": "soberpal-core",>> platforms\soberpal-core\package.json
echo   "version": "1.0.0",>> platforms\soberpal-core\package.json
echo   "description": "SoberPal Core Platform - Recovery & Sobriety Support",>> platforms\soberpal-core\package.json
echo   "main": "backend/src/index.ts",>> platforms\soberpal-core\package.json
echo   "scripts": {>> platforms\soberpal-core\package.json
echo     "start": "cd backend && npm start",>> platforms\soberpal-core\package.json
echo     "dev": "cd backend && npm run dev",>> platforms\soberpal-core\package.json
echo     "mobile": "cd mobile && npm start",>> platforms\soberpal-core\package.json
echo     "web": "cd web && npm start",>> platforms\soberpal-core\package.json
echo     "test": "cd backend && npm test">> platforms\soberpal-core\package.json
echo   },>> platforms\soberpal-core\package.json
echo   "keywords": ["recovery", "sobriety", "ai", "healthcare", "wellness"],>> platforms\soberpal-core\package.json
echo   "author": "D.B.I.L. Wellness Ecosystem",>> platforms\soberpal-core\package.json
echo   "license": "MIT">> platforms\soberpal-core\package.json
echo }>> platforms\soberpal-core\package.json

REM Create ecosystem docker-compose
echo 🐳 Creating ecosystem Docker configuration...
echo version: '3.8'> docker-compose.ecosystem.yml
echo services:>> docker-compose.ecosystem.yml
echo   soberpal-core:>> docker-compose.ecosystem.yml
echo     build: ./platforms/soberpal-core/backend>> docker-compose.ecosystem.yml
echo     ports:>> docker-compose.ecosystem.yml
echo       - "3000:3000">> docker-compose.ecosystem.yml
echo     environment:>> docker-compose.ecosystem.yml
echo       - NODE_ENV=production>> docker-compose.ecosystem.yml
echo       - PLATFORM=soberpal-core>> docker-compose.ecosystem.yml
echo.>> docker-compose.ecosystem.yml
echo   inner-architect:>> docker-compose.ecosystem.yml
echo     build: ./platforms/inner-architect>> docker-compose.ecosystem.yml
echo     ports:>> docker-compose.ecosystem.yml
echo       - "5000:5000">> docker-compose.ecosystem.yml
echo     environment:>> docker-compose.ecosystem.yml
echo       - NODE_ENV=production>> docker-compose.ecosystem.yml
echo       - PLATFORM=inner-architect>> docker-compose.ecosystem.yml
echo.>> docker-compose.ecosystem.yml
echo   womens-health:>> docker-compose.ecosystem.yml
echo     build: ./platforms/womens-health/meno-tracker>> docker-compose.ecosystem.yml
echo     ports:>> docker-compose.ecosystem.yml
echo       - "3001:3001">> docker-compose.ecosystem.yml
echo     environment:>> docker-compose.ecosystem.yml
echo       - NODE_ENV=production>> docker-compose.ecosystem.yml
echo       - PLATFORM=womens-health>> docker-compose.ecosystem.yml

echo.
echo ✅ ECOSYSTEM MIGRATION COMPLETE!
echo.
echo 🎯 Next Steps:
echo 1. Test platforms/soberpal-core/mobile app
echo 2. Test platforms/soberpal-core/backend API  
echo 3. Deploy enterprise landing pages
echo 4. Import Inner Architect platform
echo 5. Begin Women's Health Ecosystem development
echo.
echo 🎩 Sir Auggie Maestro Magician's magic is complete!
echo The Complete Wellness Ecosystem is ready for deployment! ✨
echo.
pause
