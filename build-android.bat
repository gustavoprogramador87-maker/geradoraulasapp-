@echo off
chcp 65001 >nul
echo 🚀 Iniciando build do Android...
echo.

REM Verificar Node.js
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado! Instale Node.js primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verificar se existe package.json
if not exist "package.json" (
    echo ❌ package.json não encontrado!
    echo 📁 Execute este script na pasta raiz do projeto
    pause
    exit /b 1
)

REM Instalar dependências
echo 📦 Instalando dependências...
if exist "package-lock.json" (
    npm ci
) else (
    npm install
)
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)

REM Build do projeto
echo 🔨 Fazendo build do projeto...
npm run build
if errorlevel 1 (
    echo ❌ Erro no build do projeto!
    pause
    exit /b 1
)

REM Verificar se Capacitor está instalado
echo 🔍 Verificando Capacitor...
npx cap --version >nul 2>&1
if errorlevel 1 (
    echo 📱 Instalando Capacitor CLI...
    npm install -g @capacitor/cli
)

REM Inicializar Capacitor se necessário
if not exist "capacitor.config.ts" (
    echo 🎯 Inicializando Capacitor...
    npx cap init "Gerador de Aulas" "com.gerador.aulas"
    if errorlevel 1 (
        echo ❌ Erro ao inicializar Capacitor!
        pause
        exit /b 1
    )
)

REM Adicionar plataforma Android se necessário
if not exist "android" (
    echo 📱 Adicionando plataforma Android...
    npx cap add android
    if errorlevel 1 (
        echo ❌ Erro ao adicionar plataforma Android!
        pause
        exit /b 1
    )
)

REM Gerar ícones se necessário
if not exist "android\app\src\main\res\mipmap-hdpi\ic_launcher.png" (
    echo 🎨 Gerando ícones PNG...
    echo ⚠️  Abra create-icons.html no navegador para gerar os ícones
    echo    Depois execute este script novamente
    pause
    exit /b 0
)

REM Sincronizar arquivos
echo 🔄 Sincronizando arquivos...
npx cap sync android
if errorlevel 1 (
    echo ❌ Erro ao sincronizar!
    pause
    exit /b 1
)

echo.
echo ✅ Build concluído com sucesso!
echo 📱 Para abrir no Android Studio: npx cap open android
echo 🔨 Para build via linha de comando: cd android && gradlew assembleDebug
echo.
pause
