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
echo 📋 DIAGNÓSTICO DETALHADO DA INICIALIZAÇÃO...
echo ============================================

echo 🔍 1. Verificando estrutura do projeto...
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json FALTANDO!)
if exist "index.html" (echo ✅ index.html) else (echo ❌ index.html FALTANDO!)
if exist "manifest.json" (echo ✅ manifest.json) else (echo ⚠️ manifest.json não encontrado)

echo.
echo 🔍 2. Verificando dependências do Capacitor...
npm list @capacitor/core 2>nul
if errorlevel 1 (
    echo ❌ @capacitor/core não instalado!
    echo 📦 Instalando dependências necessárias...
    npm install @capacitor/core @capacitor/cli @capacitor/android
    if errorlevel 1 (
        echo ❌ ERRO: Falha ao instalar dependências do Capacitor!
        echo 💡 Tente: npm cache clean --force
        pause
        exit /b 1
    )
) else (
    echo ✅ @capacitor/core instalado
)

echo.
echo 🔍 3. Testando inicialização do Capacitor...
if exist "capacitor.config.ts" (
    echo ⚠️ Capacitor já inicializado, removendo para teste...
    del "capacitor.config.ts" 2>nul
    if exist "android" rmdir /s /q "android" 2>nul
)

echo 🎯 Tentando inicializar Capacitor...
echo Comando: npx cap init "Gerador de Aulas" "com.gugamilani940.geradoraulas" --web-dir="."
npx cap init "Gerador de Aulas" "com.gugamilani940.geradoraulas" --web-dir="." 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERRO NA INICIALIZAÇÃO DO CAPACITOR!
    echo.
    echo 🔧 POSSÍVEIS SOLUÇÕES:
    echo 1. Verificar se o nome do app tem caracteres especiais
    echo 2. Verificar se o appId está no formato correto
    echo 3. Verificar permissões da pasta
    echo 4. Limpar cache do npm
    echo.
    echo 🧪 Tentando com configuração mais simples...
    npx cap init "GeradorAulas" "com.gerador.aulas" --web-dir="." 2>&1
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
        echo.
        echo 💡 Tente executar como administrador ou verificar antivírus
        pause
        exit /b 1
    ) else (
        echo ✅ Inicialização com nome simples funcionou!
    )
) else (
    echo ✅ Capacitor inicializado com sucesso!
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
    )
) else (
    echo ✅ Plataforma Android adicionada com sucesso!
)

echo.
echo 📋 RESUMO DO DIAGNÓSTICO:
echo ========================
if exist "capacitor.config.ts" (echo ✅ Capacitor configurado) else (echo ❌ Capacitor NÃO configurado)
if exist "android" (echo ✅ Plataforma Android adicionada) else (echo ❌ Plataforma Android NÃO adicionada)

pause