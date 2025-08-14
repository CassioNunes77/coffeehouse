// CoffeeHouse Admin App
let adminApp = {
    currentSection: 'dashboard',
    employees: [],
    inventory: [],
    transactions: [],
    sales: [],

    statistics: {},
    charts: {},
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.hideLoading();
        this.loadDashboard();
        this.initializeCharts();
    },

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.querySelector('.admin-sidebar').classList.toggle('active');
        });

        // Theme toggle
        document.getElementById('themeBtn')?.addEventListener('click', () => this.toggleTheme());

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // Employee management
        document.getElementById('addEmployeeBtn')?.addEventListener('click', () => this.openEmployeeModal());
        document.getElementById('saveEmployeeBtn')?.addEventListener('click', () => this.saveEmployee());
        document.getElementById('cancelEmployeeBtn')?.addEventListener('click', () => this.closeEmployeeModal());
        document.getElementById('closeEmployeeModal')?.addEventListener('click', () => this.closeEmployeeModal());

        // Inventory management
        document.getElementById('addItemBtn')?.addEventListener('click', () => this.openInventoryModal());
        document.getElementById('saveInventoryBtn')?.addEventListener('click', () => this.saveInventoryItem());
        document.getElementById('cancelInventoryBtn')?.addEventListener('click', () => this.closeInventoryModal());
        document.getElementById('closeInventoryModal')?.addEventListener('click', () => this.closeInventoryModal());



        // Statistics
        document.getElementById('statsPeriod')?.addEventListener('change', () => this.loadStatistics());
        document.getElementById('exportStatsBtn')?.addEventListener('click', () => this.exportStatistics());

        // Filters
        document.getElementById('categoryFilter')?.addEventListener('change', () => this.filterInventory());
        document.getElementById('stockFilter')?.addEventListener('change', () => this.filterInventory());
        document.getElementById('dateRange')?.addEventListener('change', () => this.loadSalesData());
        document.getElementById('productFilter')?.addEventListener('change', () => this.filterSales());

        // Reports and exports
        document.getElementById('generateReportBtn')?.addEventListener('click', () => this.generateSalesReport());
        document.getElementById('exportSalesBtn')?.addEventListener('click', () => this.exportSalesData());
        document.getElementById('exportTransactionsBtn')?.addEventListener('click', () => this.exportTransactions());

        // Settings
        document.getElementById('generalSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGeneralSettings();
        });
        document.getElementById('systemSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSystemSettings();
        });

        // Modal backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    },

    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`)?.classList.add('active');

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        const titles = {
            dashboard: 'Dashboard',
            employees: 'Funcionários',
            inventory: 'Estoque',

            statistics: 'Estatísticas',
            financial: 'Financeiro',
            sales: 'Vendas',
            metrics: 'Métricas',
            settings: 'Configurações'
        };
        if (pageTitle) {
            pageTitle.textContent = titles[sectionId] || 'Dashboard';
        }

        this.currentSection = sectionId;

        // Load section specific data
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'employees':
                this.loadEmployees();
                break;
            case 'inventory':
                this.loadInventory();
                break;
            case 'financial':
                this.loadFinancialData();
                break;
            case 'sales':
                this.loadSalesData();
                break;
            case 'metrics':
                this.loadMetrics();
                break;
        }
    },

    loadData() {
        // Load employees
        const savedEmployees = localStorage.getItem('coffeehouse_employees');
        this.employees = savedEmployees ? JSON.parse(savedEmployees) : this.getDefaultEmployees();

        // Load inventory
        const savedInventory = localStorage.getItem('coffeehouse_inventory');
        this.inventory = savedInventory ? JSON.parse(savedInventory) : this.getDefaultInventory();

        // Load transactions
        const savedTransactions = localStorage.getItem('coffeehouse_transactions');
        this.transactions = savedTransactions ? JSON.parse(savedTransactions) : this.getDefaultTransactions();

        // Load sales
        const savedSales = localStorage.getItem('coffeehouse_sales');
        this.sales = savedSales ? JSON.parse(savedSales) : this.getDefaultSales();
    },

    getDefaultEmployees() {
        return window.ADMIN_DATA?.employees || [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@coffeehouse.com',
                phone: '(11) 99999-1111',
                role: 'barista',
                status: 'active',
                hireDate: '2023-01-15'
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@coffeehouse.com',
                phone: '(11) 99999-2222',
                role: 'cashier',
                status: 'active',
                hireDate: '2023-02-20'
            },
            {
                id: 3,
                name: 'Pedro Costa',
                email: 'pedro@coffeehouse.com',
                phone: '(11) 99999-3333',
                role: 'manager',
                status: 'active',
                hireDate: '2022-11-10'
            }
        ];
    },

    getDefaultInventory() {
        return window.ADMIN_DATA?.inventory || [
            {
                id: 1,
                name: 'Café Arábica',
                category: 'coffees',
                price: 25.90,
                stock: 50,
                minStock: 10,
                description: 'Café arábica premium'
            },
            {
                id: 2,
                name: 'Leite Integral',
                category: 'others',
                price: 8.50,
                stock: 30,
                minStock: 15,
                description: 'Leite integral fresco'
            },
            {
                id: 3,
                name: 'Açúcar Refinado',
                category: 'others',
                price: 5.90,
                stock: 5,
                minStock: 10,
                description: 'Açúcar refinado 1kg'
            }
        ];
    },

    getDefaultTransactions() {
        return window.ADMIN_DATA?.transactions || [
            {
                id: 1,
                type: 'revenue',
                amount: 150.00,
                description: 'Vendas do dia',
                date: new Date().toISOString(),
                category: 'sales'
            },
            {
                id: 2,
                type: 'expense',
                amount: 45.00,
                description: 'Compra de insumos',
                date: new Date().toISOString(),
                category: 'inventory'
            }
        ];
    },

    getDefaultSales() {
        return window.ADMIN_DATA?.sales || [
            {
                id: 1,
                productName: 'Cappuccino',
                quantity: 25,
                revenue: 172.50,
                date: new Date().toISOString(),
                customerName: 'Maria Santos'
            },
            {
                id: 2,
                productName: 'Espresso',
                quantity: 15,
                revenue: 67.50,
                date: new Date().toISOString(),
                customerName: 'Pedro Oliveira'
            }
        ];
    },

    loadDashboard() {
        this.updateDashboardStats();
        this.loadRecentOrders();
        // Limpar cache dos gráficos para garantir atualização na primeira vez
        this.clearChartsCache();
        this.updateCharts();
    },

    updateDashboardStats() {
        const today = new Date().toDateString();
        
        // Today's orders
        const todayOrders = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        ).length;
        document.getElementById('todayOrders').textContent = todayOrders;

        // Today's revenue
        const todayRevenue = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        ).reduce((sum, sale) => sum + sale.revenue, 0);
        document.getElementById('todayRevenue').textContent = Utils.formatCurrency(todayRevenue);

        // Active employees
        const activeEmployees = this.employees.filter(emp => emp.status === 'active').length;
        document.getElementById('activeEmployees').textContent = activeEmployees;

        // Low stock items
        const lowStockItems = this.inventory.filter(item => item.stock <= item.minStock).length;
        document.getElementById('lowStockItems').textContent = lowStockItems;
    },

    loadRecentOrders() {
        const recentOrdersList = document.getElementById('recentOrdersList');
        if (!recentOrdersList) return;

        const orders = this.sales.slice(0, 5);
        
        recentOrdersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-product">${order.productName}</div>
                    <div class="order-customer">${order.customerName}</div>
                </div>
                <div class="order-details">
                    <div class="order-quantity">x${order.quantity}</div>
                    <div class="order-revenue">${Utils.formatCurrency(order.revenue)}</div>
                </div>
            </div>
        `).join('');
    },

    loadEmployees() {
        const employeesGrid = document.getElementById('employeesGrid');
        if (!employeesGrid) return;

        employeesGrid.innerHTML = this.employees.map(employee => `
            <div class="employee-card">
                <div class="employee-header">
                    <div class="employee-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="employee-info">
                        <h4>${employee.name}</h4>
                        <p class="employee-role">${this.getRoleName(employee.role)}</p>
                    </div>
                    <span class="employee-status ${employee.status}">${employee.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div class="employee-details">
                    <p><i class="fas fa-envelope"></i> ${employee.email}</p>
                    <p><i class="fas fa-phone"></i> ${employee.phone}</p>
                </div>
                <div class="employee-actions">
                    <button class="btn-secondary btn-sm" onclick="adminApp.editEmployee(${employee.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary btn-sm" onclick="adminApp.toggleEmployeeStatus(${employee.id})">
                        <i class="fas fa-toggle-on"></i> ${employee.status === 'active' ? 'Desativar' : 'Ativar'}
                    </button>
                </div>
            </div>
        `).join('');
    },

    loadInventory() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;

        inventoryGrid.innerHTML = this.inventory.map(item => `
            <div class="inventory-item">
                <div class="inventory-header">
                    <div>
                        <h4 class="inventory-name">${item.name}</h4>
                        <p class="inventory-category">${this.getCategoryName(item.category)}</p>
                    </div>
                    <div class="inventory-price">${Utils.formatCurrency(item.price)}</div>
                </div>
                <div class="inventory-stock">
                    <span class="stock-amount">Estoque: ${item.stock} unidades</span>
                    <span class="stock-status ${this.getStockStatus(item)}">${this.getStockStatusText(item)}</span>
                </div>
                <p class="inventory-description">${item.description}</p>
                <div class="inventory-actions">
                    <button class="btn-secondary btn-sm" onclick="adminApp.editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary btn-sm" onclick="adminApp.updateStock(${item.id})">
                        <i class="fas fa-plus"></i> Atualizar Estoque
                    </button>
                </div>
            </div>
        `).join('');
    },

    loadFinancialData() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = this.transactions
            .filter(t => t.type === 'revenue' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = this.transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const profit = monthlyRevenue - monthlyExpenses;
        const profitMargin = monthlyRevenue > 0 ? (profit / monthlyRevenue) * 100 : 0;

        document.getElementById('totalRevenue').textContent = Utils.formatCurrency(monthlyRevenue);
        document.getElementById('totalExpenses').textContent = Utils.formatCurrency(monthlyExpenses);
        document.getElementById('totalProfit').textContent = Utils.formatCurrency(profit);
        document.getElementById('profitMargin').textContent = `${profitMargin.toFixed(1)}%`;

        this.loadTransactionsTable();
        this.updateFinancialCharts();
    },

    loadTransactionsTable() {
        const transactionsTable = document.getElementById('transactionsTable');
        if (!transactionsTable) return;

        const recentTransactions = this.transactions.slice(0, 10);
        
        transactionsTable.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentTransactions.map(transaction => `
                        <tr>
                            <td>${Utils.formatDate(transaction.date)}</td>
                            <td>${transaction.description}</td>
                            <td>
                                <span class="badge ${transaction.type === 'revenue' ? 'success' : 'error'}">
                                    ${transaction.type === 'revenue' ? 'Receita' : 'Despesa'}
                                </span>
                            </td>
                            <td>${Utils.formatCurrency(transaction.amount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    loadSalesData() {
        const dateRange = document.getElementById('dateRange')?.value || 'month';
        const filteredSales = this.filterSalesByDateRange(dateRange);
        
        const totalSales = filteredSales.length;
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.revenue, 0);
        const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
        const totalProducts = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

        document.getElementById('totalSales').textContent = totalSales;
        document.getElementById('salesRevenue').textContent = Utils.formatCurrency(totalRevenue);
        document.getElementById('averageTicket').textContent = Utils.formatCurrency(averageTicket);
        document.getElementById('productsSold').textContent = totalProducts;

        this.loadSalesTable(filteredSales);
    },

    loadSalesTable(sales) {
        const salesTable = document.getElementById('salesTable');
        if (!salesTable) return;

        salesTable.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Produto</th>
                        <th>Cliente</th>
                        <th>Quantidade</th>
                        <th>Receita</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map(sale => `
                        <tr>
                            <td>${Utils.formatDate(sale.date)}</td>
                            <td>${sale.productName}</td>
                            <td>${sale.customerName}</td>
                            <td>${sale.quantity}</td>
                            <td>${Utils.formatCurrency(sale.revenue)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    loadMetrics() {
        this.updateMetricsCharts();
    },

    initializeCharts() {
        // Sales Chart
        const salesCtx = document.getElementById('salesChart')?.getContext('2d');
        if (salesCtx) {
            this.charts.sales = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Vendas (R$)',
                        data: [],
                        borderColor: '#8B4513',
                        backgroundColor: 'rgba(139, 69, 19, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Products Chart
        const productsCtx = document.getElementById('productsChart')?.getContext('2d');
        if (productsCtx) {
            this.charts.products = new Chart(productsCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#8B4513',
                            '#D2691E',
                            '#FFD700',
                            '#4CAF50',
                            '#2196F3'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        }

        // Financial Chart
        const financialCtx = document.getElementById('financialChart')?.getContext('2d');
        if (financialCtx) {
            this.charts.financial = new Chart(financialCtx, {
                type: 'bar',
                data: {
                    labels: ['Receita', 'Despesas'],
                    datasets: [{
                        label: 'Valor (R$)',
                        data: [0, 0],
                        backgroundColor: ['#4CAF50', '#F44336']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });
        }
    },

    updateCharts() {
        this.updateSalesChart();
        this.updateProductsChart();
    },

    // Função para limpar cache dos gráficos
    clearChartsCache() {
        if (this.charts.sales) {
            delete this.charts.sales.lastData;
        }
        if (this.charts.products) {
            delete this.charts.products.lastData;
        }
        if (this.charts.financial) {
            delete this.charts.financial.lastData;
        }
    },

    // Função para forçar atualização dos gráficos (usada quando novos dados são adicionados)
    forceUpdateCharts() {
        this.clearChartsCache();
        this.updateCharts();
        this.updateFinancialCharts();
    },

    updateSalesChart() {
        if (!this.charts.sales) return;

        const last7Days = [];
        const salesData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            last7Days.push(dateStr);
            
            const daySales = this.sales.filter(sale => 
                new Date(sale.date).toDateString() === date.toDateString()
            ).reduce((sum, sale) => sum + sale.revenue, 0);
            
            salesData.push(daySales);
        }

        // Atualizar apenas se os dados mudaram ou se não há cache
        const currentData = JSON.stringify(salesData);
        if (!this.charts.sales.lastData || this.charts.sales.lastData !== currentData) {
            this.charts.sales.data.labels = last7Days;
            this.charts.sales.data.datasets[0].data = salesData;
            this.charts.sales.update();
            
            // Marcar como atualizado
            this.charts.sales.lastData = currentData;
        }
    },

    updateProductsChart() {
        if (!this.charts.products) return;

        const productStats = {};
        this.sales.forEach(sale => {
            productStats[sale.productName] = (productStats[sale.productName] || 0) + sale.quantity;
        });

        const labels = Object.keys(productStats);
        const data = Object.values(productStats);

        // Atualizar apenas se os dados mudaram ou se não há cache
        const currentData = JSON.stringify(data);
        if (!this.charts.products.lastData || this.charts.products.lastData !== currentData) {
            this.charts.products.data.labels = labels;
            this.charts.products.data.datasets[0].data = data;
            this.charts.products.update();
            
            // Marcar como atualizado
            this.charts.products.lastData = currentData;
        }
    },

    updateFinancialCharts() {
        if (!this.charts.financial) return;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = this.transactions
            .filter(t => t.type === 'revenue' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = this.transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        // Atualizar apenas se os dados mudaram ou se não há cache
        const currentData = JSON.stringify([monthlyRevenue, monthlyExpenses]);
        if (!this.charts.financial.lastData || this.charts.financial.lastData !== currentData) {
            this.charts.financial.data.datasets[0].data = [monthlyRevenue, monthlyExpenses];
            this.charts.financial.update();
            
            // Marcar como atualizado
            this.charts.financial.lastData = currentData;
        }
    },

    // Employee Management
    openEmployeeModal(employeeId = null) {
        const modal = document.getElementById('employeeModal');
        const title = document.getElementById('employeeModalTitle');
        const form = document.getElementById('employeeForm');
        
        if (employeeId) {
            const employee = this.employees.find(emp => emp.id === employeeId);
            if (employee) {
                title.textContent = 'Editar Funcionário';
                form.elements.employeeName.value = employee.name;
                form.elements.employeeEmail.value = employee.email;
                form.elements.employeePhone.value = employee.phone;
                form.elements.employeeRole.value = employee.role;
                form.elements.employeeStatus.value = employee.status;
                form.dataset.employeeId = employeeId;
            }
        } else {
            title.textContent = 'Adicionar Funcionário';
            form.reset();
            delete form.dataset.employeeId;
        }
        
        modal.classList.add('active');
    },

    closeEmployeeModal() {
        document.getElementById('employeeModal').classList.remove('active');
    },

    saveEmployee() {
        const form = document.getElementById('employeeForm');
        const employeeId = form.dataset.employeeId;
        
        const employeeData = {
            name: form.elements.employeeName.value,
            email: form.elements.employeeEmail.value,
            phone: form.elements.employeePhone.value,
            role: form.elements.employeeRole.value,
            status: form.elements.employeeStatus.value
        };

        if (employeeId) {
            // Edit existing employee
            const index = this.employees.findIndex(emp => emp.id === parseInt(employeeId));
            if (index !== -1) {
                this.employees[index] = { ...this.employees[index], ...employeeData };
            }
        } else {
            // Add new employee
            const newEmployee = {
                id: Date.now(),
                ...employeeData,
                hireDate: new Date().toISOString()
            };
            this.employees.push(newEmployee);
        }

        this.saveEmployees();
        this.loadEmployees();
        this.closeEmployeeModal();
        this.showToast('Funcionário salvo com sucesso!', 'success');
        // Forçar atualização dos gráficos se estivermos no dashboard
        if (this.currentSection === 'dashboard') {
            this.forceUpdateCharts();
        }
    },

    // Inventory Management
    openInventoryModal(itemId = null) {
        const modal = document.getElementById('inventoryModal');
        const title = document.getElementById('inventoryModalTitle');
        const form = document.getElementById('inventoryForm');
        
        if (itemId) {
            const item = this.inventory.find(inv => inv.id === itemId);
            if (item) {
                title.textContent = 'Editar Item';
                form.elements.itemName.value = item.name;
                form.elements.itemCategory.value = item.category;
                form.elements.itemPrice.value = item.price;
                form.elements.itemStock.value = item.stock;
                form.elements.itemDescription.value = item.description;
                form.dataset.itemId = itemId;
            }
        } else {
            title.textContent = 'Adicionar Item';
            form.reset();
            delete form.dataset.itemId;
        }
        
        modal.classList.add('active');
    },

    closeInventoryModal() {
        document.getElementById('inventoryModal').classList.remove('active');
    },

    saveInventoryItem() {
        const form = document.getElementById('inventoryForm');
        const itemId = form.dataset.itemId;
        
        const itemData = {
            name: form.elements.itemName.value,
            category: form.elements.itemCategory.value,
            price: parseFloat(form.elements.itemPrice.value),
            stock: parseInt(form.elements.itemStock.value),
            description: form.elements.itemDescription.value,
            minStock: 10 // Default minimum stock
        };

        if (itemId) {
            // Edit existing item
            const index = this.inventory.findIndex(item => item.id === parseInt(itemId));
            if (index !== -1) {
                this.inventory[index] = { ...this.inventory[index], ...itemData };
            }
        } else {
            // Add new item
            const newItem = {
                id: Date.now(),
                ...itemData
            };
            this.inventory.push(newItem);
        }

        this.saveInventory();
        this.loadInventory();
        this.closeInventoryModal();
        this.showToast('Item salvo com sucesso!', 'success');
        // Forçar atualização dos gráficos se estivermos no dashboard
        if (this.currentSection === 'dashboard') {
            this.forceUpdateCharts();
        }
    },

    // Utility functions
    getRoleName(role) {
        const roles = {
            barista: 'Barista',
            cashier: 'Caixa',
            manager: 'Gerente',
            admin: 'Administrador'
        };
        return roles[role] || role;
    },

    getCategoryName(category) {
        const categories = {
            coffees: 'Cafés',
            'cold-drinks': 'Bebidas Geladas',
            sweets: 'Doces',
            savory: 'Salgados',
            others: 'Outros'
        };
        return categories[category] || category;
    },

    getStockStatus(item) {
        if (item.stock === 0) return 'out';
        if (item.stock <= item.minStock) return 'low';
        return 'normal';
    },

    getStockStatusText(item) {
        const status = this.getStockStatus(item);
        const texts = {
            normal: 'Normal',
            low: 'Baixo',
            out: 'Sem Estoque'
        };
        return texts[status];
    },

    filterInventory() {
        const categoryFilter = document.getElementById('categoryFilter')?.value;
        const stockFilter = document.getElementById('stockFilter')?.value;
        
        let filteredInventory = this.inventory;
        
        if (categoryFilter) {
            filteredInventory = filteredInventory.filter(item => item.category === categoryFilter);
        }
        
        if (stockFilter) {
            filteredInventory = filteredInventory.filter(item => this.getStockStatus(item) === stockFilter);
        }
        
        this.renderInventoryGrid(filteredInventory);
    },

    filterSalesByDateRange(range) {
        const now = new Date();
        const startDate = new Date();
        
        switch (range) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        return this.sales.filter(sale => new Date(sale.date) >= startDate);
    },

    filterSales() {
        const productFilter = document.getElementById('productFilter')?.value;
        const dateRange = document.getElementById('dateRange')?.value || 'month';
        
        let filteredSales = this.filterSalesByDateRange(dateRange);
        
        if (productFilter) {
            filteredSales = filteredSales.filter(sale => sale.productName === productFilter);
        }
        
        this.loadSalesTable(filteredSales);
    },

    // Export functions
    exportSalesData() {
        const dateRange = document.getElementById('dateRange')?.value || 'month';
        const sales = this.filterSalesByDateRange(dateRange);
        
        const csvContent = this.generateSalesCSV(sales);
        this.downloadCSV(csvContent, `vendas_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
        
        this.showToast('Relatório de vendas exportado com sucesso!', 'success');
    },

    exportTransactions() {
        const csvContent = this.generateTransactionsCSV(this.transactions);
        this.downloadCSV(csvContent, `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
        
        this.showToast('Relatório de transações exportado com sucesso!', 'success');
    },

    generateSalesCSV(sales) {
        const headers = ['Data', 'Produto', 'Cliente', 'Quantidade', 'Receita'];
        const rows = sales.map(sale => [
            Utils.formatDate(sale.date),
            sale.productName,
            sale.customerName,
            sale.quantity,
            sale.revenue
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    },

    generateTransactionsCSV(transactions) {
        const headers = ['Data', 'Descrição', 'Tipo', 'Valor'];
        const rows = transactions.map(transaction => [
            Utils.formatDate(transaction.date),
            transaction.description,
            transaction.type === 'revenue' ? 'Receita' : 'Despesa',
            transaction.amount
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    },

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Settings
    saveGeneralSettings() {
        const settings = {
            storeName: document.getElementById('storeName').value,
            storeAddress: document.getElementById('storeAddress').value,
            storePhone: document.getElementById('storePhone').value,
            storeEmail: document.getElementById('storeEmail').value
        };
        
        localStorage.setItem('coffeehouse_general_settings', JSON.stringify(settings));
        this.showToast('Configurações gerais salvas com sucesso!', 'success');
    },

    saveSystemSettings() {
        const settings = {
            currency: document.getElementById('currency').value,
            timezone: document.getElementById('timezone').value,
            language: document.getElementById('language').value
        };
        
        localStorage.setItem('coffeehouse_system_settings', JSON.stringify(settings));
        this.showToast('Configurações do sistema salvas com sucesso!', 'success');
    },

    // Data persistence
    saveEmployees() {
        localStorage.setItem('coffeehouse_employees', JSON.stringify(this.employees));
    },

    saveInventory() {
        localStorage.setItem('coffeehouse_inventory', JSON.stringify(this.inventory));
    },

    // UI functions
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

    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            window.location.href = 'index.html';
        }
    },

    // Additional functions
    editEmployee(employeeId) {
        this.openEmployeeModal(employeeId);
    },

    toggleEmployeeStatus(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (employee) {
            employee.status = employee.status === 'active' ? 'inactive' : 'active';
            this.saveEmployees();
            this.loadEmployees();
            this.showToast(`Funcionário ${employee.name} ${employee.status === 'active' ? 'ativado' : 'desativado'} com sucesso!`, 'success');
        }
    },

    editInventoryItem(itemId) {
        this.openInventoryModal(itemId);
    },

    updateStock(itemId) {
        const item = this.inventory.find(inv => inv.id === itemId);
        if (item) {
            const newStock = prompt(`Atualizar estoque de ${item.name} (atual: ${item.stock}):`, item.stock);
            if (newStock !== null && !isNaN(newStock)) {
                item.stock = parseInt(newStock);
                this.saveInventory();
                this.loadInventory();
                this.showToast(`Estoque de ${item.name} atualizado para ${item.stock} unidades!`, 'success');
            }
        }
    },

    generateSalesReport() {
        const dateRange = document.getElementById('dateRange')?.value || 'month';
        const sales = this.filterSalesByDateRange(dateRange);
        
        // Generate a comprehensive report
        const report = {
            period: dateRange,
            totalSales: sales.length,
            totalRevenue: sales.reduce((sum, sale) => sum + sale.revenue, 0),
            totalProducts: sales.reduce((sum, sale) => sum + sale.quantity, 0),
            averageTicket: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.revenue, 0) / sales.length : 0,
            topProducts: this.getTopProducts(sales),
            generatedAt: new Date().toISOString()
        };
        
        // Save report to localStorage
        const reports = JSON.parse(localStorage.getItem('coffeehouse_reports') || '[]');
        reports.unshift(report);
        localStorage.setItem('coffeehouse_reports', JSON.stringify(reports));
        
        this.showToast('Relatório gerado com sucesso!', 'success');
        
        // You could also open a modal to display the report
        this.displayReport(report);
    },

    getTopProducts(sales) {
        const productStats = {};
        sales.forEach(sale => {
            productStats[sale.productName] = (productStats[sale.productName] || 0) + sale.quantity;
        });
        
        return Object.entries(productStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }));
    },

    displayReport(report) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Relatório de Vendas</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="report-summary">
                        <h4>Resumo do Período</h4>
                        <p><strong>Total de Vendas:</strong> ${report.totalSales}</p>
                        <p><strong>Receita Total:</strong> ${Utils.formatCurrency(report.totalRevenue)}</p>
                        <p><strong>Produtos Vendidos:</strong> ${report.totalProducts}</p>
                        <p><strong>Ticket Médio:</strong> ${Utils.formatCurrency(report.averageTicket)}</p>
                    </div>
                    <div class="report-products">
                        <h4>Produtos Mais Vendidos</h4>
                        <ul>
                            ${report.topProducts.map(product => 
                                `<li>${product.name}: ${product.quantity} unidades</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    updateMetricsCharts() {
        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart')?.getContext('2d');
        if (performanceCtx && !this.charts.performance) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Vendas Mensais',
                        data: [1200, 1400, 1300, 1600, 1800, 2000],
                        borderColor: '#8B4513',
                        backgroundColor: 'rgba(139, 69, 19, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Peak Hours Chart
        const peakHoursCtx = document.getElementById('peakHoursChart')?.getContext('2d');
        if (peakHoursCtx && !this.charts.peakHours) {
            this.charts.peakHours = new Chart(peakHoursCtx, {
                type: 'bar',
                data: {
                    labels: ['8h', '10h', '12h', '14h', '16h', '18h'],
                    datasets: [{
                        label: 'Vendas por Hora',
                        data: [15, 25, 45, 30, 35, 40],
                        backgroundColor: '#D2691E'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Popular Products Chart
        const popularProductsCtx = document.getElementById('popularProductsChart')?.getContext('2d');
        if (popularProductsCtx && !this.charts.popularProducts) {
            this.charts.popularProducts = new Chart(popularProductsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Cappuccino', 'Espresso', 'Latte', 'Brownie', 'Outros'],
                    datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: [
                            '#8B4513',
                            '#D2691E',
                            '#FFD700',
                            '#4CAF50',
                            '#2196F3'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Customer Analysis Chart
        const customerAnalysisCtx = document.getElementById('customerAnalysisChart')?.getContext('2d');
        if (customerAnalysisCtx && !this.charts.customerAnalysis) {
            this.charts.customerAnalysis = new Chart(customerAnalysisCtx, {
                type: 'pie',
                data: {
                    labels: ['Novos Clientes', 'Clientes Recorrentes', 'Clientes VIP'],
                    datasets: [{
                        data: [40, 45, 15],
                        backgroundColor: [
                            '#4CAF50',
                            '#2196F3',
                            '#FFD700'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    },

    renderInventoryGrid(inventory) {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;

        inventoryGrid.innerHTML = inventory.map(item => `
            <div class="inventory-item">
                <div class="inventory-header">
                    <div>
                        <h4 class="inventory-name">${item.name}</h4>
                        <p class="inventory-category">${this.getCategoryName(item.category)}</p>
                    </div>
                    <div class="inventory-price">${Utils.formatCurrency(item.price)}</div>
                </div>
                <div class="inventory-stock">
                    <span class="stock-amount">Estoque: ${item.stock} unidades</span>
                    <span class="stock-status ${this.getStockStatus(item)}">${this.getStockStatusText(item)}</span>
                </div>
                <p class="inventory-description">${item.description}</p>
                <div class="inventory-actions">
                    <button class="btn-secondary btn-sm" onclick="adminApp.editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary btn-sm" onclick="adminApp.updateStock(${item.id})">
                        <i class="fas fa-plus"></i> Atualizar Estoque
                    </button>
                </div>
            </div>
        `).join('');
    }
};

// Initialize admin app
document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});

// Make admin app globally available
window.adminApp = adminApp;
