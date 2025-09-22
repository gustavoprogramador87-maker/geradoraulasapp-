@echo off
title Fix GitHub Actions - Dependency Lock File Issue
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    FIX GITHUB ACTIONS ERROR                  ║
echo ║              Dependencies lock file not found                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Diagnosticando o problema...
echo.

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ package.json não encontrado!
    echo 📁 Certifique-se de estar na pasta do projeto
    pause
    exit /b 1
)

echo ✅ package.json encontrado
echo.

REM Verificar se o workflow existe
if not exist ".github\workflows\build-android.yml" (
    echo ❌ Workflow do GitHub Actions não encontrado!
    echo 📁 Certifique-se de que .github\workflows\build-android.yml existe
    pause
    exit /b 1
)

echo ✅ Workflow do GitHub Actions encontrado
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
echo.

echo 🔧 SOLUÇÕES DISPONÍVEIS:
echo.
echo 1️⃣  Gerar package-lock.json (Recomendado)
echo 2️⃣  Verificar se workflow foi atualizado
echo 3️⃣  Forçar commit de todas as mudanças
echo 4️⃣  Ver status do Git
echo.

set /p choice="Escolha uma opção (1-4): "

if "%choice%"=="1" goto generate_lock
if "%choice%"=="2" goto check_workflow
if "%choice%"=="3" goto force_commit
if "%choice%"=="4" goto git_status

echo ❌ Opção inválida!
pause
exit /b 1

:generate_lock
echo.
echo 📦 GERANDO PACKAGE-LOCK.JSON...
echo.

REM Limpar instalação anterior
if exist "node_modules" (
    echo 🧹 Removendo node_modules antigo...
    rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
    echo 🧹 Removendo package-lock.json antigo...
    del "package-lock.json"
)

echo 📋 Instalando dependências...
npm install

if exist "package-lock.json" (
    echo ✅ package-lock.json gerado com sucesso!
    
    echo.
    echo 📊 Informações:
    for %%A in (package-lock.json) do echo    Tamanho: %%~zA bytes
    
    echo.
    echo 🚀 Fazendo commit do package-lock.json...
    git add package-lock.json
    git commit -m "Add package-lock.json for GitHub Actions"
    
    echo.
    echo 📤 Enviando para GitHub...
    git push
    
    echo.
    echo ✅ Pronto! O GitHub Actions agora deve funcionar.
) else (
    echo ❌ Erro ao gerar package-lock.json!
    echo 💡 Verifique se o package.json está correto
)
goto end

:check_workflow
echo.
echo 🔍 VERIFICANDO WORKFLOW...
echo.

findstr /c:"npm ci" ".github\workflows\build-android.yml" >nul
if not errorlevel 1 (
    echo ⚠️  Workflow ainda usa 'npm ci' sem verificação!
    echo.
    echo 💡 O workflow precisa ser atualizado para verificar se package-lock.json existe.
    echo    Vou mostrar a seção problemática:
    echo.
    findstr /n /c:"npm ci" ".github\workflows\build-android.yml"
    echo.
    echo 🔧 Solução: Execute a opção 3 para forçar commit do workflow atualizado
) else (
    echo ✅ Workflow parece estar atualizado!
    echo.
    echo 🔍 Verificando se tem a lógica de detecção de lock file...
    findstr /c:"package-lock.json" ".github\workflows\build-android.yml" >nul
    if not errorlevel 1 (
        echo ✅ Workflow tem verificação de package-lock.json
    ) else (
        echo ⚠️  Workflow pode não ter a verificação adequada
    )
)
goto end

:force_commit
echo.
echo 🚀 FORÇANDO COMMIT DE TODAS AS MUDANÇAS...
echo.

echo 📋 Status atual do Git:
git status --porcelain

echo.
echo 📦 Adicionando todos os arquivos...
git add .

echo.
echo 💾 Fazendo commit...
git commit -m "Fix GitHub Actions: Update workflow and add all Android build files

- Update build-android.yml to handle missing package-lock.json
- Add comprehensive Android APK build system
- Add Samsung S22 Ultra optimizations
- Add documentation and setup scripts"

echo.
echo 📤 Enviando para GitHub...
git push

echo.
echo ✅ Todas as mudanças foram enviadas!
goto end

:git_status
echo.
echo 📋 STATUS DO GIT:
echo.
git status
echo.
echo 📁 Arquivos não commitados:
git ls-files --others --exclude-standard
echo.
echo 🔄 Últimos commits:
git log --oneline -5
goto end

:end
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                         CONCLUÍDO!                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Vá para seu repositório no GitHub
echo 2. Clique na aba "Actions"
echo 3. Veja se o workflow está executando
echo 4. Se ainda der erro, execute este script novamente
echo.
echo 🔗 Seu repositório: https://github.com/gugamilani940/gerador-aulas-app
echo.
pause
