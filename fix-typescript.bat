@echo off
echo 🔧 CORRIGINDO DEPENDÊNCIA DO TYPESCRIPT
echo ======================================
echo.

echo 📦 Instalando TypeScript como dependência de desenvolvimento...
npm install -D typescript
if errorlevel 1 (
    echo ❌ Erro ao instalar TypeScript!
    echo 💡 Tente limpar o cache: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo ✅ TypeScript instalado com sucesso!

echo.
echo 🔄 Testando sync do Capacitor...
npx cap sync
if errorlevel 1 (
    echo ❌ Ainda há problemas com o sync!
    echo.
    echo 🔍 Verificando se todas as dependências estão instaladas...
    npm list @capacitor/core @capacitor/cli @capacitor/android
    pause
    exit /b 1
) else (
    echo ✅ Capacitor sync executado com sucesso!
)

echo.
echo 🎯 Verificando se a plataforma Android foi configurada...
if exist "android" (
    echo ✅ Pasta android encontrada!
    echo 📱 Pronto para abrir no Android Studio!
    echo.
    echo 🚀 Deseja abrir o Android Studio agora? (S/N)
    set /p choice=
    if /i "%choice%"=="S" (
        npx cap open android
    )
) else (
    echo ❌ Pasta android não encontrada!
    echo 📱 Adicionando plataforma Android...
    npx cap add android
    if errorlevel 1 (
        echo ❌ Erro ao adicionar Android!
    ) else (
        echo ✅ Android adicionado! Executando sync final...
        npx cap sync
    )
)

echo.
echo ✅ CORREÇÃO CONCLUÍDA!
pause