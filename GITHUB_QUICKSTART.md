# 🚀 GitHub Quick Start - Gerador de Aulas Android APK

> **3 maneiras fáceis de gerar seu APK no GitHub!**

## 🎯 Método 1: Clone + Build Local (5 minutos)

```bash
# 1. Clone o repositório
git clone https://github.com/gugamilani940/gerador-aulas-app.git
cd gerador-aulas-app

# 2. Setup automático (Windows)
quick-setup.bat

# 3. Gerar ícones
# Abra create-icons.html no navegador → Baixar todos → Salvar em icons/

# 4. Build APK
npx cap open android
# No Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**✅ Pronto! APK em:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ☁️ Método 2: GitHub Codespaces (Online - 0 instalações)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/gugamilani940/gerador-aulas-app)

1. **Clique no botão acima** ☝️
2. **Aguarde** o ambiente carregar (2-3 minutos)
3. **Execute no terminal**:
   ```bash
   ./build-quick.sh
   ```
4. **Baixe o APK** gerado automaticamente

**🌟 Vantagens:** Funciona em qualquer computador, tablet ou até celular!

---

## 🤖 Método 3: GitHub Actions (Automático)

1. **Fork** este repositório
2. **Vá em** `Actions` → `Build Android APK`
3. **Clique** `Run workflow` → `Run workflow`
4. **Aguarde** 5-10 minutos
5. **Baixe** o APK dos `Artifacts`

**🔄 Automático:** Gera APK a cada push na branch `main`

---

## 📱 Instalação no Samsung S22 Ultra

### Via USB (Recomendado):
```bash
# 1. Ativar "Depuração USB" no celular
# 2. Conectar via USB
# 3. Instalar
adb install app-debug.apk
```

### Manual:
1. Transferir APK para o celular
2. Ativar "Fontes desconhecidas"
3. Abrir APK → Instalar

---

## 🛠️ Comandos Úteis

```bash
# Servir PWA localmente
npm run serve

# Build rápido
npm run android:quick

# Reset completo
npm run reset

# Codespaces setup
npm run codespaces:setup
```

---

## 🎯 Links Rápidos

- 📖 **Guia Completo**: [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)
- 🎨 **Gerar Ícones**: [create-icons.html](create-icons.html)
- 🐛 **Issues**: [GitHub Issues](https://github.com/gugamilani940/gerador-aulas-app/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/gugamilani940/gerador-aulas-app/discussions)

---

## ❓ Problemas Comuns

<details>
<summary><strong>🔧 "Node.js não encontrado"</strong></summary>

**Solução:**
```bash
# Windows
winget install OpenJS.NodeJS

# Ou baixar: https://nodejs.org/
```
</details>

<details>
<summary><strong>📱 "ANDROID_HOME não configurado"</strong></summary>

**Solução:**
```bash
# Windows
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Adicionar ao PATH permanentemente
```
</details>

<details>
<summary><strong>🏗️ "Gradle build failed"</strong></summary>

**Solução:**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```
</details>

<details>
<summary><strong>📲 "Device not found"</strong></summary>

**Solução:**
```bash
adb devices
adb kill-server
adb start-server
```
</details>

---

## 🎉 Resultado Final

Após seguir qualquer método acima, você terá:

- ✅ **APK Android** otimizado para Samsung S22 Ultra
- ✅ **Interface responsiva** (3088x1440, 516 PPI)
- ✅ **Todas as funcionalidades** do PWA original
- ✅ **Modo offline** com Service Worker
- ✅ **Integração IA** (OpenAI GPT-4)
- ✅ **Análise de PDFs** científicos
- ✅ **Compatibilidade One UI** (Samsung)

---

<div align="center">

**🧬 Transforme PDFs científicos em aulas interativas!**

[![GitHub stars](https://img.shields.io/github/stars/gugamilani940/gerador-aulas-app?style=social)](https://github.com/gugamilani940/gerador-aulas-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/gugamilani940/gerador-aulas-app?style=social)](https://github.com/gugamilani940/gerador-aulas-app/network)

**Escolha seu método preferido e comece agora! 🚀**

</div>
