/**
 * Ingresos (Income/Revenue) JavaScript
 * Handles income tracking, order management, and revenue analytics
 * Based on orders.jsx from React implementation
 * Compatible with Laravel Blade integration
 */

// Global state management
let currentCreator = null;
let allOrders = [];
let allProducts = [];
let filteredOrders = [];
let isLoading = true;

// Filter and pagination state
let searchTerm = "";
let filterStatus = "all";
let filterDate = "all";
let currentPage = 1;
const ordersPerPage = 15;

// Chart instances
let mobileChart = null;
let desktopChart = null;

// UI state
let copied = false;

// DOM elements
const loadingState = document.getElementById('loadingState');
const mobileLayout = document.getElementById('mobileLayout');
const desktopLayout = document.getElementById('desktopLayout');

/**
 * Initialize the income dashboard
 * Main entry point for the application
 */
async function initializeIngresos() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Set up event listeners
    setupEventListeners();
    
    // Show loading state
    showLoadingState();
    
    // Load income data
    await loadIncomeData();
    
    // Hide loading state and show content
    hideLoadingState();
    
    console.log('Ingresos dashboard initialized successfully');
}

/**
 * Set up all event listeners
 * Handles all user interactions on the page
 */
function setupEventListeners() {
    // Search inputs
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', handleSearchChange);
    }
    if (desktopSearchInput) {
        desktopSearchInput.addEventListener('input', handleSearchChange);
    }
    
    // Filter dropdowns
    const filterElements = [
        'mobileStatusFilter', 'desktopStatusFilter',
        'mobileDateFilter', 'desktopDateFilter'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', handleFilterChange);
        }
    });
    
    // Export CSV buttons
    const mobileExportBtn = document.getElementById('mobileExportBtn');
    const desktopExportBtn = document.getElementById('desktopExportBtn');
    
    if (mobileExportBtn) {
        mobileExportBtn.addEventListener('click', handleExportCSV);
    }
    if (desktopExportBtn) {
        desktopExportBtn.addEventListener('click', handleExportCSV);
    }
    
    // Copy URL button
    const desktopCopyBtn = document.getElementById('desktopCopyBtn');
    if (desktopCopyBtn) {
        desktopCopyBtn.addEventListener('click', handleCopyUrl);
    }
    
    // View public profile button
    const desktopProfileBtn = document.getElementById('desktopProfileBtn');
    if (desktopProfileBtn) {
        desktopProfileBtn.addEventListener('click', handleViewPublicProfile);
    }
    
    // Pagination buttons
    setupPaginationListeners();
}

/**
 * Set up pagination event listeners
 */
function setupPaginationListeners() {
    const paginationElements = [
        { prev: 'mobilePrevBtn', next: 'mobileNextBtn' },
        { prev: 'desktopPrevBtn', next: 'desktopNextBtn' }
    ];
    
    paginationElements.forEach(({ prev, next }) => {
        const prevBtn = document.getElementById(prev);
        const nextBtn = document.getElementById(next);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => handlePageChange(currentPage - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => handlePageChange(currentPage + 1));
        }
    });
}

/**
 * Show loading state
 */
function showLoadingState() {
    if (loadingState) {
        loadingState.style.display = 'block';
    }
    if (mobileLayout) {
        mobileLayout.style.display = 'none';
    }
    if (desktopLayout) {
        desktopLayout.style.display = 'none';
    }
    isLoading = true;
}

/**
 * Hide loading state and show content
 */
function hideLoadingState() {
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    if (mobileLayout) {
        mobileLayout.style.display = '';  // Let CSS handle responsive behavior
    }
    if (desktopLayout) {
        desktopLayout.style.display = '';  // Let CSS handle responsive behavior
    }
    isLoading = false;
}

/**
 * Load income data
 * Simulates the data loading from React orders.jsx
 */
async function loadIncomeData() {
    try {
        // Simulate API calls with realistic data
        await simulateDataLoading();
        
        // Apply initial filters
        applyFilters();
        
        // Update UI with loaded data
        updateIncomeUI();
        
        // Create revenue charts
        await createRevenueCharts();
        
    } catch (error) {
        console.error('Error loading income data:', error);
        // In production, show error message to user
    }
}

/**
 * Simulate data loading with realistic delays
 * Replicates the loadData function from React orders.jsx
 */
async function simulateDataLoading() {
    // Simulate getting current creator (User.me() + Creator.filter())
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock creator data
    currentCreator = {
        id: 'creator_123',
        username: 'mi_usuario',
        display_name: 'Ana María',
        bio: 'Creadora de contenido digital',
        public_url: `${window.location.origin}/u/mi_usuario`
    };
    
    // Mock products data (Product.filter())
    await new Promise(resolve => setTimeout(resolve, 300));
    
    allProducts = [
        {
            id: 'prod_1',
            title: 'Curso de Marketing Digital',
            creator_id: currentCreator.id,
            type: 'course'
        },
        {
            id: 'prod_2',
            title: 'Consultoría 1:1',
            creator_id: currentCreator.id,
            type: 'call'
        },
        {
            id: 'prod_3',
            title: 'Membresía Premium',
            creator_id: currentCreator.id,
            type: 'membership'
        },
        {
            id: 'prod_deleted',
            title: 'Producto eliminado',
            creator_id: currentCreator.id,
            type: 'deleted'
        }
    ];
    
    // Mock orders data (Order.filter())
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generate realistic mock orders
    allOrders = generateMockOrders();
}

/**
 * Generate mock orders for testing
 * Based on the order generation logic from React orders.jsx
 */
function generateMockOrders() {
    const orders = [];
    const statuses = ['completed', 'pending', 'refunded'];
    const customers = [
        { name: 'María González', email: 'maria.gonzalez@email.com' },
        { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com' },
        { name: 'Ana López', email: 'ana.lopez@email.com' },
        { name: 'Luis Martínez', email: 'luis.martinez@email.com' },
        { name: 'Sofía Hernández', email: 'sofia.hernandez@email.com' },
        { name: 'Diego Fernández', email: 'diego.fernandez@email.com' }
    ];
    
    // Generate orders for the last 30 days
    for (let i = 0; i < 25; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);
        
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const productId = allProducts[Math.floor(Math.random() * (allProducts.length - 1))].id; // Exclude deleted product mostly
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Weight statuses - more completed orders
        const weightedStatus = Math.random() < 0.8 ? 'completed' : 
                             Math.random() < 0.9 ? 'pending' : 'refunded';
        
        orders.push({
            id: `order_${Date.now()}_${i}`,
            creator_id: currentCreator.id,
            product_id: productId,
            customer_name: customer.name,
            customer_email: customer.email,
            amount: Math.floor(Math.random() * 200) + 25, // $25-$225
            status: weightedStatus,
            created_date: orderDate.toISOString()
        });
    }
    
    // Sort by date (newest first)
    return orders.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
}

/**
 * Get product title by ID
 * Replicates the getProductTitle function from React orders.jsx
 */
function getProductTitle(productId) {
    const product = allProducts.find(p => p.id === productId);
    return product ? product.title : "Producto eliminado";
}

/**
 * Calculate financial metrics
 * Replicates the financial calculations from React orders.jsx
 */
function calculateMetrics() {
    const completedOrders = allOrders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);
    
    // Calculate available funds (80% immediately available, 20% in processing)
    const availableForWithdraw = totalRevenue * 0.8;
    const availableSoon = totalRevenue * 0.2;
    
    return {
        totalRevenue,
        availableForWithdraw,
        availableSoon,
        totalSales: completedOrders.length,
        totalOrders: allOrders.length
    };
}

/**
 * Generate revenue chart data
 * Replicates the generateRevenueChart function from React orders.jsx
 */
function generateRevenueChart() {
    const completedOrders = allOrders.filter(order => order.status === 'completed');
    
    // If no orders, generate example data
    if (completedOrders.length === 0) {
        const exampleData = [];
        let accumulated = 0;
        
        for (let i = 7; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Add simulated revenue growth
            accumulated += Math.floor(Math.random() * 50) + 10;
            
            exampleData.push({
                date: formatDateForChart(date),
                revenue: accumulated
            });
        }
        
        return exampleData;
    }
    
    // Process real orders
    const sortedOrders = [...completedOrders].sort((a, b) => 
        new Date(a.created_date) - new Date(b.created_date));
    
    let accumulated = 0;
    const data = [];
    
    // Add starting point
    if (sortedOrders.length > 0) {
        const firstOrderDate = new Date(sortedOrders[0].created_date);
        const dayBefore = new Date(firstOrderDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        data.push({ 
            date: formatDateForChart(dayBefore), 
            revenue: 0 
        });
    }
    
    // Add cumulative revenue points
    sortedOrders.forEach(order => {
        accumulated += order.amount;
        data.push({
            date: formatDateForChart(new Date(order.created_date)),
            revenue: accumulated
        });
    });
    
    return data;
}

/**
 * Apply filters to orders
 * Replicates the filtering logic from React orders.jsx
 */
function applyFilters() {
    filteredOrders = allOrders.filter(order => {
        // Search filter
        const matchesSearch = searchTerm === "" ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getProductTitle(order.product_id).toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        
        // Date filter
        const orderDate = new Date(order.created_date);
        let matchesDate = true;
        
        if (filterDate === "today") {
            const today = new Date();
            matchesDate = formatDateYMD(orderDate) === formatDateYMD(today);
        } else if (filterDate === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = orderDate >= weekAgo;
        } else if (filterDate === "month") {
            const monthStart = new Date();
            monthStart.setDate(1);
            matchesDate = orderDate >= monthStart;
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Reset pagination when filters change
    currentPage = 1;
}

/**
 * Update the income UI with current data
 */
function updateIncomeUI() {
    const metrics = calculateMetrics();
    
    // Update revenue amounts
    updateElement('mobileRevenueAmount', `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    updateElement('desktopRevenueAmount', `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    
    // Update sales counts
    updateElement('mobileTotalSales', `${metrics.totalSales} ventas totales`);
    updateElement('desktopTotalSales', `${metrics.totalSales} ventas totales`);
    
    // Update available amounts
    updateElement('mobileAvailableAmount', `$${metrics.availableForWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    updateElement('desktopAvailableAmount', `$${metrics.availableForWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    
    updateElement('mobileAvailableSoon', `$${metrics.availableSoon.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    updateElement('desktopAvailableSoon', `$${metrics.availableSoon.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    
    // Update orders list
    renderOrdersList();
    updatePagination();
}

/**
 * Update element text content safely
 */
function updateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Create revenue charts for both mobile and desktop
 */
async function createRevenueCharts() {
    const chartData = generateRevenueChart();
    
    // Destroy existing charts
    if (mobileChart) {
        mobileChart.destroy();
    }
    if (desktopChart) {
        desktopChart.destroy();
    }
    
    // Create mobile chart
    const mobileCanvas = document.getElementById('mobileRevenueChart');
    if (mobileCanvas) {
        mobileChart = createAreaChart(mobileCanvas, chartData, false);
    }
    
    // Create desktop chart
    const desktopCanvas = document.getElementById('desktopRevenueChart');
    if (desktopCanvas) {
        desktopChart = createAreaChart(desktopCanvas, chartData, true);
    }
}

/**
 * Create individual area chart
 * Replicates the AreaChart functionality from React orders.jsx
 */
function createAreaChart(canvas, data, isDesktop) {
    const ctx = canvas.getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: 'Ingresos',
                data: data.map(d => d.revenue),
                borderColor: '#3b82f6',
                backgroundColor: createGradient(ctx),
                borderWidth: isDesktop ? 3 : 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#3b82f6',
                pointRadius: isDesktop ? 4 : 3,
                pointHoverRadius: isDesktop ? 6 : 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#374151',
                    bodyColor: '#3b82f6',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    cornerRadius: isDesktop ? 8 : 6,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Ingresos: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6B7280',
                        font: {
                            size: isDesktop ? 12 : 10
                        }
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: isDesktop ? 1000 : 600,
                easing: 'easeOutQuart'
            }
        }
    });
}

/**
 * Create gradient for chart background
 */
function createGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0.05, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(0.95, 'rgba(59, 130, 246, 0.05)');
    return gradient;
}

/**
 * Render orders list for both mobile and desktop
 */
function renderOrdersList() {
    renderMobileOrdersList();
    renderDesktopOrdersList();
}

/**
 * Render mobile orders list
 */
function renderMobileOrdersList() {
    const container = document.getElementById('mobileOrdersList');
    const emptyState = document.getElementById('mobileEmptyState');
    
    if (!container || !emptyState) return;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    
    if (paginatedOrders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = paginatedOrders.map(order => `
        <div class="order-item">
            <div class="order-mobile">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div>
                        <h4 style="font-weight: 600; color: #111827; margin: 0; font-size: 0.875rem;">${order.customer_name}</h4>
                        <p style="color: #6b7280; font-size: 0.75rem; margin: 0;">${order.customer_email}</p>
                    </div>
                    <span class="badge ${getBadgeClass(order.status)}">${getStatusText(order.status)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">${getProductTitle(order.product_id)}</p>
                        <p style="font-size: 0.625rem; color: #9ca3af; margin: 0;">${formatDate(order.created_date)}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: 700; color: #111827; font-size: 1.125rem; margin: 0;">$${order.amount.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Render desktop orders list
 */
function renderDesktopOrdersList() {
    const container = document.getElementById('desktopOrdersList');
    const emptyState = document.getElementById('desktopEmptyState');
    
    if (!container || !emptyState) return;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    
    if (paginatedOrders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = paginatedOrders.map(order => `
        <div class="order-item">
            <div class="order-desktop">
                <div style="font-size: 0.875rem; color: #6b7280;">${formatDateShort(order.created_date)}</div>
                <div style="font-weight: 500; color: #111827;">${order.customer_name}</div>
                <div style="font-size: 0.875rem; color: #6b7280; overflow: hidden; text-overflow: ellipsis;">${getProductTitle(order.product_id)}</div>
                <div style="font-size: 0.875rem; color: #6b7280;">${order.customer_email}</div>
                <div style="font-weight: 700; color: #111827;">$${order.amount.toFixed(2)}</div>
                <div>
                    <span class="badge ${getBadgeClass(order.status)}">${getStatusText(order.status)}</span>
                </div>
                <div>
                    <button style="background: none; border: none; color: #6b7280; padding: 0.5rem; cursor: pointer; border-radius: 0.25rem; transition: color 0.2s;" onmouseover="this.style.color='#111827'" onmouseout="this.style.color='#6b7280'">
                        <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons for the new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Update pagination controls
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = Math.min(startIndex + ordersPerPage, filteredOrders.length);
    
    // Update pagination info
    const paginationInfo = `Mostrando ${startIndex + 1} a ${endIndex} de ${filteredOrders.length} órdenes`;
    updateElement('mobilePaginationInfo', paginationInfo);
    updateElement('desktopPaginationInfo', paginationInfo);
    
    // Update pagination text
    const paginationText = `Página ${currentPage} de ${totalPages}`;
    updateElement('mobilePaginationText', paginationText);
    updateElement('desktopPaginationText', paginationText);
    
    // Update button states
    updatePaginationButtons('mobile', currentPage, totalPages);
    updatePaginationButtons('desktop', currentPage, totalPages);
    
    // Show/hide pagination
    const showPagination = totalPages > 1;
    const mobilePagination = document.getElementById('mobilePagination');
    const desktopPagination = document.getElementById('desktopPagination');
    
    if (mobilePagination) {
        mobilePagination.style.display = showPagination ? 'flex' : 'none';
    }
    if (desktopPagination) {
        desktopPagination.style.display = showPagination ? 'flex' : 'none';
    }
}

/**
 * Update pagination button states
 */
function updatePaginationButtons(layout, currentPage, totalPages) {
    const prevBtn = document.getElementById(`${layout}PrevBtn`);
    const nextBtn = document.getElementById(`${layout}NextBtn`);
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

/**
 * Event Handlers
 */

/**
 * Handle search input changes
 */
function handleSearchChange(event) {
    searchTerm = event.target.value;
    applyFilters();
    updateIncomeUI();
    
    // Sync search inputs
    const mobileInput = document.getElementById('mobileSearchInput');
    const desktopInput = document.getElementById('desktopSearchInput');
    
    if (event.target === mobileInput && desktopInput) {
        desktopInput.value = searchTerm;
    } else if (event.target === desktopInput && mobileInput) {
        mobileInput.value = searchTerm;
    }
}

/**
 * Handle filter dropdown changes
 */
function handleFilterChange(event) {
    const { id, value } = event.target;
    
    if (id.includes('Status')) {
        filterStatus = value;
        // Sync status filters
        const mobileFilter = document.getElementById('mobileStatusFilter');
        const desktopFilter = document.getElementById('desktopStatusFilter');
        if (mobileFilter && mobileFilter !== event.target) mobileFilter.value = value;
        if (desktopFilter && desktopFilter !== event.target) desktopFilter.value = value;
    } else if (id.includes('Date')) {
        filterDate = value;
        // Sync date filters
        const mobileFilter = document.getElementById('mobileDateFilter');
        const desktopFilter = document.getElementById('desktopDateFilter');
        if (mobileFilter && mobileFilter !== event.target) mobileFilter.value = value;
        if (desktopFilter && desktopFilter !== event.target) desktopFilter.value = value;
    }
    
    applyFilters();
    updateIncomeUI();
}

/**
 * Handle pagination changes
 */
function handlePageChange(newPage) {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updateIncomeUI();
    }
}

/**
 * Handle CSV export
 * Replicates the handleExportCSV function from React orders.jsx
 */
function handleExportCSV() {
    const headers = ['Fecha', 'Cliente', 'Email', 'Producto', 'Monto', 'Estado'];
    const csvData = [
        headers.join(','),
        ...allOrders.map(order => [
            formatDateYMD(new Date(order.created_date)),
            `"${order.customer_name.replace(/"/g, '""')}"`, // Handle quotes in names
            order.customer_email,
            `"${getProductTitle(order.product_id).replace(/"/g, '""')}"`, // Handle quotes in product titles
            order.amount,
            order.status
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingresos-${formatDateYMD(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Handle copy URL functionality
 * Replicates the handleCopyUrl function from React orders.jsx
 */
async function handleCopyUrl() {
    if (!currentCreator) return;
    
    const publicUrl = currentCreator.public_url;
    try {
        await navigator.clipboard.writeText(publicUrl);
        
        // Update button text and styling
        const copyBtn = document.getElementById('desktopCopyBtn');
        const copyText = document.getElementById('desktopCopyText');
        const copyIcon = copyBtn.querySelector('i[data-lucide]');
        
        if (copyBtn && copyText && copyIcon) {
            copyBtn.classList.add('copied');
            copyText.textContent = '¡Copiado!';
            copyIcon.setAttribute('data-lucide', 'check');
            
            // Re-initialize the icon
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyText.textContent = 'Copiar URL';
                copyIcon.setAttribute('data-lucide', 'copy');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 2000);
        }
        
    } catch (error) {
        console.error("Error copying to clipboard:", error);
    }
}

/**
 * Handle view public profile
 */
function handleViewPublicProfile() {
    if (currentCreator) {
        window.open(currentCreator.public_url, '_blank');
    }
}

/**
 * Utility Functions
 */

/**
 * Get badge CSS class for order status
 */
function getBadgeClass(status) {
    switch (status) {
        case 'completed':
            return 'badge-completed';
        case 'pending':
            return 'badge-pending';
        case 'refunded':
            return 'badge-refunded';
        default:
            return 'badge-completed';
    }
}

/**
 * Get status text in Spanish
 */
function getStatusText(status) {
    switch (status) {
        case 'completed':
            return 'Completado';
        case 'pending':
            return 'Pendiente';
        case 'refunded':
            return 'Reembolsado';
        default:
            return 'Completado';
    }
}

/**
 * Format date for display (dd/MM/yyyy HH:mm)
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format date for display (dd/MM/yyyy)
 */
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Format date for chart labels
 */
function formatDateForChart(date) {
    return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateYMD(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Laravel integration helpers
 */
const IngresosLaravelHelper = {
    /**
     * Load real data from Laravel backend
     * Replaces the mock data loading with actual API calls
     */
    loadRealData: async function() {
        try {
            // This would be called in Laravel implementation
            const [creator, orders, products] = await Promise.all([
                this.makeRequest('/api/creator'),
                this.makeRequest('/api/orders'),
                this.makeRequest('/api/products')
            ]);
            
            currentCreator = creator;
            allOrders = orders;
            allProducts = products;
            
            return true;
        } catch (error) {
            console.error('Failed to load real data:', error);
            return false;
        }
    },
    
    /**
     * Make API request to Laravel backend
     */
    makeRequest: async function(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'X-CSRF-TOKEN': this.getCsrfToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: { ...defaultOptions.headers, ...options.headers }
        };
        
        const response = await fetch(endpoint, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    },
    
    /**
     * Get CSRF token for Laravel
     */
    getCsrfToken: function() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    },
    
    /**
     * Handle withdrawal request
     */
    requestWithdrawal: async function(amount) {
        try {
            const response = await this.makeRequest('/api/withdrawals', {
                method: 'POST',
                body: JSON.stringify({ amount })
            });
            
            return response;
        } catch (error) {
            console.error('Withdrawal request failed:', error);
            throw error;
        }
    }
};

/**
 * Navigation helpers
 */
const IngresosNavigation = {
    /**
     * Navigate to Mi Tienda
     */
    goToMiTienda: function() {
        window.location.href = 'mi-tienda.html';
    },
    
    /**
     * Navigate to Dashboard
     */
    goToDashboard: function() {
        window.location.href = 'dashboard.html';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeIngresos);

// Export for Laravel integration
if (typeof window !== 'undefined') {
    window.Ingresos = {
        LaravelHelper: IngresosLaravelHelper,
        Navigation: IngresosNavigation,
        init: initializeIngresos,
        loadData: loadIncomeData,
        exportCSV: handleExportCSV
    };
}