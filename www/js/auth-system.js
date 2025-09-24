/**
 * Sistema de Autenticação Avançado para Gerador de Aulas Científicas
 * Versão: 2.0.0
 * Recursos: Perfis de usuário, configurações personalizadas, histórico de aulas
 */

class AuthenticationSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkSession();
                this.setupEventListeners();
                this.createAuthUI();
            });
        } else {
            this.checkSession();
            this.setupEventListeners();
            this.createAuthUI();
        }
    }

    // Gerenciamento de usuários
    loadUsers() {
        try {
            const users = localStorage.getItem('scientificLectureUsers');
            return users ? JSON.parse(users) : {};
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            return {};
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('scientificLectureUsers', JSON.stringify(this.users));
        } catch (error) {
            console.error('Erro ao salvar usuários:', error);
        }
    }

    // Autenticação
    async register(userData) {
        const { username, email, password, fullName } = userData;
        
        if (this.users[username]) {
            throw new Error('Nome de usuário já existe');
        }

        const hashedPassword = await this.hashPassword(password);
        const userId = this.generateUserId();

        this.users[username] = {
            id: userId,
            username,
            email,
            fullName,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            preferences: this.getDefaultPreferences(),
            lectureHistory: [],
            savedLectures: [],
            statistics: {
                lecturesGenerated: 0,
                totalPDFsProcessed: 0,
                favoriteTopics: [],
                averageGenerationTime: 0
            }
        };

        this.saveUsers();
        return this.login({ username, password });
    }

    async login(credentials) {
        const { username, password } = credentials;
        const user = this.users[username];

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValidPassword = await this.verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Senha incorreta');
        }

        // Atualizar último login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();

        // Criar sessão
        this.currentUser = user;
        this.saveSession();
        
        this.onLoginSuccess();
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('scientificLectureSession');
        this.onLogout();
    }

    // Gerenciamento de sessão
    saveSession() {
        const sessionData = {
            userId: this.currentUser.id,
            username: this.currentUser.username,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
        };
        localStorage.setItem('scientificLectureSession', JSON.stringify(sessionData));
    }

    checkSession() {
        try {
            const session = localStorage.getItem('scientificLectureSession');
            if (!session) return false;

            const sessionData = JSON.parse(session);
            const now = new Date();
            const expiresAt = new Date(sessionData.expiresAt);

            if (now > expiresAt) {
                this.logout();
                return false;
            }

            // Restaurar usuário da sessão
            const user = Object.values(this.users).find(u => u.id === sessionData.userId);
            if (user) {
                this.currentUser = user;
                this.onLoginSuccess();
                return true;
            }
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
        }
        return false;
    }

    // Criptografia
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'scientificLectureSalt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async verifyPassword(password, hash) {
        const hashedInput = await this.hashPassword(password);
        return hashedInput === hash;
    }

    // Utilitários
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDefaultPreferences() {
        return {
            theme: 'light',
            language: 'pt-BR',
            autoSave: true,
            notifications: true,
            defaultLectureLength: 'medium',
            preferredTopics: [],
            aiModel: 'gpt-3.5-turbo',
            outputFormat: 'html',
            includeImages: true,
            includeReferences: true,
            lectureTemplate: 'academic',
            maxModules: 10,
            complexityLevel: 'intermediate'
        };
    }

    // Interface do usuário
    createAuthUI() {
        const authContainer = document.createElement('div');
        authContainer.id = 'auth-container';
        authContainer.innerHTML = `
            <div class="auth-modal" id="auth-modal" style="display: none;">
                <div class="auth-content">
                    <div class="auth-header">
                        <h2 id="auth-title">Entrar</h2>
                        <button class="close-auth" onclick="authSystem.closeAuthModal()">&times;</button>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" onclick="authSystem.showLogin()">Entrar</button>
                        <button class="auth-tab" onclick="authSystem.showRegister()">Registrar</button>
                    </div>

                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="login-username">Nome de usuário:</label>
                            <input type="text" id="login-username" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Senha:</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="auth-btn">Entrar</button>
                    </form>

                    <form id="register-form" class="auth-form" style="display: none;">
                        <div class="form-group">
                            <label for="register-fullname">Nome completo:</label>
                            <input type="text" id="register-fullname" required>
                        </div>
                        <div class="form-group">
                            <label for="register-username">Nome de usuário:</label>
                            <input type="text" id="register-username" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email:</label>
                            <input type="email" id="register-email" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Senha:</label>
                            <input type="password" id="register-password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="register-confirm">Confirmar senha:</label>
                            <input type="password" id="register-confirm" required>
                        </div>
                        <button type="submit" class="auth-btn">Registrar</button>
                    </form>

                    <div class="auth-footer">
                        <p>Seus dados são armazenados localmente e com segurança.</p>
                    </div>
                </div>
            </div>

            <div class="user-profile" id="user-profile" style="display: none;">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <span id="profile-initials"></span>
                    </div>
                    <div class="profile-info">
                        <h3 id="profile-name"></h3>
                        <p id="profile-stats"></p>
                    </div>
                    <div class="profile-actions">
                        <button onclick="authSystem.showPreferences()" class="profile-btn">⚙️</button>
                        <button onclick="authSystem.logout()" class="profile-btn">🚪</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(authContainer);
        this.addAuthStyles();
    }

    addAuthStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-modal {
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

            .auth-content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: authSlideIn 0.3s ease-out;
            }

            @keyframes authSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .auth-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 15px;
            }

            .auth-header h2 {
                margin: 0;
                color: #2c3e50;
                font-size: 24px;
            }

            .close-auth {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #7f8c8d;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .close-auth:hover {
                background: #f8f9fa;
                color: #e74c3c;
            }

            .auth-tabs {
                display: flex;
                margin-bottom: 20px;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #e0e0e0;
            }

            .auth-tab {
                flex: 1;
                padding: 12px;
                border: none;
                background: #f8f9fa;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .auth-tab.active {
                background: #3498db;
                color: white;
            }

            .auth-tab:hover:not(.active) {
                background: #e9ecef;
            }

            .auth-form {
                animation: formFadeIn 0.3s ease-out;
            }

            @keyframes formFadeIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #2c3e50;
            }

            .form-group input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .form-group input:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            }

            .auth-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }

            .auth-btn:hover {
                background: linear-gradient(135deg, #2980b9, #21618c);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
            }

            .auth-footer {
                margin-top: 20px;
                text-align: center;
                color: #7f8c8d;
                font-size: 12px;
                border-top: 1px solid #f0f0f0;
                padding-top: 15px;
            }

            .user-profile {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
                z-index: 1000;
                min-width: 250px;
            }

            .profile-header {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .profile-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3498db, #2980b9);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
            }

            .profile-info {
                flex: 1;
            }

            .profile-info h3 {
                margin: 0 0 5px 0;
                color: #2c3e50;
                font-size: 16px;
            }

            .profile-info p {
                margin: 0;
                color: #7f8c8d;
                font-size: 12px;
            }

            .profile-actions {
                display: flex;
                gap: 5px;
            }

            .profile-btn {
                width: 35px;
                height: 35px;
                border: none;
                border-radius: 8px;
                background: #f8f9fa;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
            }

            .profile-btn:hover {
                background: #e9ecef;
                transform: scale(1.1);
            }

            @media (max-width: 768px) {
                .auth-content {
                    width: 95%;
                    padding: 20px;
                }
                
                .user-profile {
                    top: 10px;
                    right: 10px;
                    min-width: 200px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Formulário de login
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLogin();
            } else if (e.target.id === 'register-form') {
                e.preventDefault();
                this.handleRegister();
            }
        });

        // Tecla ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('auth-modal').style.display !== 'none') {
                this.closeAuthModal();
            }
        });
    }

    // Handlers de eventos
    async handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            await this.login({ username, password });
            this.closeAuthModal();
            this.showNotification('Login realizado com sucesso!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleRegister() {
        const fullName = document.getElementById('register-fullname').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (password !== confirmPassword) {
            this.showNotification('As senhas não coincidem', 'error');
            return;
        }

        try {
            await this.register({ fullName, username, email, password });
            this.closeAuthModal();
            this.showNotification('Conta criada com sucesso!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Interface
    showAuthModal() {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    closeAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
    }

    showLogin() {
        document.getElementById('auth-title').textContent = 'Entrar';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
    }

    showRegister() {
        document.getElementById('auth-title').textContent = 'Registrar';
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
    }

    onLoginSuccess() {
        const profile = document.getElementById('user-profile');
        const initials = document.getElementById('profile-initials');
        const name = document.getElementById('profile-name');
        const stats = document.getElementById('profile-stats');

        if (this.currentUser) {
            const userInitials = this.currentUser.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

            initials.textContent = userInitials;
            name.textContent = this.currentUser.fullName;
            stats.textContent = `${this.currentUser.statistics.lecturesGenerated} aulas geradas`;
            
            profile.style.display = 'block';
        }
    }

    onLogout() {
        document.getElementById('user-profile').style.display = 'none';
        this.showNotification('Logout realizado com sucesso!', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10001;
                animation: notificationSlide 0.3s ease-out;
            }
            
            .notification-success { background: #27ae60; }
            .notification-error { background: #e74c3c; }
            .notification-info { background: #3498db; }
            
            @keyframes notificationSlide {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Métodos públicos para integração
    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUserPreferences(preferences) {
        if (this.currentUser) {
            this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
            this.users[this.currentUser.username] = this.currentUser;
            this.saveUsers();
        }
    }

    addLectureToHistory(lectureData) {
        if (this.currentUser) {
            this.currentUser.lectureHistory.unshift({
                ...lectureData,
                createdAt: new Date().toISOString()
            });
            
            // Manter apenas os últimos 50 registros
            if (this.currentUser.lectureHistory.length > 50) {
                this.currentUser.lectureHistory = this.currentUser.lectureHistory.slice(0, 50);
            }
            
            this.currentUser.statistics.lecturesGenerated++;
            this.users[this.currentUser.username] = this.currentUser;
            this.saveUsers();
        }
    }

    saveLecture(lectureData) {
        if (this.currentUser) {
            const lectureId = 'lecture_' + Date.now();
            this.currentUser.savedLectures.push({
                id: lectureId,
                ...lectureData,
                savedAt: new Date().toISOString()
            });
            
            this.users[this.currentUser.username] = this.currentUser;
            this.saveUsers();
            return lectureId;
        }
        return null;
    }

    getSavedLectures() {
        return this.currentUser ? this.currentUser.savedLectures : [];
    }

    getLectureHistory() {
        return this.currentUser ? this.currentUser.lectureHistory : [];
    }
}

// Inicializar sistema de autenticação
const authSystem = new AuthenticationSystem();

// Exportar para uso global
window.authSystem = authSystem;