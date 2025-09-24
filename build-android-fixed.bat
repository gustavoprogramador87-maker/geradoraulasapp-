
@echo off
chcp 65001 >nul
echo 🔧 CORRIGINDO CONFIGURAÇÕES DO CAPACITOR
echo =======================================
echo.

REM Verificar se estamos na pasta correta
if not exist "package.json" (
    echo ❌ Execute este script na pasta raiz do projeto!
    pause
    exit /b 1
)

echo 📦 Instalando dependências do Capacitor...
npm install @capacitor/core @capacitor/cli @capacitor/android --save
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do Capacitor!
    pause
    exit /b 1
)

echo 🔧 Removendo configuração antiga do Capacitor...
if exist "capacitor.config.json" del "capacitor.config.json"
if exist "android" rmdir /s /q "android"

echo 🎯 Inicializando Capacitor com configurações corretas...
npx cap init "Gerador de Aulas Científicas" "com.gugamilani940.geradoraulas" --web-dir="."
if errorlevel 1 (
    echo ❌ Erro ao inicializar Capacitor!
    pause
    exit /b 1
)

echo 📱 Adicionando plataforma Android...
npx cap add android
if errorlevel 1 (
    echo ❌ Erro ao adicionar Android!
    pause
    exit /b 1
)

echo 🎨 Verificando ícones...
if not exist "android\app\src\main\res\mipmap-hdpi\ic_launcher.png" (
    echo ⚠️ Ícones não encontrados! Criando ícones padrão...
    call :create_default_icons
)

echo 🔄 Sincronizando com configurações atualizadas...
npx cap sync android
if errorlevel 1 (
    echo ❌ Erro na sincronização!
    pause
    exit /b 1
)

echo 🔍 Verificando configuração do Capacitor...
npx cap doctor
if errorlevel 1 (
    echo ⚠️ Alguns problemas detectados, mas continuando...
)

echo.
echo ✅ CONFIGURAÇÃO DO CAPACITOR CORRIGIDA!
echo 📱 Para abrir no Android Studio: npx cap open android
echo 🔨 Para build: cd android && gradlew assembleDebug
echo.
pause
exit /b 0

:create_default_icons
echo Criando estrutura de ícones...
mkdir "android\app\src\main\res\mipmap-hdpi" 2>nul
mkdir "android\app\src\main\res\mipmap-mdpi" 2>nul
mkdir "android\app\src\main\res\mipmap-xhdpi" 2>nul
mkdir "android\app\src\main\res\mipmap-xxhdpi" 2>nul
mkdir "android\app\src\main\res\mipmap-xxxhdpi" 2>nul

REM Copiar ícones do template do Capacitor
if exist "node_modules\@capacitor\android\capacitor\src\main\res" (
    xcopy "node_modules\@capacitor\android\capacitor\src\main\res\mipmap-*" "android\app\src\main\res" /E /Y >nul 2>&1
)
goto :eof
