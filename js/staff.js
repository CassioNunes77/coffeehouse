// Staff App - Área do Funcionário
let staffApp = {
    orders: [],
    settings: { soundEnabled: true, autoRefresh: true },
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.hideLoading();
        this.loadOrders();
        this.startAutoRefresh();
    },

    setupEventListeners() {
        document.getElementById('themeBtn')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('soundBtn')?.addEventListener('click', () => this.toggleSound());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettingsModal());
    },

    loadOrders() {
        const savedOrders = localStorage.getItem('coffeehouse_orders');
        if (savedOrders) {
            try {
                this.orders = JSON.parse(savedOrders);
            } catch (error) {
                this.orders = [];
            }
        }
        
        // Sample orders for demo
        if (this.orders.length === 0) {
            this.orders = [
                {
                    id: 1,
                    number: '#123456',
                    status: 'new',
                    items: [{ name: 'Cappuccino', quantity: 2, price: 6.90 }],
                    total: 13.80,
                    timestamp: new Date().toISOString()
                }
            ];
        }
        
        this.renderOrders();
    },

    renderOrders() {
        this.renderOrderSection('new', 'newOrdersGrid');
        this.renderOrderSection('preparing', 'preparingOrdersGrid');
        this.renderOrderSection('ready', 'readyOrdersGrid');
        this.updateStats();
    },

    renderOrderSection(status, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const orders = this.orders.filter(order => order.status === status);
        
        if (orders.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum pedido</p>';
            return;
        }

        grid.innerHTML = orders.map(order => `
            <div class="order-card ${order.status}" onclick="staffApp.openOrderModal(${order.id})">
                <div class="order-header">
                    <div class="order-number">${order.number}</div>
                    <div class="order-time">${this.getTimeAgo(order.timestamp)}</div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">x${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">${Utils.formatCurrency(order.total)}</div>
                    <div class="order-status ${order.status}">${this.getStatusText(order.status)}</div>
                </div>
            </div>
        `).join('');
    },

    openOrderModal(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderModal');
        const modalBody = document.getElementById('orderModalBody');
        const modalFooter = document.getElementById('orderModalFooter');

        modalBody.innerHTML = `
            <div class="order-details-header">
                <div class="order-details-number">${order.number}</div>
                <div class="order-details-time">${this.getTimeAgo(order.timestamp)}</div>
            </div>
            <div class="order-details-items">
                ${order.items.map(item => `
                    <div class="order-details-item">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-description">Quantidade: ${item.quantity}</div>
                        </div>
                        <div class="item-price">${Utils.formatCurrency(item.price * item.quantity)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-details-summary">
                <div class="summary-row">
                    <span>Total:</span>
                    <span class="summary-total">${Utils.formatCurrency(order.total)}</span>
                </div>
            </div>
        `;

        let actions = '';
        if (order.status === 'new') {
            actions = `
                <button class="btn btn-primary" onclick="staffApp.handleOrderAction(${order.id}, 'start')">Iniciar Preparo</button>
            `;
        } else if (order.status === 'preparing') {
            actions = `
                <button class="btn btn-success" onclick="staffApp.handleOrderAction(${order.id}, 'ready')">Marcar como Pronto</button>
            `;
        } else {
            actions = `
                <button class="btn btn-secondary" onclick="staffApp.handleOrderAction(${order.id}, 'close')">Fechar</button>
            `;
        }

        modalFooter.innerHTML = actions;
        modal.classList.add('active');
    },

    handleOrderAction(orderId, action) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        switch (action) {
            case 'start':
                order.status = 'preparing';
                this.showToast(`Pedido ${order.number} iniciado!`, 'success');
                break;
            case 'ready':
                order.status = 'ready';
                this.showToast(`Pedido ${order.number} pronto!`, 'success');
                break;
            case 'close':
                this.orders = this.orders.filter(o => o.id !== orderId);
                this.showToast(`Pedido ${order.number} finalizado!`, 'info');
                break;
        }

        this.saveOrders();
        this.renderOrders();
        this.closeOrderModal();
    },

    closeOrderModal() {
        document.getElementById('orderModal').classList.remove('active');
    },

    openSettingsModal() {
        document.getElementById('settingsModal').classList.add('active');
    },

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    },

    updateStats() {
        const pendingCount = this.orders.filter(o => o.status === 'new').length;
        const preparingCount = this.orders.filter(o => o.status === 'preparing').length;
        const readyCount = this.orders.filter(o => o.status === 'ready').length;

        document.getElementById('pendingCount').textContent = pendingCount;
        document.getElementById('preparingCount').textContent = preparingCount;
        document.getElementById('readyCount').textContent = readyCount;

        document.getElementById('newOrdersBadge').textContent = pendingCount;
        document.getElementById('preparingOrdersBadge').textContent = preparingCount;
        document.getElementById('readyOrdersBadge').textContent = readyCount;
    },

    getStatusText(status) {
        const statusMap = {
            'new': 'Novo',
            'preparing': 'Em Preparo',
            'ready': 'Pronto'
        };
        return statusMap[status] || status;
    },

    getTimeAgo(timestamp) {
        const now = new Date();
        const orderTime = new Date(timestamp);
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h atrás`;
    },

    addNewOrder(orderData) {
        const newOrder = {
            id: Date.now(),
            number: Utils.generateOrderNumber(),
            status: 'new',
            items: orderData.items,
            total: orderData.total,
            timestamp: new Date().toISOString()
        };

        this.orders.unshift(newOrder);
        this.saveOrders();
        this.renderOrders();
        this.showToast(`Novo pedido: ${newOrder.number}`, 'success');
    },

    saveOrders() {
        localStorage.setItem('coffeehouse_orders', JSON.stringify(this.orders));
    },

    loadSettings() {
        const savedSettings = localStorage.getItem('coffeehouse_staff_settings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    },

    saveSettings() {
        localStorage.setItem('coffeehouse_staff_settings', JSON.stringify(this.settings));
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    },

    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.saveSettings();
        
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            const icon = soundBtn.querySelector('i');
            if (this.settings.soundEnabled) {
                icon.className = 'fas fa-volume-up';
                soundBtn.classList.remove('muted');
            } else {
                icon.className = 'fas fa-volume-mute';
                soundBtn.classList.add('muted');
            }
        }
    },

    startAutoRefresh() {
        setInterval(() => {
            this.loadOrders();
        }, 5000);
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Aviso',
            info: 'Informação'
        };
        
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-title">
                    <i class="${icons[type] || icons.info}"></i>
                    ${titles[type] || titles.info}
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    },

    hideLoading() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);
    }
};

// Initialize staff app
document.addEventListener('DOMContentLoaded', () => {
    staffApp.init();
});

// Make staff app globally available
window.staffApp = staffApp;
