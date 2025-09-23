@echo off
echo 🔍 VERIFICAÇÃO ESPECÍFICA DO CAPACITOR
echo =====================================
echo.

echo 📋 Verificando versão do Capacitor...
npx cap --version
if errorlevel 1 (
    echo ❌ Capacitor CLI não encontrado!
    echo 📦 Instalando versão mais recente...
    npm install -g @capacitor/cli@latest
    if errorlevel 1 (
        echo ❌ Erro ao instalar Capacitor CLI!
        pause
        exit /b 1
    )
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
echo 📋 DIAGNÓSTICO DETALHADO DA INICIALIZAÇÃO...
echo ============================================

echo 🔍 1. Verificando estrutura do projeto...
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json FALTANDO!)
if exist "index.html" (echo ✅ index.html) else (echo ❌ index.html FALTANDO!)
if exist "manifest.json" (echo ✅ manifest.json) else (echo ⚠️ manifest.json não encontrado)

echo.
echo 🔍 2. Atualizando Capacitor para versão mais recente...
npm uninstall -g @capacitor/cli
npm install -g @capacitor/cli@latest
npm install @capacitor/core@latest @capacitor/android@latest --save

echo.
echo 🔍 3. Verificando versão atualizada...
npx cap --version

echo.
echo 🔍 4. Testando inicialização do Capacitor (SEM --no-build)...
if exist "capacitor.config.ts" (
    echo ⚠️ Capacitor já inicializado, removendo para teste...
    del "capacitor.config.ts" 2>nul
    if exist "android" rmdir /s /q "android" 2>nul
)

echo 🎯 Tentando inicializar Capacitor (versão compatível)...
echo Comando: npx cap init "Gerador de Aulas" "com.gugamilani940.geradoraulas"
npx cap init "Gerador de Aulas" "com.gugamilani940.geradoraulas" 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERRO NA INICIALIZAÇÃO DO CAPACITOR!
    echo.
    echo 🧪 Tentando com configuração mais simples...
    npx cap init "GeradorAulas" "com.gerador.aulas" 2>&1
    if errorlevel 1 (
        echo ❌ Falha mesmo com configuração simples!
        echo.
        echo 🔍 Informações de debug:
        echo Pasta atual: %CD%
        echo Usuário: %USERNAME%
        echo Node version:
        node --version
        echo NPM version:
        npm --version
        echo Capacitor version:
        npx cap --version
        echo.
        echo 💡 Tente executar como administrador
        pause
        exit /b 1
    ) else (
        echo ✅ Inicialização com nome simples funcionou!
    )
) else (
    echo ✅ Capacitor inicializado com sucesso!
)

echo.
echo 🔧 Configurando webDir manualmente...
if exist "capacitor.config.ts" (
    echo Atualizando capacitor.config.ts para webDir: "."
    powershell -Command "(Get-Content capacitor.config.ts) -replace 'webDir: ''www''', 'webDir: ''.''' | Set-Content capacitor.config.ts"
    powershell -Command "(Get-Content capacitor.config.ts) -replace 'webDir: ''build''', 'webDir: ''.''' | Set-Content capacitor.config.ts"
    powershell -Command "(Get-Content capacitor.config.ts) -replace 'webDir: ''dist''', 'webDir: ''.''' | Set-Content capacitor.config.ts"
)

echo.
echo 📋 Executando diagnóstico do Capacitor...
npx cap doctor

echo.
echo 📋 Verificando plataformas instaladas...
npx cap ls

echo.
echo 🎯 Testando adição da plataforma Android...
npx cap add android 2>&1
if errorlevel 1 (
    echo ❌ ERRO ao adicionar plataforma Android!
    echo.
    echo 🔧 Verificando requisitos Android...
    echo ANDROID_HOME: %ANDROID_HOME%
    echo JAVA_HOME: %JAVA_HOME%
    echo.
    if "%ANDROID_HOME%"=="" (
        echo ❌ ANDROID_HOME não configurado!
        echo 📱 Instale Android Studio e configure as variáveis:
        echo    - ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
        echo    - JAVA_HOME = C:\Program Files\Android\Android Studio\jre
        echo.
        echo 🔧 Para configurar automaticamente, execute:
        echo setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
        echo setx JAVA_HOME "C:\Program Files\Android\Android Studio\jre"
    )
) else (
    echo ✅ Plataforma Android adicionada com sucesso!
)

echo.
echo 📋 RESUMO DO DIAGNÓSTICO:
echo ========================
if exist "capacitor.config.ts" (echo ✅ Capacitor configurado) else (echo ❌ Capacitor NÃO configurado)
if exist "android" (echo ✅ Plataforma Android adicionada) else (echo ❌ Plataforma Android NÃO adicionada)

echo.
echo 🔧 PRÓXIMOS PASSOS RECOMENDADOS:
echo 1. Se tudo estiver ✅, execute: npx cap sync
echo 2. Para abrir no Android Studio: npx cap open android
echo 3. Para build: cd android ^&^& gradlew assembleDebug

pause