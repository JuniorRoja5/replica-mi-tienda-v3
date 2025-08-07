/* ========================================
   STATISTICS ANALYTICS - JAVASCRIPT CORE
   Compatible with Laravel Blade + Bootstrap 5 + Chart.js
   ======================================== */

/* === FOR LARAVEL DEVELOPER === 
 * 
 * REQUIRED INTEGRATION:
 * 1. Replace localStorage with Laravel API calls  
 * 2. Connect with Product model for product stats
 * 3. Integrate with analytics service (Google Analytics, etc.)
 * 4. Add proper date range API endpoints
 * 5. Connect with Mi Tienda products data
 * 
 * IMPORTANT FEATURES IMPLEMENTED:
 * - Chart.js integration for activity graphs
 * - Real-time product statistics from Mi Tienda
 * - Device analytics with progress bars
 * - Export to CSV functionality
 * - Period selection with date ranges
 * - Design system integration
 * 
 * CRITICAL FUNCTIONS TO INTEGRATE:
 * - loadStatistics(): Should use API GET /api/statistics with date ranges
 * - loadProductStats(): Should connect to products from Mi Tienda
 * - generateAnalyticsData(): Should use real analytics service
 */

// === GLOBAL APPLICATION STATE ===
// LARAVEL NOTE: Replace with data from Analytics API and Product model
let currentPeriod = '7D';
let statisticsData = {
    views: 0,
    clicks: 0,
    sales: 0,
    conversionRate: 0,
    dailyData: [],
    productStats: [],
    deviceData: []
};

let activityChart = null;
let currentDesignSettings = null;

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeStatistics();
    setupEventListeners();
    // Initialize design integration
    initializeDesignIntegration();
});

/* ========================================
   DESIGN SYSTEM INTEGRATION
   Apply design settings from Diseño section
   ======================================== */

/**
 * Initialize design integration system
 * Sets up communication with the Design Customizer
 */
function initializeDesignIntegration() {
    // Listen for design updates from Design Customizer via PostMessage
    window.addEventListener('message', function(event) {
        if (event.data.type === 'DESIGN_UPDATE' && event.data.settings) {
            const designSettings = event.data.settings;
            applyDesignSettings(designSettings);
            console.log('✅ Design updated from Design Customizer via PostMessage:', designSettings);
        }
    });
    
    // Listen for design updates via custom events (same-origin communication)
    window.addEventListener('designUpdate', function(event) {
        if (event.detail && event.detail.design_settings) {
            const designSettings = event.detail.design_settings;
            applyDesignSettings(designSettings);
            console.log('✅ Design updated from Design Customizer via custom event:', designSettings);
        }
    });
    
    // Listen for localStorage changes (for cross-tab communication)
    window.addEventListener('storage', function(event) {
        if (event.key === 'pending_design_update' && event.newValue) {
            try {
                const updateData = JSON.parse(event.newValue);
                if (updateData.design_settings && updateData.source === 'diseno-customizer') {
                    applyDesignSettings(updateData.design_settings);
                    console.log('✅ Design updated from Design Customizer via localStorage:', updateData.design_settings);
                }
            } catch (error) {
                console.error('Error parsing design update from localStorage:', error);
            }
        }
    });
    
    // Load design settings from localStorage if available
    const savedDesignSettings = localStorage.getItem('applied_design_settings');
    if (savedDesignSettings) {
        try {
            const settings = JSON.parse(savedDesignSettings);
            applyDesignSettings(settings);
        } catch (error) {
            console.error('Error loading saved design settings:', error);
        }
    } else {
        // Apply default light theme if no settings saved
        applyDefaultDesignSettings();
    }
    
    console.log('🎨 Design integration initialized successfully for statistics page');
}

/**
 * Apply design settings to statistics page
 * Updates CSS custom properties and chart colors
 * @param {Object} settings - Design settings object from Design Customizer
 */
function applyDesignSettings(settings) {
    if (!settings || typeof settings !== 'object') {
        console.warn('Invalid design settings received:', settings);
        return;
    }
    
    currentDesignSettings = settings;
    
    // Update CSS custom properties for real-time design changes
    const root = document.documentElement;
    
    // For statistics page, we use a light theme approach
    root.style.setProperty('--design-background', '#FFFFFF');
    root.style.setProperty('--design-text-color', settings.text_color || '#1F2937');
    root.style.setProperty('--design-text-secondary', settings.text_secondary_color || '#6B7280');
    root.style.setProperty('--design-button-bg', settings.button_color || '#3B82F6');
    root.style.setProperty('--design-button-text', settings.button_font_color || '#FFFFFF');
    root.style.setProperty('--design-button-hover', settings.button_hover_color || '#2563EB');
    root.style.setProperty('--design-font-family', settings.font_family || 'Inter');
    
    // Update chart colors if chart exists
    if (activityChart) {
        updateChartColors();
    }
    
    console.log('📊 Design settings applied to statistics page:', settings);
}

/**
 * Apply default design settings (light theme for statistics)
 */
function applyDefaultDesignSettings() {
    const defaultSettings = {
        theme_id: 'light',
        theme_name: 'Tema Claro',
        background: '#FFFFFF',
        background_type: 'solid',
        text_color: '#1F2937',
        text_secondary_color: '#6B7280',
        font_family: 'Inter',
        button_color: '#3B82F6',
        button_font_color: '#FFFFFF',
        button_hover_color: '#2563EB'
    };
    
    applyDesignSettings(defaultSettings);
}

/* ========================================
   CORE INITIALIZATION FUNCTIONS
   ======================================== */

/**
 * Initialize the statistics analytics system
 * Entry point for the application
 */
async function initializeStatistics() {
    console.log('Statistics Analytics v1.0 - Initializing...');
    
    showLoading();
    
    try {
        // Load statistics data
        await loadStatistics();
        
        // Update overview cards
        updateOverviewCards();
        
        // Create activity chart
        createActivityChart();
        
        // Render products table
        renderProductsTable();
        
        // Render devices section
        renderDevicesSection();
        
        hideLoading();
        
    } catch (error) {
        console.error('Error initializing statistics:', error);
        hideLoading();
        showError('Error al cargar las estadísticas. Por favor, inténtalo de nuevo.');
    }
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
    // Window resize listener for chart responsiveness
    window.addEventListener('resize', debounce(() => {
        if (activityChart) {
            activityChart.resize();
        }
    }, 300));
}

/**
 * Debounce function to limit resize events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ========================================
   DATA LOADING AND MANAGEMENT FUNCTIONS
   ======================================== */

/**
 * Load statistics data for current period
 * LARAVEL INTEGRATION: Replace with API call to GET /api/statistics
 */
async function loadStatistics() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // LARAVEL NOTE: Replace this with actual API call
        // const response = await fetch(`/api/statistics?period=${currentPeriod}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        //     }
        // });
        // statisticsData = await response.json();
        
        // Mock data for development
        statisticsData = generateMockStatistics();
        
        console.log('Statistics loaded successfully:', statisticsData);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        throw error;
    }
}

/**
 * Generate mock statistics data for development
 * LARAVEL NOTE: Remove this function when integrating with real API
 */
function generateMockStatistics() {
    // Load products from Mi Tienda localStorage (this should come from Laravel API)
    const miTiendaProducts = loadProductsFromMiTienda();
    
    // Generate daily data for the selected period
    const daysCount = getPeriodDays(currentPeriod);
    const dailyData = [];
    
    for (let i = 0; i < daysCount; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (daysCount - i - 1));
        
        dailyData.push({
            date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
            views: Math.floor(Math.random() * 200) + 50,
            clicks: Math.floor(Math.random() * 80) + 20,
            sales: Math.floor(Math.random() * 10) + 1
        });
    }
    
    // Generate product statistics
    const productStats = miTiendaProducts.map(product => {
        const views = Math.floor(Math.random() * 500) + 100;
        const sales = Math.floor(Math.random() * 15) + 1;
        const revenue = sales * (product.price || 0);
        const conversionRate = views > 0 ? ((sales / views) * 100).toFixed(1) : '0.0';
        
        return {
            id: product.id,
            title: product.title,
            type: product.type,
            image_url: product.image_url,
            views: views,
            sales: sales,
            revenue: revenue,
            conversionRate: conversionRate
        };
    }).sort((a, b) => b.revenue - a.revenue);
    
    // Generate device data
    const totalClicks = dailyData.reduce((sum, day) => sum + day.clicks, 0);
    const deviceData = [
        {
            device: 'Móvil',
            clicks: Math.floor(totalClicks * 0.7),
            percentage: 70,
            conversionRate: '5.0',
            icon: 'mobile',
            color: '#10b981'
        },
        {
            device: 'Escritorio', 
            clicks: Math.floor(totalClicks * 0.25),
            percentage: 25,
            conversionRate: '6.2',
            icon: 'desktop',
            color: '#3b82f6'
        },
        {
            device: 'Tablet',
            clicks: Math.floor(totalClicks * 0.05),
            percentage: 5,
            conversionRate: '4.1',
            icon: 'tablet',
            color: '#8b5cf6'
        }
    ];
    
    // Calculate totals
    const totalViews = dailyData.reduce((sum, day) => sum + day.views, 0);
    const totalClicksCalculated = dailyData.reduce((sum, day) => sum + day.clicks, 0);
    const totalSales = dailyData.reduce((sum, day) => sum + day.sales, 0);
    const conversionRate = totalClicksCalculated > 0 ? 
        ((totalSales / totalClicksCalculated) * 100).toFixed(1) : 0;
    
    return {
        views: totalViews,
        clicks: totalClicksCalculated,
        sales: totalSales,
        conversionRate: conversionRate,
        dailyData: dailyData,
        productStats: productStats,
        deviceData: deviceData
    };
}

/**
 * Load products from Mi Tienda
 * LARAVEL NOTE: This should come from Product model via API
 */
function loadProductsFromMiTienda() {
    try {
        const appState = localStorage.getItem('miTiendaAppState');
        if (appState) {
            const state = JSON.parse(appState);
            return state.products || [];
        }
    } catch (error) {
        console.warn('Could not load Mi Tienda products:', error);
    }
    
    // Mock products if no Mi Tienda data available
    return [
        {
            id: 1,
            title: 'Curso Digital de Marketing',
            type: 'curso',
            price: 99.99,
            image_url: ''
        },
        {
            id: 2,
            title: 'Consultoría Personalizada',
            type: 'llamada',
            price: 150.00,
            image_url: ''
        },
        {
            id: 3,
            title: 'Membresía Premium',
            type: 'membresia',
            price: 29.99,
            image_url: ''
        }
    ];
}

/**
 * Get number of days for a period
 * @param {string} period - Period identifier
 */
function getPeriodDays(period) {
    switch (period) {
        case '7D': return 7;
        case '14D': return 14;
        case 'month': return 30;
        case 'custom': return 7; // Default for custom
        default: return 7;
    }
}

/* ========================================
   UI UPDATE FUNCTIONS
   ======================================== */

/**
 * Show loading state
 */
function showLoading() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
}

/**
 * Hide loading state
 */
function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    // You can implement a toast notification or error modal here
    alert(message);
}

/**
 * Update overview stat cards
 */
function updateOverviewCards() {
    document.getElementById('totalViews').textContent = statisticsData.views.toLocaleString();
    document.getElementById('totalClicks').textContent = statisticsData.clicks.toLocaleString();
    document.getElementById('totalSales').textContent = statisticsData.sales.toLocaleString();
    document.getElementById('conversionRate').textContent = `${statisticsData.conversionRate}%`;
}

/* ========================================
   CHART FUNCTIONS
   ======================================== */

/**
 * Create activity chart using Chart.js
 */
function createActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (activityChart) {
        activityChart.destroy();
    }
    
    const chartData = {
        labels: statisticsData.dailyData.map(day => day.date),
        datasets: [
            {
                label: 'Clics',
                data: statisticsData.dailyData.map(day => day.clicks),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            },
            {
                label: 'Ventas',
                data: statisticsData.dailyData.map(day => day.sales),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: getComputedStyle(document.documentElement)
                        .getPropertyValue('--design-text-color').trim() || '#1F2937',
                    font: {
                        family: getComputedStyle(document.documentElement)
                            .getPropertyValue('--design-font-family').trim() || 'Inter',
                        size: 14,
                        weight: '500'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1F2937',
                bodyColor: '#6B7280',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                titleFont: {
                    family: getComputedStyle(document.documentElement)
                        .getPropertyValue('--design-font-family').trim() || 'Inter',
                    size: 14,
                    weight: '600'
                },
                bodyFont: {
                    family: getComputedStyle(document.documentElement)
                        .getPropertyValue('--design-font-family').trim() || 'Inter',
                    size: 13
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: getComputedStyle(document.documentElement)
                        .getPropertyValue('--design-text-secondary').trim() || '#6B7280',
                    font: {
                        family: getComputedStyle(document.documentElement)
                            .getPropertyValue('--design-font-family').trim() || 'Inter',
                        size: 12
                    }
                }
            },
            y: {
                display: false,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                beginAtZero: true
            }
        }
    };
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

/**
 * Update chart colors based on design settings
 */
function updateChartColors() {
    if (!activityChart || !currentDesignSettings) return;
    
    // Update legend colors
    activityChart.options.plugins.legend.labels.color = 
        currentDesignSettings.text_color || '#1F2937';
    
    // Update axis colors  
    activityChart.options.scales.x.ticks.color = 
        currentDesignSettings.text_secondary_color || '#6B7280';
    
    // Update chart
    activityChart.update('none');
}

/* ========================================
   PRODUCTS TABLE FUNCTIONS
   ======================================== */

/**
 * Render products summary table
 */
function renderProductsTable() {
    const container = document.getElementById('productsTableContent');
    
    if (statisticsData.productStats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-box empty-icon"></i>
                <h4 class="empty-title">No hay productos aún</h4>
                <p class="empty-description">Crea tu primer producto en Mi Tienda para ver las estadísticas</p>
            </div>
        `;
        return;
    }
    
    const tableHTML = `
        <table class="products-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Vistas</th>
                    <th>Órdenes</th>
                    <th>Conversión (%)</th>
                    <th>Ingresos</th>
                </tr>
            </thead>
            <tbody>
                ${statisticsData.productStats.map(product => `
                    <tr>
                        <td>
                            <div class="product-info">
                                <div class="product-icon">
                                    ${product.image_url ? 
                                        `<img src="${product.image_url}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;">` :
                                        getProductIcon(product.type)
                                    }
                                </div>
                                <div class="product-details">
                                    <h4>${product.title}</h4>
                                    <div class="product-type">${getProductTypeName(product.type)}</div>
                                </div>
                            </div>
                        </td>
                        <td class="table-stat-value">${product.views.toLocaleString()}</td>
                        <td class="table-stat-value">${product.sales > 0 ? product.sales : '<span class="table-stat-empty">-</span>'}</td>
                        <td class="table-stat-value">${product.sales > 0 ? product.conversionRate + '%' : '<span class="table-stat-empty">-</span>'}</td>
                        <td class="table-stat-revenue">${product.revenue > 0 ? '$' + product.revenue.toFixed(2) : '<span class="table-stat-empty">-</span>'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

/**
 * Get product icon based on type
 * @param {string} type - Product type
 */
function getProductIcon(type) {
    const icons = {
        'product': '<i class="bi bi-box"></i>',
        'llamada': '<i class="bi bi-telephone"></i>',
        'curso': '<i class="bi bi-play-circle"></i>',
        'membresia': '<i class="bi bi-star"></i>',
        'link': '<i class="bi bi-link-45deg"></i>'
    };
    
    return icons[type] || '<i class="bi bi-box"></i>';
}

/**
 * Get product type display name
 * @param {string} type - Product type
 */
function getProductTypeName(type) {
    const names = {
        'product': 'Producto Digital',
        'llamada': 'Consultoría',
        'curso': 'Curso Digital',
        'membresia': 'Membresía',
        'link': 'Enlace'
    };
    
    return names[type] || 'Producto';
}

/* ========================================
   DEVICES SECTION FUNCTIONS
   ======================================== */

/**
 * Render devices section
 */
function renderDevicesSection() {
    const container = document.getElementById('devicesContent');
    
    const devicesHTML = statisticsData.deviceData.map(device => `
        <div class="device-item">
            <div class="device-icon-container ${device.icon}">
                <i class="bi bi-${device.icon === 'mobile' ? 'phone' : device.icon === 'desktop' ? 'display' : 'tablet'}"></i>
            </div>
            <div class="device-info">
                <div class="device-info-header">
                    <span class="device-name">${device.device}</span>
                    <span class="device-percentage">${device.percentage}%</span>
                </div>
                <div class="device-stats">
                    <span>${device.clicks.toLocaleString()} clics</span>
                    <span>${device.conversionRate}% conversión</span>
                </div>
                <div class="device-progress">
                    <div class="device-progress-bar ${device.icon}" style="width: ${device.percentage}%"></div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = devicesHTML;
}

/* ========================================
   PERIOD SELECTION FUNCTIONS
   ======================================== */

/**
 * Select time period and reload data
 * @param {string} period - Period identifier
 * @param {HTMLElement} button - Button element that was clicked
 */
async function selectPeriod(period, button) {
    // Remove active class from all buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    currentPeriod = period;
    
    // Show loading state
    showLoading();
    
    try {
        // Reload data with new period
        await loadStatistics();
        
        // Update all sections
        updateOverviewCards();
        createActivityChart();
        renderProductsTable();
        renderDevicesSection();
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading period data:', error);
        hideLoading();
        showError('Error al cargar datos del período seleccionado.');
    }
}

/* ========================================
   EXPORT FUNCTIONS
   ======================================== */

/**
 * Export statistics to CSV
 */
function exportStatisticsToCSV() {
    if (statisticsData.dailyData.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }
    
    const headers = ['Fecha', 'Visualizaciones', 'Clics', 'Ventas'];
    
    const csvData = statisticsData.dailyData.map(day => [
        day.date,
        day.views,
        day.clicks,
        day.sales
    ]);
    
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `estadisticas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    console.log('Statistics CSV exported successfully');
}

/* ========================================
   LARAVEL INTEGRATION HELPER
   ======================================== */

/**
 * Laravel integration helper functions
 */
const StatisticsLaravelHelper = {
    /**
     * Load statistics from Laravel API
     */
    loadFromAPI: async function(period = '7D') {
        try {
            const response = await fetch(`/api/statistics?period=${period}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken()
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to load statistics:', error);
            throw error;
        }
    },
    
    /**
     * Load product statistics from Laravel API
     */
    loadProductStats: async function(period = '7D') {
        try {
            const response = await fetch(`/api/product-statistics?period=${period}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken()
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to load product statistics:', error);
            throw error;
        }
    },
    
    /**
     * Get CSRF token for Laravel
     */
    getCsrfToken: function() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    }
};

// Export for Laravel Blade integration
if (typeof window !== 'undefined') {
    window.StatisticsLaravelHelper = StatisticsLaravelHelper;
    window.selectPeriod = selectPeriod;
    window.exportStatisticsToCSV = exportStatisticsToCSV;
}