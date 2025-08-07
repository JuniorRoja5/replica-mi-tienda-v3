/* ========================================
   CUSTOMERS MANAGEMENT - JAVASCRIPT CORE
   Compatible with Laravel Blade + Bootstrap 5
   ======================================== */

/* === FOR LARAVEL DEVELOPER === 
 * 
 * REQUIRED INTEGRATION:
 * 1. Replace localStorage with Laravel API calls
 * 2. Add CSRF tokens for forms  
 * 3. Modify loadCustomers() to use Route::apiResource
 * 4. Update addCustomer() for POST /api/customers
 * 5. Connect deleteCustomer() with DELETE /api/customers/{id}
 * 6. Implement CSV import with Laravel file handling
 * 
 * IMPORTANT GLOBAL VARIABLES:
 * - customers: Array of customer objects
 * - filteredCustomers: Filtered array for search
 * - currentPage: Current pagination page
 * - customersPerPage: Number of customers per page (30)
 * 
 * CRITICAL FUNCTIONS TO INTEGRATE:
 * - loadCustomers(): Should use API GET /api/customers  
 * - addCustomer(): Should use API POST with CSRF
 * - deleteCustomer(): Should use API DELETE with CSRF
 * - exportToCSV(): Keep as is (client-side)
 * - importCSV(): Needs Laravel file upload integration
 */

// === GLOBAL APPLICATION STATE ===
// LARAVEL NOTE: Replace with data from Customer model and API
let customers = [];
let filteredCustomers = [];
let currentPage = 1;
let customersPerPage = 30;
let customerToDelete = null;

// Design integration
let currentDesignSettings = null;

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomers();
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
    
    console.log('🎨 Design integration initialized successfully for customers page');
}

/**
 * Apply design settings to customers page
 * Updates CSS custom properties
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
    
    // For customers page, we use a light theme approach
    root.style.setProperty('--design-background', '#FFFFFF');
    root.style.setProperty('--design-text-color', settings.text_color || '#1F2937');
    root.style.setProperty('--design-text-secondary', settings.text_secondary_color || '#6B7280');
    root.style.setProperty('--design-button-bg', settings.button_color || '#3B82F6');
    root.style.setProperty('--design-button-text', settings.button_font_color || '#FFFFFF');
    root.style.setProperty('--design-button-hover', settings.button_hover_color || '#2563EB');
    root.style.setProperty('--design-font-family', settings.font_family || 'Inter');
    
    console.log('🎨 Design settings applied to customers page:', settings);
}

/**
 * Apply default design settings (light theme for customers)
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
 * Initialize the customers management system
 * Entry point for the application
 */
async function initializeCustomers() {
    console.log('Customers Management v1.0 - Initializing...');
    
    showLoading();
    
    try {
        // Load customer data
        await loadCustomers();
        
        // Update statistics
        updateStatistics();
        
        // Render customers list
        renderCustomers();
        
        hideLoading();
        
    } catch (error) {
        console.error('Error initializing customers:', error);
        hideLoading();
        showError('Error al cargar los clientes. Por favor, inténtalo de nuevo.');
    }
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
    // Search input listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterCustomers, 300));
    }
}

/**
 * Debounce function to limit API calls during search
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
 * Load customers data
 * LARAVEL INTEGRATION: Replace with API call to GET /api/customers
 */
async function loadCustomers() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // LARAVEL NOTE: Replace this with actual API call
        // const response = await fetch('/api/customers', {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        //     }
        // });
        // customers = await response.json();
        
        // Mock data for development
        customers = generateMockCustomers();
        filteredCustomers = [...customers];
        
        console.log('Customers loaded successfully:', customers.length);
        
    } catch (error) {
        console.error('Error loading customers:', error);
        throw error;
    }
}

/**
 * Generate mock customer data for development
 * LARAVEL NOTE: Remove this function when integrating with real API
 */
function generateMockCustomers() {
    const names = [
        'Ana García López', 'Carlos Rodríguez', 'María Fernández', 'Juan Martínez',
        'Laura Sánchez', 'Pedro González', 'Carmen López', 'Miguel Hernández',
        'Isabel Ruiz', 'Antonio Jiménez', 'Cristina Moreno', 'Francisco Muñoz',
        'Elena Álvarez', 'José Romero', 'Pilar Gutiérrez', 'Manuel Torres'
    ];
    
    const emails = names.map(name => 
        name.toLowerCase()
            .replace(/\s+/g, '.')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n') + '@email.com'
    );
    
    const sources = ['manual', 'instagram', 'tiktok', 'website', 'referral'];
    
    return names.map((name, index) => ({
        id: index + 1,
        name: name,
        email: emails[index],
        phone: Math.random() > 0.3 ? `+1${Math.floor(Math.random() * 9000000000) + 1000000000}` : '',
        source: sources[Math.floor(Math.random() * sources.length)],
        first_purchase_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        total_purchases: Math.floor(Math.random() * 10) + 1,
        total_spent: Math.floor(Math.random() * 1000) + 50,
        notes: Math.random() > 0.7 ? 'Cliente muy interesado en productos digitales' : '',
        created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
    }));
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
 * Update statistics cards
 */
function updateStatistics() {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0);
    const totalPurchases = customers.reduce((sum, customer) => sum + (customer.total_purchases || 0), 0);
    
    document.getElementById('totalCustomers').textContent = totalCustomers.toLocaleString();
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('totalPurchases').textContent = totalPurchases.toLocaleString();
}

/**
 * Filter customers based on search term
 */
function filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredCustomers = [...customers];
    } else {
        filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            (customer.phone && customer.phone.includes(searchTerm))
        );
    }
    
    currentPage = 1;
    renderCustomers();
    updatePagination();
}

/**
 * Render customers list
 */
function renderCustomers() {
    const customersList = document.getElementById('customersList');
    
    if (filteredCustomers.length === 0) {
        renderEmptyState(customersList);
        return;
    }
    
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    const currentCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    customersList.innerHTML = currentCustomers.map((customer, index) => 
        renderCustomerCard(customer, index)
    ).join('');
    
    updatePagination();
}

/**
 * Render empty state when no customers found
 * @param {HTMLElement} container - Container element
 */
function renderEmptyState(container) {
    const isSearching = document.getElementById('searchInput').value.trim() !== '';
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-people empty-icon"></i>
            <h3 class="empty-title">
                ${isSearching ? 'No se encontraron clientes' : 'No tienes clientes aún'}
            </h3>
            <p class="empty-description">
                ${isSearching 
                    ? 'Intenta con otros términos de búsqueda' 
                    : 'Agrega tu primer contacto o espera a que alguien compre tus productos'
                }
            </p>
            ${!isSearching ? `
                <button class="btn-primary-custom" onclick="showAddCustomerModal()">
                    <i class="bi bi-plus"></i>
                    Agregar primer contacto
                </button>
            ` : ''}
        </div>
    `;
    
    document.getElementById('paginationContainer').style.display = 'none';
}

/**
 * Render a single customer card
 * @param {Object} customer - Customer data
 * @param {number} index - Index for animation delay
 */
function renderCustomerCard(customer, index) {
    const customerSince = customer.first_purchase_date ? 
        new Date(customer.first_purchase_date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) : 'N/A';
    
    const initials = customer.name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    
    return `
        <div class="customer-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="customer-header">
                <div class="customer-info">
                    <div class="customer-avatar">
                        ${initials}
                    </div>
                    <div class="customer-details">
                        <h3>${customer.name}</h3>
                        <div class="customer-contact">
                            <span class="contact-item">
                                <i class="bi bi-envelope"></i>
                                ${customer.email}
                            </span>
                            ${customer.phone ? `
                                <span class="contact-item">
                                    <i class="bi bi-telephone"></i>
                                    ${customer.phone}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="customer-stats">
                    <div class="stat-item">
                        <div class="stat-label">Cliente desde</div>
                        <div class="stat-number">${customerSince}</div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-label">Compras</div>
                        <div class="stat-number">${customer.total_purchases || 0}</div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-label">Total gastado</div>
                        <div class="stat-number success">$${(customer.total_spent || 0).toFixed(2)}</div>
                    </div>
                    
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="editCustomer(${customer.id})">
                                <i class="bi bi-pencil"></i> Editar
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="showDeleteModal(${customer.id})">
                                <i class="bi bi-trash"></i> Eliminar
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            ${customer.notes ? `
                <div class="customer-notes">
                    <strong>Notas:</strong> ${customer.notes}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Update pagination controls
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="bi bi-chevron-left"></i>
        </button>
    `;
    
    // Show page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span class="pagination-btn">...</span>';
        }
    }
    
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="bi bi-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

/**
 * Change current page
 * @param {number} page - Page number to navigate to
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCustomers();
    }
}

/* ========================================
   CUSTOMER MANAGEMENT FUNCTIONS
   ======================================== */

/**
 * Show add customer modal
 */
function showAddCustomerModal() {
    const modal = new bootstrap.Modal(document.getElementById('addCustomerModal'));
    
    // Reset form
    document.getElementById('customerForm').reset();
    
    modal.show();
}

/**
 * Add new customer
 * LARAVEL INTEGRATION: Replace with API call to POST /api/customers
 */
async function addCustomer() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const source = document.getElementById('customerSource').value;
    const notes = document.getElementById('customerNotes').value.trim();
    
    // Validation
    if (!name || !email) {
        alert('Por favor, ingresa al menos el nombre y email del contacto.');
        return;
    }
    
    // Check if email already exists
    if (customers.some(customer => customer.email.toLowerCase() === email.toLowerCase())) {
        alert('Ya existe un contacto con ese email.');
        return;
    }
    
    try {
        // LARAVEL NOTE: Replace this with actual API call
        // const response = await fetch('/api/customers', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        //     },
        //     body: JSON.stringify({ name, email, phone, source, notes })
        // });
        // const newCustomer = await response.json();
        
        // Mock implementation
        const newCustomer = {
            id: customers.length + 1,
            name,
            email,
            phone,
            source,
            notes,
            first_purchase_date: new Date().toISOString(),
            total_purchases: 0,
            total_spent: 0,
            created_at: new Date().toISOString()
        };
        
        customers.unshift(newCustomer);
        filteredCustomers = [...customers];
        
        // Update UI
        updateStatistics();
        renderCustomers();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
        modal.hide();
        
        // Show success message
        showSuccessMessage('¡Contacto agregado correctamente!');
        
    } catch (error) {
        console.error('Error adding customer:', error);
        showError('Error al agregar el contacto. Por favor, inténtalo de nuevo.');
    }
}

/**
 * Show delete confirmation modal
 * @param {number} customerId - ID of customer to delete
 */
function showDeleteModal(customerId) {
    customerToDelete = customers.find(c => c.id === customerId);
    
    if (customerToDelete) {
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }
}

/**
 * Confirm delete customer
 * LARAVEL INTEGRATION: Replace with API call to DELETE /api/customers/{id}
 */
async function confirmDeleteCustomer() {
    if (!customerToDelete) return;
    
    try {
        // LARAVEL NOTE: Replace this with actual API call
        // const response = await fetch(`/api/customers/${customerToDelete.id}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        //     }
        // });
        
        // Mock implementation
        customers = customers.filter(c => c.id !== customerToDelete.id);
        filteredCustomers = [...customers];
        
        // Update UI
        updateStatistics();
        renderCustomers();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        // Reset delete customer
        customerToDelete = null;
        
        // Show success message
        showSuccessMessage('Contacto eliminado correctamente.');
        
    } catch (error) {
        console.error('Error deleting customer:', error);
        showError('Error al eliminar el contacto. Por favor, inténtalo de nuevo.');
    }
}

/**
 * Edit customer (placeholder)
 * @param {number} customerId - ID of customer to edit
 */
function editCustomer(customerId) {
    // TODO: Implement edit customer modal and functionality
    console.log('Edit customer:', customerId);
    showSuccessMessage('Función de edición próximamente disponible.');
}

/* ========================================
   EXPORT AND IMPORT FUNCTIONS
   ======================================== */

/**
 * Export customers to CSV
 */
function exportToCSV() {
    if (customers.length === 0) {
        alert('No hay clientes para exportar.');
        return;
    }
    
    const headers = ['Nombre', 'Email', 'Teléfono', 'Origen', 'Cliente desde', 'Total compras', 'Total gastado', 'Notas'];
    
    const csvData = customers.map(customer => [
        customer.name,
        customer.email,
        customer.phone || '',
        customer.source || '',
        customer.first_purchase_date ? new Date(customer.first_purchase_date).toLocaleDateString('es-ES') : '',
        customer.total_purchases || 0,
        `$${(customer.total_spent || 0).toFixed(2)}`,
        customer.notes || ''
    ]);
    
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showSuccessMessage('Archivo CSV descargado correctamente.');
}

/**
 * Import customers from CSV
 * LARAVEL INTEGRATION: Needs file upload handling
 */
function importCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona un archivo CSV.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            let imported = 0;
            let errors = 0;
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                
                if (values.length >= 2) {
                    const name = values[0];
                    const email = values[1];
                    const phone = values[2] || '';
                    
                    if (name && email && !customers.some(c => c.email.toLowerCase() === email.toLowerCase())) {
                        const newCustomer = {
                            id: customers.length + imported + 1,
                            name,
                            email,
                            phone,
                            source: 'csv_import',
                            notes: '',
                            first_purchase_date: new Date().toISOString(),
                            total_purchases: 0,
                            total_spent: 0,
                            created_at: new Date().toISOString()
                        };
                        
                        customers.push(newCustomer);
                        imported++;
                    } else {
                        errors++;
                    }
                } else {
                    errors++;
                }
            }
            
            filteredCustomers = [...customers];
            updateStatistics();
            renderCustomers();
            
            // Show results
            const resultsDiv = document.getElementById('importResults');
            resultsDiv.innerHTML = `
                <strong>Resultados de importación:</strong><br>
                ✅ ${imported} contactos importados correctamente<br>
                ${errors > 0 ? `❌ ${errors} filas con errores o duplicadas` : ''}
            `;
            resultsDiv.style.display = 'block';
            
            if (imported > 0) {
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
                    modal.hide();
                }, 3000);
            }
            
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showError('Error al procesar el archivo CSV. Verifica el formato.');
        }
    };
    
    reader.readAsText(file);
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Show success message
 * @param {string} message - Success message to show
 */
function showSuccessMessage(message) {
    // Simple alert for now - can be enhanced with toast notifications
    // TODO: Implement proper toast notification system
    alert(message);
}

/**
 * Laravel integration helper functions
 */
const CustomersLaravelHelper = {
    /**
     * Load customers from Laravel API
     */
    loadFromAPI: async function() {
        try {
            const response = await fetch('/api/customers', {
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
            console.error('Failed to load customers:', error);
            throw error;
        }
    },
    
    /**
     * Create customer via Laravel API
     */
    create: async function(customerData) {
        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken()
                },
                body: JSON.stringify(customerData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to create customer:', error);
            throw error;
        }
    },
    
    /**
     * Delete customer via Laravel API
     */
    delete: async function(customerId) {
        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE',
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
            console.error('Failed to delete customer:', error);
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
    window.CustomersLaravelHelper = CustomersLaravelHelper;
    window.loadCustomers = loadCustomers;
    window.addCustomer = addCustomer;
    window.deleteCustomer = confirmDeleteCustomer;
}