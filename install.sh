
#!/bin/bash
echo "🚀 INSTALANDO GERADOR DE AULAS CIENTÍFICAS"
echo "=========================================="
echo

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Instale Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado!"
    echo "📥 Instale Java 17: https://adoptium.net/"
    exit 1
fi

echo "✅ Java encontrado: $(java --version | head -n 1)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar Capacitor
echo "🔧 Configurando Capacitor..."
npx cap sync

# Verificar se Android SDK está disponível
if command -v adb &> /dev/null; then
    echo "✅ Android SDK encontrado"
    echo "📱 Adicionando plataforma Android..."
    npx cap add android
    npx cap sync android
    
    echo "🎯 Pronto para desenvolvimento!"
    echo "Execute: npm run android"
else
    echo "⚠️  Android SDK não encontrado"
    echo "📱 Instale Android Studio para desenvolvimento mobile"
    echo "🌐 Por enquanto, execute: npm run dev"
fi

echo
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "📋 Comandos disponíveis:"
echo "   npm run dev      - Executar no navegador"
echo "   npm run android  - Executar no Android"
echo "   npm run sync     - Sincronizar arquivos"
