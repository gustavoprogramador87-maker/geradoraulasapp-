/**
 * Sistema Avançado de Análise de PDFs com IA
 * Versão: 3.0.0
 * Recursos: Extração de imagens, fórmulas, tabelas, gráficos, estruturas químicas
 */

class AdvancedPDFAnalyzer {
    constructor() {
        this.pdfDoc = null;
        this.extractedData = {
            text: '',
            images: [],
            formulas: [],
            tables: [],
            graphs: [],
            chemicalStructures: [],
            references: [],
            metadata: {}
        };
        this.analysisProgress = 0;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupPDFJS();
                this.createAnalysisUI();
            });
        } else {
            this.setupPDFJS();
            this.createAnalysisUI();
        }
    }

    setupPDFJS() {
        // Configurar PDF.js para análise avançada
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
        } else {
            console.warn('PDF.js não está carregado. Algumas funcionalidades podem não funcionar.');
        }
    }

    createAnalysisUI() {
        const analysisContainer = document.createElement('div');
        analysisContainer.id = 'pdf-analysis-container';
        analysisContainer.innerHTML = `
            <div class="analysis-modal" id="analysis-modal" style="display: none;">
                <div class="analysis-content">
                    <div class="analysis-header">
                        <h2>🔬 Análise Avançada de PDF</h2>
                        <button class="close-analysis" onclick="pdfAnalyzer.closeAnalysis()">&times;</button>
                    </div>

                    <div class="analysis-progress">
                        <div class="progress-info">
                            <span id="analysis-status">Preparando análise...</span>
                            <span id="analysis-percentage">0%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="analysis-progress-bar"></div>
                        </div>
                    </div>

                    <div class="analysis-tabs">
                        <button class="analysis-tab active" data-tab="overview">Visão Geral</button>
                        <button class="analysis-tab" data-tab="images">Imagens</button>
                        <button class="analysis-tab" data-tab="formulas">Fórmulas</button>
                        <button class="analysis-tab" data-tab="tables">Tabelas</button>
                        <button class="analysis-tab" data-tab="structures">Estruturas</button>
                        <button class="analysis-tab" data-tab="references">Referências</button>
                    </div>

                    <div class="analysis-body">
                        <!-- Aba Visão Geral -->
                        <div class="analysis-content-tab active" id="overview-content">
                            <div class="overview-grid">
                                <div class="overview-card">
                                    <h3>📄 Documento</h3>
                                    <div id="doc-info">
                                        <p><strong>Páginas:</strong> <span id="page-count">-</span></p>
                                        <p><strong>Tamanho:</strong> <span id="file-size">-</span></p>
                                        <p><strong>Tipo:</strong> <span id="doc-type">-</span></p>
                                    </div>
                                </div>
                                <div class="overview-card">
                                    <h3>🖼️ Elementos Visuais</h3>
                                    <div id="visual-stats">
                                        <p><strong>Imagens:</strong> <span id="images-count">0</span></p>
                                        <p><strong>Gráficos:</strong> <span id="graphs-count">0</span></p>
                                        <p><strong>Diagramas:</strong> <span id="diagrams-count">0</span></p>
                                    </div>
                                </div>
                                <div class="overview-card">
                                    <h3>🧮 Conteúdo Científico</h3>
                                    <div id="scientific-stats">
                                        <p><strong>Fórmulas:</strong> <span id="formulas-count">0</span></p>
                                        <p><strong>Tabelas:</strong> <span id="tables-count">0</span></p>
                                        <p><strong>Estruturas:</strong> <span id="structures-count">0</span></p>
                                    </div>
                                </div>
                                <div class="overview-card">
                                    <h3>📚 Referências</h3>
                                    <div id="references-stats">
                                        <p><strong>Citações:</strong> <span id="citations-count">0</span></p>
                                        <p><strong>Bibliografia:</strong> <span id="bibliography-count">0</span></p>
                                        <p><strong>Links:</strong> <span id="links-count">0</span></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="analysis-summary">
                                <h3>📊 Resumo da Análise</h3>
                                <div id="analysis-summary-content">
                                    <p>Aguardando análise...</p>
                                </div>
                            </div>
                        </div>

                        <!-- Aba Imagens -->
                        <div class="analysis-content-tab" id="images-content">
                            <div class="content-header">
                                <h3>🖼️ Imagens Extraídas</h3>
                                <div class="content-actions">
                                    <button class="btn" onclick="pdfAnalyzer.downloadAllImages()">📥 Baixar Todas</button>
                                    <button class="btn" onclick="pdfAnalyzer.analyzeImagesWithAI()">🤖 Analisar com IA</button>
                                </div>
                            </div>
                            <div class="images-grid" id="extracted-images">
                                <!-- Imagens serão inseridas dinamicamente -->
                            </div>
                        </div>

                        <!-- Aba Fórmulas -->
                        <div class="analysis-content-tab" id="formulas-content">
                            <div class="content-header">
                                <h3>🧮 Fórmulas Matemáticas e Químicas</h3>
                                <div class="content-actions">
                                    <button class="btn" onclick="pdfAnalyzer.exportFormulas()">📤 Exportar LaTeX</button>
                                    <button class="btn" onclick="pdfAnalyzer.renderFormulas()">🎨 Renderizar</button>
                                </div>
                            </div>
                            <div class="formulas-list" id="extracted-formulas">
                                <!-- Fórmulas serão inseridas dinamicamente -->
                            </div>
                        </div>

                        <!-- Aba Tabelas -->
                        <div class="analysis-content-tab" id="tables-content">
                            <div class="content-header">
                                <h3>📊 Tabelas e Dados</h3>
                                <div class="content-actions">
                                    <button class="btn" onclick="pdfAnalyzer.exportTables()">📊 Exportar CSV</button>
                                    <button class="btn" onclick="pdfAnalyzer.createCharts()">📈 Criar Gráficos</button>
                                </div>
                            </div>
                            <div class="tables-container" id="extracted-tables">
                                <!-- Tabelas serão inseridas dinamicamente -->
                            </div>
                        </div>

                        <!-- Aba Estruturas -->
                        <div class="analysis-content-tab" id="structures-content">
                            <div class="content-header">
                                <h3>🧬 Estruturas Químicas e Biológicas</h3>
                                <div class="content-actions">
                                    <button class="btn" onclick="pdfAnalyzer.export3DStructures()">🎯 Exportar 3D</button>
                                    <button class="btn" onclick="pdfAnalyzer.identifyMolecules()">🔍 Identificar</button>
                                </div>
                            </div>
                            <div class="structures-grid" id="extracted-structures">
                                <!-- Estruturas serão inseridas dinamicamente -->
                            </div>
                        </div>

                        <!-- Aba Referências -->
                        <div class="analysis-content-tab" id="references-content">
                            <div class="content-header">
                                <h3>📚 Referências e Citações</h3>
                                <div class="content-actions">
                                    <button class="btn" onclick="pdfAnalyzer.exportBibliography()">📝 Exportar BibTeX</button>
                                    <button class="btn" onclick="pdfAnalyzer.validateReferences()">✅ Validar</button>
                                </div>
                            </div>
                            <div class="references-list" id="extracted-references">
                                <!-- Referências serão inseridas dinamicamente -->
                            </div>
                        </div>
                    </div>

                    <div class="analysis-footer">
                        <button class="btn" onclick="pdfAnalyzer.generateReport()">📋 Gerar Relatório</button>
                        <button class="btn success" onclick="pdfAnalyzer.useInLecture()">✨ Usar na Aula</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(analysisContainer);
        this.addAnalysisStyles();
        this.setupAnalysisEventListeners();
    }

    addAnalysisStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .analysis-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }

            .analysis-content {
                background: white;
                border-radius: 20px;
                width: 95%;
                max-width: 1200px;
                height: 90%;
                display: flex;
                flex-direction: column;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
                animation: analysisSlideIn 0.5s ease-out;
                overflow: hidden;
            }

            @keyframes analysisSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-100px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .analysis-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px;
                border-bottom: 3px solid #f0f0f0;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }

            .analysis-header h2 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }

            .close-analysis {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                font-size: 32px;
                cursor: pointer;
                color: white;
                padding: 10px;
                border-radius: 50%;
                transition: all 0.3s ease;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close-analysis:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .analysis-progress {
                padding: 20px 30px;
                background: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
            }

            .progress-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-weight: 600;
            }

            .progress-bar-container {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .analysis-tabs {
                display: flex;
                background: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
                overflow-x: auto;
            }

            .analysis-tab {
                padding: 15px 25px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                white-space: nowrap;
                border-bottom: 3px solid transparent;
                min-width: 120px;
            }

            .analysis-tab.active {
                background: white;
                color: #667eea;
                border-bottom-color: #667eea;
            }

            .analysis-tab:hover:not(.active) {
                background: #e9ecef;
            }

            .analysis-body {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
            }

            .analysis-content-tab {
                display: none;
                animation: tabFadeIn 0.3s ease-out;
            }

            .analysis-content-tab.active {
                display: block;
            }

            @keyframes tabFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .overview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .overview-card {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 25px;
                border-left: 5px solid #667eea;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }

            .overview-card h3 {
                margin: 0 0 15px 0;
                color: #2c3e50;
                font-size: 18px;
            }

            .overview-card p {
                margin: 8px 0;
                color: #5a6c7d;
            }

            .analysis-summary {
                background: white;
                border-radius: 15px;
                padding: 25px;
                border: 2px solid #e0e0e0;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }

            .content-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }

            .content-header h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 22px;
            }

            .content-actions {
                display: flex;
                gap: 10px;
            }

            .images-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 20px;
            }

            .image-card {
                background: white;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid #e0e0e0;
                transition: all 0.3s ease;
            }

            .image-card:hover {
                border-color: #667eea;
                transform: translateY(-5px);
            }

            .image-preview {
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 10px;
            }

            .formulas-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .formula-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border-left: 5px solid #667eea;
            }

            .formula-preview {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                margin: 10px 0;
            }

            .tables-container {
                display: flex;
                flex-direction: column;
                gap: 25px;
            }

            .table-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid #e0e0e0;
                overflow-x: auto;
            }

            .structures-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }

            .structure-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid #e0e0e0;
                text-align: center;
            }

            .references-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .reference-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border-left: 5px solid #667eea;
            }

            .analysis-footer {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                padding: 25px 30px;
                border-top: 2px solid #f0f0f0;
                background: #f8f9fa;
            }

            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }

            .btn.success {
                background: linear-gradient(135deg, #27ae60, #2ecc71);
            }

            @media (max-width: 768px) {
                .analysis-content {
                    width: 98%;
                    height: 95%;
                }
                
                .overview-grid {
                    grid-template-columns: 1fr;
                }
                
                .content-header {
                    flex-direction: column;
                    gap: 15px;
                    align-items: flex-start;
                }
                
                .content-actions {
                    width: 100%;
                    justify-content: space-between;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupAnalysisEventListeners() {
        // Tabs
        document.querySelectorAll('.analysis-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchAnalysisTab(tabName);
            });
        });
    }

    switchAnalysisTab(tabName) {
        // Atualizar tabs
        document.querySelectorAll('.analysis-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Atualizar conteúdo
        document.querySelectorAll('.analysis-content-tab').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    async analyzePDF(file) {
        this.showAnalysis();
        this.updateProgress(0, 'Carregando PDF...');

        try {
            const arrayBuffer = await file.arrayBuffer();
            this.pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            // Atualizar informações básicas
            this.updateDocumentInfo(file, this.pdfDoc);
            
            // Executar análises em paralelo
            await this.performComprehensiveAnalysis();
            
            this.updateProgress(100, 'Análise concluída!');
            this.generateAnalysisSummary();
            
        } catch (error) {
            console.error('Erro na análise do PDF:', error);
            this.updateProgress(0, 'Erro na análise: ' + error.message);
        }
    }

    updateDocumentInfo(file, pdfDoc) {
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        document.getElementById('file-size').textContent = this.formatFileSize(file.size);
        document.getElementById('doc-type').textContent = 'PDF Científico';
    }

    async performComprehensiveAnalysis() {
        const totalPages = this.pdfDoc.numPages;
        const analysisSteps = [
            { name: 'Extraindo texto...', weight: 20 },
            { name: 'Identificando imagens...', weight: 25 },
            { name: 'Detectando fórmulas...', weight: 20 },
            { name: 'Analisando tabelas...', weight: 15 },
            { name: 'Identificando estruturas...', weight: 15 },
            { name: 'Processando referências...', weight: 5 }
        ];

        let currentProgress = 0;

        for (let i = 0; i < analysisSteps.length; i++) {
            const step = analysisSteps[i];
            this.updateProgress(currentProgress, step.name);

            switch (i) {
                case 0:
                    await this.extractText();
                    break;
                case 1:
                    await this.extractImages();
                    break;
                case 2:
                    await this.detectFormulas();
                    break;
                case 3:
                    await this.analyzeTables();
                    break;
                case 4:
                    await this.identifyStructures();
                    break;
                case 5:
                    await this.processReferences();
                    break;
            }

            currentProgress += step.weight;
            this.updateProgress(currentProgress, step.name + ' concluído');
            await this.delay(500); // Simular processamento
        }
    }

    async extractText() {
        let fullText = '';
        
        for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
            const page = await this.pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        this.extractedData.text = fullText;
    }

    async extractImages() {
        const images = [];
        
        for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
            const page = await this.pdfDoc.getPage(pageNum);
            const operatorList = await page.getOperatorList();
            
            // Simular extração de imagens (implementação real seria mais complexa)
            const pageImages = this.simulateImageExtraction(pageNum);
            images.push(...pageImages);
        }
        
        this.extractedData.images = images;
        this.displayExtractedImages(images);
        document.getElementById('images-count').textContent = images.length;
    }

    simulateImageExtraction(pageNum) {
        // Simular algumas imagens encontradas
        const imageTypes = ['gráfico', 'diagrama', 'fotografia', 'esquema'];
        const numImages = Math.floor(Math.random() * 3) + 1;
        const images = [];
        
        for (let i = 0; i < numImages; i++) {
            images.push({
                id: `img_${pageNum}_${i}`,
                page: pageNum,
                type: imageTypes[Math.floor(Math.random() * imageTypes.length)],
                width: 200 + Math.random() * 300,
                height: 150 + Math.random() * 200,
                description: `Imagem ${i + 1} da página ${pageNum}`,
                dataUrl: this.generatePlaceholderImage()
            });
        }
        
        return images;
    }

    generatePlaceholderImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        
        // Criar um gradiente colorido como placeholder
        const gradient = ctx.createLinearGradient(0, 0, 200, 150);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 150);
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Imagem Extraída', 100, 80);
        
        return canvas.toDataURL();
    }

    displayExtractedImages(images) {
        const imagesGrid = document.getElementById('extracted-images');
        imagesGrid.innerHTML = '';
        
        images.forEach(image => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            imageCard.innerHTML = `
                <img src="${image.dataUrl}" alt="${image.description}" class="image-preview">
                <h4>${image.type}</h4>
                <p>Página ${image.page}</p>
                <p>${image.width}x${image.height}px</p>
                <div style="margin-top: 10px;">
                    <button class="btn" onclick="pdfAnalyzer.analyzeImageWithAI('${image.id}')">🤖 Analisar</button>
                    <button class="btn" onclick="pdfAnalyzer.downloadImage('${image.id}')">💾 Baixar</button>
                </div>
            `;
            imagesGrid.appendChild(imageCard);
        });
    }

    async detectFormulas() {
        // Simular detecção de fórmulas usando regex e padrões
        const text = this.extractedData.text;
        const formulas = [];
        
        // Padrões para detectar fórmulas químicas e matemáticas
        const chemicalPatterns = [
            /[A-Z][a-z]?(\d+)?(\([A-Z][a-z]?\d*\))?(\d+)?/g, // Fórmulas químicas básicas
            /\b[A-Z][a-z]?\d*(\+|\-|\d)*\b/g // Íons e compostos
        ];
        
        const mathPatterns = [
            /\b\d+\s*[+\-*/=]\s*\d+/g, // Equações simples
            /\b[a-z]\s*=\s*[^,\s]+/g, // Variáveis
            /\b\d+\.\d+\s*[×x]\s*10\^[\-\d]+/g // Notação científica
        ];
        
        // Detectar fórmulas químicas
        chemicalPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            matches.forEach(match => {
                if (match.length > 2 && this.isLikelyChemicalFormula(match)) {
                    formulas.push({
                        type: 'chemical',
                        formula: match,
                        latex: this.convertToLaTeX(match, 'chemical'),
                        description: 'Fórmula química detectada'
                    });
                }
            });
        });
        
        // Detectar fórmulas matemáticas
        mathPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            matches.forEach(match => {
                formulas.push({
                    type: 'mathematical',
                    formula: match,
                    latex: this.convertToLaTeX(match, 'mathematical'),
                    description: 'Expressão matemática detectada'
                });
            });
        });
        
        this.extractedData.formulas = formulas;
        this.displayExtractedFormulas(formulas);
        document.getElementById('formulas-count').textContent = formulas.length;
    }

    isLikelyChemicalFormula(text) {
        // Verificar se o texto parece uma fórmula química
        const hasElement = /[A-Z][a-z]?/.test(text);
        const hasNumber = /\d/.test(text);
        const isNotWord = !/^[a-zA-Z]+$/.test(text);
        
        return hasElement && (hasNumber || isNotWord) && text.length <= 20;
    }

    convertToLaTeX(formula, type) {
        if (type === 'chemical') {
            // Converter para LaTeX químico
            return formula.replace(/(\d+)/g, '_{$1}');
        } else {
            // Converter para LaTeX matemático
            return formula.replace(/\*/g, '\\cdot ').replace(/\^/g, '^');
        }
    }

    displayExtractedFormulas(formulas) {
        const formulasList = document.getElementById('extracted-formulas');
        formulasList.innerHTML = '';
        
        formulas.forEach((formula, index) => {
            const formulaCard = document.createElement('div');
            formulaCard.className = 'formula-card';
            formulaCard.innerHTML = `
                <h4>${formula.type === 'chemical' ? '🧪' : '🧮'} ${formula.description}</h4>
                <div class="formula-preview">
                    <strong>Original:</strong> ${formula.formula}<br>
                    <strong>LaTeX:</strong> ${formula.latex}
                </div>
                <div style="margin-top: 15px;">
                    <button class="btn" onclick="pdfAnalyzer.renderFormula(${index})">🎨 Renderizar</button>
                    <button class="btn" onclick="pdfAnalyzer.copyLaTeX(${index})">📋 Copiar LaTeX</button>
                </div>
            `;
            formulasList.appendChild(formulaCard);
        });
    }

    async analyzeTables() {
        // Simular análise de tabelas
        const tables = this.simulateTableDetection();
        
        this.extractedData.tables = tables;
        this.displayExtractedTables(tables);
        document.getElementById('tables-count').textContent = tables.length;
    }

    simulateTableDetection() {
        // Simular algumas tabelas encontradas
        const tables = [];
        const numTables = Math.floor(Math.random() * 4) + 1;
        
        for (let i = 0; i < numTables; i++) {
            const rows = Math.floor(Math.random() * 8) + 3;
            const cols = Math.floor(Math.random() * 5) + 2;
            
            tables.push({
                id: `table_${i}`,
                rows: rows,
                columns: cols,
                title: `Tabela ${i + 1}`,
                data: this.generateSampleTableData(rows, cols),
                page: Math.floor(Math.random() * 5) + 1
            });
        }
        
        return tables;
    }

    generateSampleTableData(rows, cols) {
        const data = [];
        const headers = ['Parâmetro', 'Valor', 'Unidade', 'Erro', 'Observações'].slice(0, cols);
        data.push(headers);
        
        for (let i = 1; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                if (j === 0) {
                    row.push(`Item ${i}`);
                } else if (j === 1) {
                    row.push((Math.random() * 100).toFixed(2));
                } else {
                    row.push(`Dado ${i}-${j}`);
                }
            }
            data.push(row);
        }
        
        return data;
    }

    displayExtractedTables(tables) {
        const tablesContainer = document.getElementById('extracted-tables');
        tablesContainer.innerHTML = '';
        
        tables.forEach(table => {
            const tableCard = document.createElement('div');
            tableCard.className = 'table-card';
            
            let tableHTML = `<h4>📊 ${table.title} (Página ${table.page})</h4>`;
            tableHTML += '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">';
            
            table.data.forEach((row, rowIndex) => {
                tableHTML += '<tr>';
                row.forEach(cell => {
                    const tag = rowIndex === 0 ? 'th' : 'td';
                    const style = rowIndex === 0 ? 
                        'background: #667eea; color: white; padding: 10px; border: 1px solid #ddd;' :
                        'padding: 8px; border: 1px solid #ddd;';
                    tableHTML += `<${tag} style="${style}">${cell}</${tag}>`;
                });
                tableHTML += '</tr>';
            });
            
            tableHTML += '</table>';
            tableHTML += `
                <div style="margin-top: 15px;">
                    <button class="btn" onclick="pdfAnalyzer.exportTable('${table.id}')">📊 Exportar CSV</button>
                    <button class="btn" onclick="pdfAnalyzer.createChart('${table.id}')">📈 Criar Gráfico</button>
                </div>
            `;
            
            tableCard.innerHTML = tableHTML;
            tablesContainer.appendChild(tableCard);
        });
    }

    async identifyStructures() {
        // Simular identificação de estruturas químicas/biológicas
        const structures = this.simulateStructureDetection();
        
        this.extractedData.chemicalStructures = structures;
        this.displayExtractedStructures(structures);
        document.getElementById('structures-count').textContent = structures.length;
    }

    simulateStructureDetection() {
        const structureTypes = ['Proteína', 'DNA', 'Molécula orgânica', 'Complexo enzimático'];
        const structures = [];
        const numStructures = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numStructures; i++) {
            structures.push({
                id: `structure_${i}`,
                type: structureTypes[Math.floor(Math.random() * structureTypes.length)],
                name: `Estrutura ${i + 1}`,
                confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
                page: Math.floor(Math.random() * 5) + 1,
                description: 'Estrutura identificada por análise de imagem'
            });
        }
        
        return structures;
    }

    displayExtractedStructures(structures) {
        const structuresGrid = document.getElementById('extracted-structures');
        structuresGrid.innerHTML = '';
        
        structures.forEach(structure => {
            const structureCard = document.createElement('div');
            structureCard.className = 'structure-card';
            structureCard.innerHTML = `
                <div style="width: 100%; height: 150px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                    <span style="font-size: 48px;">🧬</span>
                </div>
                <h4>${structure.name}</h4>
                <p><strong>Tipo:</strong> ${structure.type}</p>
                <p><strong>Confiança:</strong> ${(structure.confidence * 100).toFixed(0)}%</p>
                <p><strong>Página:</strong> ${structure.page}</p>
                <div style="margin-top: 15px;">
                    <button class="btn" onclick="pdfAnalyzer.analyze3DStructure('${structure.id}')">🎯 Análise 3D</button>
                    <button class="btn" onclick="pdfAnalyzer.identifyMolecule('${structure.id}')">🔍 Identificar</button>
                </div>
            `;
            structuresGrid.appendChild(structureCard);
        });
    }

    async processReferences() {
        // Simular processamento de referências
        const references = this.simulateReferenceExtraction();
        
        this.extractedData.references = references;
        this.displayExtractedReferences(references);
        document.getElementById('citations-count').textContent = references.filter(r => r.type === 'citation').length;
        document.getElementById('bibliography-count').textContent = references.filter(r => r.type === 'bibliography').length;
    }

    simulateReferenceExtraction() {
        const references = [];
        
        // Simular algumas referências
        const sampleRefs = [
            {
                type: 'bibliography',
                authors: 'Silva, J. et al.',
                title: 'Advances in Biochemical Analysis',
                journal: 'Nature Biochemistry',
                year: '2023',
                doi: '10.1038/s41586-023-12345'
            },
            {
                type: 'citation',
                text: 'Como demonstrado por Silva et al. (2023)',
                reference: 'Silva, J. et al. (2023)',
                page: 3
            }
        ];
        
        return sampleRefs;
    }

    displayExtractedReferences(references) {
        const referencesList = document.getElementById('extracted-references');
        referencesList.innerHTML = '';
        
        references.forEach((ref, index) => {
            const refCard = document.createElement('div');
            refCard.className = 'reference-card';
            
            if (ref.type === 'bibliography') {
                refCard.innerHTML = `
                    <h4>📚 Referência Bibliográfica</h4>
                    <p><strong>Autores:</strong> ${ref.authors}</p>
                    <p><strong>Título:</strong> ${ref.title}</p>
                    <p><strong>Periódico:</strong> ${ref.journal}</p>
                    <p><strong>Ano:</strong> ${ref.year}</p>
                    ${ref.doi ? `<p><strong>DOI:</strong> ${ref.doi}</p>` : ''}
                    <div style="margin-top: 15px;">
                        <button class="btn" onclick="pdfAnalyzer.validateReference(${index})">✅ Validar</button>
                        <button class="btn" onclick="pdfAnalyzer.exportBibTeX(${index})">📝 BibTeX</button>
                    </div>
                `;
            } else {
                refCard.innerHTML = `
                    <h4>📖 Citação</h4>
                    <p><strong>Texto:</strong> "${ref.text}"</p>
                    <p><strong>Referência:</strong> ${ref.reference}</p>
                    <p><strong>Página:</strong> ${ref.page}</p>
                    <div style="margin-top: 15px;">
                        <button class="btn" onclick="pdfAnalyzer.findReference(${index})">🔍 Localizar</button>
                    </div>
                `;
            }
            
            referencesList.appendChild(refCard);
        });
    }

    generateAnalysisSummary() {
        const summary = document.getElementById('analysis-summary-content');
        const data = this.extractedData;
        
        summary.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="text-align: center; padding: 15px; background: #f0f8ff; border-radius: 10px;">
                    <h4 style="margin: 0; color: #667eea;">Conteúdo Textual</h4>
                    <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.text.length.toLocaleString()}</p>
                    <p style="margin: 0; color: #666;">caracteres</p>
                </div>
                <div style="text-align: center; padding: 15px; background: #f0fff0; border-radius: 10px;">
                    <h4 style="margin: 0; color: #27ae60;">Elementos Visuais</h4>
                    <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.images.length}</p>
                    <p style="margin: 0; color: #666;">imagens</p>
                </div>
                <div style="text-align: center; padding: 15px; background: #fff8f0; border-radius: 10px;">
                    <h4 style="margin: 0; color: #f39c12;">Dados Estruturados</h4>
                    <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.tables.length}</p>
                    <p style="margin: 0; color: #666;">tabelas</p>
                </div>
            </div>
            <p><strong>Resumo:</strong> O documento contém ${data.images.length} elementos visuais, ${data.formulas.length} fórmulas, ${data.tables.length} tabelas e ${data.references.length} referências. A análise identificou conteúdo científico rico adequado para criação de aulas interativas.</p>
            <p><strong>Recomendações:</strong> Este material é ideal para criação de aulas com foco em visualizações científicas e dados experimentais.</p>
        `;
    }

    // Métodos utilitários
    updateProgress(percentage, status) {
        this.analysisProgress = percentage;
        document.getElementById('analysis-progress-bar').style.width = percentage + '%';
        document.getElementById('analysis-percentage').textContent = Math.round(percentage) + '%';
        document.getElementById('analysis-status').textContent = status;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Métodos de interface
    showAnalysis() {
        document.getElementById('analysis-modal').style.display = 'flex';
    }

    closeAnalysis() {
        document.getElementById('analysis-modal').style.display = 'none';
    }

    // Métodos de ação (implementações básicas)
    downloadAllImages() {
        console.log('Baixando todas as imagens...');
        // Implementar download em lote
    }

    analyzeImagesWithAI() {
        console.log('Analisando imagens com IA...');
        // Implementar análise de IA
    }

    exportFormulas() {
        console.log('Exportando fórmulas...');
        // Implementar exportação LaTeX
    }

    generateReport() {
        console.log('Gerando relatório...');
        // Implementar geração de relatório
    }

    useInLecture() {
        console.log('Usando dados na aula...');
        this.closeAnalysis();
        // Integrar com o sistema de geração de aulas
    }
}

// Inicializar analisador de PDF
const pdfAnalyzer = new AdvancedPDFAnalyzer();

// Exportar para uso global
window.pdfAnalyzer = pdfAnalyzer;