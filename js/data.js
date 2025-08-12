// ===== PRODUCT DATA =====
const PRODUCTS_DATA = {
    coffees: [
        {
            id: 1,
            name: "Espresso",
            description: "Café puro e intenso, extraído sob pressão",
            price: 4.50,
            category: "coffees",
            image: "☕",
            badge: null
        },
        {
            id: 2,
            name: "Cappuccino",
            description: "Espresso com leite vaporizado e espuma cremosa",
            price: 6.90,
            category: "coffees",
            image: "☕",
            badge: "Popular"
        },
        {
            id: 3,
            name: "Latte",
            description: "Espresso suave com leite cremoso",
            price: 7.50,
            category: "coffees",
            image: "☕",
            badge: null
        }
    ],
    "cold-drinks": [
        {
            id: 4,
            name: "Frappuccino",
            description: "Bebida gelada com café, leite e gelo batido",
            price: 12.90,
            category: "cold-drinks",
            image: "🥤",
            badge: "Gelado"
        },
        {
            id: 5,
            name: "Iced Latte",
            description: "Latte gelado com cubos de gelo",
            price: 8.50,
            category: "cold-drinks",
            image: "🥤",
            badge: "Gelado"
        }
    ],
    sweets: [
        {
            id: 6,
            name: "Brownie",
            description: "Brownie caseiro com chocolate belga",
            price: 8.90,
            category: "sweets",
            image: "🍰",
            badge: "Caseiro"
        },
        {
            id: 7,
            name: "Cheesecake",
            description: "Cheesecake cremoso com calda de frutas vermelhas",
            price: 12.90,
            category: "sweets",
            image: "🍰",
            badge: "Especial"
        }
    ],
    savory: [
        {
            id: 8,
            name: "Sanduíche de Frango",
            description: "Sanduíche com frango grelhado e vegetais",
            price: 15.90,
            category: "savory",
            image: "🥪",
            badge: "Grelhado"
        },
        {
            id: 9,
            name: "Croissant",
            description: "Croissant tradicional francês",
            price: 7.90,
            category: "savory",
            image: "🥐",
            badge: "Tradicional"
        }
    ],
    others: [
        {
            id: 10,
            name: "Água",
            description: "Água mineral natural",
            price: 3.50,
            category: "others",
            image: "💧",
            badge: null
        },
        {
            id: 11,
            name: "Suco Natural",
            description: "Suco natural de laranja",
            price: 6.90,
            category: "others",
            image: "🍊",
            badge: "Natural"
        }
    ]
};

// ===== CATEGORIES =====
const CATEGORIES = [
    { id: "coffees", name: "Cafés", icon: "fas fa-coffee" },
    { id: "cold-drinks", name: "Bebidas Geladas", icon: "fas fa-glass-whiskey" },
    { id: "sweets", name: "Doces", icon: "fas fa-cookie-bite" },
    { id: "savory", name: "Salgados", icon: "fas fa-bread-slice" },
    { id: "others", name: "Outros", icon: "fas fa-ellipsis-h" }
];

// ===== PAYMENT METHODS =====
const PAYMENT_METHODS = [
    {
        id: "card",
        name: "Cartão",
        icon: "fas fa-credit-card",
        description: "Cartão de crédito ou débito"
    },
    {
        id: "pix",
        name: "PIX",
        icon: "fas fa-qrcode",
        description: "Pagamento instantâneo"
    },
    {
        id: "nfc",
        name: "NFC",
        icon: "fas fa-mobile-alt",
        description: "Apple Pay ou Google Pay"
    },
    {
        id: "cash",
        name: "Dinheiro",
        icon: "fas fa-money-bill-wave",
        description: "Pagamento em dinheiro"
    }
];

// ===== APP CONFIGURATIONS =====
const APP_CONFIG = {
    name: "CoffeeHouse",
    version: "1.0.0",
    currency: "R$",
    language: "pt-BR",
    theme: "light",
    estimatedTime: "5-10 minutos",
    maxQuantity: 10,
    minOrderValue: 5.00,
    taxRate: 0.10, // 10% de taxa
    deliveryFee: 0.00,
    autoSaveInterval: 30000, // 30 segundos
    sessionTimeout: 300000, // 5 minutos
    notifications: {
        enabled: true,
        sound: true,
        vibration: true
    }
};

// ===== LOCALIZATION =====
const TRANSLATIONS = {
    "pt-BR": {
        welcome: {
            title: "Bem-vindo ao CoffeeHouse",
            subtitle: "Escolha seus produtos favoritos e faça seu pedido de forma rápida e fácil",
            startOrder: "Fazer Pedido",
            viewMenu: "Ver Cardápio",
            features: {
                fast: "Pedido Rápido",
                secure: "Pagamento Seguro",
                noSignup: "Sem Cadastro"
            }
        },
        menu: {
            title: "Cardápio",
            categories: {
                coffees: "Cafés",
                "cold-drinks": "Bebidas Geladas",
                sweets: "Doces",
                savory: "Salgados",
                others: "Outros"
            }
        },
        cart: {
            title: "Seu Pedido",
            empty: "Seu carrinho está vazio",
            subtotal: "Subtotal:",
            total: "Total:",
            proceed: "Ir para Pagamento",
            clear: "Limpar Carrinho"
        },
        payment: {
            title: "Pagamento",
            orderSummary: "Resumo do Pedido",
            paymentMethod: "Forma de Pagamento",
            confirm: "Confirmar Pagamento"
        },
        confirmation: {
            title: "Pedido Confirmado!",
            orderNumber: "Número do Pedido:",
            estimatedTime: "Tempo Estimado:",
            message: "Seu pedido foi recebido e está sendo preparado com carinho!",
            newOrder: "Novo Pedido"
        },
        notifications: {
            addedToCart: "Adicionado ao carrinho",
            removedFromCart: "Removido do carrinho",
            cartCleared: "Carrinho limpo",
            paymentSuccess: "Pagamento realizado com sucesso!",
            paymentError: "Erro no pagamento. Tente novamente.",
            orderConfirmed: "Pedido confirmado!",
            error: "Ocorreu um erro. Tente novamente."
        }
    },
    "en-US": {
        welcome: {
            title: "Welcome to CoffeeHouse",
            subtitle: "Choose your favorite products and place your order quickly and easily",
            startOrder: "Start Order",
            viewMenu: "View Menu",
            features: {
                fast: "Fast Order",
                secure: "Secure Payment",
                noSignup: "No Signup"
            }
        },
        menu: {
            title: "Menu",
            categories: {
                coffees: "Coffees",
                "cold-drinks": "Cold Drinks",
                sweets: "Sweets",
                savory: "Savory",
                others: "Others"
            }
        },
        cart: {
            title: "Your Order",
            empty: "Your cart is empty",
            subtotal: "Subtotal:",
            total: "Total:",
            proceed: "Proceed to Payment",
            clear: "Clear Cart"
        },
        payment: {
            title: "Payment",
            orderSummary: "Order Summary",
            paymentMethod: "Payment Method",
            confirm: "Confirm Payment"
        },
        confirmation: {
            title: "Order Confirmed!",
            orderNumber: "Order Number:",
            estimatedTime: "Estimated Time:",
            message: "Your order has been received and is being prepared with care!",
            newOrder: "New Order"
        },
        notifications: {
            addedToCart: "Added to cart",
            removedFromCart: "Removed from cart",
            cartCleared: "Cart cleared",
            paymentSuccess: "Payment successful!",
            paymentError: "Payment error. Please try again.",
            orderConfirmed: "Order confirmed!",
            error: "An error occurred. Please try again."
        }
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    generateOrderNumber: () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `#${timestamp}${random}`;
    },

    getProductById: (id) => {
        for (const category in PRODUCTS_DATA) {
            const product = PRODUCTS_DATA[category].find(p => p.id === id);
            if (product) return product;
        }
        return null;
    },

    getProductsByCategory: (category) => {
        return PRODUCTS_DATA[category] || [];
    },

    // Get all products
    getAllProducts: () => {
        const allProducts = [];
        for (const category in PRODUCTS_DATA) {
            allProducts.push(...PRODUCTS_DATA[category]);
        }
        return allProducts;
    },

    // Get category by ID
    getCategoryById: (id) => {
        return CATEGORIES.find(cat => cat.id === id);
    },

    // Get payment method by ID
    getPaymentMethodById: (id) => {
        return PAYMENT_METHODS.find(method => method.id === id);
    },

    // Get translation
    getText: (key, language = APP_CONFIG.language) => {
        const keys = key.split('.');
        let value = TRANSLATIONS[language];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return value;
    },

    // Save to localStorage
    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    // Load from localStorage
    loadFromStorage: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    // Clear localStorage
    clearStorage: (key) => {
        try {
            if (key) {
                localStorage.removeItem(key);
            } else {
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: (phone) => {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Format phone number
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat(APP_CONFIG.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Get time ago
    getTimeAgo: (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " anos atrás";
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " meses atrás";
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " dias atrás";
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " horas atrás";
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutos atrás";
        
        return Math.floor(seconds) + " segundos atrás";
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCTS_DATA,
        CATEGORIES,
        PAYMENT_METHODS,
        APP_CONFIG,
        TRANSLATIONS,
        Utils
    };
}
