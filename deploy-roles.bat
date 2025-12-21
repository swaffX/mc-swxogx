@echo off
REM Real-Time Rol Sistemi Deployment Script (Windows)
REM Kullanim: deploy-roles.bat

echo.
echo ========================================
echo   Real-Time Rol Sistemi Deployment
echo ========================================
echo.

REM 1. Git pull
echo [1/6] Git pull yapiliyor...
git pull origin main
if %errorlevel% neq 0 (
    echo [HATA] Git pull basarisiz!
    pause
    exit /b 1
)
echo [OK] Git pull basarili
echo.

REM 2. Data klasoru
echo [2/6] Data klasoru kontrol ediliyor...
if not exist "data" (
    mkdir data
    echo [OK] Data klasoru olusturuldu
) else (
    echo [OK] Data klasoru mevcut
)
echo.

REM 3. Node modules
echo [3/6] Node modules kontrol ediliyor...
if not exist "node_modules" (
    echo npm install yapiliyor...
    call npm install
    if %errorlevel% neq 0 (
        echo [HATA] npm install basarisiz!
        pause
        exit /b 1
    )
    echo [OK] npm install basarili
) else (
    echo [OK] Node modules mevcut
)
echo.

REM 4. Session lock temizle
echo [4/6] Session lock dosyalari temizleniyor...
if exist "world\session.lock" del /f /q "world\session.lock" 2>nul
if exist "world_nether\session.lock" del /f /q "world_nether\session.lock" 2>nul
if exist "world_the_end\session.lock" del /f /q "world_the_end\session.lock" 2>nul
echo [OK] Lock dosyalari temizlendi
echo.

REM 5. PM2 restart
echo [5/6] PM2 servisleri yeniden baslatiliyor...
call pm2 restart all
if %errorlevel% neq 0 (
    echo [HATA] PM2 restart basarisiz!
    pause
    exit /b 1
)
echo [OK] PM2 restart basarili
echo.

REM 6. Loglar
echo [6/6] Backend loglari:
echo ========================================
call pm2 logs server --lines 20 --nostream
echo ========================================
echo.

REM Basari mesaji
echo.
echo ========================================
echo   DEPLOYMENT TAMAMLANDI!
echo ========================================
echo.
echo Web Panel: http://194.105.5.37:3000
echo Minecraft: swxogx.mooo.com
echo.
echo Dokumantasyon:
echo   - Rol Sistemi: docs\ROL_SISTEMI.md
echo   - Test Rehberi: docs\ROL_TEST.md
echo   - Tamamlanan: docs\REAL_TIME_ROL_TAMAMLANDI.md
echo.
echo Test icin:
echo   1. Web panele giris yap
echo   2. Dashboard -^> Role Manager
echo   3. Bir oyuncuya rol ata
echo   4. Minecraft'ta renkli bildirim gor!
echo.
echo ========================================
echo.
pause
