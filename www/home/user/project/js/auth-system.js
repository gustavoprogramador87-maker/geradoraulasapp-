/**
 * Sistema de Autenticação Avançado para Gerador de Aulas Científicas
 * Versão: 3.0.0 - Corrigida e Melhorada
 */

class AuthenticationSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupSystem();
            });
        } else {
            this.setupSystem();
        }
    }

    setupSystem() {
        this.checkSession();
        this.setupEventListeners();
        this.createAuthUI();
        this.isInitialized = true;
    }

    // Gerenciamento de usuários com validação melhorada
    loadUsers() {
        try {
            const users = localStorage.getItem('scientificLectureUsers');
            const parsedUsers = users ? JSON.parse(users) : {};
            
            // Validar estrutura dos dados
            Object.keys(parsedUsers).forEach(username => {
                if (!this.validateUserData(parsedUsers[username])) {
                    delete parsedUsers[username];
                }
            });
            
            return parsedUsers;
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            localStorage.removeItem('scientificLectureUsers');
            return {};
        }
    }

    validateUserData(user) {
        return user && 
               typeof user.id === 'string' &&
               typeof user.username === 'string' &&
               typeof user.email === 'string' &&
               typeof user.password === 'string' &&
               user.preferences &&
               Array.isArray(user.lectureHistory) &&
               Array.isArray(user.savedLectures);
    }

    saveUsers() {
        try {
            localStorage.setItem('scientificLectureUsers', JSON.stringify(this.users));
            return true;
        } catch (error) {
            console.error('Erro ao salvar usuários:', error);
            this.showNotification('Erro ao salvar dados do usuário', 'error');
            return false;
        }
    }

    // Autenticação com validação melhorada
    async register(userData) {
        const { username, email, password, fullName } = userData;
        
        // Validações
        if (!this.validateRegistrationData(userData)) {
            throw new Error('Dados de registro inválidos');
        }

        if (this.users[username]) {
            throw new Error('Nome de usuário já existe');
        }

        // Verificar se email já existe
        const existingUser = Object.values(this.users).find(u => u.email === email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        try {
            const hashedPassword = await this.hashPassword(password);
            const userId = this.generateUserId();

            this.users[username] = {
                id: userId,
                username: username.trim(),
                email: email.trim().toLowerCase(),
                fullName: fullName.trim(),
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
                    averageGenerationTime: 0,
                    lastActivity: new Date().toISOString()
                }
            };

            if (!this.saveUsers()) {
                throw new Error('Erro ao salvar dados do usuário');
            }

            return await this.login({ username, password });
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    validateRegistrationData(userData) {
        const { username, email, password, fullName } = userData;
        
        if (!username || username.length < 3) return false;
        if (!email || !this.isValidEmail(email)) return false;
        if (!password || password.length < 6) return false;
        if (!fullName || fullName.length < 2) return false;
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async login(credentials) {
        const { username, password } = credentials;
        
        if (!username || !password) {
            throw new Error('Username e senha são obrigatórios');
        }

        const user = this.users[username];
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        try {
            const isValidPassword = await this.verifyPassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Senha incorreta');
            }

            // Atualizar último login
            user.lastLogin = new Date().toISOString();
            user.statistics.lastActivity = new Date().toISOString();
            
            if (!this.saveUsers()) {
                throw new Error('Erro ao atualizar dados do usuário');
            }

            // Criar sessão
            this.currentUser = user;
            this.saveSession();
            
            this.onLoginSuccess();
            return user;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    logout() {
        if (this.currentUser) {
            this.currentUser.statistics.lastActivity = new Date().toISOString();
            this.saveUsers();
        }
        
        this.currentUser = null;
        localStorage.removeItem('scientificLectureSession');
        this.onLogout();
    }

    // Gerenciamento de sessão melhorado
    saveSession() {
        try {
            const sessionData = {
                userId: this.currentUser.id,
                username: this.currentUser.username,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
            };
            localStorage.setItem('scientificLectureSession', JSON.stringify(sessionData));
            return true;
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
            return false;
        }
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
            localStorage.removeItem('scientificLectureSession');
        }
        return false;
    }

    // Criptografia melhorada
    async hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const salt = 'scientificLectureSalt2024';
            const data = encoder.encode(password + salt);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Erro ao criptografar senha:', error);
            throw new Error('Erro interno de segurança');
        }
    }

    async verifyPassword(password, hash) {
        try {
            const hashedInput = await this.hashPassword(password);
            return hashedInput === hash;
        } catch (error) {
            console.error('Erro ao verificar senha:', error);
            return false;
        }
    }

    // Interface melhorada
    createAuthUI() {
        // Verificar se já existe
        if (document.getElementById('auth-container')) {
            return;
        }

        const authContainer = document.createElement('div');
        authContainer.id = 'auth-container';
        authContainer.innerHTML = `
            <div class="auth-modal" id="auth-modal" style="display: none;">
                <div class="auth-content">
                    <div class="auth-header">
                        <h2 id="auth-title">Entrar</h2>
                        <button class="close-auth" onclick="authSystem.closeAuthModal()" aria-label="Fechar">&times;</button>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" onclick="authSystem.showLogin()">Entrar</button>
                        <button class="auth-tab" onclick="authSystem.showRegister()">Registrar</button>
                    </div>

                    <div class="auth-error" id="auth-error" style="display: none;"></div>

                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="login-username">Nome de usuário:</label>
                            <input type="text" id="login-username" required autocomplete="username">
                        </div>
                        <div class="form-group">
                            <label for="login-password">Senha:</label>
                            <input type="password" id="login-password" required autocomplete="current-password">
                        </div>
                        <button type="submit" class="auth-btn">
                            <span class="btn-text">Entrar</span>
                            <span class="btn-loading" style="display: none;">Entrando...</span>
                        </button>
                    </form>

                    <form id="register-form" class="auth-form" style="display: none;">
                        <div class="form-group">
                            <label for="register-fullname">Nome completo:</label>
                            <input type="text" id="register-fullname" required autocomplete="name">
                        </div>
                        <div class="form-group">
                            <label for="register-username">Nome de usuário:</label>
                            <input type="text" id="register-username" required autocomplete="username" minlength="3">
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email:</label>
                            <input type="email" id="register-email" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="register-password">Senha:</label>
                            <input type="password" id="register-password" required autocomplete="new-password" minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="register-confirm">Confirmar Senha:</label>
                            <input type="password" id="register-confirm" required autocomplete="new-password" minlength="6">
                        </div>
                        <button type="submit" class="auth-btn">
                            <span class="btn-text">Registrar</span>
                            <span class="btn-loading" style="display: none;">Registrando...</span>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(authContainer);
        this.setupAuthFormListeners();
    }

    setupAuthFormListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLoginSubmit();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegisterSubmit();
            });
        }
    }

    setupEventListeners() {
        // Adicionar listener para fechar modal ao clicar fora
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('auth-modal');
            if (modal && e.target === modal) {
                this.closeAuthModal();
            }
        });

        // Adicionar listener para tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
            }
        });
    }

    showLogin() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.querySelector('.auth-tab.active').classList.remove('active');
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('auth-title').textContent = 'Entrar';
    }

    showRegister() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.querySelector('.auth-tab.active').classList.remove('active');
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('auth-title').textContent = 'Registrar';
    }

    handleLoginSubmit() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        this.login({ username, password })
            .then(() => {
                this.closeAuthModal();
                this.showNotification('Login realizado com sucesso!', 'success');
            })
            .catch(error => {
                this.showError(error.message);
            });
    }

    handleRegisterSubmit() {
        const fullName = document.getElementById('register-fullname').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        if (password !== confirmPassword) {
            this.showError('As senhas não coincidem');
            return;
        }

        this.register({ fullName, username, email, password })
            .then(() => {
                this.closeAuthModal();
                this.showNotification('Registro realizado com sucesso!', 'success');
            })
            .catch(error => {
                this.showError(error.message);
            });
    }

    showError(message) {
        const errorElement = document.getElementById('auth-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    onLoginSuccess() {
        // Atualizar interface após login
        this.updateAuthUI();
    }

    onLogout() {
        // Atualizar interface após logout
        this.updateAuthUI();
    }

    updateAuthUI() {
        // Atualizar elementos da interface baseados no estado do usuário
        const loginButton = document.getElementById('login-button');
        const logoutButton = document.getElementById('logout-button');
        const userMenu = document.getElementById('user-menu');
        
        if (this.currentUser) {
            if (loginButton) loginButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';
            if (userMenu) {
                userMenu.style.display = 'block';
                userMenu.querySelector('.user-name').textContent = this.currentUser.fullName;
            }
        } else {
            if (loginButton) loginButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Implementação de notificação
        console.log(`[${type}] ${message}`);
    }

    getDefaultPreferences() {
        return {
            theme: 'light',
            notifications: true,
            autoSave: true,
            language: 'pt-BR'
        };
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Inicializar o sistema de autenticação
const authSystem = new AuthenticationSystem();

// Funções globais para uso no HTML
window.authSystem = authSystem;
