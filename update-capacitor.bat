@echo off
echo 🔄 ATUALIZANDO CAPACITOR PARA VERSÃO COMPATÍVEL
echo ==============================================
echo.

echo 🧹 1. Removendo versões antigas...
npm uninstall -g @capacitor/cli
npm uninstall @capacitor/core @capacitor/android @capacitor/cli

echo.
echo 📦 2. Instalando versão mais recente...
npm install -g @capacitor/cli@latest
npm install @capacitor/core@latest @capacitor/android@latest @capacitor/cli@latest --save

echo.
echo 🔍 3. Verificando versão instalada...
npx cap --version
echo.

echo 🧹 4. Limpando configurações antigas...
if exist "capacitor.config.ts" del "capacitor.config.ts"
if exist "capacitor.config.json" del "capacitor.config.json"
if exist "android" rmdir /s /q "android"

echo.
echo 🎯 5. Inicializando com versão atualizada...
npx cap init "GeradorAulas" "com.gerador.aulas"
if errorlevel 1 (
    echo ❌ Erro na inicialização!
    echo 🔍 Tentando diagnóstico...
    npx cap init --help
    pause
    exit /b 1
)

echo.
echo 🔧 6. Configurando webDir...
if exist "capacitor.config.ts" (
    echo Configurando webDir para pasta atual...
    powershell -Command "$content = Get-Content 'capacitor.config.ts' -Raw; $content = $content -replace 'webDir: ''[^'']*''', 'webDir: ''.'''; Set-Content 'capacitor.config.ts' -Value $content"
)

echo.
echo 📱 7. Adicionando plataforma Android...
npx cap add android
if errorlevel 1 (
    echo ⚠️ Erro ao adicionar Android - verifique ANDROID_HOME
) else (
    echo ✅ Android adicionado com sucesso!
)

echo.
echo 🔄 8. Sincronizando...
npx cap sync

echo.
echo ✅ ATUALIZAÇÃO CONCLUÍDA!
echo 📋 Execute check-capacitor.bat para verificar
pause