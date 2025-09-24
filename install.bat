@echo off
chcp 65001 >nul
echo 🚀 INSTALANDO GERADOR DE AULAS CIENTÍFICAS
echo ==========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado:
node --version

REM Verificar Java
java --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java não encontrado!
    echo 📥 Instale Java 17: https://adoptium.net/
    pause
    exit /b 1
)

echo ✅ Java encontrado

echo.
echo 📦 Instalando dependências...
npm install

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)

echo.
echo 🔧 Configurando Capacitor...
npx cap sync

echo.
echo 📱 Configurando Android...
npx cap add android
npx cap sync android

echo.
echo ✅ INSTALAÇÃO CONCLUÍDA!
echo.
echo 📋 Comandos disponíveis:
echo    npm run dev      - Executar no navegador
echo    npm run android  - Executar no Android
echo    npm run sync     - Sincronizar arquivos
echo.
echo 🚀 Para testar agora: npm run dev
pause