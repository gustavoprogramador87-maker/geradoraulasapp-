/**
 * Biblioteca de Aulas Científicas
 * Versão: 3.0.0
 * Recursos: Busca avançada, categorização, tags, favoritos, compartilhamento
 */

class LectureLibrary {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.lectures = this.loadLectures();
        this.categories = this.getDefaultCategories();
        this.tags = this.loadTags();
        this.filters = {
            category: 'all',
            tags: [],
            dateRange: 'all',
            author: 'all',
            searchTerm: ''
        };
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createLibraryUI();
                this.setupEventListeners();
                this.loadUserLectures();
            });
        } else {
            this.createLibraryUI();
            this.setupEventListeners();
            this.loadUserLectures();
        }
    }

    getDefaultCategories() {
        return {
            biochemistry: { name: 'Bioquímica', icon: '🧬', color: '#3498db' },
            chemistry: { name: 'Química', icon: '⚗️', color: '#e74c3c' },
            biology: { name: 'Biologia', icon: '🔬', color: '#27ae60' },
            physics: { name: 'Física', icon: '⚛️', color: '#9b59b6' },
            medicine: { name: 'Medicina', icon: '🏥', color: '#e67e22' },
            pharmacology: { name: 'Farmacologia', icon: '💊', color: '#1abc9c' },
            genetics: { name: 'Genética', icon: '🧬', color: '#f39c12' },
            microbiology: { name: 'Microbiologia', icon: '🦠', color: '#34495e' },
            neuroscience: { name: 'Neurociência', icon: '🧠', color: '#8e44ad' },
            ecology: { name: 'Ecologia', icon: '🌱', color: '#2ecc71' }
        };
    }

    createLibraryUI() {
        const libraryContainer = document.createElement('div');
        libraryContainer.id = 'lecture-library-container';
        libraryContainer.innerHTML = `
            <div class="library-modal" id="library-modal" style="display: none;">
                <div class="library-content">
                    <div class="library-header">
                        <h2>📚 Biblioteca de Aulas</h2>
                        <div class="header-actions">
                            <button class="btn" onclick="lectureLibrary.importLectures()">📥 Importar</button>
                            <button class="btn" onclick="lectureLibrary.exportLibrary()">📤 Exportar</button>
                            <button class="close-library" onclick="lectureLibrary.closeLibrary()">&times;</button>
                        </div>
                    </div>

                    <div class="library-toolbar">
                        <div class="search-section">
                            <div class="search-box">
                                <input type="text" id="library-search" placeholder="🔍 Buscar aulas..." />
                                <button class="search-btn" onclick="lectureLibrary.performSearch()">Buscar</button>
                            </div>
                            <div class="quick-filters">
                                <button class="filter-btn active" data-filter="all">Todas</button>
                                <button class="filter-btn" data-filter="favorites">⭐ Favoritas</button>
                                <button class="filter-btn" data-filter="recent">🕒 Recentes</button>
                                <button class="filter-btn" data-filter="shared">🔗 Compartilhadas</button>
                            </div>
                        </div>

                        <div class="filter-section">
                            <div class="filter-group">
                                <label>Categoria:</label>
                                <select id="category-filter">
                                    <option value="all">Todas as categorias</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Período:</label>
                                <select id="date-filter">
                                    <option value="all">Todos os períodos</option>
                                    <option value="today">Hoje</option>
                                    <option value="week">Esta semana</option>
                                    <option value="month">Este mês</option>
                                    <option value="year">Este ano</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Ordenar por:</label>
                                <select id="sort-filter">
                                    <option value="date-desc">Data (mais recente)</option>
                                    <option value="date-asc">Data (mais antigo)</option>
                                    <option value="title-asc">Título (A-Z)</option>
                                    <option value="title-desc">Título (Z-A)</option>
                                    <option value="rating-desc">Avaliação</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="library-body">
                        <div class="library-sidebar">
                            <div class="categories-section">
                                <h3>📂 Categorias</h3>
                                <div class="categories-list" id="categories-list">
                                    <!-- Categorias serão inseridas dinamicamente -->
                                </div>
                            </div>

                            <div class="tags-section">
                                <h3>🏷️ Tags</h3>
                                <div class="tags-cloud" id="tags-cloud">
                                    <!-- Tags serão inseridas dinamicamente -->
                                </div>
                            </div>

                            <div class="stats-section">
                                <h3>📊 Estatísticas</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="stat-number" id="total-lectures">0</span>
                                        <span class="stat-label">Total de Aulas</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number" id="favorites-count">0</span>
                                        <span class="stat-label">Favoritas</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number" id="categories-count">0</span>
                                        <span class="stat-label">Categorias</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="library-main">
                            <div class="results-header">
                                <span id="results-count">0 aulas encontradas</span>
                                <div class="view-options">
                                    <button class="view-btn active" data-view="grid" title="Visualização em grade">⊞</button>
                                    <button class="view-btn" data-view="list" title="Visualização em lista">☰</button>
                                </div>
                            </div>

                            <div class="lectures-container" id="lectures-container">
                                <!-- Aulas serão inseridas dinamicamente -->
                            </div>

                            <div class="pagination" id="pagination">
                                <!-- Paginação será inserida dinamicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de detalhes da aula -->
            <div class="lecture-details-modal" id="lecture-details-modal" style="display: none;">
                <div class="lecture-details-content">
                    <div class="details-header">
                        <h2 id="lecture-title">Título da Aula</h2>
                        <button class="close-details" onclick="lectureLibrary.closeLectureDetails()">&times;</button>
                    </div>
                    <div class="details-body" id="lecture-details-body">
                        <!-- Detalhes serão inseridos dinamicamente -->
                    </div>
                    <div class="details-footer">
                        <button class="btn" onclick="lectureLibrary.editLecture()">✏️ Editar</button>
                        <button class="btn" onclick="lectureLibrary.duplicateLecture()">📋 Duplicar</button>
                        <button class="btn" onclick="lectureLibrary.shareLecture()">🔗 Compartilhar</button>
                        <button class="btn success" onclick="lectureLibrary.openLecture()">▶️ Abrir Aula</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(libraryContainer);
        this.addLibraryStyles();
        this.populateCategories();
        this.populateTags();
    }

    addLibraryStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .library-modal {
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

            .library-content {
                background: white;
                border-radius: 20px;
                width: 95%;
                max-width: 1400px;
                height: 90%;
                display: flex;
                flex-direction: column;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
                animation: librarySlideIn 0.5s ease-out;
                overflow: hidden;
            }

            @keyframes librarySlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-100px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .library-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px;
                border-bottom: 3px solid #f0f0f0;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }

            .library-header h2 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }

            .header-actions {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .close-library {
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

            .close-library:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .library-toolbar {
                padding: 20px 30px;
                background: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
            }

            .search-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                gap: 20px;
            }

            .search-box {
                display: flex;
                flex: 1;
                max-width: 400px;
                gap: 10px;
            }

            .search-box input {
                flex: 1;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 25px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .search-box input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .search-btn {
                padding: 12px 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .search-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }

            .quick-filters {
                display: flex;
                gap: 10px;
            }

            .filter-btn {
                padding: 8px 16px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .filter-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .filter-btn:hover:not(.active) {
                border-color: #667eea;
                color: #667eea;
            }

            .filter-section {
                display: flex;
                gap: 20px;
                align-items: center;
            }

            .filter-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .filter-group label {
                font-weight: 600;
                color: #2c3e50;
                font-size: 14px;
            }

            .filter-group select {
                padding: 8px 12px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                min-width: 150px;
            }

            .library-body {
                flex: 1;
                display: flex;
                overflow: hidden;
            }

            .library-sidebar {
                width: 280px;
                background: #f8f9fa;
                border-right: 1px solid #e0e0e0;
                padding: 25px;
                overflow-y: auto;
            }

            .library-sidebar h3 {
                margin: 0 0 15px 0;
                color: #2c3e50;
                font-size: 16px;
                font-weight: 600;
            }

            .categories-section, .tags-section, .stats-section {
                margin-bottom: 30px;
            }

            .categories-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .category-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
            }

            .category-item:hover {
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .category-item.active {
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-left: 4px solid #667eea;
            }

            .category-icon {
                font-size: 18px;
            }

            .category-count {
                margin-left: auto;
                background: #e0e0e0;
                color: #666;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .tags-cloud {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .tag-item {
                background: #e0e0e0;
                color: #666;
                padding: 4px 10px;
                border-radius: 15px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .tag-item:hover {
                background: #667eea;
                color: white;
            }

            .tag-item.active {
                background: #667eea;
                color: white;
            }

            .stats-grid {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .stat-item {
                text-align: center;
                padding: 15px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .stat-number {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
            }

            .stat-label {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }

            .library-main {
                flex: 1;
                padding: 25px;
                overflow-y: auto;
            }

            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }

            .results-header span {
                font-weight: 600;
                color: #2c3e50;
            }

            .view-options {
                display: flex;
                gap: 5px;
            }

            .view-btn {
                width: 35px;
                height: 35px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .view-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .view-btn:hover:not(.active) {
                border-color: #667eea;
                color: #667eea;
            }

            .lectures-container {
                min-height: 400px;
            }

            .lectures-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }

            .lectures-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .lecture-card {
                background: white;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid transparent;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .lecture-card:hover {
                border-color: #667eea;
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
            }

            .lecture-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
            }

            .lecture-title {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin: 0;
                line-height: 1.3;
            }

            .lecture-actions {
                display: flex;
                gap: 5px;
            }

            .action-btn {
                width: 30px;
                height: 30px;
                border: none;
                background: #f8f9fa;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .action-btn:hover {
                background: #667eea;
                color: white;
            }

            .lecture-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 15px;
                font-size: 12px;
                color: #666;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .lecture-description {
                color: #5a6c7d;
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 15px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .lecture-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 15px;
            }

            .lecture-tag {
                background: #f0f8ff;
                color: #667eea;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
            }

            .lecture-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 15px;
                border-top: 1px solid #f0f0f0;
            }

            .lecture-rating {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 14px;
            }

            .stars {
                color: #f39c12;
            }

            .lecture-date {
                font-size: 12px;
                color: #999;
            }

            .pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #f0f0f0;
            }

            .page-btn {
                width: 35px;
                height: 35px;
                border: 1px solid #e0e0e0;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .page-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .page-btn:hover:not(.active) {
                border-color: #667eea;
                color: #667eea;
            }

            .lecture-details-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
                backdrop-filter: blur(5px);
            }

            .lecture-details-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 80%;
                display: flex;
                flex-direction: column;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                animation: detailsSlideIn 0.4s ease-out;
                overflow: hidden;
            }

            @keyframes detailsSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .details-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px;
                border-bottom: 2px solid #f0f0f0;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            }

            .details-header h2 {
                margin: 0;
                color: #2c3e50;
                font-size: 24px;
                font-weight: 600;
            }

            .close-details {
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

            .close-details:hover {
                background: #e74c3c;
                color: white;
                transform: rotate(90deg);
            }

            .details-body {
                flex: 1;
                padding: 30px;
                overflow-y: auto;
            }

            .details-footer {
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
                .library-content {
                    width: 98%;
                    height: 95%;
                }
                
                .library-body {
                    flex-direction: column;
                }
                
                .library-sidebar {
                    width: 100%;
                    max-height: 200px;
                }
                
                .search-section {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .filter-section {
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .lectures-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    populateCategories() {
        const categoriesList = document.getElementById('categories-list');
        const categoryFilter = document.getElementById('category-filter');
        
        // Adicionar "Todas" na lista
        const allItem = document.createElement('div');
        allItem.className = 'category-item active';
        allItem.dataset.category = 'all';
        allItem.innerHTML = `
            <span class="category-icon">📚</span>
            <span>Todas</span>
            <span class="category-count" id="all-count">0</span>
        `;
        allItem.onclick = () => this.filterByCategory('all');
        categoriesList.appendChild(allItem);
        
        // Adicionar categorias
        Object.entries(this.categories).forEach(([key, category]) => {
            // Lista lateral
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.dataset.category = key;
            categoryItem.innerHTML = `
                <span class="category-icon">${category.icon}</span>
                <span>${category.name}</span>
                <span class="category-count" id="${key}-count">0</span>
            `;
            categoryItem.onclick = () => this.filterByCategory(key);
            categoriesList.appendChild(categoryItem);
            
            // Filtro dropdown
            const option = document.createElement('option');
            option.value = key;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    populateTags() {
        // Simular algumas tags populares
        const popularTags = [
            'proteínas', 'enzimas', 'metabolismo', 'DNA', 'RNA',
            'células', 'mitocôndria', 'fotossíntese', 'respiração',
            'genética', 'evolução', 'ecologia', 'farmacologia'
        ];
        
        const tagsCloud = document.getElementById('tags-cloud');
        popularTags.forEach(tag => {
            const tagItem = document.createElement('div');
            tagItem.className = 'tag-item';
            tagItem.textContent = tag;
            tagItem.onclick = () => this.toggleTag(tag);
            tagsCloud.appendChild(tagItem);
        });
    }

    setupEventListeners() {
        // Busca
        document.getElementById('library-search').addEventListener('input', (e) => {
            this.filters.searchTerm = e.target.value;
            this.debounceSearch();
        });
        
        // Filtros rápidos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.applyQuickFilter(btn.dataset.filter);
            });
        });
        
        // Filtros dropdown
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterByCategory(e.target.value);
        });
        
        document.getElementById('date-filter').addEventListener('change', (e) => {
            this.filters.dateRange = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('sort-filter').addEventListener('change', (e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            this.sortBy = sortBy;
            this.sortOrder = sortOrder;
            this.applyFilters();
        });
        
        // Visualização
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.changeView(btn.dataset.view);
            });
        });
    }

    loadUserLectures() {
        if (this.authSystem.isLoggedIn()) {
            const user = this.authSystem.getCurrentUser();
            this.lectures = user.savedLectures || [];
        } else {
            // Carregar aulas de exemplo para demonstração
            this.lectures = this.getSampleLectures();
        }
        
        this.updateStats();
        this.applyFilters();
    }

    getSampleLectures() {
        return [
            {
                id: 'sample_1',
                title: 'Bioquímica do Zinc Spark na Fertilização',
                description: 'Estudo detalhado sobre o papel do zinco na ativação do óvulo durante a fertilização, incluindo mecanismos moleculares e implicações clínicas.',
                category: 'biochemistry',
                tags: ['fertilização', 'zinco', 'óvulo', 'bioquímica'],
                author: 'Sistema',
                createdAt: new Date().toISOString(),
                rating: 4.8,
                views: 156,
                duration: '45 min',
                modules: 8,
                isFavorite: false,
                isShared: false
            },
            {
                id: 'sample_2',
                title: 'Metabolismo Celular e Produção de ATP',
                description: 'Análise completa dos processos de respiração celular, glicólise e ciclo de Krebs na produção de energia celular.',
                category: 'biochemistry',
                tags: ['ATP', 'metabolismo', 'respiração', 'mitocôndria'],
                author: 'Sistema',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                rating: 4.6,
                views: 203,
                duration: '60 min',
                modules: 12,
                isFavorite: true,
                isShared: true
            },
            {
                id: 'sample_3',
                title: 'Estrutura e Função das Proteínas',
                description: 'Exploração das diferentes estruturas proteicas e suas funções biológicas, incluindo enzimas, anticorpos e proteínas estruturais.',
                category: 'biochemistry',
                tags: ['proteínas', 'enzimas', 'estrutura', 'função'],
                author: 'Sistema',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                rating: 4.9,
                views: 89,
                duration: '50 min',
                modules: 10,
                isFavorite: false,
                isShared: false
            }
        ];
    }

    updateStats() {
        document.getElementById('total-lectures').textContent = this.lectures.length;
        document.getElementById('favorites-count').textContent = this.lectures.filter(l => l.isFavorite).length;
        document.getElementById('categories-count').textContent = new Set(this.lectures.map(l => l.category)).size;
        
        // Atualizar contadores de categorias
        const categoryCounts = {};
        this.lectures.forEach(lecture => {
            categoryCounts[lecture.category] = (categoryCounts[lecture.category] || 0) + 1;
        });
        
        document.getElementById('all-count').textContent = this.lectures.length;
        Object.keys(this.categories).forEach(category => {
            const countElement = document.getElementById(`${category}-count`);
            if (countElement) {
                countElement.textContent = categoryCounts[category] || 0;
            }
        });
    }

    filterByCategory(category) {
        this.filters.category = category;
        
        // Atualizar UI
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.applyFilters();
    }

    toggleTag(tag) {
        const index = this.filters.tags.indexOf(tag);
        if (index > -1) {
            this.filters.tags.splice(index, 1);
        } else {
            this.filters.tags.push(tag);
        }
        
        // Atualizar UI
        document.querySelectorAll('.tag-item').forEach(item => {
            if (item.textContent === tag) {
                item.classList.toggle('active');
            }
        });
        
        this.applyFilters();
    }

    applyQuickFilter(filter) {
        switch (filter) {
            case 'all':
                this.filters = { ...this.filters, category: 'all', tags: [] };
                break;
            case 'favorites':
                this.filters = { ...this.filters, category: 'all', tags: [] };
                break;
            case 'recent':
                this.filters.dateRange = 'week';
                break;
            case 'shared':
                this.filters = { ...this.filters, category: 'all', tags: [] };
                break;
        }
        
        this.applyFilters(filter);
    }

    applyFilters(quickFilter = null) {
        let filteredLectures = [...this.lectures];
        
        // Filtro de categoria
        if (this.filters.category !== 'all') {
            filteredLectures = filteredLectures.filter(lecture => 
                lecture.category === this.filters.category
            );
        }
        
        // Filtro de tags
        if (this.filters.tags.length > 0) {
            filteredLectures = filteredLectures.filter(lecture =>
                this.filters.tags.some(tag => 
                    lecture.tags.some(lectureTag => 
                        lectureTag.toLowerCase().includes(tag.toLowerCase())
                    )
                )
            );
        }
        
        // Filtro de busca
        if (this.filters.searchTerm) {
            const searchTerm = this.filters.searchTerm.toLowerCase();
            filteredLectures = filteredLectures.filter(lecture =>
                lecture.title.toLowerCase().includes(searchTerm) ||
                lecture.description.toLowerCase().includes(searchTerm) ||
                lecture.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Filtros rápidos especiais
        if (quickFilter) {
            switch (quickFilter) {
                case 'favorites':
                    filteredLectures = filteredLectures.filter(lecture => lecture.isFavorite);
                    break;
                case 'shared':
                    filteredLectures = filteredLectures.filter(lecture => lecture.isShared);
                    break;
            }
        }
        
        // Filtro de data
        if (this.filters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            
            switch (this.filters.dateRange) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filteredLectures = filteredLectures.filter(lecture =>
                new Date(lecture.createdAt) >= filterDate
            );
        }
        
        // Ordenação
        filteredLectures.sort((a, b) => {
            switch (this.sortBy) {
                case 'date':
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                case 'title':
                    return this.sortOrder === 'desc' ? 
                        b.title.localeCompare(a.title) : 
                        a.title.localeCompare(b.title);
                case 'rating':
                    return this.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
                default:
                    return 0;
            }
        });
        
        this.displayLectures(filteredLectures);
    }

    displayLectures(lectures) {
        const container = document.getElementById('lectures-container');
        const resultsCount = document.getElementById('results-count');
        
        resultsCount.textContent = `${lectures.length} aula${lectures.length !== 1 ? 's' : ''} encontrada${lectures.length !== 1 ? 's' : ''}`;
        
        if (lectures.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                    <h3>Nenhuma aula encontrada</h3>
                    <p>Tente ajustar os filtros ou criar uma nova aula.</p>
                </div>
            `;
            return;
        }
        
        const isGridView = document.querySelector('.view-btn[data-view="grid"]').classList.contains('active');
        container.className = isGridView ? 'lectures-grid' : 'lectures-list';
        
        container.innerHTML = lectures.map(lecture => this.createLectureCard(lecture)).join('');
    }

    createLectureCard(lecture) {
        const category = this.categories[lecture.category];
        const formattedDate = new Date(lecture.createdAt).toLocaleDateString('pt-BR');
        const stars = '★'.repeat(Math.floor(lecture.rating)) + '☆'.repeat(5 - Math.floor(lecture.rating));
        
        return `
            <div class="lecture-card" onclick="lectureLibrary.showLectureDetails('${lecture.id}')">
                <div class="lecture-card-header">
                    <h3 class="lecture-title">${lecture.title}</h3>
                    <div class="lecture-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); lectureLibrary.toggleFavorite('${lecture.id}')" title="Favoritar">
                            ${lecture.isFavorite ? '⭐' : '☆'}
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); lectureLibrary.shareLecture('${lecture.id}')" title="Compartilhar">
                            🔗
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); lectureLibrary.deleteLecture('${lecture.id}')" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </div>
                
                <div class="lecture-meta">
                    <div class="meta-item">
                        <span>${category?.icon || '📚'}</span>
                        <span>${category?.name || 'Geral'}</span>
                    </div>
                    <div class="meta-item">
                        <span>👤</span>
                        <span>${lecture.author}</span>
                    </div>
                    <div class="meta-item">
                        <span>⏱️</span>
                        <span>${lecture.duration}</span>
                    </div>
                    <div class="meta-item">
                        <span>📊</span>
                        <span>${lecture.modules} módulos</span>
                    </div>
                    <div class="meta-item">
                        <span>👁️</span>
                        <span>${lecture.views} visualizações</span>
                    </div>
                </div>
                
                <div class="lecture-description">
                    ${lecture.description}
                </div>
                
                <div class="lecture-tags">
                    ${lecture.tags.map(tag => `<span class="lecture-tag">${tag}</span>`).join('')}
                </div>
                
                <div class="lecture-footer">
                    <div class="lecture-rating">
                        <span class="stars">${stars}</span>
                        <span>${lecture.rating}</span>
                    </div>
                    <div class="lecture-date">${formattedDate}</div>
                </div>
            </div>
        `;
    }

    changeView(view) {
        const container = document.getElementById('lectures-container');
        container.className = view === 'grid' ? 'lectures-grid' : 'lectures-list';
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    // Métodos de ação
    showLectureDetails(lectureId) {
        const lecture = this.lectures.find(l => l.id === lectureId);
        if (!lecture) return;
        
        document.getElementById('lecture-title').textContent = lecture.title;
        document.getElementById('lecture-details-body').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <h3>📋 Informações Gerais</h3>
                    <p><strong>Categoria:</strong> ${this.categories[lecture.category]?.name || 'Geral'}</p>
                    <p><strong>Autor:</strong> ${lecture.author}</p>
                    <p><strong>Duração:</strong> ${lecture.duration}</p>
                    <p><strong>Módulos:</strong> ${lecture.modules}</p>
                    <p><strong>Criado em:</strong> ${new Date(lecture.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                    <h3>📊 Estatísticas</h3>
                    <p><strong>Avaliação:</strong> ${lecture.rating}/5.0</p>
                    <p><strong>Visualizações:</strong> ${lecture.views}</p>
                    <p><strong>Favorita:</strong> ${lecture.isFavorite ? 'Sim' : 'Não'}</p>
                    <p><strong>Compartilhada:</strong> ${lecture.isShared ? 'Sim' : 'Não'}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3>📝 Descrição</h3>
                <p>${lecture.description}</p>
            </div>
            
            <div>
                <h3>🏷️ Tags</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${lecture.tags.map(tag => `<span class="lecture-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('lecture-details-modal').style.display = 'flex';
        this.currentLectureId = lectureId;
    }

    closeLectureDetails() {
        document.getElementById('lecture-details-modal').style.display = 'none';
        this.currentLectureId = null;
    }

    toggleFavorite(lectureId) {
        const lecture = this.lectures.find(l => l.id === lectureId);
        if (lecture) {
            lecture.isFavorite = !lecture.isFavorite;
            this.saveLectures();
            this.updateStats();
            this.applyFilters();
        }
    }

    deleteLecture(lectureId) {
        if (confirm('Tem certeza que deseja excluir esta aula?')) {
            this.lectures = this.lectures.filter(l => l.id !== lectureId);
            this.saveLectures();
            this.updateStats();
            this.applyFilters();
        }
    }

    // Métodos de persistência
    loadLectures() {
        try {
            const lectures = localStorage.getItem('scientificLectures');
            return lectures ? JSON.parse(lectures) : [];
        } catch (error) {
            console.error('Erro ao carregar aulas:', error);
            return [];
        }
    }

    saveLectures() {
        try {
            localStorage.setItem('scientificLectures', JSON.stringify(this.lectures));
            if (this.authSystem.isLoggedIn()) {
                const user = this.authSystem.getCurrentUser();
                user.savedLectures = this.lectures;
                this.authSystem.users[user.username] = user;
                this.authSystem.saveUsers();
            }
        } catch (error) {
            console.error('Erro ao salvar aulas:', error);
        }
    }

    loadTags() {
        try {
            const tags = localStorage.getItem('scientificLectureTags');
            return tags ? JSON.parse(tags) : [];
        } catch (error) {
            console.error('Erro ao carregar tags:', error);
            return [];
        }
    }

    // Métodos de interface
    showLibrary() {
        this.loadUserLectures();
        document.getElementById('library-modal').style.display = 'flex';
    }

    closeLibrary() {
        document.getElementById('library-modal').style.display = 'none';
    }

    // Métodos de ação (implementações básicas)
    editLecture() {
        console.log('Editando aula:', this.currentLectureId);
        this.closeLectureDetails();
    }

    duplicateLecture() {
        console.log('Duplicando aula:', this.currentLectureId);
        this.closeLectureDetails();
    }

    shareLecture(lectureId = null) {
        const id = lectureId || this.currentLectureId;
        console.log('Compartilhando aula:', id);
        if (!lectureId) this.closeLectureDetails();
    }

    openLecture() {
        console.log('Abrindo aula:', this.currentLectureId);
        this.closeLectureDetails();
        this.closeLibrary();
    }

    importLectures() {
        console.log('Importando aulas...');
    }

    exportLibrary() {
        console.log('Exportando biblioteca...');
    }
}

// Inicializar biblioteca quando o sistema de autenticação estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (window.authSystem) {
        window.lectureLibrary = new LectureLibrary(window.authSystem);
    }
});