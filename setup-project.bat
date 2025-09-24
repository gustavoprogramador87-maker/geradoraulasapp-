@echo off
chcp 65001 >nul
echo 🚀 CONFIGURANDO PROJETO GERADOR DE AULAS CIENTÍFICAS
echo ================================================
echo.

echo 📦 1. Inicializando projeto Node.js...
npm init -y

echo 📦 2. Instalando dependências do Capacitor...
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar --save

echo 📦 3. Instalando dependências de desenvolvimento...
npm install -D typescript @types/node

echo 🎯 4. Inicializando Capacitor...
npx cap init "Gerador de Aulas Científicas" "com.gugamilani940.geradoraulas" --web-dir="dist"

echo 📱 5. Adicionando plataforma Android...
npx cap add android

echo ✅ Projeto configurado com sucesso!
pause