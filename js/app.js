// CoffeeHouse App - Cardápio e Pedidos
let app = {
    cart: [],
    currentCategory: 'coffees',
    customerName: '',
    
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartDisplay();
        this.hideLoading();
        this.loadProducts();
    },

    setupEventListeners() {
        // Welcome buttons
        document.getElementById('startOrderBtn')?.addEventListener('click', () => this.showScreen('menu'));

        // Navigation
        document.getElementById('backToWelcome')?.addEventListener('click', () => this.showScreen('welcome'));
        document.getElementById('cartIndicator')?.addEventListener('click', () => this.showScreen('cart'));
        document.getElementById('backToMenu')?.addEventListener('click', () => this.showScreen('menu'));
        document.getElementById('floatingCart')?.addEventListener('click', () => this.showScreen('cart'));

        // Cart actions
        document.getElementById('clearCartBtn')?.addEventListener('click', () => this.clearCart());
        document.getElementById('proceedToCustomerInfoBtn')?.addEventListener('click', () => this.validateCartAndProceed());

        // Customer info
        document.getElementById('backToCart')?.addEventListener('click', () => this.showScreen('cart'));
        document.getElementById('proceedToPaymentBtn')?.addEventListener('click', () => this.validateAndProceedToPayment());

        // Payment
        document.getElementById('backToCustomerInfo')?.addEventListener('click', () => this.showScreen('customer-info'));
        document.getElementById('confirmPaymentBtn')?.addEventListener('click', () => this.processPayment());

        // Confirmation
        document.getElementById('newOrderBtn')?.addEventListener('click', () => this.startNewOrder());

        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.changeCategory(e.currentTarget.dataset.category);
            });
        });

        // Payment options
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget.dataset.method);
            });
        });

        // Theme toggle
        document.getElementById('themeBtn')?.addEventListener('click', () => this.toggleTheme());

        // Customer name input validation
        document.getElementById('customerName')?.addEventListener('input', (e) => {
            this.validateCustomerName(e.target);
        });
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            if (screenId === 'menu') {
                this.loadProducts();
            } else if (screenId === 'cart') {
                this.loadCartItems();
            } else if (screenId === 'customer-info') {
                this.loadCustomerInfoOrderPreview();
            } else if (screenId === 'payment') {
                this.loadPaymentSummary();
            }
        }
    },

    changeCategory(category) {
        this.currentCategory = category;
        
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

        this.loadProducts();
    },

    loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const products = Utils.getProductsByCategory(this.currentCategory);
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card hover-lift" data-product-id="${product.id}">
                <div class="product-image">
                    <span style="font-size: 3rem;">${product.image}</span>
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <div>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                        </div>
                        <div class="product-price">${Utils.formatCurrency(product.price)}</div>
                    </div>
                    <div class="product-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="app.decreaseQuantity(${product.id})" disabled>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display" id="quantity-${product.id}">1</span>
                            <button class="quantity-btn" onclick="app.increaseQuantity(${product.id})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="add-to-cart-btn" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-plus"></i>
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    increaseQuantity(productId) {
        const display = document.getElementById(`quantity-${productId}`);
        const decreaseBtn = display?.parentElement?.querySelector('.quantity-btn:first-child');
        const increaseBtn = display?.parentElement?.querySelector('.quantity-btn:last-child');
        
        let quantity = parseInt(display.textContent);
        if (quantity < 10) {
            quantity++;
            display.textContent = quantity;
            
            if (decreaseBtn) decreaseBtn.disabled = false;
            if (increaseBtn) increaseBtn.disabled = quantity >= 10;
        }
    },

    decreaseQuantity(productId) {
        const display = document.getElementById(`quantity-${productId}`);
        const decreaseBtn = display?.parentElement?.querySelector('.quantity-btn:first-child');
        const increaseBtn = display?.parentElement?.querySelector('.quantity-btn:last-child');
        
        let quantity = parseInt(display.textContent);
        if (quantity > 1) {
            quantity--;
            display.textContent = quantity;
            
            if (decreaseBtn) decreaseBtn.disabled = quantity <= 1;
            if (increaseBtn) increaseBtn.disabled = false;
        }
    },

    addToCart(productId) {
        const product = Utils.getProductById(productId);
        const quantity = parseInt(document.getElementById(`quantity-${productId}`).textContent);
        
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showToast('Produto adicionado ao carrinho!', 'success');
        
        // Reset quantity
        document.getElementById(`quantity-${productId}`).textContent = '1';
        document.querySelector(`[data-product-id="${productId}"] .quantity-btn:first-child`).disabled = true;
        document.querySelector(`[data-product-id="${productId}"] .quantity-btn:last-child`).disabled = false;
    },

    loadCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p style="text-align: center; color: var(--text-secondary);">Seu carrinho está vazio</p>
                    <button class="btn-primary" onclick="app.showScreen('menu')" style="margin-top: 1rem;">
                        <i class="fas fa-utensils"></i>
                        Ver Cardápio
                    </button>
                </div>
            `;
            this.updateCartSummary(); // Atualizar valores quando carrinho está vazio
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item cart-item-enter" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <span style="font-size: 2rem;">${item.image}</span>
                </div>
                <div class="cart-item-content">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${Utils.formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.id}, 1)" ${item.quantity >= 10 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">${Utils.formatCurrency(item.price * item.quantity)}</div>
                    <button class="quantity-btn" onclick="app.removeFromCart(${item.id})" style="background-color: var(--error-color);">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.updateCartSummary();
    },

    updateCartItemQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity < 1 || newQuantity > 10) return;

        item.quantity = newQuantity;
        this.saveCart();
        this.loadCartItems();
        this.updateCartDisplay();
    },

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.loadCartItems();
        this.updateCartDisplay();
        this.showToast('Item removido do carrinho', 'info');
    },

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.loadCartItems();
        this.updateCartDisplay();
        this.showToast('Carrinho limpo', 'info');
    },

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('totalAmount');
        
        if (subtotalElement) {
            subtotalElement.textContent = Utils.formatCurrency(subtotal);
        }
        if (totalElement) {
            totalElement.textContent = Utils.formatCurrency(subtotal);
        }
    },

    validateCartAndProceed() {
        if (this.cart.length === 0) {
            this.showToast('Seu carrinho está vazio! Adicione produtos antes de continuar.', 'warning');
            return;
        }
        
        this.showScreen('customer-info');
    },

    loadPaymentSummary() {
        const orderSummaryItems = document.getElementById('orderSummaryItems');
        const orderTotal = document.getElementById('orderTotal');
        const paymentCustomerName = document.getElementById('paymentCustomerName');
        
        if (orderSummaryItems) {
            orderSummaryItems.innerHTML = this.cart.map(item => `
                <div class="order-item">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                    </div>
                    <span class="item-price">${Utils.formatCurrency(item.price * item.quantity)}</span>
                </div>
            `).join('');
        }
        
        if (orderTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            orderTotal.textContent = Utils.formatCurrency(total);
        }

        if (paymentCustomerName) {
            paymentCustomerName.textContent = this.customerName || 'Cliente';
        }
    },

    loadCustomerInfoOrderPreview() {
        const previewItems = document.getElementById('customerInfoOrderPreview');
        const previewTotal = document.getElementById('customerInfoTotal');
        
        if (previewItems) {
            previewItems.innerHTML = this.cart.map(item => `
                <div class="preview-item">
                    <div>
                        <span class="preview-item-name">${item.name}</span>
                        <span class="preview-item-quantity">x${item.quantity}</span>
                    </div>
                    <span class="preview-item-price">${Utils.formatCurrency(item.price * item.quantity)}</span>
                </div>
            `).join('');
        }
        
        if (previewTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            previewTotal.textContent = Utils.formatCurrency(total);
        }
    },

    selectPaymentMethod(method) {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`)?.classList.add('active');
    },

    processPayment() {
        if (this.cart.length === 0) {
            this.showToast('Carrinho vazio!', 'error');
            return;
        }

        this.showToast('Processando pagamento...', 'info');
        
        setTimeout(() => {
            const orderNumber = Utils.generateOrderNumber();
            document.getElementById('orderNumber').textContent = orderNumber;
            
            // Send order to staff area
            this.sendOrderToStaff(orderNumber);
            
            this.showScreen('confirmation');
            this.clearCart();
        }, 2000);
    },

    sendOrderToStaff(orderNumber) {
        // Get selected payment method
        const selectedMethod = document.querySelector('.payment-option.active');
        const paymentMethod = selectedMethod ? selectedMethod.dataset.method : 'Cartão';
        
        // Prepare order data
        const orderData = {
            items: this.cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            paymentMethod: paymentMethod,
            customerName: this.customerName || 'Cliente'
        };

        // Save order to localStorage for staff area
        const existingOrders = JSON.parse(localStorage.getItem('coffeehouse_orders') || '[]');
        const newOrder = {
            id: Date.now(),
            number: orderNumber,
            status: 'new',
            items: orderData.items,
            total: orderData.total,
            timestamp: new Date().toISOString(),
            paymentMethod: orderData.paymentMethod,
            customerName: orderData.customerName
        };
        
        existingOrders.unshift(newOrder);
        localStorage.setItem('coffeehouse_orders', JSON.stringify(existingOrders));
        
        this.showToast(`Pedido ${orderNumber} enviado para preparo!`, 'success');
    },

    startNewOrder() {
        this.cart = [];
        this.customerName = '';
        this.saveCart();
        this.updateCartDisplay();
        
        // Reset customer name input
        const customerNameInput = document.getElementById('customerName');
        if (customerNameInput) {
            customerNameInput.value = '';
            customerNameInput.classList.remove('is-valid', 'is-invalid');
        }
        
        this.showScreen('welcome');
    },

    updateCartDisplay() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.getElementById('cartCount').textContent = totalItems;
        document.getElementById('floatingCartCount').textContent = totalItems;
        
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart) {
            floatingCart.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    saveCart() {
        localStorage.setItem('coffeehouse_cart', JSON.stringify(this.cart));
    },

    loadCart() {
        const savedCart = localStorage.getItem('coffeehouse_cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (error) {
                this.cart = [];
            }
        }
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
        }, 1500);
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

    validateCustomerName(input) {
        const customerNameInput = document.getElementById('customerName');
        if (customerNameInput) {
            const customerName = customerNameInput.value.trim();
            if (customerName.length > 0) {
                customerNameInput.classList.remove('is-invalid');
                customerNameInput.classList.add('is-valid');
                this.customerName = customerName;
            } else {
                customerNameInput.classList.remove('is-valid');
                customerNameInput.classList.add('is-invalid');
                this.customerName = '';
            }
        }
    },

    validateAndProceedToPayment() {
        const customerNameInput = document.getElementById('customerName');
        if (!customerNameInput || !this.customerName) {
            this.showToast('Por favor, insira o nome do cliente.', 'warning');
            return;
        }
        this.showScreen('payment');
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Make app globally available
window.app = app;
