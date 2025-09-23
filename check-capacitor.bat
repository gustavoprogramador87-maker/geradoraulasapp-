@echo off
echo 🔍 VERIFICAÇÃO ESPECÍFICA DO CAPACITOR
echo =====================================
echo.

echo 📋 Verificando instalação do Capacitor...
npx cap --version
if errorlevel 1 (
    echo ❌ Capacitor CLI não encontrado!
    echo 📦 Instalando...
    npm install -g @capacitor/cli
)

echo 📋 Verificando configuração...
if exist "capacitor.config.ts" (
    echo ✅ capacitor.config.ts encontrado
    echo 📄 Conteúdo:
    type capacitor.config.ts
) else (
    echo ❌ capacitor.config.ts não encontrado!
)

echo.
echo 📋 Executando diagnóstico do Capacitor...
npx cap doctor

echo.
echo 📋 Verificando plataformas instaladas...
npx cap ls

echo.
pause