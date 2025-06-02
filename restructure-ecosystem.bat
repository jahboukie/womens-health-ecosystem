@echo off
echo 🥋🔥 WOMEN'S HEALTH ECOSYSTEM - STRUCTURE CLEANUP 🔥🥋
echo.
echo Starting the magical cleanup and restructuring...
echo.

REM Create new clean structure
echo 📂 Creating new clean directory structure...

REM Main apps directory
mkdir apps 2>nul
mkdir apps\menotracker 2>nul
mkdir apps\menotracker\backend 2>nul
mkdir apps\menotracker\web 2>nul
mkdir apps\menotracker\mobile 2>nul

mkdir apps\menopartner 2>nul
mkdir apps\menopartner\backend 2>nul
mkdir apps\menopartner\web 2>nul
mkdir apps\menopartner\mobile 2>nul

mkdir apps\menocommunity 2>nul
mkdir apps\menocommunity\backend 2>nul
mkdir apps\menocommunity\web 2>nul
mkdir apps\menocommunity\mobile 2>nul

mkdir apps\breathe-with-alex 2>nul
mkdir apps\breathe-with-alex\backend 2>nul
mkdir apps\breathe-with-alex\web 2>nul
mkdir apps\breathe-with-alex\mobile 2>nul

REM Shared directory (keep existing but clean)
mkdir shared\components 2>nul
mkdir shared\utils 2>nul
mkdir shared\types 2>nul
mkdir shared\auth 2>nul
mkdir shared\ai 2>nul
mkdir shared\constants 2>nul

REM Enterprise directory (simplified)
mkdir enterprise\analytics 2>nul
mkdir enterprise\sso 2>nul
mkdir enterprise\whitelabel 2>nul
mkdir enterprise\landing-pages 2>nul

REM Deployment directory
mkdir deployment\docker 2>nul
mkdir deployment\kubernetes 2>nul
mkdir deployment\scripts 2>nul

REM Documentation
mkdir docs\api 2>nul
mkdir docs\deployment 2>nul
mkdir docs\development 2>nul

echo.
echo 📦 Moving existing code to new structure...

REM Move backend code from platforms/womens-health/meno-tracker/backend to apps/menotracker/backend
if exist "platforms\womens-health\meno-tracker\backend" (
    echo Moving MenoTracker backend...
    xcopy "platforms\womens-health\meno-tracker\backend\*" "apps\menotracker\backend\" /E /I /Y /Q
)

REM Move backend code from backend/ to apps/menotracker/backend (if it exists)
if exist "backend" (
    echo Moving root backend to MenoTracker...
    xcopy "backend\*" "apps\menotracker\backend\" /E /I /Y /Q
)

REM Move web code
if exist "web" (
    echo Moving web code to MenoTracker web...
    xcopy "web\*" "apps\menotracker\web\" /E /I /Y /Q
)

REM Move mobile code
if exist "mobile" (
    echo Moving mobile code to MenoTracker mobile...
    xcopy "mobile\*" "apps\menotracker\mobile\" /E /I /Y /Q
)

REM Move breathe-with-alex backend
if exist "platforms\breathe-with-alex\backend" (
    echo Moving Breathe with Alex backend...
    xcopy "platforms\breathe-with-alex\backend\*" "apps\breathe-with-alex\backend\" /E /I /Y /Q
)

echo.
echo 🧹 Cleaning up old structure...

REM Remove old confusing directories (but keep them for now, just rename)
if exist "platforms" (
    echo Renaming old platforms to platforms_OLD...
    ren "platforms" "platforms_OLD"
)

echo.
echo 📝 Creating .env.example files...

REM Create .env.example files for each app
echo # MenoTracker Backend Environment Variables > apps\menotracker\backend\.env.example
echo CLAUDE_API_KEY=your_claude_api_key_here >> apps\menotracker\backend\.env.example
echo DATABASE_URL=postgresql://user:password@localhost:5432/menotracker >> apps\menotracker\backend\.env.example
echo JWT_SECRET=your_jwt_secret_here >> apps\menotracker\backend\.env.example
echo PORT=3001 >> apps\menotracker\backend\.env.example

echo # MenoTracker Web Environment Variables > apps\menotracker\web\.env.example
echo NEXT_PUBLIC_API_URL=http://localhost:3001 >> apps\menotracker\web\.env.example
echo NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key_here >> apps\menotracker\web\.env.example

echo # Dr. Alex Backend Environment Variables > apps\breathe-with-alex\backend\.env.example
echo CLAUDE_API_KEY=your_claude_api_key_here >> apps\breathe-with-alex\backend\.env.example
echo DATABASE_URL=postgresql://user:password@localhost:5432/dralexai >> apps\breathe-with-alex\backend\.env.example
echo JWT_SECRET=your_jwt_secret_here >> apps\breathe-with-alex\backend\.env.example
echo PORT=3004 >> apps\breathe-with-alex\backend\.env.example

echo # Shared AI Environment Variables > shared\ai\.env.example
echo CLAUDE_API_KEY=your_shared_claude_api_key_here >> shared\ai\.env.example
echo OPENAI_API_KEY=your_openai_api_key_here >> shared\ai\.env.example

echo.
echo ✅ Structure cleanup complete!
echo.
echo 🎯 Next steps:
echo 1. Copy your API keys to the new .env files in apps/*/backend/ and apps/*/web/
echo 2. Update import paths in your code
echo 3. Test that everything works
echo 4. Remove the old platforms_OLD directory when ready
echo.
echo 🔥 Your ecosystem is now clean and organized! 🔥
pause
