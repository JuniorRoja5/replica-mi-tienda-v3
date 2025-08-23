/* ========================================
   MY STORE BUILDER - JAVASCRIPT CORE
   Compatible with Laravel Blade + Bootstrap 5
   ======================================== */

/* === FOR LARAVEL DEVELOPER ===
 *
 * REQUIRED INTEGRATION:
 * 1. Replace localStorage with Laravel API calls
 * 2. Add CSRF tokens for forms
 * 3. Modify loadProducts() to use Route::apiResource
 * 4. Update saveProduct() for POST /api/products
 * 5. Connect updateProfileUI() with PUT /api/profile
 *
 * IMPORTANT GLOBAL VARIABLES:
 * - appState: Main application state
 * - productFormData: Product form data
 * - courseFormData: Course-specific data
 * - membershipFormData: Membership-specific data
 *
 * CRITICAL FUNCTIONS TO INTEGRATE:
 * - getCurrentUser(): Should use auth()->user()
 * - loadProducts(): Should use API /api/products
 * - saveProduct(): Should use API POST with CSRF
 * - updatePreview(): Keep as is (UI only)
 */

// === GLOBAL APPLICATION STATE ===
// LARAVEL NOTE: Replace with data from auth()->user() and $user->products()
let appState = {
    profile: {
        name: 'Trading Sharks',
        username: 'tradingsharks',
        bio: 'Aquí le cambia la vida 🔥📈',
        avatar_url: '',
        social_links: {
            tiktok: '',
            instagram: '',
            youtube: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            discord: '',
            spotify: ''
        }
    },
    products: [
        {
            id: 1,
            type: 'link',
            title: '🔥NAGA - Acción GRATUITA de hasta 100 USD',
            description: '',
            url: 'https://bit.ly/naga-TradingSharks',
            price: 0,
            image_url: '',
            status: 'active',
            sales: 0,
            sort_order: 3
        },
        {
            id: 2,
            type: 'product',
            title: 'Guía completa para invertir en video',
            description: 'Guía completa de la A a la Z para aprender a invertir y lograr la libertad financiera',
            url: '',
            price: 49.99,
            image_url: '',
            status: 'active',
            sales: 0,
            sort_order: 1
        },
        {
            id: 3,
            type: 'product',
            title: 'Guía completa para invertir',
            description: 'Guía paso a paso de la A a la Z de cómo invertir y ganar interés compuesto',
            url: '',
            price: 149,
            image_url: '',
            status: 'active',
            sales: 3,
            sort_order: 2
        }
    ]
};

let sortableInstance = null;
let isEditing = false;
let editingId = null;

// Form data objects for different product types
let productFormData = {};
let consultationFormData = {};
let courseFormData = {};
let membershipFormData = {};

// Laravel Authentication Variables
let laravelAuth = {
    csrfToken: null,
    userId: null,
    userName: null,
    userEmail: null,
    authenticated: false
};

// Global design state
let currentDesignSettings = null;

// Current tab tracking for forms
let currentProductTab = 'datos';
let currentConsultationTab = 'datos';
let currentCourseTab = 'datos';
let currentMembershipTab = 'datos';

// Global functions need to be declared before DOMContentLoaded
function setupLaravelAuthListener() {
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'LARAVEL_AUTH') {
            laravelAuth = {
                csrfToken: event.data.csrfToken,
                userId: event.data.userId,
                userName: event.data.userName,
                userEmail: event.data.userEmail,
                authenticated: true
            };

            console.log('Laravel authentication data received:', laravelAuth);

            // Now load data from API instead of localStorage
            loadFromAPI();
        }
    });
}

function getAuthHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': laravelAuth.csrfToken
    };
}

async function loadFromAPI() {
    if (!laravelAuth.authenticated) {
        console.warn('Not authenticated, falling back to localStorage');
        loadFromStorage();
        return;
    }

    try {
        // Load profile from API
        await loadProfileFromAPI();

        // Load products from API
        await loadProductsFromAPI();

        // Update UI with loaded data
        updateProfileUI();
        renderProducts();
        updatePreview();

        console.log('Data loaded successfully from Laravel API');
    } catch (error) {
        console.error('Error loading data from API:', error);
        // Fallback to localStorage if API fails
        loadFromStorage();
    }
}

async function loadProfileFromAPI() {
    try {
        const response = await fetch('/user/api/mi-tienda/profile', {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.profile) {
                // Update appState with API data
                appState.profile = {
                    ...appState.profile,
                    ...data.profile
                };
                console.log('Profile loaded from API:', data.profile);
            }
        } else {
            console.error('Failed to load profile from API:', response.status);
        }
    } catch (error) {
        console.error('Error loading profile from API:', error);
        throw error;
    }
}

async function loadProductsFromAPI() {
    try {
        const response = await fetch('/user/api/mi-tienda/products', {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.products) {
                // Update appState with API data
                appState.products = data.products;
                console.log('Products loaded from API:', data.products);
            }
        } else {
            console.error('Failed to load products from API:', response.status);
        }
    } catch (error) {
        console.error('Error loading products from API:', error);
        throw error;
    }
}

async function saveProfileToAPI() {
    if (!laravelAuth.authenticated) {
        console.warn('Not authenticated, cannot save profile');
        return false;
    }

    try {
        const response = await fetch('/user/api/mi-tienda/profile', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: appState.profile.name,
                username: appState.profile.username,
                bio: appState.profile.bio,
                avatar_url: appState.profile.avatar_url,
                social_links: appState.profile.social_links
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log('Profile saved successfully to API');
                showToast('Perfil guardado correctamente', 'success');
                return true;
            }
        } else {
            console.error('Failed to save profile to API:', response.status);
            showToast('Error al guardar perfil', 'error');
        }
    } catch (error) {
        console.error('Error saving profile to API:', error);
        showToast('Error al guardar perfil', 'error');
    }
    return false;
}

// Product CRUD API functions

async function createProduct(productData) {
    if (!laravelAuth.authenticated) {
        console.warn('Not authenticated, cannot create product');
        return false;
    }

    try {
        const response = await fetch('/user/api/mi-tienda/products', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log('Product created successfully:', data.product);
                showToast('Producto creado correctamente', 'success');
                return data.product;
            }
        } else {
            console.error('Failed to create product:', response.status);
            showToast('Error al crear producto', 'error');
        }
    } catch (error) {
        console.error('Error creating product:', error);
        showToast('Error al crear producto', 'error');
    }
    return false;
}

async function updateProduct(productId, productData) {
    if (!laravelAuth.authenticated) {
        console.warn('Not authenticated, cannot update product');
        return false;
    }

    try {
        const response = await fetch('/user/api/mi-tienda/products', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id: productId,
                ...productData
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log('Product updated successfully:', data.product);
                showToast('Producto actualizado correctamente', 'success');
                return data.product;
            }
        } else {
            console.error('Failed to update product:', response.status);
            showToast('Error al actualizar producto', 'error');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error al actualizar producto', 'error');
    }
    return false;
}

async function deleteProduct(productId) {
    if (!laravelAuth.authenticated) {
        console.warn('Not authenticated, cannot delete product');
        return false;
    }

    try {
        const response = await fetch('/user/api/mi-tienda/products', {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id: productId
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log('Product deleted successfully');
                showToast('Producto eliminado correctamente', 'success');
                return true;
            }
        } else {
            console.error('Failed to delete product:', response.status);
            showToast('Error al eliminar producto', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error al eliminar producto', 'error');
    }
    return false;
}

async function reorderProducts(productIds) {
    if (!laravelAuth.authenticated) {
        console.warn('Not authenticated, cannot reorder products');
        return false;
    }

    try {
        const response = await fetch('/user/api/mi-tienda/products/reorder', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log('Products reordered successfully');
                showToast('Orden actualizado correctamente', 'success');
                return true;
            }
        } else {
            console.error('Failed to reorder products:', response.status);
            showToast('Error al reordenar productos', 'error');
        }
    } catch (error) {
        console.error('Error reordering products:', error);
        showToast('Error al reordenar productos', 'error');
    }
    return false;
}

// Design Integration Functions
function initializeDesignIntegration() {
    // Listen for design updates from Design Customizer via PostMessage
    window.addEventListener('message', function(event) {
        if (event.data.type === 'DESIGN_UPDATE' && event.data.settings) {
            const designSettings = event.data.settings;
            applyDesignSettings(designSettings);
            console.log('✅ Design updated from Design Customizer via PostMessage:', designSettings);
        } else if (event.data.type === 'productClick') {
            handleProductClickFromIframe(event.data.productId, event.data.productType);
        } else if (event.data.type === 'openPurchaseModal') {
            handlePurchaseFromPublicView(event.data.product);
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

                    // Clear the pending update
                    localStorage.removeItem('pending_design_update');
                }
            } catch (error) {
                console.error('Error parsing design update from localStorage:', error);
            }
        }
    });

    // Check for any pending design updates on initialization
    try {
        const pendingUpdate = localStorage.getItem('pending_design_update');
        if (pendingUpdate) {
            const updateData = JSON.parse(pendingUpdate);
            if (updateData.design_settings && updateData.source === 'diseno-customizer') {
                // Apply the pending update if it's recent (within 5 seconds)
                const age = Date.now() - updateData.timestamp;
                if (age < 5000) {
                    applyDesignSettings(updateData.design_settings);
                    console.log('✅ Applied pending design update on initialization:', updateData.design_settings);
                }
                // Clear the pending update
                localStorage.removeItem('pending_design_update');
            }
        }
    } catch (error) {
        console.error('Error checking for pending design updates:', error);
    }

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
        // Apply default dark theme if no settings saved
        applyDefaultDesignSettings();
    }

    console.log('🎨 Design integration initialized successfully with multiple communication methods');
}

function applyDesignSettings(settings) {
    if (!settings || typeof settings !== 'object') {
        console.warn('Invalid design settings received:', settings);
        return;
    }

    currentDesignSettings = settings;

    // Update CSS custom properties for real-time design changes
    const root = document.documentElement;

    // Background settings
    root.style.setProperty('--design-background', settings.background || '#000000');
    root.style.setProperty('--design-text-color', settings.text_color || '#FFFFFF');
    root.style.setProperty('--design-text-secondary', settings.text_secondary_color || '#A0A0A0');
    root.style.setProperty('--design-button-bg', settings.button_color || 'rgba(255, 255, 255, 0.1)');
    root.style.setProperty('--design-button-text', settings.button_font_color || '#FFFFFF');
    root.style.setProperty('--design-button-hover', settings.button_hover_color || 'rgba(255, 255, 255, 0.15)');
    root.style.setProperty('--design-font-family', settings.font_family || 'Inter');

    // Apply background type specific styles
    if (settings.background_type === 'gradient' && settings.background.includes('gradient')) {
        root.style.setProperty('--design-background-type', 'gradient');
    } else {
        root.style.setProperty('--design-background-type', 'solid');
    }

    // Inject dynamic styles for preview content
    injectDynamicDesignStyles(settings);

    // Update preview with new design
    updatePreview();

    // Store settings for persistence
    localStorage.setItem('applied_design_settings', JSON.stringify(settings));

    console.log('Design settings applied successfully:', settings);
}

function applyDefaultDesignSettings() {
    const defaultSettings = {
        theme_id: 'dark',
        theme_name: 'Tema Oscuro',
        background: '#000000',
        background_type: 'solid',
        text_color: '#FFFFFF',
        text_secondary_color: '#A0A0A0',
        font_family: 'Inter',
        button_color: 'rgba(255, 255, 255, 0.1)',
        button_font_color: '#FFFFFF',
        button_hover_color: 'rgba(255, 255, 255, 0.15)'
    };

    applyDesignSettings(defaultSettings);
}

function injectDynamicDesignStyles(settings) {
    // Remove existing dynamic styles
    const existingStyle = document.getElementById('dynamic-design-styles');
    if (existingStyle) {
        existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = 'dynamic-design-styles';

    // Generate CSS based on design settings
    const cssRules = `
        /* Preview content styling with design customization */
        .preview-content,
        #previewContent {
            background: ${settings.background} !important;
            color: ${settings.text_color} !important;
            font-family: ${settings.font_family} !important;
        }

        /* Preview header styling */
        .preview-header {
            background: ${settings.background} !important;
            color: ${settings.text_color} !important;
            font-family: ${settings.font_family} !important;
        }

        .preview-name {
            color: ${settings.text_color} !important;
            font-family: ${settings.font_family} !important;
        }

        .preview-username,
        .preview-bio {
            color: ${settings.text_secondary_color} !important;
            font-family: ${settings.font_family} !important;
        }

        /* Preview product styling */
        .preview-product {
            background: ${settings.button_color} !important;
            color: ${settings.button_font_color} !important;
            font-family: ${settings.font_family} !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            transition: all 0.2s ease !important;
        }

        .preview-product:hover {
            background: ${settings.button_hover_color} !important;
        }

        .preview-product h4 {
            color: ${settings.button_font_color} !important;
            font-family: ${settings.font_family} !important;
        }

        .preview-product p {
            color: ${settings.text_secondary_color} !important;
            font-family: ${settings.font_family} !important;
        }

        .preview-product-price {
            color: ${settings.button_font_color} !important;
            font-family: ${settings.font_family} !important;
        }

        /* Social icons with design colors */
        .preview-social-icon {
            border: 1px solid ${settings.text_secondary_color} !important;
        }

        /* For product sales pages in preview */
        .sales-page-preview {
            background: ${settings.background} !important;
            color: ${settings.text_color} !important;
            font-family: ${settings.font_family} !important;
        }

        /* Button styling in sales preview */
        .sales-preview-button {
            background: ${settings.button_color} !important;
            color: ${settings.button_font_color} !important;
            font-family: ${settings.font_family} !important;
        }

        .sales-preview-button:hover {
            background: ${settings.button_hover_color} !important;
        }

        /* Custom CSS for gradient backgrounds */
        ${settings.background_type === 'gradient' && settings.background.includes('gradient') ? `
        .preview-content,
        #previewContent {
            background: ${settings.background} !important;
            background-attachment: fixed !important;
        }
        ` : ''}

        /* Responsive design adjustments */
        @media (max-width: 768px) {
            .preview-content,
            #previewContent {
                font-size: 14px !important;
            }

            .preview-name {
                font-size: 1.2rem !important;
            }
        }
    `;

    style.textContent = cssRules;
    document.head.appendChild(style);
}

function getCurrentDesignSettings() {
    return currentDesignSettings;
}

// Core Application Functions
function initializeApp() {
    console.log('Mi Tienda v2.0 - Aplicación inicializada');
    renderProducts();

    // Configurar evento para escuchar mensajes del iframe
    window.addEventListener('message', function(event) {
        if (event.data.type === 'productClick') {
            handleProductClickFromIframe(event.data.productId, event.data.productType);
        } else if (event.data.type === 'openPurchaseModal') {
            handlePurchaseFromPublicView(event.data.product);
        }
    });
}

function handlePurchaseFromPublicView(product) {
    console.log('🛒 Compra desde vista pública:', product);
    showPurchaseModal(product);
}

function handleProductClickFromIframe(productId, productType) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    if (productType === 'link') {
        if (product.url) {
            window.open(product.url, '_blank');
        }
    } else if (productType === 'product') {
        const username = appState.profile.username || 'user';
        window.open(`public-product.html?p=${product.id}&u=${username}`, '_blank');
    } else if (productType === 'consultation') {
        const username = appState.profile.username || 'user';
        window.open(`public-product.html?c=${product.id}&u=${username}`, '_blank');
    } else if (productType === 'course') {
        const username = appState.profile.username || 'user';
        window.open(`public-product.html?course=${product.id}&u=${username}`, '_blank');
    } else if (productType === 'membership') {
        const username = appState.profile.username || 'user';
        window.open(`public-product.html?membership=${product.id}&u=${username}`, '_blank');
    }
}

function loadFromStorage() {
    const savedData = localStorage.getItem('miTiendaData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appState = { ...appState, ...parsedData };

            // Actualizar interfaz con datos guardados
            updateProfileUI();
            renderProducts();
            updatePreview();
        } catch (error) {
            console.error('Error al cargar datos guardados:', error);
        }
    }
}

function saveToStorage() {
    try {
        const dataToSave = {
            profile: appState.profile,
            products: appState.products.map(product => {
                const productCopy = { ...product };
                if (productCopy.image_url && productCopy.image_url.startsWith('data:image') && productCopy.image_url.length > 50000) {
                    console.warn('Imagen demasiado grande para localStorage, se omitirá en el guardado');
                    productCopy.image_url = '';
                }
                return productCopy;
            })
        };

        localStorage.setItem('miTiendaData', JSON.stringify(dataToSave));
        console.log('Datos guardados en localStorage');
    } catch (error) {
        console.error('Error al guardar datos:', error);

        if (error.name === 'QuotaExceededError') {
            console.warn('LocalStorage lleno, limpiando datos temporales...');
            localStorage.removeItem('tempProductPreview');

            try {
                const minimalData = {
                    profile: {
                        ...appState.profile,
                        avatar: ''
                    },
                    products: appState.products.map(product => ({
                        ...product,
                        image_url: ''
                    }))
                };
                localStorage.setItem('miTiendaData', JSON.stringify(minimalData));
                showToast('Datos guardados (imágenes omitidas por espacio limitado)', 'warning');
            } catch (secondError) {
                console.error('Error al guardar datos mínimos:', secondError);
                showToast('Error: Espacio insuficiente. Los datos no se guardaron.', 'error');
            }
        } else {
            showToast('Error al guardar datos', 'error');
        }
    }
}

function updateProfileUI() {
    const profileNameEl = document.getElementById('profileName');
    const profileUsernameEl = document.getElementById('profileUsername');
    const profileBioEl = document.getElementById('profileBio');
    const profileAvatarEl = document.getElementById('profileAvatar');

    if (profileNameEl) profileNameEl.textContent = appState.profile.name;
    if (profileUsernameEl) profileUsernameEl.textContent = '@' + appState.profile.username;
    if (profileBioEl) profileBioEl.textContent = appState.profile.bio;

    if (appState.profile.avatar_url && profileAvatarEl) {
        profileAvatarEl.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }

    updatePublicLink();
}

function setupEventListeners() {
    const bioInput = document.getElementById('bioInput');
    const bioCounter = document.getElementById('bioCounter');

    if (bioInput && bioCounter) {
        bioInput.addEventListener('input', function() {
            bioCounter.textContent = this.value.length;
        });
    }

    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }

    const linkImageInput = document.getElementById('linkImageInput');
    if (linkImageInput) {
        linkImageInput.addEventListener('change', handleLinkImageUpload);
    }
}

function initializeDragAndDrop() {
    const productsList = document.getElementById('productsList');

    if (productsList && typeof Sortable !== 'undefined') {
        sortableInstance = Sortable.create(productsList, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: function(evt) {
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;

                const item = appState.products.splice(oldIndex, 1)[0];
                appState.products.splice(newIndex, 0, item);

                appState.products.forEach((product, index) => {
                    product.sort_order = index + 1;
                });

                // Use API to reorder if authenticated, otherwise use localStorage
                if (laravelAuth.authenticated) {
                    const productIds = appState.products.map(p => p.id);
                    reorderProducts(productIds);
                } else {
                    saveToStorage();
                }
                
                updatePreview();
                showToast('¡Orden actualizado correctamente!');
            }
        });
    }
}

function renderProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    if (appState.products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-box"></i>
                <h5>No tienes productos aún</h5>
                <p>Agrega tu primer producto o enlace para empezar.</p>
                <button class="btn btn-primary" onclick="showCreateModal()">
                    <i class="bi bi-plus"></i> Crear Producto
                </button>
            </div>
        `;
        return;
    }

    const sortedProducts = [...appState.products].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    productsList.innerHTML = sortedProducts.map(product => `
        <div class="product-item fade-in" data-id="${product.id}" data-type="${product.type}">
            <div class="drag-handle">
                <i class="bi bi-grip-vertical"></i>
            </div>
            <div class="product-icon ${product.type}">
                <i class="bi bi-${getProductIcon(product.type)}"></i>
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-url">${product.type === 'link' ? product.url : product.description}</p>
                <span class="product-type ${product.type}">${getProductTypeLabel(product.type)}</span>
            </div>
            <div class="product-status">
                <div class="status-indicator ${product.status}"></div>
                <span class="status-text">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span>
            </div>
            ${product.type !== 'link' ? `
                <div class="product-price">
                    $${product.price}
                    <div class="product-sales">${product.sales || 0} ventas</div>
                </div>
            ` : ''}
            <div class="product-actions">
                <button class="btn-action edit" onclick="editProduct(${product.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action delete" onclick="confirmDeleteProduct(${product.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getProductIcon(type) {
    const icons = {
        link: 'link-45deg',
        product: 'play-btn',
        consultation: 'telephone',
        course: 'mortarboard',
        membership: 'crown'
    };
    return icons[type] || 'box-seam';
}

function getProductTypeLabel(type) {
    const labels = {
        link: 'LINK',
        product: 'PRODUCTO',
        consultation: 'Consultoría',
        course: 'Curso',
        membership: 'MEMBRESÍA'
    };
    return labels[type] || 'Producto';
}

function updatePreview() {
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) return;

    const previewHeader = `
        <div class="preview-header">
            <div class="preview-avatar" id="previewAvatar">
                ${appState.profile.avatar_url ?
                    `<img src="${appState.profile.avatar_url}" alt="Avatar">` :
                    '👤'
                }
            </div>
            <h3 class="preview-name">${appState.profile.name}</h3>
            ${appState.profile.username ? `<p class="preview-username">@${appState.profile.username}</p>` : ''}
            <p class="preview-bio">${appState.profile.bio}</p>
            <div class="preview-social" id="previewSocial">
                ${generateSocialIcons()}
            </div>
        </div>
    `;

    let previewProducts = '';
    if (appState.products.length === 0) {
        previewProducts = `
            <div class="text-center" style="padding: 2rem; color: #666;">
                <i class="bi bi-box" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No hay productos disponibles</p>
            </div>
        `;
    } else {
        const sortedProducts = [...appState.products].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        previewProducts = `
            <div class="preview-products">
                ${sortedProducts.map(product => `
                    <div class="preview-product" onclick="handleProductClick(${product.id}, '${product.type}')" style="cursor: pointer;">
                        <div class="preview-product-content">
                            <div class="preview-product-icon ${product.type}">
                                ${product.image_url && (product.type === 'link' || product.type === 'product') ?
                                    `<img src="${product.image_url}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;">` :
                                    `<i class="bi bi-${getProductIcon(product.type)}"></i>`
                                }
                            </div>
                            <div class="preview-product-info">
                                <h4>${truncateText(product.title, 35)}</h4>
                                ${product.subtitle && product.type === 'product' ? `<p style="font-size: 0.75rem; color: #a0aec0; margin: 0.2rem 0;">${truncateText(product.subtitle, 40)}</p>` : ''}
                                ${product.description && product.type !== 'link' ? `<p style="margin-top: 0.25rem;">${truncateText(product.description, 45)}</p>` : ''}
                            </div>
                            ${product.type !== 'link' && product.price > 0 ? `
                                <div class="preview-product-price">
                                    ${product.has_discount && product.discount_price > 0 ?
                                        `<div style="text-decoration: line-through; font-size: 0.8rem; color: #a0aec0;">$${product.price}</div>
                                         <div style="color: #48bb78;">$${product.discount_price}</div>` :
                                        `$${product.price}`
                                    }
                                </div>
                            ` : ''}
                        </div>
                        ${product.reviews && product.reviews.length > 0 ? `
                            <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.25rem;">
                                <div style="color: #ffc107; font-size: 0.75rem;">
                                    ${Array.from({length: 5}, (_, i) => `<i class="bi bi-star${i < Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length) ? '-fill' : ''}"></i>`).join('')}
                                </div>
                                <span style="font-size: 0.75rem; color: #a0aec0;">(${product.reviews.length})</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    previewContent.innerHTML = previewHeader + previewProducts;
}

function handleProductClick(productId, productType) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    console.log('Product clicked:', product);

    if (productType === 'link') {
        if (product.url) {
            window.open(product.url, '_blank');
        }
    } else if (productType === 'product') {
        const username = appState.profile.username || 'user';
        const productUrl = `public-product.html?p=${product.id}&u=${username}`;
        window.open(productUrl, '_blank');
    } else if (productType === 'consultation') {
        const username = appState.profile.username || 'user';
        const consultationUrl = `public-product.html?c=${product.id}&u=${username}`;
        window.open(consultationUrl, '_blank');
    } else if (productType === 'course') {
        const username = appState.profile.username || 'user';
        const courseUrl = `public-product.html?course=${product.id}&u=${username}`;
        window.open(courseUrl, '_blank');
    } else if (productType === 'membership') {
        const username = appState.profile.username || 'user';
        const membershipUrl = `public-product.html?membership=${product.id}&u=${username}`;
        window.open(membershipUrl, '_blank');
    }
}

// Utility Functions
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function generateSocialIcons() {
    const socialLinks = appState.profile.social_links;
    const socialPlatforms = [
        { key: 'tiktok', icon: 'tiktok', color: '#000000' },
        { key: 'instagram', icon: 'instagram', color: '#E4405F' },
        { key: 'youtube', icon: 'youtube', color: '#FF0000' },
        { key: 'twitter', icon: 'twitter', color: '#1DA1F2' },
        { key: 'facebook', icon: 'facebook', color: '#1877F2' },
        { key: 'linkedin', icon: 'linkedin', color: '#0A66C2' },
        { key: 'discord', icon: 'discord', color: '#5865F2' },
        { key: 'spotify', icon: 'spotify', color: '#1DB954' }
    ];

    return socialPlatforms
        .filter(platform => socialLinks[platform.key] && socialLinks[platform.key].trim() !== '')
        .map(platform => `
            <a href="${socialLinks[platform.key]}" target="_blank" class="preview-social-icon" style="color: ${platform.color};">
                <i class="bi bi-${platform.icon}"></i>
            </a>
        `)
        .join('');
}

// Product Management Functions
function showCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function selectProductType(type) {
    closeCreateModal();
    
    switch(type) {
        case 'link':
            showLinkFormOverlay();
            break;
        case 'product':
            showProductFormOverlay();
            break;
        case 'consultation':
            showConsultationFormOverlay();
            break;
        case 'course':
            showCourseFormOverlay();
            break;
        case 'membership':
            showMembershipFormOverlay();
            break;
        default:
            console.error('Unknown product type:', type);
    }
}

function editProduct(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    isEditing = true;
    editingId = productId;

    switch(product.type) {
        case 'link':
            showLinkFormOverlay(product);
            break;
        case 'product':
            showProductFormOverlay(product);
            break;
        case 'consultation':
            showConsultationFormOverlay(product);
            break;
        case 'course':
            showCourseFormOverlay(product);
            break;
        case 'membership':
            showMembershipFormOverlay(product);
            break;
        default:
            console.error('Unknown product type:', product.type);
    }
}

function confirmDeleteProduct(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`¿Estás seguro de que quieres eliminar "${product.title}"?`)) {
        deleteProductById(productId);
    }
}

async function deleteProductById(productId) {
    // Try to delete from API first if authenticated
    if (laravelAuth.authenticated) {
        const success = await deleteProduct(productId);
        if (success) {
            // Remove from local state
            appState.products = appState.products.filter(p => p.id !== productId);
            renderProducts();
            updatePreview();
            return;
        }
    }

    // Fallback to localStorage if API fails or not authenticated
    appState.products = appState.products.filter(p => p.id !== productId);
    saveToStorage();
    renderProducts();
    updatePreview();
    showToast('Producto eliminado correctamente', 'success');
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Profile Management Functions
function showProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        // Populate form with current data
        const nameInput = document.getElementById('modalProfileName');
        const usernameInput = document.getElementById('modalProfileUsername'); 
        const bioInput = document.getElementById('modalProfileBio');
        
        if (nameInput) nameInput.value = appState.profile.name;
        if (usernameInput) usernameInput.value = appState.profile.username;
        if (bioInput) bioInput.value = appState.profile.bio;
        
        modal.style.display = 'block';
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function saveProfile() {
    const nameInput = document.getElementById('modalProfileName');
    const usernameInput = document.getElementById('modalProfileUsername');
    const bioInput = document.getElementById('modalProfileBio');
    
    if (!nameInput || !usernameInput || !bioInput) {
        showToast('Error: Elementos del formulario no encontrados', 'error');
        return;
    }
    
    const newProfile = {
        name: nameInput.value.trim(),
        username: usernameInput.value.trim(),
        bio: bioInput.value.trim()
    };
    
    if (!newProfile.name || !newProfile.username) {
        showToast('El nombre y el usuario son obligatorios', 'error');
        return;
    }
    
    // Update local state
    appState.profile = {
        ...appState.profile,
        ...newProfile
    };
    
    // Try to save to API if authenticated
    if (laravelAuth.authenticated) {
        const success = await saveProfileToAPI();
        if (success) {
            updateProfileUI();
            updatePreview();
            closeProfileModal();
            return;
        }
    }
    
    // Fallback to localStorage
    saveToStorage();
    updateProfileUI();
    updatePreview();
    closeProfileModal();
    showToast('Perfil actualizado correctamente', 'success');
}

// Link Product Functions
function showLinkFormOverlay(editData = null) {
    const overlay = document.getElementById('linkFormOverlay');
    if (!overlay) {
        console.error('Link form overlay not found');
        return;
    }
    
    // Reset or populate form
    const titleInput = document.getElementById('linkTitle');
    const urlInput = document.getElementById('linkUrl');
    const imageInput = document.getElementById('linkImageInput');
    const imagePreview = document.getElementById('linkImagePreview');
    
    if (editData) {
        if (titleInput) titleInput.value = editData.title || '';
        if (urlInput) urlInput.value = editData.url || '';
        if (imagePreview && editData.image_url) {
            imagePreview.innerHTML = `<img src="${editData.image_url}" alt="Preview">`;
        }
    } else {
        if (titleInput) titleInput.value = '';
        if (urlInput) urlInput.value = '';
        if (imagePreview) imagePreview.innerHTML = '<div class="image-placeholder"><i class="bi bi-image"></i></div>';
    }
    
    overlay.style.display = 'block';
}

function closeLinkFormOverlay() {
    const overlay = document.getElementById('linkFormOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    isEditing = false;
    editingId = null;
}

async function saveLinkProduct() {
    const titleInput = document.getElementById('linkTitle');
    const urlInput = document.getElementById('linkUrl');
    const imagePreview = document.getElementById('linkImagePreview');
    
    if (!titleInput || !urlInput) {
        showToast('Error: Elementos del formulario no encontrados', 'error');
        return;
    }
    
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    
    if (!title || !url) {
        showToast('El título y la URL son obligatorios', 'error');
        return;
    }
    
    const imageUrl = imagePreview && imagePreview.querySelector('img') 
        ? imagePreview.querySelector('img').src 
        : '';
    
    const linkData = {
        type: 'link',
        title: title,
        url: url,
        image_url: imageUrl,
        description: '',
        price: 0,
        status: 'active',
        sales: 0
    };
    
    if (isEditing && editingId) {
        // Update existing link
        if (laravelAuth.authenticated) {
            const updatedProduct = await updateProduct(editingId, linkData);
            if (updatedProduct) {
                const index = appState.products.findIndex(p => p.id == editingId);
                if (index !== -1) {
                    appState.products[index] = { ...appState.products[index], ...linkData };
                }
                renderProducts();
                updatePreview();
                closeLinkFormOverlay();
                return;
            }
        }
        
        // Fallback to localStorage
        const index = appState.products.findIndex(p => p.id == editingId);
        if (index !== -1) {
            appState.products[index] = { ...appState.products[index], ...linkData };
        }
    } else {
        // Create new link
        linkData.id = Date.now();
        linkData.sort_order = appState.products.length + 1;
        
        if (laravelAuth.authenticated) {
            const newProduct = await createProduct(linkData);
            if (newProduct) {
                appState.products.push(newProduct);
                renderProducts();
                updatePreview();
                closeLinkFormOverlay();
                return;
            }
        }
        
        // Fallback to localStorage
        appState.products.push(linkData);
    }
    
    saveToStorage();
    renderProducts();
    updatePreview();
    closeLinkFormOverlay();
    showToast(isEditing ? 'Link actualizado correctamente' : 'Link creado correctamente', 'success');
}

// Image upload handlers
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        appState.profile.avatar_url = e.target.result;
        updateProfileUI();
        updatePreview();
        showToast('Avatar actualizado correctamente', 'success');
    };
    reader.readAsDataURL(file);
}

function handleLinkImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('linkImagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        showToast('Imagen cargada correctamente', 'success');
    };
    reader.readAsDataURL(file);
}

// Placeholder functions for other product types (to be implemented)
function showProductFormOverlay(editData = null) {
    showToast('Formulario de producto digital - En desarrollo', 'info');
}

function showConsultationFormOverlay(editData = null) {
    showToast('Formulario de consultoría - En desarrollo', 'info');
}

function showCourseFormOverlay(editData = null) {
    showToast('Formulario de curso - En desarrollo', 'info');
}

function showMembershipFormOverlay(editData = null) {
    showToast('Formulario de membresía - En desarrollo', 'info');
}

function showPurchaseModal(product) {
    showToast(`Modal de compra para: ${product.title} - En desarrollo`, 'info');
}

// Public link functions
function copyPublicLink() {
    const linkInput = document.getElementById('publicLinkInput');
    if (!linkInput) return;

    try {
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(linkInput.value).then(() => {
            showToast('Link copiado al portapapeles', 'success');

            linkInput.style.background = '#DEF7EC';
            linkInput.style.borderColor = '#10B981';
            setTimeout(() => {
                linkInput.style.background = '#F9FAFB';
                linkInput.style.borderColor = '#E5E7EB';
            }, 1000);
        }).catch(() => {
            document.execCommand('copy');
            showToast('Link copiado', 'success');
        });
    } catch (err) {
        showToast('Por favor selecciona y copia el link manualmente', 'info');
    }
}

function updatePublicLink() {
    const usernameEl = document.getElementById('profileUsername');
    const publicLinkInput = document.getElementById('publicLinkInput');
    
    if (usernameEl && publicLinkInput) {
        const username = usernameEl.textContent.replace('@', '');
        publicLinkInput.value = `https://clickmy.link/u/${username}`;
    }
}

// Export functions for Laravel Blade integration
window.MiTienda = {
    showProfileModal,
    closeProfileModal,
    showCreateModal,
    closeCreateModal,
    selectProductType,
    editProduct,
    confirmDeleteProduct,
    saveProfile,
    saveLinkProduct,
    copyPublicLink,
    getState: () => appState,
    setState: (newState) => {
        appState = { ...appState, ...newState };
        if (laravelAuth.authenticated) {
            // Don't save to localStorage if we have API
        } else {
            saveToStorage();
        }
        renderProducts();
        updatePreview();
    }
};

// Export design integration functions
if (typeof window !== 'undefined') {
    window.MiTiendaDesignIntegration = {
        initializeWithLaravelData: function(creatorData) {
            if (creatorData.design_settings) {
                applyDesignSettings(creatorData.design_settings);
            } else {
                applyDefaultDesignSettings();
            }
        },
        getCurrentSettings: function() {
            return getCurrentDesignSettings();
        },
        applySettings: function(settings) {
            applyDesignSettings(settings);
        },
        resetToDefault: function() {
            applyDefaultDesignSettings();
            showToast('Diseño restablecido al tema por defecto', 'info');
        }
    };
    
    window.applyDesignSettings = applyDesignSettings;
    window.getCurrentDesignSettings = getCurrentDesignSettings;
}

// Initialization - Wait for DOM and setup everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mi Tienda v2.0 - Inicializando aplicación...');
    
    // Wait for Laravel authentication data from parent iframe
    setupLaravelAuthListener();

    // Initialize core application
    initializeApp();
    
    // Load data (will fall back to localStorage if not authenticated)
    updatePreview();
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize design integration
    initializeDesignIntegration();
    
    console.log('Mi Tienda v2.0 - Aplicación inicializada correctamente');
    console.log('Estado inicial:', appState);
});

console.log('Mi Tienda JavaScript Core loaded');
console.log('Compatible with Laravel Blade + Bootstrap 5');