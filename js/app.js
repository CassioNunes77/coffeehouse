// CoffeeHouse App
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);

    // Simple cart functionality
    let cart = [];
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('coffeehouse_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            cart = [];
        }
    }

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Update cart display
    const updateCartDisplay = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
        document.getElementById('floatingCartCount').textContent = totalItems;
    };

    // Initialize
    updateCartDisplay();
});
