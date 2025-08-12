// ===== COMPONENTS =====

// ===== TOAST NOTIFICATION COMPONENT =====
class Toast {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-title">
                    <i class="${icon}"></i>
                    ${this.getTitle(type)}
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${message}</div>
        `;

        this.container.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Aviso',
            info: 'Informação'
        };
        return titles[type] || titles.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// ===== PRODUCT CARD COMPONENT =====
class ProductCard {
    constructor(product, onAddToCart) {
        this.product = product;
        this.onAddToCart = onAddToCart;
        this.quantity = 1;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'product-card hover-lift';
        card.dataset.productId = this.product.id;

        const badge = this.product.badge ? `<div class="product-badge">${this.product.badge}</div>` : '';

        card.innerHTML = `
            <div class="product-image">
                <span style="font-size: 3rem;">${this.product.image}</span>
                ${badge}
            </div>
            <div class="product-content">
                <div class="product-header">
                    <div>
                        <h3 class="product-title">${this.product.name}</h3>
                        <p class="product-description">${this.product.description}</p>
                    </div>
                    <div class="product-price">${Utils.formatCurrency(this.product.price)}</div>
                </div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.productCard.decreaseQuantity()" disabled>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">1</span>
                        <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.productCard.increaseQuantity()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="add-to-cart-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.productCard.addToCart()">
                        <i class="fas fa-plus"></i>
                        Adicionar
                    </button>
                </div>
            </div>
        `;

        // Attach component instance to DOM element
        card.productCard = this;
        this.element = card;

        return card;
    }

    increaseQuantity() {
        if (this.quantity < 10) {
            this.quantity++;
            this.updateQuantityDisplay();
            this.updateButtons();
        }
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
            this.updateQuantityDisplay();
            this.updateButtons();
        }
    }

    updateQuantityDisplay() {
        const display = this.element.querySelector('.quantity-display');
        if (display) {
            display.textContent = this.quantity;
        }
    }

    updateButtons() {
        const decreaseBtn = this.element.querySelector('.quantity-btn:first-child');
        const increaseBtn = this.element.querySelector('.quantity-btn:last-child');
        
        if (decreaseBtn) {
            decreaseBtn.disabled = this.quantity <= 1;
        }
        if (increaseBtn) {
            increaseBtn.disabled = this.quantity >= 10;
        }
    }

    addToCart() {
        if (this.onAddToCart) {
            this.onAddToCart(this.product, this.quantity);
        }
    }
}

// ===== CART ITEM COMPONENT =====
class CartItem {
    constructor(item, onUpdateQuantity, onRemove) {
        this.item = item;
        this.onUpdateQuantity = onUpdateQuantity;
        this.onRemove = onRemove;
    }

    render() {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item cart-item-enter';
        cartItem.dataset.itemId = this.item.id;

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <span style="font-size: 2rem;">${this.item.image}</span>
            </div>
            <div class="cart-item-content">
                <h4 class="cart-item-title">${this.item.name}</h4>
                <p class="cart-item-price">${Utils.formatCurrency(this.item.price)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.cartItem.decreaseQuantity()" ${this.item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${this.item.quantity}</span>
                    <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.cartItem.increaseQuantity()" ${this.item.quantity >= 10 ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">${Utils.formatCurrency(this.item.price * this.item.quantity)}</div>
                <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.cartItem.removeItem()" style="background-color: var(--error-color);">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Attach component instance to DOM element
        cartItem.cartItem = this;
        this.element = cartItem;

        return cartItem;
    }

    increaseQuantity() {
        if (this.item.quantity < 10) {
            this.item.quantity++;
            this.updateDisplay();
            if (this.onUpdateQuantity) {
                this.onUpdateQuantity(this.item);
            }
        }
    }

    decreaseQuantity() {
        if (this.item.quantity > 1) {
            this.item.quantity--;
            this.updateDisplay();
            if (this.onUpdateQuantity) {
                this.onUpdateQuantity(this.item);
            }
        }
    }

    updateDisplay() {
        const quantityDisplay = this.element.querySelector('.quantity-display');
        const totalDisplay = this.element.querySelector('.cart-item-total');
        const decreaseBtn = this.element.querySelector('.quantity-btn:first-child');
        const increaseBtn = this.element.querySelector('.quantity-btn:nth-child(2)');

        if (quantityDisplay) {
            quantityDisplay.textContent = this.item.quantity;
        }
        if (totalDisplay) {
            totalDisplay.textContent = Utils.formatCurrency(this.item.price * this.item.quantity);
        }
        if (decreaseBtn) {
            decreaseBtn.disabled = this.item.quantity <= 1;
        }
        if (increaseBtn) {
            increaseBtn.disabled = this.item.quantity >= 10;
        }
    }

    removeItem() {
        if (this.onRemove) {
            this.onRemove(this.item);
        }
    }
}

// ===== LOADING COMPONENT =====
class Loading {
    constructor() {
        this.element = document.getElementById('loading-screen');
    }

    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
        }
    }

    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
        }
    }

    setMessage(message) {
        const title = this.element?.querySelector('h2');
        if (title) {
            title.textContent = message;
        }
    }
}

// ===== MODAL COMPONENT =====
class Modal {
    constructor(id, title, content) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.isOpen = false;
    }

    render() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = this.id;
        
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${this.title}</h3>
                        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.modal.close()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                </div>
            </div>
        `;

        // Attach component instance to DOM element
        modal.modal = this;
        this.element = modal;

        return modal;
    }

    open() {
        if (!this.element) {
            this.render();
            document.body.appendChild(this.element);
        }
        
        this.element.style.display = 'flex';
        this.isOpen = true;
        
        // Add animation
        setTimeout(() => {
            this.element.classList.add('modal-open');
        }, 10);
    }

    close() {
        if (this.element) {
            this.element.classList.remove('modal-open');
            setTimeout(() => {
                this.element.style.display = 'none';
                this.isOpen = false;
            }, 300);
        }
    }

    updateContent(content) {
        const body = this.element?.querySelector('.modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }
}

// ===== SCREEN MANAGER =====
class ScreenManager {
    constructor() {
        this.screens = {};
        this.currentScreen = null;
    }

    registerScreen(id, element) {
        this.screens[id] = element;
    }

    showScreen(id) {
        // Hide current screen
        if (this.currentScreen && this.screens[this.currentScreen]) {
            this.screens[this.currentScreen].classList.remove('active');
        }

        // Show new screen
        if (this.screens[id]) {
            this.screens[id].classList.add('active');
            this.currentScreen = id;
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    getScreen(id) {
        return this.screens[id];
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.observers = new Map();
    }

    // Intersection Observer for scroll animations
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    // Stagger animation for lists
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
            element.classList.add('stagger-item');
        });
    }

    // Add animation class
    animate(element, animationClass, duration = 600) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }

    // Pulse animation
    pulse(element, duration = 1000) {
        this.animate(element, 'animate-pulse', duration);
    }

    // Bounce animation
    bounce(element) {
        this.animate(element, 'animate-bounce', 1000);
    }

    // Fade in animation
    fadeIn(element) {
        this.animate(element, 'animate-fade-in', 600);
    }

    // Scale in animation
    scaleIn(element) {
        this.animate(element, 'animate-scale-in', 400);
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateThemeButton();
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateThemeButton();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }

    updateThemeButton() {
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// ===== LANGUAGE MANAGER =====
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'pt-BR';
        this.init();
    }

    init() {
        this.updateLanguageButton();
    }

    toggle() {
        this.currentLanguage = this.currentLanguage === 'pt-BR' ? 'en-US' : 'pt-BR';
        this.updateLanguageButton();
        localStorage.setItem('language', this.currentLanguage);
        // Reload page to apply language change
        window.location.reload();
    }

    updateLanguageButton() {
        const languageBtn = document.getElementById('languageBtn');
        if (languageBtn) {
            const span = languageBtn.querySelector('span');
            span.textContent = this.currentLanguage === 'pt-BR' ? 'PT' : 'EN';
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// ===== EXPORT COMPONENTS =====
window.Components = {
    Toast,
    ProductCard,
    CartItem,
    Loading,
    Modal,
    ScreenManager,
    AnimationManager,
    ThemeManager,
    LanguageManager
};
