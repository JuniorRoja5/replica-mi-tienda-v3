/**
 * Dashboard JavaScript
 * Handles analytics dashboard functionality with charts and statistics
 * Compatible with Laravel Blade integration
 */

// Global state
let currentCreator = null;
let currentOrders = [];
let currentStats = {
    totalRevenue: 0,
    revenueChange: 0,
    storeVisits: 0,
    visitsChange: 0,
    leads: 0,
    leadsChange: 0
};
let chartData = [];
let selectedPeriod = '7D';
let dateRange = {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
};
let tempDateRange = null;
let isLoading = true;

// Chart instances
let mobileChart = null;
let desktopChart = null;

// DOM Elements
const loadingState = document.getElementById('loadingState');
const mobileLayout = document.getElementById('mobileLayout');
const desktopLayout = document.getElementById('desktopLayout');
const calendarModal = document.getElementById('calendarModal');

/**
 * Initialize the dashboard
 */
async function initializeDashboard() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Set up event listeners
    setupEventListeners();
    
    // Show loading state
    showLoadingState();
    
    // Load dashboard data
    await loadData();
    
    // Hide loading state and show content
    hideLoadingState();
    
    console.log('Dashboard initialized successfully');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Period selector buttons
    const periodButtons = document.querySelectorAll('.period-btn:not([id])');
    periodButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const period = e.target.dataset.period;
            if (period !== 'custom') {
                handlePeriodSelect(period);
            }
        });
    });
    
    // Custom range buttons
    const customRangeBtn = document.getElementById('customRangeBtn');
    const desktopCustomRangeBtn = document.getElementById('desktopCustomRangeBtn');
    
    if (customRangeBtn) {
        customRangeBtn.addEventListener('click', handleOpenCalendar);
    }
    if (desktopCustomRangeBtn) {
        desktopCustomRangeBtn.addEventListener('click', handleOpenCalendar);
    }
    
    // Calendar modal
    const closeCalendarBtn = document.getElementById('closeCalendarBtn');
    const cancelCalendarBtn = document.getElementById('cancelCalendarBtn');
    const applyCalendarBtn = document.getElementById('applyCalendarBtn');
    
    if (closeCalendarBtn) {
        closeCalendarBtn.addEventListener('click', handleCancelCalendar);
    }
    if (cancelCalendarBtn) {
        cancelCalendarBtn.addEventListener('click', handleCancelCalendar);
    }
    if (applyCalendarBtn) {
        applyCalendarBtn.addEventListener('click', handleApplyDateRange);
    }
    
    // Calendar modal backdrop
    if (calendarModal) {
        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                handleCancelCalendar();
            }
        });
    }
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
}

/**
 * Hide loading state and show content
 */
function hideLoadingState() {
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    if (mobileLayout) {
        mobileLayout.style.display = 'block';
    }
    if (desktopLayout) {
        desktopLayout.style.display = 'block';
    }
    isLoading = false;
}

/**
 * Load dashboard data
 * This simulates the data loading from React version
 */
async function loadData() {
    try {
        // Simulate API calls with realistic data
        await simulateDataLoading();
        
        // Calculate stats
        calculateStats();
        
        // Generate chart data
        generateChartData();
        
        // Update UI
        updateUI();
        
        // Create charts
        createCharts();
        
    } catch (error) {
        console.error('Error loading data:', error);
        // In production, show error message to user
    }
}

/**
 * Simulate data loading with realistic delays
 */
async function simulateDataLoading() {
    // Simulate getting current creator
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock creator data
    currentCreator = {
        id: 'creator_123',
        username: 'mi_usuario',
        display_name: 'Mi Nombre',
        bio: 'Bienvenido a mi tienda!'
    };
    
    // Mock orders data
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate realistic mock orders for the selected period
    currentOrders = generateMockOrders();
}

/**
 * Generate mock orders for testing
 */
function generateMockOrders() {
    const orders = [];
    const startDate = dateRange.from;
    const endDate = dateRange.to;
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Generate 0-5 orders per day randomly
    for (let i = 0; i <= daysDiff; i++) {
        const orderDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const ordersPerDay = Math.floor(Math.random() * 6); // 0-5 orders
        
        for (let j = 0; j < ordersPerDay; j++) {
            orders.push({
                id: `order_${Date.now()}_${i}_${j}`,
                creator_id: currentCreator.id,
                amount: Math.floor(Math.random() * 200) + 10, // $10-$210
                created_date: orderDate.toISOString(),
                status: 'completed'
            });
        }
    }
    
    return orders;
}

/**
 * Calculate statistics
 */
function calculateStats() {
    // Calculate current period orders
    const currentPeriodOrders = currentOrders.filter(order => {
        const orderDate = new Date(order.created_date);
        return orderDate >= dateRange.from && orderDate <= dateRange.to;
    });
    
    // Calculate previous period for comparison
    const periodLength = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24));
    const previousPeriodStart = new Date(dateRange.from.getTime() - periodLength * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = new Date(dateRange.to.getTime() - periodLength * 24 * 60 * 60 * 1000);
    
    // Mock previous period orders
    const previousPeriodOrders = generateMockOrdersForPeriod(previousPeriodStart, previousPeriodEnd);
    
    // Calculate revenue
    const currentRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.amount, 0);
    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.amount, 0);
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    
    // Generate mock data for visits and leads
    const currentVisits = Math.floor(Math.random() * 500) + 100;
    const previousVisits = Math.floor(Math.random() * 400) + 80;
    const visitsChange = previousVisits > 0 ? ((currentVisits - previousVisits) / previousVisits) * 100 : 0;
    
    const currentLeads = Math.floor(Math.random() * 50) + 10;
    const previousLeads = Math.floor(Math.random() * 40) + 8;
    const leadsChange = previousLeads > 0 ? ((currentLeads - previousLeads) / previousLeads) * 100 : 0;
    
    currentStats = {
        totalRevenue: currentRevenue,
        revenueChange,
        storeVisits: currentVisits,
        visitsChange,
        leads: currentLeads,
        leadsChange
    };
}

/**
 * Generate mock orders for a specific period
 */
function generateMockOrdersForPeriod(startDate, endDate) {
    const orders = [];
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
        const orderDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const ordersPerDay = Math.floor(Math.random() * 4); // 0-3 orders (slightly less than current)
        
        for (let j = 0; j < ordersPerDay; j++) {
            orders.push({
                id: `prev_order_${Date.now()}_${i}_${j}`,
                amount: Math.floor(Math.random() * 150) + 10, // $10-$160 (slightly less than current)
                created_date: orderDate.toISOString(),
                status: 'completed'
            });
        }
    }
    
    return orders;
}

/**
 * Generate chart data
 */
function generateChartData() {
    const days = [];
    const currentDate = new Date(dateRange.from);
    
    // Generate array of days in the range
    while (currentDate <= dateRange.to) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    chartData = days.map(day => {
        const dayStr = formatDateForChart(day);
        const dayOrders = currentOrders.filter(order => {
            const orderDate = new Date(order.created_date);
            return formatDateYMD(orderDate) === formatDateYMD(day);
        });
        
        // Mock visits data based on orders (in real app, this would be actual analytics)
        const visits = dayOrders.length > 0 ? 
            dayOrders.length * (Math.floor(Math.random() * 20) + 10) : 
            Math.floor(Math.random() * 30) + 5;
        
        return {
            day: dayStr,
            visits: visits,
            orders: dayOrders.length
        };
    });
}

/**
 * Update UI with current data
 */
function updateUI() {
    // Update creator names
    const mobileCreatorName = document.getElementById('mobileCreatorName');
    const desktopCreatorName = document.getElementById('desktopCreatorName');
    
    if (mobileCreatorName && currentCreator) {
        mobileCreatorName.textContent = currentCreator.display_name || 'Creator';
    }
    if (desktopCreatorName && currentCreator) {
        desktopCreatorName.textContent = currentCreator.display_name || 'Creator';
    }
    
    // Update stats in mobile layout
    updateElement('mobileRevenue', `$${currentStats.totalRevenue.toFixed(0)}`);
    updateElement('mobileVisits', currentStats.storeVisits.toString());
    updateElement('mobileLeads', currentStats.leads.toString());
    
    // Update stats in desktop layout
    updateElement('desktopRevenue', `$${currentStats.totalRevenue.toFixed(0)}`);
    updateElement('desktopVisits', currentStats.storeVisits.toString());
    updateElement('desktopLeads', currentStats.leads.toString());
    
    // Update change indicators
    updateChangeIndicator('mobileRevenueChange', currentStats.revenueChange);
    updateChangeIndicator('mobileVisitsChange', currentStats.visitsChange);
    updateChangeIndicator('mobileLeadsChange', currentStats.leadsChange);
    
    updateChangeIndicator('desktopRevenueChange', currentStats.revenueChange);
    updateChangeIndicator('desktopVisitsChange', currentStats.visitsChange);
    updateChangeIndicator('desktopLeadsChange', currentStats.leadsChange);
    
    // Update period selector active state
    updatePeriodSelector();
}

/**
 * Update element text content
 */
function updateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Update change indicator
 */
function updateChangeIndicator(id, change) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const isPositive = change >= 0;
    const icon = element.querySelector('i[data-lucide]');
    const span = element.querySelector('span');
    
    // Update class
    element.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
    
    // Update icon
    if (icon) {
        icon.setAttribute('data-lucide', isPositive ? 'trending-up' : 'trending-down');
    }
    
    // Update text
    if (span) {
        span.textContent = `${Math.abs(change).toFixed(0)}%`;
    }
    
    // Re-initialize icons for this specific element
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ icons: element });
    }
}

/**
 * Update period selector active state
 */
function updatePeriodSelector() {
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.period === selectedPeriod) {
            button.classList.add('active');
        }
    });
    
    // Update custom range button text if needed
    if (selectedPeriod === 'custom') {
        updateCustomRangeButtons();
    }
}

/**
 * Update custom range button texts
 */
function updateCustomRangeButtons() {
    const customButtons = [
        document.getElementById('customRangeBtn'),
        document.getElementById('desktopCustomRangeBtn')
    ];
    
    const customRangeLabel = getCustomRangeLabel();
    
    customButtons.forEach(button => {
        if (button) {
            button.textContent = customRangeLabel;
        }
    });
}

/**
 * Get custom range label
 */
function getCustomRangeLabel() {
    if (selectedPeriod === 'custom' && dateRange.from && dateRange.to) {
        const fromStr = formatDateForDisplay(dateRange.from);
        const toStr = formatDateForDisplay(dateRange.to);
        return `${fromStr} – ${toStr}`;
    }
    return 'Rango personalizado';
}

/**
 * Create charts
 */
function createCharts() {
    // Destroy existing charts
    if (mobileChart) {
        mobileChart.destroy();
    }
    if (desktopChart) {
        desktopChart.destroy();
    }
    
    // Mobile chart
    const mobileCanvas = document.getElementById('mobileChart');
    if (mobileCanvas) {
        mobileChart = createChart(mobileCanvas, false);
    }
    
    // Desktop chart
    const desktopCanvas = document.getElementById('desktopChart');
    if (desktopCanvas) {
        desktopChart = createChart(desktopCanvas, true);
    }
}

/**
 * Create individual chart
 */
function createChart(canvas, isDesktop) {
    const ctx = canvas.getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(d => d.day),
            datasets: [{
                label: 'Visitas',
                data: chartData.map(d => d.visits),
                backgroundColor: '#22c55e',
                borderRadius: isDesktop ? 4 : 3,
                borderSkipped: false,
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
                    titleColor: '#111827',
                    bodyColor: '#059669',
                    borderColor: 'rgba(229, 231, 235, 0.5)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            return `Visitas: ${context.parsed.y}`;
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
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

/**
 * Handle period selection
 */
async function handlePeriodSelect(period) {
    selectedPeriod = period;
    const now = new Date();
    
    switch(period) {
        case '7D':
            dateRange = {
                from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                to: now
            };
            break;
        case '14D':
            dateRange = {
                from: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
                to: now
            };
            break;
        case 'month':
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateRange = {
                from: startOfMonth,
                to: now
            };
            break;
    }
    
    // Reload data with new date range
    showLoadingState();
    await loadData();
    hideLoadingState();
}

/**
 * Handle opening calendar modal
 */
function handleOpenCalendar() {
    tempDateRange = null;
    showCalendarModal();
    initializeCalendar();
}

/**
 * Show calendar modal
 */
function showCalendarModal() {
    if (calendarModal) {
        calendarModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide calendar modal
 */
function hideCalendarModal() {
    if (calendarModal) {
        calendarModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize calendar widget
 */
function initializeCalendar() {
    const calendarWidget = document.getElementById('calendarWidget');
    if (!calendarWidget) return;
    
    // Simple calendar implementation
    // In production, you might want to use a proper calendar library
    calendarWidget.innerHTML = `
        <div style="text-align: center; padding: 1rem; background: white; border-radius: 0.5rem;">
            <p style="margin-bottom: 1rem; color: #6b7280;">Selecciona las fechas de inicio y fin</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">Fecha inicio:</label>
                    <input type="date" id="startDate" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">Fecha fin:</label>
                    <input type="date" id="endDate" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
                </div>
            </div>
        </div>
    `;
    
    // Set up date inputs
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyBtn = document.getElementById('applyCalendarBtn');
    
    if (startDateInput && endDateInput) {
        // Set default values
        startDateInput.value = formatDateForInput(dateRange.from);
        endDateInput.value = formatDateForInput(dateRange.to);
        
        // Add event listeners
        const updateTempRange = () => {
            const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
            const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
            
            if (startDate && endDate && startDate <= endDate) {
                tempDateRange = { from: startDate, to: endDate };
                if (applyBtn) {
                    applyBtn.disabled = false;
                }
            } else {
                tempDateRange = null;
                if (applyBtn) {
                    applyBtn.disabled = true;
                }
            }
        };
        
        startDateInput.addEventListener('change', updateTempRange);
        endDateInput.addEventListener('change', updateTempRange);
        
        // Initial check
        updateTempRange();
    }
}

/**
 * Handle calendar cancellation
 */
function handleCancelCalendar() {
    tempDateRange = null;
    hideCalendarModal();
}

/**
 * Handle applying date range
 */
async function handleApplyDateRange() {
    if (tempDateRange?.from && tempDateRange?.to) {
        dateRange = { ...tempDateRange };
        selectedPeriod = 'custom';
        hideCalendarModal();
        
        // Reload data with new date range
        showLoadingState();
        await loadData();
        hideLoadingState();
    }
}

/**
 * Utility functions for date formatting
 */
function formatDateForChart(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es', options);
}

function formatDateForDisplay(date) {
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('es', options);
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function formatDateYMD(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Laravel integration helpers
 */
const DashboardLaravelHelper = {
    /**
     * Load real data from Laravel backend
     */
    loadRealData: async function() {
        try {
            // This would be called in Laravel implementation
            const [creator, orders] = await Promise.all([
                this.makeRequest('/api/creator'),
                this.makeRequest('/api/orders')
            ]);
            
            currentCreator = creator;
            currentOrders = orders;
            
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
    }
};

/**
 * Navigation helpers
 */
const DashboardNavigation = {
    /**
     * Navigate to Mi Tienda
     */
    goToMiTienda: function() {
        window.location.href = 'mi-tienda.html';
    },
    
    /**
     * Navigate to Dashboard Home
     */
    goToDashboardHome: function() {
        window.location.href = 'dashboard-home.html';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Export for Laravel integration
if (typeof window !== 'undefined') {
    window.Dashboard = {
        LaravelHelper: DashboardLaravelHelper,
        Navigation: DashboardNavigation,
        init: initializeDashboard,
        loadData: loadData
    };
}