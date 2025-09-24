/**
 * Sistema de Preferências Avançado
 * Versão: 2.0.0
 * Recursos: Configurações personalizadas, temas, templates, IA
 */

class PreferencesSystem {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.themes = this.getAvailableThemes();
        this.templates = this.getAvailableTemplates();
        this.aiModels = this.getAvailableAIModels();
        this.init();
    }

    init() {
        this.createPreferencesUI();
        this.setupEventListeners();
    }

    getAvailableThemes() {
        return {
            light: {
                name: 'Claro',
                colors: {
                    primary: '#3498db',
                    secondary: '#2c3e50',
                    background: '#ffffff',
                    surface: '#f8f9fa',
                    text: '#2c3e50',
                    textSecondary: '#7f8c8d'
                }
            },
            dark: {
                name: 'Escuro',
                colors: {
                    primary: '#3498db',
                    secondary: '#ecf0f1',
                    background: '#2c3e50',
                    surface: '#34495e',
                    text: '#ecf0f1',
                    textSecondary: '#bdc3c7'
                }
            },
            scientific: {
                name: 'Científico',
                colors: {
                    primary: '#27ae60',
                    secondary: '#2c3e50',
                    background: '#ffffff',
                    surface: '#f1f2f6',
                    text: '#2f3542',
                    textSecondary: '#57606f'
                }
            },
            ocean: {
                name: 'Oceano',
                colors: {
                    primary: '#0984e3',
                    secondary: '#2d3436',
                    background: '#dfe6e9',
                    surface: '#ffffff',
                    text: '#2d3436',
                    textSecondary: '#636e72'
                }
            }
        };
    }

    getAvailableTemplates() {
        return {
            academic: {
                name: 'Acadêmico',
                description: 'Formato tradicional para apresentações acadêmicas',
                structure: ['introducao', 'objetivos', 'desenvolvimento', 'conclusao', 'referencias'],
                style: 'formal'
            },
            interactive: {
                name: 'Interativo',
                description: 'Formato dinâmico com elementos interativos',
                structure: ['abertura', 'exploracao', 'atividades', 'sintese', 'recursos'],
                style: 'dynamic'
            },
            practical: {
                name: 'Prático',
                description: 'Foco em aplicações práticas e exemplos',
                structure: ['contexto', 'teoria', 'pratica', 'aplicacoes', 'exercicios'],
                style: 'practical'
            },
            research: {
                name: 'Pesquisa',
                description: 'Baseado em metodologia científica',
                structure: ['problema', 'hipotese', 'metodologia', 'resultados', 'discussao'],
                style: 'research'
            },
            workshop: {
                name: 'Workshop',
                description: 'Formato hands-on para aprendizado ativo',
                structure: ['aquecimento', 'demonstracao', 'pratica-guiada', 'pratica-livre', 'reflexao'],
                style: 'workshop'
            }
        };
    }

    getAvailableAIModels() {
        return {
            'gpt-3.5-turbo': {
                name: 'GPT-3.5 Turbo',
                description: 'Rápido e eficiente para a maioria das tarefas',
                speed: 'fast',
                quality: 'good',
                cost: 'low'
            },
            'gpt-4': {
                name: 'GPT-4',
                description: 'Máxima qualidade e precisão científica',
                speed: 'medium',
                quality: 'excellent',
                cost: 'high'
            },
            'claude-3': {
                name: 'Claude-3',
                description: 'Excelente para análise de documentos longos',
                speed: 'medium',
                quality: 'excellent',
                cost: 'medium'
            }
        };
    }

    createPreferencesUI() {
        const preferencesContainer = document.createElement('div');
        preferencesContainer.id = 'preferences-container';
        preferencesContainer.innerHTML = `
            <div class="preferences-modal" id="preferences-modal" style="display: none;">
                <div class="preferences-content">
                    <div class="preferences-header">
                        <h2>⚙️ Configurações</h2>
                        <button class="close-preferences" onclick="preferencesSystem.closePreferences()">&times;</button>
                    </div>

                    <div class="preferences-tabs">
                        <button class="pref-tab active" data-tab="general">Geral</button>
                        <button class="pref-tab" data-tab="appearance">Aparência</button>
                        <button class="pref-tab" data-tab="lecture">Aulas</button>
                        <button class="pref-tab" data-tab="ai">IA & Modelos</button>
                        <button class="pref-tab" data-tab="advanced">Avançado</button>
                    </div>

                    <div class="preferences-body">
                        <!-- Aba Geral -->
                        <div class="pref-content active" id="general-content">
                            <div class="pref-section">
                                <h3>🌐 Idioma e Região</h3>
                                <div class="pref-group">
                                    <label for="language-select">Idioma:</label>
                                    <select id="language-select">
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="en-US">English (US)</option>
                                        <option value="es-ES">Español</option>
                                        <option value="fr-FR">Français</option>
                                    </select>
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>💾 Armazenamento</h3>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="auto-save">
                                        <span class="checkmark"></span>
                                        Salvamento automático
                                    </label>
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="backup-enabled">
                                        <span class="checkmark"></span>
                                        Backup automático
                                    </label>
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>🔔 Notificações</h3>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="notifications-enabled">
                                        <span class="checkmark"></span>
                                        Ativar notificações
                                    </label>
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="sound-enabled">
                                        <span class="checkmark"></span>
                                        Sons de notificação
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Aba Aparência -->
                        <div class="pref-content" id="appearance-content">
                            <div class="pref-section">
                                <h3>🎨 Tema</h3>
                                <div class="theme-grid" id="theme-grid">
                                    <!-- Temas serão inseridos dinamicamente -->
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>📱 Interface</h3>
                                <div class="pref-group">
                                    <label for="font-size">Tamanho da fonte:</label>
                                    <input type="range" id="font-size" min="12" max="20" value="14">
                                    <span id="font-size-value">14px</span>
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="animations-enabled">
                                        <span class="checkmark"></span>
                                        Animações
                                    </label>
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="compact-mode">
                                        <span class="checkmark"></span>
                                        Modo compacto
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Aba Aulas -->
                        <div class="pref-content" id="lecture-content">
                            <div class="pref-section">
                                <h3>📚 Templates</h3>
                                <div class="template-grid" id="template-grid">
                                    <!-- Templates serão inseridos dinamicamente -->
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>⚙️ Configurações Padrão</h3>
                                <div class="pref-group">
                                    <label for="default-length">Duração padrão:</label>
                                    <select id="default-length">
                                        <option value="short">Curta (15-30 min)</option>
                                        <option value="medium">Média (45-60 min)</option>
                                        <option value="long">Longa (90+ min)</option>
                                    </select>
                                </div>
                                <div class="pref-group">
                                    <label for="complexity-level">Nível de complexidade:</label>
                                    <select id="complexity-level">
                                        <option value="basic">Básico</option>
                                        <option value="intermediate">Intermediário</option>
                                        <option value="advanced">Avançado</option>
                                    </select>
                                </div>
                                <div class="pref-group">
                                    <label for="max-modules">Máximo de módulos:</label>
                                    <input type="number" id="max-modules" min="3" max="20" value="10">
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>📄 Formato de Saída</h3>
                                <div class="pref-group">
                                    <label for="output-format">Formato preferido:</label>
                                    <select id="output-format">
                                        <option value="html">HTML Interativo</option>
                                        <option value="pdf">PDF</option>
                                        <option value="pptx">PowerPoint</option>
                                        <option value="markdown">Markdown</option>
                                    </select>
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="include-images">
                                        <span class="checkmark"></span>
                                        Incluir imagens
                                    </label>
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="include-references">
                                        <span class="checkmark"></span>
                                        Incluir referências
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Aba IA & Modelos -->
                        <div class="pref-content" id="ai-content">
                            <div class="pref-section">
                                <h3>🤖 Modelo de IA</h3>
                                <div class="ai-models-grid" id="ai-models-grid">
                                    <!-- Modelos serão inseridos dinamicamente -->
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>⚡ Configurações de Performance</h3>
                                <div class="pref-group">
                                    <label for="generation-speed">Velocidade vs Qualidade:</label>
                                    <input type="range" id="generation-speed" min="1" max="5" value="3">
                                    <div class="range-labels">
                                        <span>Rápido</span>
                                        <span>Balanceado</span>
                                        <span>Qualidade</span>
                                    </div>
                                </div>
                                <div class="pref-group">
                                    <label for="creativity-level">Nível de criatividade:</label>
                                    <input type="range" id="creativity-level" min="0" max="10" value="7">
                                    <div class="range-labels">
                                        <span>Conservador</span>
                                        <span>Criativo</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>🎯 Tópicos Preferidos</h3>
                                <div class="topics-container">
                                    <input type="text" id="topic-input" placeholder="Adicionar tópico...">
                                    <button onclick="preferencesSystem.addTopic()">Adicionar</button>
                                    <div class="topics-list" id="topics-list">
                                        <!-- Tópicos serão inseridos dinamicamente -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Aba Avançado -->
                        <div class="pref-content" id="advanced-content">
                            <div class="pref-section">
                                <h3>🔧 Configurações Técnicas</h3>
                                <div class="pref-group">
                                    <label for="cache-size">Tamanho do cache (MB):</label>
                                    <input type="number" id="cache-size" min="50" max="1000" value="200">
                                </div>
                                <div class="pref-group">
                                    <label for="concurrent-requests">Requisições simultâneas:</label>
                                    <input type="number" id="concurrent-requests" min="1" max="10" value="3">
                                </div>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="debug-mode">
                                        <span class="checkmark"></span>
                                        Modo debug
                                    </label>
                                </div>
                            </div>

                            <div class="pref-section">
                                <h3>📊 Dados e Privacidade</h3>
                                <div class="pref-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="analytics-enabled">
                                        <span class="checkmark"></span>
                                        Permitir análise de uso
                                    </label>
                                </div>
                                <div class="pref-group">
                                    <button class="danger-btn" onclick="preferencesSystem.clearAllData()">
                                        🗑️ Limpar todos os dados
                                    </button>
                                </div>
                                <div class="pref-group">
                                    <button class="export-btn" onclick="preferencesSystem.exportData()">
                                        📤 Exportar dados
                                    </button>
                                    <button class="import-btn" onclick="preferencesSystem.importData()">
                                        📥 Importar dados
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="preferences-footer">
                        <button class="cancel-btn" onclick="preferencesSystem.closePreferences()">Cancelar</button>
                        <button class="save-btn" onclick="preferencesSystem.savePreferences()">Salvar Configurações</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(preferencesContainer);
        this.addPreferencesStyles();
        this.populateThemes();
        this.populateTemplates();
        this.populateAIModels();
    }

    addPreferencesStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .preferences-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }

            .preferences-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 900px;
                height: 80%;
                max-height: 700px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                animation: preferencesSlideIn 0.4s ease-out;
                overflow: hidden;
            }

            @keyframes preferencesSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .preferences-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px;
                border-bottom: 2px solid #f0f0f0;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            }

            .preferences-header h2 {
                margin: 0;
                color: #2c3e50;
                font-size: 24px;
                font-weight: 600;
            }

            .close-preferences {
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #7f8c8d;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.3s ease;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close-preferences:hover {
                background: #e74c3c;
                color: white;
                transform: rotate(90deg);
            }

            .preferences-tabs {
                display: flex;
                background: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
                overflow-x: auto;
            }

            .pref-tab {
                padding: 15px 25px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                white-space: nowrap;
                border-bottom: 3px solid transparent;
            }

            .pref-tab.active {
                background: white;
                color: #3498db;
                border-bottom-color: #3498db;
            }

            .pref-tab:hover:not(.active) {
                background: #e9ecef;
            }

            .preferences-body {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
            }

            .pref-content {
                display: none;
                animation: contentFadeIn 0.3s ease-out;
            }

            .pref-content.active {
                display: block;
            }

            @keyframes contentFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .pref-section {
                margin-bottom: 35px;
                padding: 25px;
                background: #f8f9fa;
                border-radius: 15px;
                border-left: 4px solid #3498db;
            }

            .pref-section h3 {
                margin: 0 0 20px 0;
                color: #2c3e50;
                font-size: 18px;
                font-weight: 600;
            }

            .pref-group {
                margin-bottom: 20px;
            }

            .pref-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #2c3e50;
            }

            .pref-group input, .pref-group select {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .pref-group input:focus, .pref-group select:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            }

            .checkbox-label {
                display: flex !important;
                align-items: center;
                cursor: pointer;
                margin-bottom: 0 !important;
            }

            .checkbox-label input[type="checkbox"] {
                width: auto !important;
                margin-right: 12px;
                transform: scale(1.2);
            }

            .theme-grid, .template-grid, .ai-models-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }

            .theme-card, .template-card, .ai-model-card {
                padding: 20px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }

            .theme-card:hover, .template-card:hover, .ai-model-card:hover {
                border-color: #3498db;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);
            }

            .theme-card.selected, .template-card.selected, .ai-model-card.selected {
                border-color: #3498db;
                background: #f0f8ff;
            }

            .theme-preview {
                width: 100%;
                height: 60px;
                border-radius: 8px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }

            .range-labels {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #7f8c8d;
                margin-top: 5px;
            }

            .topics-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .topics-container input {
                flex: 1;
            }

            .topics-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .topic-tag {
                background: #3498db;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .topic-tag .remove {
                cursor: pointer;
                font-weight: bold;
            }

            .preferences-footer {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                padding: 25px 30px;
                border-top: 2px solid #f0f0f0;
                background: #f8f9fa;
            }

            .cancel-btn, .save-btn, .danger-btn, .export-btn, .import-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .cancel-btn {
                background: #95a5a6;
                color: white;
            }

            .save-btn {
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
            }

            .danger-btn {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
            }

            .export-btn, .import-btn {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
            }

            .cancel-btn:hover { background: #7f8c8d; }
            .save-btn:hover { background: linear-gradient(135deg, #2ecc71, #27ae60); }
            .danger-btn:hover { background: linear-gradient(135deg, #c0392b, #a93226); }
            .export-btn:hover, .import-btn:hover { background: linear-gradient(135deg, #2980b9, #21618c); }

            @media (max-width: 768px) {
                .preferences-content {
                    width: 95%;
                    height: 90%;
                }
                
                .preferences-tabs {
                    flex-wrap: wrap;
                }
                
                .pref-tab {
                    flex: 1;
                    min-width: 100px;
                }
                
                .theme-grid, .template-grid, .ai-models-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    populateThemes() {
        const themeGrid = document.getElementById('theme-grid');
        Object.entries(this.themes).forEach(([key, theme]) => {
            const themeCard = document.createElement('div');
            themeCard.className = 'theme-card';
            themeCard.dataset.theme = key;
            themeCard.innerHTML = `
                <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});">
                    ${theme.name}
                </div>
                <h4>${theme.name}</h4>
            `;
            themeCard.onclick = () => this.selectTheme(key);
            themeGrid.appendChild(themeCard);
        });
    }

    populateTemplates() {
        const templateGrid = document.getElementById('template-grid');
        Object.entries(this.templates).forEach(([key, template]) => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.dataset.template = key;
            templateCard.innerHTML = `
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <small>Estrutura: ${template.structure.length} seções</small>
            `;
            templateCard.onclick = () => this.selectTemplate(key);
            templateGrid.appendChild(templateCard);
        });
    }

    populateAIModels() {
        const aiGrid = document.getElementById('ai-models-grid');
        Object.entries(this.aiModels).forEach(([key, model]) => {
            const modelCard = document.createElement('div');
            modelCard.className = 'ai-model-card';
            modelCard.dataset.model = key;
            modelCard.innerHTML = `
                <h4>${model.name}</h4>
                <p>${model.description}</p>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 10px;">
                    <span>Velocidade: ${model.speed}</span>
                    <span>Qualidade: ${model.quality}</span>
                </div>
            `;
            modelCard.onclick = () => this.selectAIModel(key);
            aiGrid.appendChild(modelCard);
        });
    }

    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.pref-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Font size slider
        const fontSizeSlider = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        fontSizeSlider.addEventListener('input', () => {
            fontSizeValue.textContent = fontSizeSlider.value + 'px';
        });

        // Topic input
        document.getElementById('topic-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTopic();
            }
        });
    }

    switchTab(tabName) {
        // Atualizar tabs
        document.querySelectorAll('.pref-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Atualizar conteúdo
        document.querySelectorAll('.pref-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    selectTheme(themeKey) {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-theme="${themeKey}"]`).classList.add('selected');
    }

    selectTemplate(templateKey) {
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-template="${templateKey}"]`).classList.add('selected');
    }

    selectAIModel(modelKey) {
        document.querySelectorAll('.ai-model-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-model="${modelKey}"]`).classList.add('selected');
    }

    addTopic() {
        const input = document.getElementById('topic-input');
        const topic = input.value.trim();
        
        if (topic) {
            const topicsList = document.getElementById('topics-list');
            const topicTag = document.createElement('div');
            topicTag.className = 'topic-tag';
            topicTag.innerHTML = `
                ${topic}
                <span class="remove" onclick="this.parentElement.remove()">×</span>
            `;
            topicsList.appendChild(topicTag);
            input.value = '';
        }
    }

    loadPreferences() {
        if (!this.authSystem.isLoggedIn()) return;

        const user = this.authSystem.getCurrentUser();
        const prefs = user.preferences;

        // Carregar valores nos campos
        document.getElementById('language-select').value = prefs.language || 'pt-BR';
        document.getElementById('auto-save').checked = prefs.autoSave !== false;
        document.getElementById('notifications-enabled').checked = prefs.notifications !== false;
        document.getElementById('font-size').value = prefs.fontSize || 14;
        document.getElementById('font-size-value').textContent = (prefs.fontSize || 14) + 'px';
        document.getElementById('default-length').value = prefs.defaultLectureLength || 'medium';
        document.getElementById('complexity-level').value = prefs.complexityLevel || 'intermediate';
        document.getElementById('max-modules').value = prefs.maxModules || 10;
        document.getElementById('output-format').value = prefs.outputFormat || 'html';
        document.getElementById('include-images').checked = prefs.includeImages !== false;
        document.getElementById('include-references').checked = prefs.includeReferences !== false;

        // Selecionar tema, template e modelo de IA
        if (prefs.theme) this.selectTheme(prefs.theme);
        if (prefs.lectureTemplate) this.selectTemplate(prefs.lectureTemplate);
        if (prefs.aiModel) this.selectAIModel(prefs.aiModel);

        // Carregar tópicos preferidos
        const topicsList = document.getElementById('topics-list');
        topicsList.innerHTML = '';
        (prefs.preferredTopics || []).forEach(topic => {
            const topicTag = document.createElement('div');
            topicTag.className = 'topic-tag';
            topicTag.innerHTML = `
                ${topic}
                <span class="remove" onclick="this.parentElement.remove()">×</span>
            `;
            topicsList.appendChild(topicTag);
        });
    }

    savePreferences() {
        if (!this.authSystem.isLoggedIn()) {
            this.authSystem.showNotification('Faça login para salvar as configurações', 'error');
            return;
        }

        const preferences = {
            language: document.getElementById('language-select').value,
            autoSave: document.getElementById('auto-save').checked,
            notifications: document.getElementById('notifications-enabled').checked,
            fontSize: parseInt(document.getElementById('font-size').value),
            theme: document.querySelector('.theme-card.selected')?.dataset.theme || 'light',
            defaultLectureLength: document.getElementById('default-length').value,
            complexityLevel: document.getElementById('complexity-level').value,
            maxModules: parseInt(document.getElementById('max-modules').value),
            outputFormat: document.getElementById('output-format').value,
            includeImages: document.getElementById('include-images').checked,
            includeReferences: document.getElementById('include-references').checked,
            lectureTemplate: document.querySelector('.template-card.selected')?.dataset.template || 'academic',
            aiModel: document.querySelector('.ai-model-card.selected')?.dataset.model || 'gpt-3.5-turbo',
            preferredTopics: Array.from(document.querySelectorAll('.topic-tag')).map(tag => 
                tag.textContent.replace('×', '').trim()
            )
        };

        this.authSystem.updateUserPreferences(preferences);
        this.applyTheme(preferences.theme);
        this.authSystem.showNotification('Configurações salvas com sucesso!', 'success');
        this.closePreferences();
    }

    applyTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }

    showPreferences() {
        this.loadPreferences();
        document.getElementById('preferences-modal').style.display = 'flex';
    }

    closePreferences() {
        document.getElementById('preferences-modal').style.display = 'none';
    }

    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.clear();
            this.authSystem.showNotification('Todos os dados foram limpos', 'info');
            location.reload();
        }
    }

    exportData() {
        const data = {
            users: this.authSystem.users,
            version: '2.0.0',
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scientific-lecture-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.users && data.version) {
                            localStorage.setItem('scientificLectureUsers', JSON.stringify(data.users));
                            this.authSystem.showNotification('Dados importados com sucesso!', 'success');
                            location.reload();
                        } else {
                            throw new Error('Formato de arquivo inválido');
                        }
                    } catch (error) {
                        this.authSystem.showNotification('Erro ao importar dados: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

// Inicializar sistema de preferências quando o sistema de autenticação estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (window.authSystem) {
        window.preferencesSystem = new PreferencesSystem(window.authSystem);
    }
});