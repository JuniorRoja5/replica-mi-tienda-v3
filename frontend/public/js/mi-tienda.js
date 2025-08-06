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

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadFromStorage();
    updatePreview();
    initializeDragAndDrop();
    setupEventListeners();
});

function initializeApp() {
    console.log('Mi Tienda v2.0 - Aplicación inicializada');
    renderProducts();
    
    // Configurar evento para escuchar mensajes del iframe
    window.addEventListener('message', function(event) {
        if (event.data.type === 'productClick') {
            handleProductClickFromIframe(event.data.productId, event.data.productType);
        } else if (event.data.type === 'openPurchaseModal') {
            // The end user clicks "buy" from the preview (public view)
            // This simulates what would happen at https://domain/u/user
            handlePurchaseFromPublicView(event.data.product);
        }
    });
}

// Handle purchases from public view (iframe preview)
function handlePurchaseFromPublicView(product) {
    // IMPORTANT NOTE: In the real implementation with Laravel:
    // - This modal will appear on the public page: https://domain/u/user
    // - NOT on the builder platform (mi-tienda.html)
    // - The end user will see the modal when clicking "buy" on the public vCard
    
    console.log('🛒 Compra desde vista pública:', product);
    showPurchaseModal(product);
}
function handleProductClickFromIframe(productId, productType) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    if (productType === 'link') {
        // Abrir link externo
        if (product.url) {
            window.open(product.url, '_blank');
        }
    } else if (productType === 'product') {
        // Navigate to product sales page
        const username = appState.profile.username || 'user';
        window.open(`public-product.html?p=${product.id}&u=${username}`, '_blank');
    } else if (productType === 'consultation') {
        // Navigate to consultation page (scheduling)
        const username = appState.profile.username || 'user';
        // NOTE: In Laravel backend, this will be a route like /u/{username}/c/{id} or /consultation/{id}
        window.open(`public-product.html?c=${product.id}&u=${username}`, '_blank');
    } else if (productType === 'course') {
        // Navigate to course page
        const username = appState.profile.username || 'user';
        // NOTE: In Laravel backend, this will be a route like /u/{username}/course/{id} or /courses/{id}
        window.open(`public-product.html?course=${product.id}&u=${username}`, '_blank');
    } else if (productType === 'membership') {
        // Navigate to membership page
        const username = appState.profile.username || 'user';
        // NOTE: In Laravel backend, this will be a route like /u/{username}/membership/{id} or /memberships/{id}
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
        // NOTE: In Laravel backend, this will be replaced by API calls to the database
        // Laravel will handle data persistence without localStorage limitations
        const dataToSave = {
            profile: appState.profile,
            products: appState.products.map(product => {
                // Reduce base64 image size if they are too large
                const productCopy = { ...product };
                if (productCopy.image_url && productCopy.image_url.startsWith('data:image') && productCopy.image_url.length > 50000) {
                    console.warn('Imagen demasiado grande para localStorage, se omitirá en el guardado');
                    productCopy.image_url = ''; // Remover imagen grande temporalmente
                }
                return productCopy;
            })
        };
        
        localStorage.setItem('miTiendaData', JSON.stringify(dataToSave));
        console.log('Datos guardados en localStorage');
    } catch (error) {
        console.error('Error al guardar datos:', error);
        
        if (error.name === 'QuotaExceededError') {
            // Manejar error de cuota excedida
            console.warn('LocalStorage lleno, limpiando datos temporales...');
            
            // Limpiar datos temporales
            localStorage.removeItem('tempProductPreview');
            
            // Try to save without large images
            try {
                const minimalData = {
                    profile: {
                        ...appState.profile,
                        avatar: '' // Remover avatar temporalmente
                    },
                    products: appState.products.map(product => ({
                        ...product,
                        image_url: '' // Remove images temporarily
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

/* === PROFILE UI UPDATE ===
 * LARAVEL INTEGRATION: Connect with User Model
 * Required DB fields: name, username, bio, avatar_url
 * API endpoint: GET /api/profile  
 */
function updateProfileUI() {
    document.getElementById('profileName').textContent = appState.profile.name;
    document.getElementById('profileUsername').textContent = '@' + appState.profile.username;
    document.getElementById('profileBio').textContent = appState.profile.bio;
    
    if (appState.profile.avatar_url) {
        const avatarElement = document.getElementById('profileAvatar');
        avatarElement.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }
    
    // Update public link
    updatePublicLink();
}

function setupEventListeners() {
    // Bio counter
    const bioInput = document.getElementById('bioInput');
    const bioCounter = document.getElementById('bioCounter');
    
    if (bioInput && bioCounter) {
        bioInput.addEventListener('input', function() {
            bioCounter.textContent = this.value.length;
        });
    }

    // Avatar preview
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
    
    // Link image upload
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
                // Reordenar productos en el estado
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;
                
                // Reordenar en el array
                const item = appState.products.splice(oldIndex, 1)[0];
                appState.products.splice(newIndex, 0, item);
                
                // Actualizar sort_order
                appState.products.forEach((product, index) => {
                    product.sort_order = index + 1;
                });
                
                saveToStorage();
                updatePreview();
                showToast('¡Orden actualizado correctamente!');
            }
        });
    }
}

/* === PRODUCT RENDERING ===
 * LARAVEL INTEGRATION: This function should receive products from API
 * Recommended Route: GET /api/products
 * Controller: ProductController@index 
 * Should include: user_id, type, title, price, url, is_active, sort_order
 */
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
    
    // Ordenar productos por sort_order
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
                <button class="btn-action delete" onclick="deleteProduct(${product.id})" title="Eliminar">
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

    // Crear header de vista previa
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

    // Crear vista previa de productos
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

// Handle product clicks in preview
function handleProductClick(productId, productType) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    console.log('Product clicked:', product);
    
    if (productType === 'link') {
        // Open link in new tab
        if (product.url) {
            window.open(product.url, '_blank');
        }
    } else if (productType === 'product') {
        // Navigate to sales page for digital products
        const username = appState.profile.username || 'user';
        const productUrl = `public-product.html?p=${product.id}&u=${username}`;
        
        // NOTE: In Laravel backend, this will be a route like /products/{slug} or /p/{id}
        window.open(productUrl, '_blank');
    } else if (productType === 'consultation') {
        // Navigate to consultation page for booking
        const username = appState.profile.username || 'user';
        const consultationUrl = `public-product.html?c=${product.id}&u=${username}`;
        
        // NOTA: En Laravel backend, esto sería una ruta como /u/{username}/c/{id} o /consultation/{id}
        window.open(consultationUrl, '_blank');
    } else if (productType === 'course') {
        // Navigate to course page
        const username = appState.profile.username || 'user';
        const courseUrl = `public-product.html?course=${product.id}&u=${username}`;
        
        // NOTA: En Laravel backend, esto sería una ruta como /u/{username}/course/{id} o /courses/{id}
        window.open(courseUrl, '_blank');
    } else if (productType === 'membership') {
        // Navigate to membership page
        const username = appState.profile.username || 'user';
        const membershipUrl = `public-product.html?membership=${product.id}&u=${username}`;
        
        // NOTA: En Laravel backend, esto sería una ruta como /u/{username}/membership/{id} o /memberships/{id}
        window.open(membershipUrl, '_blank');
    }
}

function generateSocialIcons() {
    const socialConfig = {
        tiktok: { icon: 'tiktok', color: '#000000', baseUrl: 'https://tiktok.com/@' },
        instagram: { icon: 'instagram', color: '#E4405F', baseUrl: 'https://instagram.com/' },
        youtube: { icon: 'youtube', color: '#FF0000', baseUrl: 'https://youtube.com/@' },
        twitter: { icon: 'twitter', color: '#1DA1F2', baseUrl: 'https://x.com/' },
        facebook: { icon: 'facebook', color: '#1877F2', baseUrl: 'https://facebook.com/' },
        linkedin: { icon: 'linkedin', color: '#0A66C2', baseUrl: 'https://linkedin.com/in/' },
        discord: { icon: 'discord', color: '#5865F2', baseUrl: 'https://discord.com/users/' },
        spotify: { icon: 'spotify', color: '#1DB954', baseUrl: 'https://open.spotify.com/user/' }
    };
    
    let socialIcons = '';
    
    Object.keys(socialConfig).forEach(platform => {
        const username = appState.profile.social_links[platform];
        if (username && username.trim()) {
            const config = socialConfig[platform];
            socialIcons += `
                <a href="${config.baseUrl}${username}" target="_blank" class="preview-social-icon ${platform}" style="background-color: ${config.color};">
                    <i class="bi bi-${config.icon}"></i>
                </a>
            `;
        }
    });
    
    return socialIcons;
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Funciones para modales
function showProfileModal() {
    // En lugar del modal, mostrar la vista superpuesta
    showProfileOverlay();
}

function showProfileOverlay() {
    // Llenar el formulario con los datos actuales
    document.getElementById('overlayNameInput').value = appState.profile.name;
    document.getElementById('overlayUsernameInput').value = appState.profile.username;
    document.getElementById('overlayBioInput').value = appState.profile.bio;
    
    // Llenar redes sociales (solo username)
    document.getElementById('overlayTiktok').value = appState.profile.social_links.tiktok || '';
    document.getElementById('overlayInstagram').value = appState.profile.social_links.instagram || '';
    document.getElementById('overlayYoutube').value = appState.profile.social_links.youtube || '';
    document.getElementById('overlayTwitter').value = appState.profile.social_links.twitter || '';
    document.getElementById('overlayFacebook').value = appState.profile.social_links.facebook || '';
    document.getElementById('overlayLinkedin').value = appState.profile.social_links.linkedin || '';
    document.getElementById('overlayDiscord').value = appState.profile.social_links.discord || '';
    document.getElementById('overlaySpotify').value = appState.profile.social_links.spotify || '';
    
    // Actualizar contador de bio
    document.getElementById('overlayBioCounter').textContent = appState.profile.bio.length;
    
    // Actualizar vista previa del avatar
    updateAvatarPreview();
    
    // Mostrar la vista superpuesta
    document.getElementById('profileOverlay').style.display = 'block';
    
    // Set up listeners for real-time updates
    setupOverlayListeners();
}

function closeProfileOverlay() {
    document.getElementById('profileOverlay').style.display = 'none';
    
    // Remover listeners
    removeOverlayListeners();
}

function updateAvatarPreview() {
    const avatarPreview = document.getElementById('avatarPreviewOverlay');
    if (avatarPreview) {
        if (appState.profile.avatar_url) {
            avatarPreview.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar preview">`;
        } else {
            avatarPreview.innerHTML = '<div class="avatar-placeholder">👤</div>';
        }
    }
}

function setupOverlayListeners() {
    const nameInput = document.getElementById('overlayNameInput');
    const usernameInput = document.getElementById('overlayUsernameInput');
    const bioInput = document.getElementById('overlayBioInput');
    const avatarInput = document.getElementById('overlayAvatarInput');
    const bioCounter = document.getElementById('overlayBioCounter');
    
    // Redes sociales
    const socialInputs = {
        tiktok: document.getElementById('overlayTiktok'),
        instagram: document.getElementById('overlayInstagram'),
        youtube: document.getElementById('overlayYoutube'),
        twitter: document.getElementById('overlayTwitter'),
        facebook: document.getElementById('overlayFacebook'),
        linkedin: document.getElementById('overlayLinkedin'),
        discord: document.getElementById('overlayDiscord'),
        spotify: document.getElementById('overlaySpotify')
    };
    
    // Name - real-time update
    const handleNameChange = function() {
        appState.profile.name = this.value;
        updateProfileUI();
        updatePreview();
    };
    
    // Username - real-time update
    const handleUsernameChange = function() {
        appState.profile.username = this.value;
        updateProfileUI();
        updatePreview();
    };
    
    // Bio - real-time update
    const handleBioChange = function() {
        appState.profile.bio = this.value;
        bioCounter.textContent = this.value.length;
        updateProfileUI();
        updatePreview();
    };
    
    // Avatar - real-time update
    const handleAvatarChange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            appState.profile.avatar_url = e.target.result;
            updateProfileUI();
            updatePreview();
            updateAvatarPreview();
        };
        reader.readAsDataURL(file);
    };
    
    // Social media - real-time update
    const handleSocialChange = function(platform) {
        return function() {
            appState.profile.social_links[platform] = this.value.trim();
            updatePreview();
        };
    };
    
    // Agregar listeners
    nameInput.addEventListener('input', handleNameChange);
    usernameInput.addEventListener('input', handleUsernameChange);
    bioInput.addEventListener('input', handleBioChange);
    avatarInput.addEventListener('change', handleAvatarChange);
    
    // Agregar listeners para redes sociales
    Object.keys(socialInputs).forEach(platform => {
        if (socialInputs[platform]) {
            const handler = handleSocialChange(platform);
            socialInputs[platform].addEventListener('input', handler);
            socialInputs[platform]._socialHandler = handler;
        }
    });
    
    // Save references to be able to remove them later
    nameInput._handleNameChange = handleNameChange;
    usernameInput._handleUsernameChange = handleUsernameChange;
    bioInput._handleBioChange = handleBioChange;
    avatarInput._handleAvatarChange = handleAvatarChange;
}

function removeOverlayListeners() {
    const nameInput = document.getElementById('overlayNameInput');
    const usernameInput = document.getElementById('overlayUsernameInput');
    const bioInput = document.getElementById('overlayBioInput');
    const avatarInput = document.getElementById('overlayAvatarInput');
    
    // Redes sociales
    const socialInputIds = ['overlayTiktok', 'overlayInstagram', 'overlayYoutube', 'overlayTwitter', 'overlayFacebook', 'overlayLinkedin', 'overlayDiscord', 'overlaySpotify'];
    
    if (nameInput && nameInput._handleNameChange) {
        nameInput.removeEventListener('input', nameInput._handleNameChange);
    }
    if (usernameInput && usernameInput._handleUsernameChange) {
        usernameInput.removeEventListener('input', usernameInput._handleUsernameChange);
    }
    if (bioInput && bioInput._handleBioChange) {
        bioInput.removeEventListener('input', bioInput._handleBioChange);
    }
    if (avatarInput && avatarInput._handleAvatarChange) {
        avatarInput.removeEventListener('change', avatarInput._handleAvatarChange);
    }
    
    // Remover listeners de redes sociales
    socialInputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && input._socialHandler) {
            input.removeEventListener('input', input._socialHandler);
        }
    });
}

function saveOverlayProfile() {
    const name = document.getElementById('overlayNameInput').value.trim();
    const username = document.getElementById('overlayUsernameInput').value.trim();
    const bio = document.getElementById('overlayBioInput').value.trim();
    
    if (!name || !username) {
        showToast('Nombre y usuario son obligatorios', 'error');
        return;
    }
    
    // Los datos ya se han actualizado en tiempo real, solo guardar en storage
    saveToStorage();
    
    // Cerrar vista superpuesta
    closeProfileOverlay();
    
    showToast('Perfil actualizado correctamente', 'success');
}

function showCreateModal() {
    // Mostrar modal de selección de tipo de producto
    const modal = new bootstrap.Modal(document.getElementById('productTypeModal'));
    modal.show();
}

function selectProductType(type) {
    // Cerrar modal de selección
    const typeModal = bootstrap.Modal.getInstance(document.getElementById('productTypeModal'));
    typeModal.hide();
    
    // Esperar a que se cierre completamente antes de abrir el siguiente
    setTimeout(() => {
        if (type === 'link') {
            showLinkFormModal();
        } else if (type === 'product') {
            // Mostrar la vista superpuesta de selección de tipo de producto digital
            showProductTypeOverlay();
        }
    }, 300);
}

function showProductTypeOverlay() {
    document.getElementById('productTypeOverlay').style.display = 'block';
}

function closeProductTypeOverlay() {
    document.getElementById('productTypeOverlay').style.display = 'none';
}

// Estado para el formulario de producto Y consultoría
let currentProductTab = 'datos';
let productFormData = {
    title: '',
    subtitle: '',
    description: '',
    price: '',
    discount_price: '',
    has_discount: false,
    image_url: '',
    file_url: '',
    button_text: 'Comprar ahora',
    is_active: true,
    reviews: [],
    custom_fields: [
        { id: 'name', label: 'Nombre completo', type: 'text', required: true },
        { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
    ]
};

// Estado específico para consultoría (nuevo)
let consultationFormData = {
    title: '',
    subtitle: '',
    description: '',
    price: '',
    discount_price: '',
    has_discount: false,
    image_url: '',
    button_text: 'Agendar llamada',
    is_active: true,
    reviews: [],
    custom_fields: [
        { id: 'name', label: 'Nombre completo', type: 'text', required: true },
        { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
    ],
    // CONFIGURACIONES ESPECÍFICAS DE CONSULTORÍA
    availability_settings: {
        call_method: 'google_meet', // google_meet, zoom, custom
        custom_call_link: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        duration: 30, // minutos
        notice_period: { value: 12, unit: 'hours' },
        buffer_time: { before: 15, after: 15 },
        booking_window: 60, // días
        weekly_availability: [
            { day: 'sunday', name: 'Domingo', enabled: false, intervals: [] },
            { day: 'monday', name: 'Lunes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'tuesday', name: 'Martes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'wednesday', name: 'Miércoles', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'thursday', name: 'Jueves', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'friday', name: 'Viernes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'saturday', name: 'Sábado', enabled: false, intervals: [] }
        ]
    }
};

// Estado específico para curso digital (nuevo)
let courseFormData = {
    title: '',
    subtitle: '',
    description: '',
    price: '',
    discount_price: '',
    has_discount: false,
    image_url: '',
    button_text: 'Empezar curso',
    is_active: true,
    reviews: [],
    custom_fields: [
        { id: 'name', label: 'Nombre completo', type: 'text', required: true },
        { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
    ],
    // CONFIGURACIONES ESPECÍFICAS DE CURSO
    course_content: {
        header_image_url: '',
        title: '',
        description: '',
        modules: [
            { 
                id: 'm_' + Date.now() + '_1', 
                title: 'Introducción', 
                lessons: [
                    { 
                        id: 'l_' + Date.now() + '_1', 
                        title: 'Bienvenida al curso', 
                        description: 'En esta lección te damos la bienvenida y explicamos cómo navegar el curso.', 
                        video_url: '', 
                        attachments: [] 
                    }
                ] 
            },
            { 
                id: 'm_' + Date.now() + '_2', 
                title: 'Capítulo 1', 
                lessons: [] 
            },
            { 
                id: 'm_' + Date.now() + '_3', 
                title: 'Capítulo 2', 
                lessons: [] 
            }
        ]
    }
};

// Estado global para formulario de membresía recurrente
let membershipFormData = {
    title: '',
    subtitle: '',
    description: '',
    price: '',
    discount_price: '',
    has_discount: false,
    image_url: '',
    button_text: 'Subscribirse',
    is_active: true,
    reviews: [],
    custom_fields: [
        { id: 'name', label: 'Nombre completo', type: 'text', required: true },
        { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
    ],
    billing_settings: {
        frequency: 'monthly',
        has_end_date: false,
        end_after_months: 12
    }
};

function selectDigitalProductType(productType) {
    // Cerrar la vista superpuesta de selección de tipo
    closeProductTypeOverlay();
    
    // Mostrar el formulario específico según el tipo
    if (productType === 'digital_product') {
        showProductFormOverlay();
    } else if (productType === 'consultation') {
        showConsultationFormOverlay();
    } else if (productType === 'course') {
        showCourseFormOverlay();
    } else if (productType === 'membership') {
        showMembershipFormOverlay();
    } else {
        // Para otros tipos, mostrar mensaje temporal
        const typeNames = {
            membership: 'Membresía Recurrente'
        };
        showToast(`Creando ${typeNames[productType]}... (próximamente)`, 'info');
    }
}

function showProductFormOverlay() {
    // Resetear formulario
    resetProductForm();
    
    // Mostrar el overlay
    document.getElementById('productFormOverlay').style.display = 'block';
    
    // Configurar tab inicial
    currentProductTab = 'datos';
    showTab('datos');
    
    // Configurar event listeners
    setupProductFormListeners();
    
    // Activar preview inmediatamente
    updatePreviewWithProduct();
}

function closeProductFormOverlay() {
    document.getElementById('productFormOverlay').style.display = 'none';
    removeProductFormListeners();
    
    // Limpiar datos temporales de preview
    localStorage.removeItem('tempProductPreview');
    
    // Volver al preview normal del perfil
    updatePreview();
}

function resetProductForm() {
    productFormData = {
        title: '',
        subtitle: '',
        description: '',
        price: '',
        discount_price: '',
        has_discount: false,
        image_url: '',
        file_url: '',
        button_text: 'Comprar ahora',
        is_active: true,
        reviews: [],
        custom_fields: [
            { id: 'name', label: 'Nombre completo', type: 'text', required: true },
            { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
        ]
    };
    
    // Limpiar formularios
    document.getElementById('productTitle').value = '';
    document.getElementById('productSubtitle').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('discountPrice').value = '';
    document.getElementById('hasDiscount').checked = false;
    document.getElementById('buttonText').value = 'Comprar ahora';
    document.getElementById('isActive').checked = true;
    
    // Resetear imagen
    document.getElementById('productImagePreview').innerHTML = `
        <div class="product-image-placeholder">
            <i class="bi bi-box-seam"></i>
        </div>
    `;
    
    // Resetear archivo
    document.getElementById('fileUploadArea').style.display = 'block';
    document.getElementById('fileUploadSuccess').style.display = 'none';
    
    // Resetear contadores
    document.getElementById('titleCounter').textContent = '0';
    document.getElementById('subtitleCounter').textContent = '0';
    
    // Resetear reseñas
    document.getElementById('reviewsList').innerHTML = `
        <div class="text-muted text-center py-3">
            <i class="bi bi-star display-6"></i>
            <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
        </div>
    `;
}

function setupProductFormListeners() {
    // Títulos con actualización en tiempo real
    const titleInput = document.getElementById('productTitle');
    const subtitleInput = document.getElementById('productSubtitle');
    const descriptionInput = document.getElementById('productDescription');
    const priceInput = document.getElementById('productPrice');
    const discountPriceInput = document.getElementById('discountPrice');
    const hasDiscountInput = document.getElementById('hasDiscount');
    const buttonTextInput = document.getElementById('buttonText');
    const isActiveInput = document.getElementById('isActive');
    
    // Event listeners para actualización en tiempo real
    titleInput.addEventListener('input', function() {
        productFormData.title = this.value;
        document.getElementById('titleCounter').textContent = this.value.length;
        updatePreviewWithProduct();
    });
    
    subtitleInput.addEventListener('input', function() {
        productFormData.subtitle = this.value;
        document.getElementById('subtitleCounter').textContent = this.value.length;
        updatePreviewWithProduct();
    });
    
    descriptionInput.addEventListener('input', function() {
        productFormData.description = this.value;
        updatePreviewWithProduct();
    });
    
    priceInput.addEventListener('input', function() {
        productFormData.price = this.value;
        updatePreviewWithProduct();
    });
    
    discountPriceInput.addEventListener('input', function() {
        productFormData.discount_price = this.value;
        updatePreviewWithProduct();
    });
    
    hasDiscountInput.addEventListener('change', function() {
        productFormData.has_discount = this.checked;
        document.getElementById('discountPrice').style.display = this.checked ? 'block' : 'none';
        updatePreviewWithProduct();
    });
    
    buttonTextInput.addEventListener('input', function() {
        productFormData.button_text = this.value;
        updatePreviewWithProduct();
    });
    
    isActiveInput.addEventListener('change', function() {
        productFormData.is_active = this.checked;
        updatePreviewWithProduct();
    });
    
    // Navegación de tabs
    document.querySelectorAll('#productTabs button').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Upload de imagen
    document.getElementById('productImageInput').addEventListener('change', handleProductImageUpload);
    
    // Upload de archivo
    document.getElementById('productFileInput').addEventListener('change', handleProductFileUpload);
}

function removeProductFormListeners() {
    // Remover listeners si es necesario
    const titleInput = document.getElementById('productTitle');
    const subtitleInput = document.getElementById('productSubtitle');
    
    if (titleInput) {
        const newTitleInput = titleInput.cloneNode(true);
        titleInput.parentNode.replaceChild(newTitleInput, titleInput);
    }
    
    if (subtitleInput) {
        const newSubtitleInput = subtitleInput.cloneNode(true);
        subtitleInput.parentNode.replaceChild(newSubtitleInput, subtitleInput);
    }
}

function showTab(tabName) {
    currentProductTab = tabName;
    
    // Actualizar navegación de tabs
    document.querySelectorAll('#productTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Mostrar panel correspondiente
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(`${tabName}-panel`).style.display = 'block';
    
    // Actualizar botones de navegación
    updateTabNavigation();
}

function updateTabNavigation() {
    const prevBtn = document.getElementById('prevTabBtn');
    const nextBtn = document.getElementById('nextTabBtn');
    const createBtn = document.getElementById('createProductBtn');
    
    switch(currentProductTab) {
        case 'datos':
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'contenido':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'opciones':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'none';
            createBtn.style.display = 'block';
            
            // Verificar si estamos en modo edición
            if (productFormData.id) {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Producto';
                createBtn.onclick = function() {
                    updateExistingProduct();
                };
            } else {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Crear Producto';
                createBtn.onclick = function() {
                    createProduct();
                };
            }
            break;
    }
}

function nextTab() {
    switch(currentProductTab) {
        case 'datos':
            showTab('contenido');
            break;
        case 'contenido':
            showTab('opciones');
            break;
    }
}

function previousTab() {
    switch(currentProductTab) {
        case 'contenido':
            showTab('datos');
            break;
        case 'opciones':
            showTab('contenido');
            break;
    }
}

function handleProductImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        productFormData.image_url = e.target.result;
        document.getElementById('productImagePreview').innerHTML = `
            <img src="${e.target.result}" alt="Imagen del producto">
        `;
        updatePreviewWithProduct();
        showToast('¡Imagen subida correctamente!', 'success');
    };
    reader.readAsDataURL(file);
}

function handleProductFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Simular subida de archivo
    productFormData.file_url = file.name; // En producción sería una URL real
    
    // Mostrar archivo subido
    document.getElementById('fileUploadArea').style.display = 'none';
    document.getElementById('fileUploadSuccess').style.display = 'block';
    document.getElementById('uploadedFileName').textContent = file.name;
    
    showToast('¡Archivo subido correctamente!', 'success');
}

function removeUploadedFile() {
    productFormData.file_url = '';
    document.getElementById('fileUploadArea').style.display = 'block';
    document.getElementById('fileUploadSuccess').style.display = 'none';
    document.getElementById('productFileInput').value = '';
}

function generateAIDescription() {
    const title = productFormData.title || 'producto digital';
    const description = `Este ${title.toLowerCase()} le enseñará todo lo que necesita saber para alcanzar sus metas. Es la guía ideal si usted está buscando:

**Beneficios principales:**
- Alcanzar sus sueños y objetivos
- Encontrar propósito en su trabajo
- Mejorar sus finanzas personales  
- Ser más feliz y productivo

**Lo que aprenderá:**
- Estrategias probadas y efectivas
- Herramientas prácticas para implementar
- Casos de estudio reales
- Plantillas y recursos adicionales

¡Empiece hoy mismo y transforme su vida!`;

    document.getElementById('productDescription').value = description;
    productFormData.description = description;
    updatePreviewWithProduct();
    showToast('¡Descripción generada con IA!', 'success');
}

function addReview() {
    const newReview = {
        id: Date.now(),
        customer_name: '',
        rating: 5,
        comment: ''
    };
    
    productFormData.reviews.push(newReview);
    renderReviews();
}

function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    
    if (productFormData.reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-muted text-center py-3">
                <i class="bi bi-star display-6"></i>
                <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = productFormData.reviews.map((review, index) => `
        <div class="review-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <input type="text" class="form-control form-control-sm" 
                       placeholder="Nombre del cliente" 
                       value="${review.customer_name}"
                       onchange="updateReview(${index}, 'customer_name', this.value)">
                <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="removeReview(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <div class="review-stars">
                    ${[1,2,3,4,5].map(star => `
                        <i class="bi bi-star${star <= review.rating ? '-fill' : ''}" 
                           onclick="updateReview(${index}, 'rating', ${star})" 
                           style="cursor: pointer;"></i>
                    `).join('')}
                </div>
            </div>
            <textarea class="form-control form-control-sm" 
                      placeholder="Comentario de la reseña..." 
                      rows="2"
                      onchange="updateReview(${index}, 'comment', this.value)">${review.comment}</textarea>
        </div>
    `).join('');
}

function updateReview(index, field, value) {
    if (productFormData.reviews[index]) {
        productFormData.reviews[index][field] = value;
        updatePreviewWithProduct();
    }
}

function removeReview(index) {
    productFormData.reviews.splice(index, 1);
    renderReviews();
    updatePreviewWithProduct();
}

function addCustomField() {
    const newField = {
        id: Date.now(),
        label: '',
        type: 'text',
        required: false
    };
    
    productFormData.custom_fields.push(newField);
    renderCustomFields();
}

function renderCustomFields() {
    const customFieldsList = document.getElementById('customFieldsList');
    
    customFieldsList.innerHTML = productFormData.custom_fields.map((field, index) => {
        if (field.id === 'name' || field.id === 'email') {
            // Campos por defecto (readonly)
            return `
                <div class="custom-field-item mb-2">
                    <div class="d-flex gap-2 align-items-center">
                        <input type="text" class="form-control" value="${field.label}" readonly>
                        <select class="form-select" disabled style="max-width: 120px;">
                            <option>${field.type === 'email' ? 'Email' : 'Texto'}</option>
                        </select>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" checked disabled>
                            <label class="form-check-label small">Obligatorio</label>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Campos personalizados
            return `
                <div class="custom-field-item mb-2">
                    <div class="d-flex gap-2 align-items-center">
                        <input type="text" class="form-control" placeholder="Etiqueta del campo" 
                               value="${field.label}"
                               onchange="updateCustomField(${index}, 'label', this.value)">
                        <select class="form-select" style="max-width: 120px;" 
                                onchange="updateCustomField(${index}, 'type', this.value)">
                            <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
                            <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                            <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>Teléfono</option>
                        </select>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" 
                                   ${field.required ? 'checked' : ''}
                                   onchange="updateCustomField(${index}, 'required', this.checked)">
                            <label class="form-check-label small">Obligatorio</label>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeCustomField(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function updateCustomField(index, field, value) {
    if (productFormData.custom_fields[index]) {
        productFormData.custom_fields[index][field] = value;
    }
}

function removeCustomField(index) {
    // No permitir remover campos por defecto
    if (productFormData.custom_fields[index].id === 'name' || productFormData.custom_fields[index].id === 'email') {
        return;
    }
    
    productFormData.custom_fields.splice(index, 1);
    renderCustomFields();
}

function updatePreviewWithProduct() {
    if (!productFormData || !productFormData.title) {
        // Si no hay datos del producto, mostrar preview normal
        updatePreview();
        return;
    }

    // Durante la edición del producto, mostrar la página de ventas simulada en el preview
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) {
        console.warn('Preview content element not found');
        return;
    }
    
    const username = appState.profile.username || 'usuario';
    const profileName = appState.profile.name || 'Tu Nombre';
    const profileAvatar = appState.profile.avatar || '';
    
    // Crear una versión temporal del producto para preview
    const tempProduct = {
        id: productFormData.id || 'preview',
        type: 'product',
        title: productFormData.title || 'Nuevo Producto Digital',
        subtitle: productFormData.subtitle || '',
        description: productFormData.description || '',
        price: parseFloat(productFormData.price) || 0,
        discount_price: productFormData.has_discount ? (parseFloat(productFormData.discount_price) || 0) : 0,
        has_discount: productFormData.has_discount,
        image_url: productFormData.image_url || '',
        file_url: productFormData.file_url || '',
        button_text: productFormData.button_text || 'Comprar ahora',
        is_active: productFormData.is_active !== false,
        reviews: productFormData.reviews || [],
        custom_fields: productFormData.custom_fields || []
    };
    
    // Mostrar la página de ventas del producto en lugar del perfil general
    const displayPrice = tempProduct.has_discount && tempProduct.discount_price > 0 
        ? tempProduct.discount_price 
        : tempProduct.price;
    const originalPrice = tempProduct.has_discount && tempProduct.discount_price > 0 
        ? tempProduct.price 
        : null;
    
    // Generar reseñas válidas
    const validReviews = (tempProduct.reviews || []).filter(review => 
        review.customer_name && review.customer_name.trim() !== '' && 
        review.comment && review.comment.trim() !== ''
    );
    
    const reviewsHTML = validReviews.length > 0 ? validReviews.map(review => {
        const stars = Array.from({length: 5}, (_, i) => 
            `<span style="color: #ffc107;">${i < review.rating ? '★' : '☆'}</span>`
        ).join('');
        
        return `
            <div style="background: #2a2a2a; padding: 1rem; border-radius: 0.75rem; margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600; font-size: 0.9rem; color: white;">${review.customer_name}</span>
                    <div style="font-size: 0.85rem;">${stars}</div>
                </div>
                <p style="color: #a0a0a0; font-size: 0.9rem; margin: 0;">${review.comment}</p>
            </div>
        `;
    }).join('') : '';
    
    // HTML de la página de ventas simulada
    previewContent.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            overflow-y: auto;
        ">
            <!-- Header con botón de regreso -->
            <div style="
                position: sticky;
                top: 0;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid #333;
                padding: 1rem;
                z-index: 10;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #a0a0a0;
                    font-size: 0.95rem;
                    cursor: pointer;
                ">
                    <i class="bi bi-arrow-left"></i>
                    <span>Volver al perfil</span>
                </div>
            </div>

            <!-- Contenido del producto -->
            <div style="padding: 2rem 1.5rem; padding-bottom: 80px;">
                <!-- Imagen del producto -->
                ${tempProduct.image_url ? `
                    <div style="width: 100%; height: 200px; border-radius: 1rem; overflow: hidden; margin-bottom: 2rem; background: #2a2a2a; display: flex; align-items: center; justify-content: center;">
                        <img src="${tempProduct.image_url}" alt="${tempProduct.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                ` : `
                    <div style="width: 100%; height: 200px; border-radius: 1rem; background: #2a2a2a; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; color: #666; font-size: 3rem;">
                        <i class="bi bi-box-seam"></i>
                    </div>
                `}

                <!-- Información del producto -->
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.2;">
                        ${tempProduct.title}
                    </h1>
                    
                    ${tempProduct.subtitle ? `
                        <p style="font-size: 1.1rem; color: #a0a0a0; margin-bottom: 1.5rem; line-height: 1.4;">
                            ${tempProduct.subtitle}
                        </p>
                    ` : ''}
                </div>

                <!-- Precio -->
                ${tempProduct.price > 0 ? `
                    <div style="margin-bottom: 2rem;">
                        <span style="font-size: 2rem; font-weight: 700; color: #10b981;">
                            $${displayPrice}
                        </span>
                        ${originalPrice ? `
                            <span style="font-size: 1.2rem; color: #666; text-decoration: line-through; margin-left: 1rem; vertical-align: top; margin-top: 0.5rem; display: inline-block;">
                                $${originalPrice}
                            </span>
                            <span style="background: #dc2626; color: white; font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 2rem; font-weight: 600; margin-left: 1rem; vertical-align: top; margin-top: 0.75rem; display: inline-block;">
                                -${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                            </span>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Descripción -->
                ${tempProduct.description ? `
                    <div style="line-height: 1.6; color: #d0d0d0; margin-bottom: 2rem; white-space: pre-line;">
                        ${tempProduct.description}
                    </div>
                ` : ''}

                <!-- Reseñas -->
                ${reviewsHTML ? `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="bi bi-star-fill" style="color: #fbbf24;"></i>
                            Reseñas de clientes
                        </h3>
                        ${reviewsHTML}
                    </div>
                ` : ''}

                <!-- Botón de compra integrado (no fixed) -->
                <div style="
                    background: rgba(26, 26, 26, 0.95);
                    border-top: 1px solid #333;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-top: 2rem;
                ">
                    <button style="
                        width: 100%;
                        background: #8b5cf6;
                        border: none;
                        color: white;
                        font-size: 1rem;
                        font-weight: 600;
                        padding: 0.875rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    " onclick="parent.postMessage({type: 'openPurchaseModal', product: ${JSON.stringify(tempProduct).replace(/"/g, '&quot;')}}, '*')">
                        <i class="bi bi-cart-plus"></i>
                        <span>${tempProduct.button_text || (tempProduct.price > 0 ? `Comprar por $${displayPrice}` : 'Obtener Gratis')}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function saveAsDraft() {
    if (!productFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    const draftProduct = createProductFromForm();
    draftProduct.is_active = false;
    
    appState.products.push(draftProduct);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeProductFormOverlay();
    showToast('¡Borrador guardado correctamente!', 'success');
}

function createProduct() {
    if (!productFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    if (!productFormData.price || parseFloat(productFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }
    
    const newProduct = createProductFromForm();
    
    appState.products.push(newProduct);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeProductFormOverlay();
    showToast('¡Producto creado correctamente!', 'success');
}

// Variables globales para el modal de compras
let currentPurchaseProduct = null;

// Función global para manejar compras desde el preview
window.handleProductPurchase = function() {
    if (productFormData && productFormData.title) {
        const product = productFormData;
        showPurchaseModal(product);
    }
};

// Mostrar modal de compra basado en PurchaseModal.jsx del código React original
function showPurchaseModal(product) {
    // ARQUITECTURA DE COMPRAS EN PRODUCCIÓN:
    // 
    // 1. PLATAFORMA DE CONSTRUCCIÓN (mi-tienda.html):
    //    - Solo para configurar productos
    //    - El creador ve el preview de cómo se verá su vCard
    //
    // 2. VISTA PÚBLICA (https://dominio/u/usuario):
    //    - Aquí es donde aparecerá este modal de compras
    //    - Los usuarios finales harán clic en "comprar"
    //    - Procesamiento real con Stripe + Laravel
    //
    // NOTA: Este modal está temporalmente en mi-tienda.html para demo,
    // pero en producción estará integrado en la vista pública de cada usuario.
    
    currentPurchaseProduct = product;
    
    // Poblar datos del producto en el modal
    populateProductSummary(product);
    
    // Resetear estados del modal
    resetModalStates();
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
    modal.show();
    
    // Configurar event listener del formulario
    setupPurchaseFormListeners();
}

function populateProductSummary(product) {
    const displayPrice = product.has_discount && product.discount_price > 0 
        ? product.discount_price 
        : (product.price || 0);
    const originalPrice = product.has_discount && product.discount_price > 0 
        ? product.price 
        : null;

    // Título del producto
    document.getElementById('productTitleSummary').textContent = product.title || 'Producto Digital';
    
    // Descripción
    const description = product.subtitle || product.description || 'Descripción del producto';
    document.getElementById('productDescriptionSummary').textContent = 
        description.length > 80 ? description.substring(0, 80) + '...' : description;
    
    // Precio
    const priceElement = document.getElementById('productPriceSummary');
    if (originalPrice) {
        priceElement.innerHTML = `
            <span style="color: #10b981; font-size: 1.75rem;">$${displayPrice}</span>
            <span style="color: #6b7280; text-decoration: line-through; font-size: 1rem; margin-left: 0.5rem;">$${originalPrice}</span>
        `;
    } else {
        priceElement.textContent = `$${displayPrice}`;
    }
    
    // Imagen del producto
    const imageContainer = document.getElementById('productImageSummary');
    if (product.image_url) {
        imageContainer.innerHTML = `<img src="${product.image_url}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;">`;
    } else {
        imageContainer.innerHTML = '<i class="bi bi-box-seam text-white" style="font-size: 2rem;"></i>';
    }
    
    // Texto del botón de compra
    const buttonText = product.price > 0 ? `Pagar Ahora $${displayPrice}` : 'Obtener Gratis';
    document.getElementById('purchaseButtonText').textContent = buttonText;
    
    // Generar campos personalizados si existen
    generateCustomFields(product.custom_fields || []);
}

function generateCustomFields(customFields) {
    const container = document.getElementById('customFieldsContainer');
    container.innerHTML = '';
    
    // Filtrar solo campos que no sean nombre y email (ya están en el formulario principal)
    const additionalFields = customFields.filter(field => 
        field.id !== 'name' && field.id !== 'email' && field.label.trim() !== ''
    );
    
    if (additionalFields.length === 0) return;
    
    // Título para campos adicionales
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-3';
    titleDiv.innerHTML = '<h6 class="text-white fw-semibold mb-3"><i class="bi bi-clipboard-data me-2"></i>Información Adicional</h6>';
    container.appendChild(titleDiv);
    
    // Generar campos
    const fieldsRow = document.createElement('div');
    fieldsRow.className = 'row g-3';
    
    additionalFields.forEach(field => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'col-md-6';
        
        const isRequired = field.required ? 'required' : '';
        const placeholder = getFieldPlaceholder(field.type, field.label);
        
        fieldDiv.innerHTML = `
            <label class="form-label text-white fw-semibold">
                <i class="bi bi-${getFieldIcon(field.type)} me-2"></i>
                ${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <input type="${field.type}" class="form-control custom-field" 
                   data-field-id="${field.id}"
                   ${isRequired}
                   style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 0.5rem;"
                   placeholder="${placeholder}">
        `;
        
        fieldsRow.appendChild(fieldDiv);
    });
    
    container.appendChild(fieldsRow);
}

function getFieldPlaceholder(type, label) {
    switch(type) {
        case 'email': return 'correo@ejemplo.com';
        case 'tel': return '+1 234 567 8900';
        case 'url': return 'https://ejemplo.com';
        default: return `Ingresa tu ${label.toLowerCase()}`;
    }
}

function getFieldIcon(type) {
    switch(type) {
        case 'email': return 'envelope';
        case 'tel': return 'telephone';
        case 'url': return 'link-45deg';
        default: return 'pencil';
    }
}

function resetModalStates() {
    // Mostrar formulario, ocultar estados de procesamiento y éxito
    document.getElementById('purchaseForm').style.display = 'block';
    document.getElementById('processingState').style.display = 'none';
    document.getElementById('successState').style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('customerForm').reset();
}

function setupPurchaseFormListeners() {
    const form = document.getElementById('customerForm');
    
    // Remover listener previo si existe
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Añadir nuevo listener
    document.getElementById('customerForm').addEventListener('submit', handlePurchaseSubmit);
}

async function handlePurchaseSubmit(e) {
    e.preventDefault();
    
    if (!currentPurchaseProduct) return;
    
    // Recopilar datos del formulario
    const customerData = {
        name: document.getElementById('customerName').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        customFields: {}
    };
    
    // Recopilar campos personalizados
    document.querySelectorAll('.custom-field').forEach(field => {
        const fieldId = field.getAttribute('data-field-id');
        customerData.customFields[fieldId] = field.value.trim();
    });
    
    // Validar campos requeridos
    if (!customerData.name || !customerData.email) {
        showToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Cambiar a estado de procesamiento
    showProcessingState();
    
    try {
        // TODO: Laravel Backend Integration
        // Esta simulación será reemplazada por integración real con Stripe
        // Endpoints necesarios:
        // 1. POST /api/stripe/create-payment-intent - Crear intención de pago
        // 2. POST /api/orders/create - Crear orden en DB
        // 3. Webhook: POST /api/stripe/webhook - Confirmar pago
        // 4. POST /api/orders/deliver - Entregar producto automáticamente
        
        // Simular procesamiento (2 segundos como en el código React original)
        await simulatePaymentProcessing(customerData);
        
        // Mostrar estado de éxito con confeti
        showSuccessState();
        
    } catch (error) {
        console.error('Error procesando compra:', error);
        showPurchaseError('Error procesando la compra. Por favor intenta nuevamente.');
    }
}

function showProcessingState() {
    document.getElementById('purchaseForm').style.display = 'none';
    document.getElementById('processingState').style.display = 'block';
    document.getElementById('successState').style.display = 'none';
}

function showSuccessState() {
    document.getElementById('purchaseForm').style.display = 'none';
    document.getElementById('processingState').style.display = 'none';
    document.getElementById('successState').style.display = 'block';
    
    // ¡ANIMACIÓN DE CONFETI! 🎉
    launchConfetti();
}

function showPurchaseError(message) {
    // Volver al formulario
    document.getElementById('purchaseForm').style.display = 'block';
    document.getElementById('processingState').style.display = 'none';
    document.getElementById('successState').style.display = 'none';
    
    showToast(message, 'error');
}

async function simulatePaymentProcessing(customerData) {
    return new Promise((resolve, reject) => {
        // Simulación del procesamiento de pago
        // En producción, esto será reemplazado por:
        // 1. Stripe.js para procesar el pago
        // 2. Confirmación vía webhook
        // 3. Creación de orden en base de datos
        // 4. Envío automático de email con descarga
        
        setTimeout(() => {
            // Simular éxito del pago
            const success = Math.random() > 0.1; // 90% de éxito para demo
            
            if (success) {
                console.log('Compra procesada exitosamente:', {
                    product: currentPurchaseProduct.title,
                    customer: customerData.name,
                    amount: currentPurchaseProduct.price,
                    timestamp: new Date().toISOString()
                });
                resolve();
            } else {
                reject(new Error('Pago rechazado'));
            }
        }, 2000);
    });
}

// 🎉 FUNCIÓN DE CONFETI
function launchConfetti() {
    // Configuración de confeti similar a celebraciones de éxito
    const duration = 3000; // 3 segundos
    const animationEnd = Date.now() + duration;
    const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 9999,
        colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Múltiples ráfagas de confeti
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Desde el lado izquierdo
        confetti(Object.assign({}, defaults, { 
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        
        // Desde el lado derecho  
        confetti(Object.assign({}, defaults, { 
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
        
        // Desde el centro (más intenso)
        confetti(Object.assign({}, defaults, { 
            particleCount: particleCount * 2,
            origin: { x: randomInRange(0.4, 0.6), y: randomInRange(0.1, 0.3) }
        }));
    }, 250);

    // Confeti adicional inmediato para impacto inicial
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981']
    });
    
    console.log('🎉 ¡Confeti lanzado! ¡Compra exitosa!');
}

function createProductFromForm() {
    return {
        id: Date.now(),
        type: 'product',
        title: productFormData.title.trim(),
        subtitle: productFormData.subtitle.trim(),
        description: productFormData.description.trim(),
        price: parseFloat(productFormData.price) || 0,
        discount_price: productFormData.has_discount ? (parseFloat(productFormData.discount_price) || 0) : 0,
        has_discount: productFormData.has_discount,
        image_url: productFormData.image_url,
        file_url: productFormData.file_url,
        button_text: productFormData.button_text,
        is_active: productFormData.is_active,
        reviews: [...productFormData.reviews],
        custom_fields: [...productFormData.custom_fields],
        status: productFormData.is_active ? 'active' : 'inactive',
        sales: 0,
        sort_order: appState.products.length + 1,
        created_at: new Date().toISOString()
    };
}

function showLinkFormModal() {
    // Resetear formulario
    document.getElementById('linkForm').reset();
    document.getElementById('linkImagePreview').innerHTML = '<i class="bi bi-image image-preview-icon"></i>';
    document.getElementById('linkActive').checked = true;
    document.getElementById('linkTitle').placeholder = 'Se extraerá automáticamente del enlace';
    
    const modal = new bootstrap.Modal(document.getElementById('linkFormModal'));
    
    // Setup URL change listener after modal is shown
    modal._element.addEventListener('shown.bs.modal', function() {
        const urlInput = document.getElementById('linkUrl');
        
        // Remove existing listeners
        const newUrlInput = urlInput.cloneNode(true);
        urlInput.parentNode.replaceChild(newUrlInput, urlInput);
        
        // Add new listener
        newUrlInput.addEventListener('input', debounce(handleUrlChange, 1000));
    });
    
    modal.show();
}
async function extractMetadataFromUrl(url) {
    try {
        // Validar URL
        const urlObj = new URL(url);
        const domain = urlObj.hostname.toLowerCase();
        
        // Base de datos de sitios conocidos para simular extracción automática
        const knownSites = {
            'instagram.com': {
                title: 'Instagram',
                favicon: 'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png'
            },
            'www.instagram.com': {
                title: 'Instagram',
                favicon: 'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png'
            },
            'youtube.com': {
                title: 'YouTube',
                favicon: 'https://www.youtube.com/s/desktop/12d6b690/img/favicon_32x32.png'
            },
            'www.youtube.com': {
                title: 'YouTube',
                favicon: 'https://www.youtube.com/s/desktop/12d6b690/img/favicon_32x32.png'
            },
            'tiktok.com': {
                title: 'TikTok',
                favicon: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.ico'
            },
            'www.tiktok.com': {
                title: 'TikTok',
                favicon: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.ico'
            },
            'twitter.com': {
                title: 'Twitter',
                favicon: 'https://abs.twimg.com/favicons/twitter.2.ico'
            },
            'x.com': {
                title: 'X (Twitter)',
                favicon: 'https://abs.twimg.com/favicons/twitter.2.ico'
            },
            'facebook.com': {
                title: 'Facebook',
                favicon: 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico'
            },
            'www.facebook.com': {
                title: 'Facebook',
                favicon: 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico'
            },
            'linkedin.com': {
                title: 'LinkedIn',
                favicon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca'
            },
            'www.linkedin.com': {
                title: 'LinkedIn',
                favicon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca'
            },
            'spotify.com': {
                title: 'Spotify',
                favicon: 'https://www.spotify.com/favicon.ico'
            },
            'open.spotify.com': {
                title: 'Spotify',
                favicon: 'https://www.spotify.com/favicon.ico'
            },
            'github.com': {
                title: 'GitHub',
                favicon: 'https://github.com/favicon.ico'
            },
            'google.com': {
                title: 'Google',
                favicon: 'https://www.google.com/favicon.ico'
            },
            'www.google.com': {
                title: 'Google',
                favicon: 'https://www.google.com/favicon.ico'
            }
        };
        
        // Buscar en sitios conocidos
        if (knownSites[domain]) {
            return knownSites[domain];
        }
        
        // Para sitios no conocidos, generar título basado en el dominio
        const cleanDomain = domain.replace('www.', '');
        const title = cleanDomain.split('.')[0];
        const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
        
        return {
            title: capitalizedTitle,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
        };
        
    } catch (error) {
        console.error('Error extrayendo metadatos:', error);
        return null;
    }
}

// Función para manejar cambios en la URL
async function handleUrlChange(event) {
    const url = event.target.value.trim();
    const titleInput = document.getElementById('linkTitle');
    const imagePreview = document.getElementById('linkImagePreview');
    
    if (!url || !isValidUrl(url)) {
        // Resetear campos si URL no es válida
        titleInput.value = '';
        titleInput.placeholder = 'Se extraerá automáticamente del enlace';
        imagePreview.innerHTML = '<i class="bi bi-image image-preview-icon"></i>';
        return;
    }
    
    // Mostrar indicador de carga
    titleInput.placeholder = 'Extrayendo información...';
    imagePreview.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>';
    
    try {
        const metadata = await extractMetadataFromUrl(url);
        
        if (metadata) {
            // Solo actualizar si el campo está vacío (no ha sido editado manualmente)
            if (!titleInput.value) {
                titleInput.value = metadata.title;
            }
            
            // Actualizar imagen
            if (metadata.favicon) {
                const img = new Image();
                img.onload = function() {
                    imagePreview.innerHTML = `
                        <img src="${metadata.favicon}" alt="Favicon" 
                             style="max-width: 100%; max-height: 100px; object-fit: contain;">
                    `;
                };
                img.onerror = function() {
                    // Si falla la carga del favicon, usar ícono por defecto
                    imagePreview.innerHTML = '<i class="bi bi-link-45deg image-preview-icon text-primary"></i>';
                };
                img.src = metadata.favicon;
            }
            
            // Mostrar notificación de éxito
            showAutoExtractNotification('¡Información extraída correctamente!');
        } else {
            throw new Error('No se pudo extraer información');
        }
        
    } catch (error) {
        console.error('Error al extraer metadatos:', error);
        titleInput.placeholder = 'Título del enlace';
        imagePreview.innerHTML = '<i class="bi bi-link-45deg image-preview-icon text-secondary"></i>';
        showAutoExtractNotification('No se pudo extraer información automáticamente', 'warning');
    }
}

// Función para mostrar notificación de auto-extracción
function showAutoExtractNotification(message, type = 'success') {
    const noticeElement = document.querySelector('.auto-extract-notice span');
    if (noticeElement) {
        const originalText = noticeElement.textContent;
        noticeElement.textContent = message;
        
        if (type === 'warning') {
            noticeElement.parentElement.style.backgroundColor = '#fff3cd';
            noticeElement.parentElement.style.borderColor = '#ffeaa7';
            noticeElement.style.color = '#856404';
        } else {
            noticeElement.parentElement.style.backgroundColor = '#d4edda';
            noticeElement.parentElement.style.borderColor = '#c3e6cb';
            noticeElement.style.color = '#155724';
        }
        
        // Restaurar texto original después de 3 segundos
        setTimeout(() => {
            noticeElement.textContent = originalText;
            noticeElement.parentElement.style.backgroundColor = '#fff3cd';
            noticeElement.parentElement.style.borderColor = '#ffeaa7';
            noticeElement.style.color = '#856404';
        }, 3000);
    }
}

// Función debounce para evitar múltiples llamadas
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

/* === SAVE LINK PRODUCT ===
 * LARAVEL INTEGRATION: 
 * - Replace with POST /api/products
 * - Add CSRF token: headers['X-CSRF-TOKEN']
 * - Validation in ProductController
 * - Return JSON with created product
 */
function saveLinkProduct() {
    const url = document.getElementById('linkUrl').value.trim();
    const title = document.getElementById('linkTitle').value.trim() || extractTitleFromUrl(url);
    const isActive = document.getElementById('linkActive').checked;
    
    if (!url) {
        showToast('La URL es obligatoria', 'error');
        return;
    }
    
    if (!isValidUrl(url)) {
        showToast('Por favor ingresa una URL válida', 'error');
        return;
    }
    
    // Obtener la imagen extraída del preview
    const imagePreview = document.getElementById('linkImagePreview');
    let extractedImage = '';
    
    if (imagePreview) {
        const img = imagePreview.querySelector('img');
        if (img) {
            extractedImage = img.src;
        }
    }
    
    const newProduct = {
        id: Date.now(),
        type: 'link',
        title: title || 'Nuevo enlace',
        description: '',
        url: url,
        price: 0,
        image_url: extractedImage,
        status: isActive ? 'active' : 'inactive',
        sales: 0,
        sort_order: appState.products.length + 1
    };
    
    appState.products.push(newProduct);
    
    saveToStorage();
    renderProducts();
    updatePreview();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('linkFormModal'));
    modal.hide();
    
    showToast('¡Link creado correctamente!', 'success');
}

function extractTitleFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        return `Enlace a ${domain}`;
    } catch {
        return 'Nuevo enlace';
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function editProduct(productId) {
    console.log('Editando producto:', productId);
    
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        showToast('Producto no encontrado', 'error');
        return;
    }
    
    if (product.type === 'link') {
        // Editar enlace externo
        editLink(product);
    } else if (product.type === 'product') {
        // Editar producto digital
        editDigitalProduct(product);
    } else {
        showToast('Tipo de producto no soportado para edición', 'info');
    }
}

function editLink(link) {
    // Poblar el formulario de enlaces con los datos existentes
    document.getElementById('linkUrl').value = link.url || '';
    document.getElementById('linkTitle').value = link.title || '';
    document.getElementById('linkDescription').value = link.description || '';
    
    // Si tiene imagen personalizada, mostrarla
    if (link.image_url) {
        updateLinkImagePreview(link.image_url);
    }
    
    // Cambiar el título del modal
    document.getElementById('linkFormModalLabel').textContent = 'Editar Enlace';
    
    // Cambiar el botón de crear por actualizar
    const createButton = document.querySelector('#linkFormModal .btn-primary');
    if (createButton) {
        createButton.textContent = 'Actualizar Enlace';
        createButton.onclick = function() {
            updateExistingLink(link.id);
        };
    }
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('linkFormModal'));
    modal.show();
}

function editDigitalProduct(product) {
    // Poblar el formulario de producto digital con los datos existentes
    productFormData = {
        id: product.id, // Importante: incluir el ID para actualizaciones
        title: product.title || '',
        subtitle: product.subtitle || '',
        description: product.description || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        has_discount: product.has_discount || false,
        image_url: product.image_url || '',
        file_url: product.file_url || '',
        button_text: product.button_text || 'Comprar ahora',
        is_active: product.is_active !== false,
        reviews: [...(product.reviews || [])],
        custom_fields: [...(product.custom_fields || [
            { id: 'name', label: 'Nombre completo', type: 'text', required: true },
            { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
        ])]
    };
    
    // Mostrar el overlay de edición
    document.getElementById('productFormOverlay').style.display = 'block';
    document.getElementById('productFormTitle').textContent = 'Editar Producto Digital';
    
    // Configurar tab inicial
    currentProductTab = 'datos';
    showTab('datos');
    
    // Poblar todos los campos del formulario
    populateProductForm();
    
    // Configurar event listeners
    setupProductFormListeners();
    
    // Activar preview inmediatamente con los datos existentes
    updatePreviewWithProduct();
}

// ============== FUNCIONES PARA LLAMADA DE CONSULTORÍA (NUEVAS) ==============

function showConsultationFormOverlay() {
    // Resetear formulario de consultoría
    resetConsultationForm();
    
    // Mostrar el overlay
    document.getElementById('consultationFormOverlay').style.display = 'block';
    
    // Configurar tab inicial
    currentProductTab = 'datos';
    showConsultationTab('datos');
    
    // Configurar event listeners específicos para consultoría
    setupConsultationFormListeners();
    
    // Activar preview inmediatamente
    updatePreviewWithConsultation();
}

function closeConsultationFormOverlay() {
    document.getElementById('consultationFormOverlay').style.display = 'none';
    removeConsultationFormListeners();
    
    // Limpiar datos temporales de preview
    localStorage.removeItem('tempConsultationPreview');
    
    // Volver al preview normal del perfil
    updatePreview();
}

function resetConsultationForm() {
    consultationFormData = {
        title: '',
        subtitle: '',
        description: '',
        price: '',
        discount_price: '',
        has_discount: false,
        image_url: '',
        button_text: 'Agendar llamada',
        is_active: true,
        reviews: [],
        custom_fields: [
            { id: 'name', label: 'Nombre completo', type: 'text', required: true },
            { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
        ],
        availability_settings: {
            call_method: 'google_meet',
            custom_call_link: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            duration: 30,
            notice_period: { value: 12, unit: 'hours' },
            buffer_time: { before: 15, after: 15 },
            booking_window: 60,
            weekly_availability: [
                { day: 'sunday', name: 'Domingo', enabled: false, intervals: [] },
                { day: 'monday', name: 'Lunes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
                { day: 'tuesday', name: 'Martes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
                { day: 'wednesday', name: 'Miércoles', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
                { day: 'thursday', name: 'Jueves', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
                { day: 'friday', name: 'Viernes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
                { day: 'saturday', name: 'Sábado', enabled: false, intervals: [] }
            ]
        }
    };
    
    // Limpiar formularios HTML
    document.getElementById('consultationTitle').value = '';
    document.getElementById('consultationSubtitle').value = '';
    document.getElementById('consultationDescription').value = '';
    document.getElementById('consultationPrice').value = '';
    document.getElementById('consultationDiscountPrice').value = '';
    document.getElementById('consultationHasDiscount').checked = false;
    document.getElementById('consultationButtonText').value = 'Agendar llamada';
    document.getElementById('consultationIsActive').checked = true;
    
    // Resetear imagen
    document.getElementById('consultationImagePreview').innerHTML = `
        <div class="product-image-placeholder">
            <i class="bi bi-camera-video"></i>
        </div>
    `;
    
    // Resetear contadores
    document.getElementById('consultationTitleCounter').textContent = '0';
    document.getElementById('consultationSubtitleCounter').textContent = '0';
    
    // Resetear reseñas
    document.getElementById('consultationReviewsList').innerHTML = `
        <div class="text-muted text-center py-3">
            <i class="bi bi-star display-6"></i>
            <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
        </div>
    `;
    
    // Generar horarios semanales
    generateWeeklySchedule();
    generateConsultationCustomFields();
}

function showConsultationTab(tabName) {
    currentProductTab = tabName;
    
    // Actualizar navegación de tabs
    document.querySelectorAll('#consultationTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`consultation-${tabName}-tab`).classList.add('active');
    
    // Mostrar panel correspondiente
    document.querySelectorAll('#consultationFormOverlay .tab-content-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(`consultation-${tabName}-panel`).style.display = 'block';
    
    // Actualizar botones de navegación
    updateConsultationTabNavigation();
}

function updateConsultationTabNavigation() {
    const prevBtn = document.getElementById('consultationPrevTabBtn');
    const nextBtn = document.getElementById('consultationNextTabBtn');
    const createBtn = document.getElementById('createConsultationBtn');
    
    switch(currentProductTab) {
        case 'datos':
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'contenido':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'disponibilidad':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'opciones':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'none';
            createBtn.style.display = 'block';
            
            // Verificar si estamos en modo edición
            if (consultationFormData.id) {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Consultoría';
                createBtn.onclick = function() {
                    updateExistingConsultation();
                };
            } else {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Crear Consultoría';
                createBtn.onclick = function() {
                    createConsultation();
                };
            }
            break;
    }
}

function setupConsultationFormListeners() {
    // Event listeners para actualización en tiempo real
    const titleInput = document.getElementById('consultationTitle');
    const subtitleInput = document.getElementById('consultationSubtitle');
    const descriptionInput = document.getElementById('consultationDescription');
    const priceInput = document.getElementById('consultationPrice');
    const discountPriceInput = document.getElementById('consultationDiscountPrice');
    const hasDiscountInput = document.getElementById('consultationHasDiscount');
    const buttonTextInput = document.getElementById('consultationButtonText');
    const isActiveInput = document.getElementById('consultationIsActive');
    
    titleInput.addEventListener('input', function() {
        consultationFormData.title = this.value;
        document.getElementById('consultationTitleCounter').textContent = this.value.length;
        updatePreviewWithConsultation();
    });
    
    subtitleInput.addEventListener('input', function() {
        consultationFormData.subtitle = this.value;
        document.getElementById('consultationSubtitleCounter').textContent = this.value.length;
        updatePreviewWithConsultation();
    });
    
    descriptionInput.addEventListener('input', function() {
        consultationFormData.description = this.value;
        updatePreviewWithConsultation();
    });
    
    priceInput.addEventListener('input', function() {
        consultationFormData.price = this.value;
        updatePreviewWithConsultation();
    });
    
    discountPriceInput.addEventListener('input', function() {
        consultationFormData.discount_price = this.value;
        updatePreviewWithConsultation();
    });
    
    hasDiscountInput.addEventListener('change', function() {
        consultationFormData.has_discount = this.checked;
        document.getElementById('consultationDiscountPrice').style.display = this.checked ? 'block' : 'none';
        updatePreviewWithConsultation();
    });
    
    buttonTextInput.addEventListener('input', function() {
        consultationFormData.button_text = this.value;
        updatePreviewWithConsultation();
    });
    
    isActiveInput.addEventListener('change', function() {
        consultationFormData.is_active = this.checked;
        updatePreviewWithConsultation();
    });
    
    // Navegación de tabs
    document.querySelectorAll('#consultationTabs button').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showConsultationTab(tabName);
        });
    });
    
    // Upload de imagen para consultoría
    document.getElementById('consultationImageInput').addEventListener('change', handleConsultationImageUpload);
    
    // Event listeners para configuración de disponibilidad
    document.querySelectorAll('input[name="callMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            consultationFormData.availability_settings.call_method = this.value;
            const customContainer = document.getElementById('customLinkContainer');
            customContainer.style.display = this.value === 'custom' ? 'block' : 'none';
            updatePreviewWithConsultation();
        });
    });
    
    // Configuración de tiempo
    document.getElementById('consultationTimezone').addEventListener('change', function() {
        consultationFormData.availability_settings.timezone = this.value;
    });
    
    document.getElementById('consultationDuration').addEventListener('change', function() {
        consultationFormData.availability_settings.duration = parseInt(this.value);
        updatePreviewWithConsultation();
    });
    
    // Custom call link
    document.getElementById('customCallLink').addEventListener('input', function() {
        consultationFormData.availability_settings.custom_call_link = this.value;
    });
}

function removeConsultationFormListeners() {
    // Remover listeners para evitar conflictos
    const titleInput = document.getElementById('consultationTitle');
    const subtitleInput = document.getElementById('consultationSubtitle');
    
    if (titleInput) {
        const newTitleInput = titleInput.cloneNode(true);
        titleInput.parentNode.replaceChild(newTitleInput, titleInput);
    }
    
    if (subtitleInput) {
        const newSubtitleInput = subtitleInput.cloneNode(true);
        subtitleInput.parentNode.replaceChild(newSubtitleInput, subtitleInput);
    }
}

function handleConsultationImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        consultationFormData.image_url = e.target.result;
        document.getElementById('consultationImagePreview').innerHTML = `
            <img src="${e.target.result}" alt="Imagen de consultoría">
        `;
        updatePreviewWithConsultation();
        showToast('¡Imagen subida correctamente!', 'success');
    };
    reader.readAsDataURL(file);
}

function generateConsultationAIDescription() {
    const title = consultationFormData.title || 'consultoría personalizada';
    const description = `Esta ${title.toLowerCase()} está diseñada para ayudarte a alcanzar tus objetivos específicos. Durante nuestra sesión personalizada trabajaremos juntos en:

**Beneficios de la consultoría:**
- Análisis personalizado de tu situación actual
- Estrategias específicas para tus necesidades
- Plan de acción claro y ejecutable
- Seguimiento y recomendaciones prácticas

**Lo que incluye:**
- Sesión 1 a 1 por videollamada
- Documento con resumen de la sesión
- Recursos adicionales personalizados
- Seguimiento por email

¡Agenda tu llamada hoy y comienza a ver resultados reales!`;

    document.getElementById('consultationDescription').value = description;
    consultationFormData.description = description;
    updatePreviewWithConsultation();
    showToast('¡Descripción generada con IA!', 'success');
}

// Funciones para reseñas de consultoría
function addConsultationReview() {
    const newReview = {
        id: Date.now(),
        customer_name: '',
        rating: 5,
        comment: ''
    };
    
    consultationFormData.reviews.push(newReview);
    renderConsultationReviews();
}

function renderConsultationReviews() {
    const reviewsList = document.getElementById('consultationReviewsList');
    
    if (consultationFormData.reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-muted text-center py-3">
                <i class="bi bi-star display-6"></i>
                <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = consultationFormData.reviews.map((review, index) => `
        <div class="review-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <input type="text" class="form-control form-control-sm" 
                       placeholder="Nombre del cliente" 
                       value="${review.customer_name}"
                       onchange="updateConsultationReview(${index}, 'customer_name', this.value)">
                <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="removeConsultationReview(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <div class="review-stars">
                    ${[1,2,3,4,5].map(star => `
                        <i class="bi bi-star${star <= review.rating ? '-fill' : ''}" 
                           onclick="updateConsultationReview(${index}, 'rating', ${star})" 
                           style="cursor: pointer; color: #ffc107;"></i>
                    `).join('')}
                </div>
            </div>
            <textarea class="form-control form-control-sm" 
                      placeholder="Comentario de la reseña..." 
                      rows="2"
                      onchange="updateConsultationReview(${index}, 'comment', this.value)">${review.comment}</textarea>
        </div>
    `).join('');
}

function updateConsultationReview(index, field, value) {
    if (consultationFormData.reviews[index]) {
        consultationFormData.reviews[index][field] = value;
        updatePreviewWithConsultation();
    }
}

function removeConsultationReview(index) {
    consultationFormData.reviews.splice(index, 1);
    renderConsultationReviews();
    updatePreviewWithConsultation();
}

function consultationNextTab() {
    switch(currentProductTab) {
        case 'datos':
            showConsultationTab('contenido');
            break;
        case 'contenido':
            showConsultationTab('disponibilidad');
            break;
        case 'disponibilidad':
            showConsultationTab('opciones');
            break;
    }
}

function consultationPreviousTab() {
    switch(currentProductTab) {
        case 'contenido':
            showConsultationTab('datos');
            break;
        case 'disponibilidad':
            showConsultationTab('contenido');
            break;
        case 'opciones':
            showConsultationTab('disponibilidad');
            break;
    }
}

// Generar horarios semanales dinámicamente
function generateWeeklySchedule() {
    const container = document.getElementById('weeklySchedule');
    const weeklyAvailability = consultationFormData.availability_settings.weekly_availability;
    
    container.innerHTML = weeklyAvailability.map((day, dayIndex) => `
        <div class="mb-3 p-3 border rounded">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" 
                           id="day-${day.day}" 
                           ${day.enabled ? 'checked' : ''}
                           onchange="toggleWeeklyDay(${dayIndex}, this.checked)">
                    <label class="form-check-label fw-semibold" for="day-${day.day}">
                        ${day.name}
                    </label>
                </div>
                ${day.enabled ? `
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="addTimeInterval(${dayIndex})">
                        <i class="bi bi-plus"></i> Intervalo
                    </button>
                ` : ''}
            </div>
            
            <div id="intervals-${dayIndex}" class="ms-4">
                ${day.enabled ? day.intervals.map((interval, intervalIndex) => `
                    <div class="d-flex gap-2 mb-2 align-items-center p-2 bg-white rounded border">
                        <input type="time" class="form-control form-control-sm" 
                               value="${interval.from}" 
                               onchange="updateTimeInterval(${dayIndex}, ${intervalIndex}, 'from', this.value)">
                        <span class="text-muted">a</span>
                        <input type="time" class="form-control form-control-sm" 
                               value="${interval.to}" 
                               onchange="updateTimeInterval(${dayIndex}, ${intervalIndex}, 'to', this.value)">
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="removeTimeInterval(${dayIndex}, ${intervalIndex})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `).join('');
}

// Funciones para manejar horarios semanales
function toggleWeeklyDay(dayIndex, enabled) {
    consultationFormData.availability_settings.weekly_availability[dayIndex].enabled = enabled;
    if (!enabled) {
        consultationFormData.availability_settings.weekly_availability[dayIndex].intervals = [];
    } else {
        // Añadir intervalo por defecto
        consultationFormData.availability_settings.weekly_availability[dayIndex].intervals = [
            { from: '09:00', to: '17:00' }
        ];
    }
    generateWeeklySchedule();
    updatePreviewWithConsultation();
}

function addTimeInterval(dayIndex) {
    const day = consultationFormData.availability_settings.weekly_availability[dayIndex];
    day.intervals.push({ from: '09:00', to: '17:00' });
    generateWeeklySchedule();
}

function updateTimeInterval(dayIndex, intervalIndex, field, value) {
    consultationFormData.availability_settings.weekly_availability[dayIndex].intervals[intervalIndex][field] = value;
    updatePreviewWithConsultation();
}

function removeTimeInterval(dayIndex, intervalIndex) {
    consultationFormData.availability_settings.weekly_availability[dayIndex].intervals.splice(intervalIndex, 1);
    generateWeeklySchedule();
    updatePreviewWithConsultation();
}

// Campos personalizados para consultoría
function generateConsultationCustomFields() {
    const container = document.getElementById('consultationCustomFieldsList');
    
    container.innerHTML = consultationFormData.custom_fields.map((field, index) => {
        if (field.id === 'name' || field.id === 'email') {
            return `
                <div class="custom-field-item mb-2">
                    <div class="d-flex gap-2 align-items-center">
                        <input type="text" class="form-control" value="${field.label}" readonly>
                        <select class="form-select" disabled style="max-width: 120px;">
                            <option>${field.type === 'email' ? 'Email' : 'Texto'}</option>
                        </select>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" checked disabled>
                            <label class="form-check-label small">Obligatorio</label>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="custom-field-item mb-2">
                    <div class="d-flex gap-2 align-items-center">
                        <input type="text" class="form-control" placeholder="Etiqueta del campo" 
                               value="${field.label}"
                               onchange="updateConsultationCustomField(${index}, 'label', this.value)">
                        <select class="form-select" style="max-width: 120px;" 
                                onchange="updateConsultationCustomField(${index}, 'type', this.value)">
                            <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
                            <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                            <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>Teléfono</option>
                        </select>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" 
                                   ${field.required ? 'checked' : ''}
                                   onchange="updateConsultationCustomField(${index}, 'required', this.checked)">
                            <label class="form-check-label small">Obligatorio</label>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeConsultationCustomField(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function addConsultationCustomField() {
    const newField = {
        id: Date.now(),
        label: '',
        type: 'text',
        required: false
    };
    
    consultationFormData.custom_fields.push(newField);
    generateConsultationCustomFields();
}

function updateConsultationCustomField(index, field, value) {
    if (consultationFormData.custom_fields[index]) {
        consultationFormData.custom_fields[index][field] = value;
    }
}

function removeConsultationCustomField(index) {
    if (consultationFormData.custom_fields[index].id === 'name' || 
        consultationFormData.custom_fields[index].id === 'email') {
        return;
    }
    
    consultationFormData.custom_fields.splice(index, 1);
    generateConsultationCustomFields();
}

// Función para actualizar el preview con consultoría
function updatePreviewWithConsultation() {
    if (!consultationFormData || !consultationFormData.title) {
        updatePreview();
        return;
    }

    // Durante la edición de consultoría, mostrar preview de calendario de agendamiento
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) {
        console.warn('Preview content element not found');
        return;
    }
    
    const username = appState.profile.username || 'usuario';
    const profileName = appState.profile.name || 'Tu Nombre';
    const profileAvatar = appState.profile.avatar || '';
    
    const displayPrice = consultationFormData.has_discount && consultationFormData.discount_price > 0 
        ? consultationFormData.discount_price 
        : (consultationFormData.price || 0);
    const originalPrice = consultationFormData.has_discount && consultationFormData.discount_price > 0 
        ? consultationFormData.price 
        : null;
    
    // Generar reseñas válidas
    const validReviews = (consultationFormData.reviews || []).filter(review => 
        review.customer_name && review.customer_name.trim() !== '' && 
        review.comment && review.comment.trim() !== ''
    );
    
    const reviewsHTML = validReviews.length > 0 ? validReviews.map(review => {
        const stars = Array.from({length: 5}, (_, i) => 
            `<span style="color: #ffc107;">${i < review.rating ? '★' : '☆'}</span>`
        ).join('');
        
        return `
            <div style="background: #2a2a2a; padding: 1rem; border-radius: 0.75rem; margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600; font-size: 0.9rem; color: white;">${review.customer_name}</span>
                    <div style="font-size: 0.85rem;">${stars}</div>
                </div>
                <p style="color: #a0a0a0; font-size: 0.9rem; margin: 0;">${review.comment}</p>
            </div>
        `;
    }).join('') : '';

    // Preview de agendamiento de consultoría (como calendario)
    previewContent.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            overflow-y: auto;
        ">
            <!-- Header con botón de regreso -->
            <div style="
                position: sticky;
                top: 0;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid #333;
                padding: 1rem;
                z-index: 10;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #a0a0a0;
                    font-size: 0.95rem;
                    cursor: pointer;
                ">
                    <i class="bi bi-arrow-left"></i>
                    <span>Volver al perfil</span>
                </div>
            </div>

            <!-- Información de la consultoría -->
            <div style="padding: 2rem 1.5rem; padding-bottom: 80px;">
                <!-- Imagen -->
                ${consultationFormData.image_url ? `
                    <div style="width: 100%; height: 150px; border-radius: 1rem; overflow: hidden; margin-bottom: 1.5rem; background: #2a2a2a; display: flex; align-items: center; justify-content: center;">
                        <img src="${consultationFormData.image_url}" alt="${consultationFormData.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                ` : `
                    <div style="width: 100%; height: 150px; border-radius: 1rem; background: linear-gradient(135deg, #8b5cf6, #3b82f6); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: white; font-size: 2rem;">
                        <i class="bi bi-camera-video"></i>
                    </div>
                `}

                <!-- Información básica -->
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
                        ${consultationFormData.title || 'Nueva Consultoría'}
                    </h1>
                    
                    ${consultationFormData.subtitle ? `
                        <p style="color: #a0a0a0; margin-bottom: 1rem;">
                            ${consultationFormData.subtitle}
                        </p>
                    ` : ''}
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                        <span style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.85rem;">
                            <i class="bi bi-clock me-1"></i>${consultationFormData.availability_settings.duration} min
                        </span>
                        <span style="background: rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.85rem;">
                            <i class="bi bi-camera-video me-1"></i>${consultationFormData.availability_settings.call_method === 'google_meet' ? 'Google Meet' : 
                                consultationFormData.availability_settings.call_method === 'zoom' ? 'Zoom' : 'Videollamada'}
                        </span>
                    </div>
                    
                    ${consultationFormData.price > 0 ? `
                        <div style="margin-bottom: 1.5rem;">
                            <span style="font-size: 1.75rem; font-weight: 700; color: #10b981;">
                                $${displayPrice}
                            </span>
                            ${originalPrice ? `
                                <span style="font-size: 1rem; color: #666; text-decoration: line-through; margin-left: 0.5rem;">
                                    $${originalPrice}
                                </span>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- Calendario simulado -->
                <div style="background: #2a2a2a; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
                    <h3 style="color: #10b981; margin-bottom: 1rem; text-align: center; font-size: 1.1rem;">
                        <i class="bi bi-calendar-check me-2"></i>Selecciona fecha y hora
                    </h3>
                    
                    <!-- Calendario simple (visual) -->
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <div style="color: #a0a0a0; font-size: 0.9rem; margin-bottom: 0.5rem;">Julio 2025</div>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; font-size: 0.8rem;">
                            <div style="color: #666; padding: 0.5rem;">D</div>
                            <div style="color: #666; padding: 0.5rem;">L</div>
                            <div style="color: #666; padding: 0.5rem;">M</div>
                            <div style="color: #666; padding: 0.5rem;">X</div>
                            <div style="color: #666; padding: 0.5rem;">J</div>
                            <div style="color: #666; padding: 0.5rem;">V</div>
                            <div style="color: #666; padding: 0.5rem;">S</div>
                            
                            ${Array.from({length: 31}, (_, i) => {
                                const day = i + 1;
                                const isAvailable = day % 7 !== 0 && day % 7 !== 6; // Simular días disponibles
                                const isSelected = day === 15; // Día seleccionado ejemplo
                                return `<div style="
                                    padding: 0.5rem; 
                                    border-radius: 0.25rem; 
                                    cursor: pointer;
                                    ${isSelected ? 'background: #8b5cf6; color: white;' : 
                                      isAvailable ? 'background: rgba(16, 185, 129, 0.1); color: #10b981; hover: background: rgba(16, 185, 129, 0.2);' : 
                                      'color: #666;'}
                                ">${day}</div>`;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Horarios disponibles -->
                    <div style="margin-top: 1rem;">
                        <div style="color: #a0a0a0; font-size: 0.9rem; margin-bottom: 0.5rem; text-align: center;">Horarios disponibles</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            ${['09:00', '10:30', '14:00', '15:30', '16:00'].map(time => `
                                <button style="
                                    background: rgba(139, 92, 246, 0.1); 
                                    border: 1px solid rgba(139, 92, 246, 0.3);
                                    color: #c4b5fd; 
                                    padding: 0.5rem; 
                                    border-radius: 0.5rem; 
                                    font-size: 0.85rem;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                ">
                                    ${time}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Descripción -->
                ${consultationFormData.description ? `
                    <div style="background: #2a2a2a; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
                        <h4 style="color: white; margin-bottom: 1rem; font-size: 1.1rem;">Sobre esta consultoría</h4>
                        <div style="line-height: 1.6; color: #d0d0d0; white-space: pre-line; font-size: 0.9rem;">
                            ${consultationFormData.description}
                        </div>
                    </div>
                ` : ''}

                <!-- Reseñas -->
                ${reviewsHTML ? `
                    <div style="margin-bottom: 2rem;">
                        <h4 style="color: white; margin-bottom: 1rem; font-size: 1.1rem;">
                            <i class="bi bi-star-fill" style="color: #fbbf24; margin-right: 0.5rem;"></i>
                            Reseñas de clientes
                        </h4>
                        ${reviewsHTML}
                    </div>
                ` : ''}

                <!-- Botón de agendamiento integrado -->
                <div style="
                    background: rgba(26, 26, 26, 0.95);
                    border-top: 1px solid #333;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-top: 2rem;
                ">
                    <button style="
                        width: 100%;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        border: none;
                        color: white;
                        font-size: 1rem;
                        font-weight: 600;
                        padding: 0.875rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    " onclick="parent.postMessage({type: 'openBookingModal', consultation: ${JSON.stringify(consultationFormData).replace(/"/g, '&quot;')}}, '*')">
                        <i class="bi bi-calendar-check"></i>
                        <span>${consultationFormData.button_text || 'Agendar Consultoría'}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Funciones para crear y actualizar consultoría
function createConsultation() {
    if (!consultationFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    if (!consultationFormData.price || parseFloat(consultationFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }
    
    const newConsultation = createConsultationFromForm();
    
    appState.products.push(newConsultation);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeConsultationFormOverlay();
    showToast('¡Consultoría creada correctamente!', 'success');
}

function createConsultationFromForm() {
    return {
        id: Date.now(),
        type: 'consultation',
        title: consultationFormData.title.trim(),
        subtitle: consultationFormData.subtitle.trim(),
        description: consultationFormData.description.trim(),
        price: parseFloat(consultationFormData.price) || 0,
        discount_price: consultationFormData.has_discount ? (parseFloat(consultationFormData.discount_price) || 0) : 0,
        has_discount: consultationFormData.has_discount,
        image_url: consultationFormData.image_url,
        button_text: consultationFormData.button_text,
        is_active: consultationFormData.is_active,
        reviews: [...consultationFormData.reviews],
        custom_fields: [...consultationFormData.custom_fields],
        availability_settings: {...consultationFormData.availability_settings},
        status: consultationFormData.is_active ? 'active' : 'inactive',
        sales: 0,
        sort_order: appState.products.length + 1,
        created_at: new Date().toISOString()
    };
}

function saveConsultationAsDraft() {
    if (!consultationFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    const draftConsultation = createConsultationFromForm();
    draftConsultation.is_active = false;
    
    appState.products.push(draftConsultation);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeConsultationFormOverlay();
    showToast('¡Borrador de consultoría guardado!', 'success');
}

function populateProductForm() {
    // Tab 1: Datos
    document.getElementById('productTitle').value = productFormData.title;
    document.getElementById('productSubtitle').value = productFormData.subtitle;
    document.getElementById('titleCounter').textContent = productFormData.title.length;
    document.getElementById('subtitleCounter').textContent = productFormData.subtitle.length;
    
    // Mostrar imagen si existe
    if (productFormData.image_url) {
        document.getElementById('productImagePreview').innerHTML = `
            <img src="${productFormData.image_url}" alt="Imagen del producto">
        `;
    }
    
    // Tab 2: Contenido y Precio
    document.getElementById('productDescription').value = productFormData.description;
    document.getElementById('productPrice').value = productFormData.price;
    document.getElementById('hasDiscount').checked = productFormData.has_discount;
    document.getElementById('discountPrice').value = productFormData.discount_price;
    document.getElementById('discountPrice').style.display = productFormData.has_discount ? 'block' : 'none';
    
    // Mostrar archivo subido si existe
    if (productFormData.file_url) {
        document.getElementById('fileUploadArea').style.display = 'none';
        document.getElementById('fileUploadSuccess').style.display = 'block';
        document.getElementById('uploadedFileName').textContent = productFormData.file_url;
    }
    
    // Tab 3: Opciones
    document.getElementById('buttonText').value = productFormData.button_text;
    document.getElementById('isActive').checked = productFormData.is_active;
    
    // Renderizar reseñas y campos personalizados
    renderReviews();
    renderCustomFields();
}

function updateExistingLink(linkId) {
    const linkUrl = document.getElementById('linkUrl').value.trim();
    const linkTitle = document.getElementById('linkTitle').value.trim();
    const linkDescription = document.getElementById('linkDescription').value.trim();
    
    if (!linkUrl || !linkTitle) {
        showToast('URL y título son obligatorios', 'error');
        return;
    }
    
    // Encontrar y actualizar el enlace
    const linkIndex = appState.products.findIndex(p => p.id === linkId);
    if (linkIndex !== -1) {
        appState.products[linkIndex] = {
            ...appState.products[linkIndex],
            url: linkUrl,
            title: linkTitle,
            description: linkDescription,
            updated_at: new Date().toISOString()
        };
        
        // Actualizar imagen si se cambió
        const customImagePreview = document.getElementById('customImagePreview');
        if (customImagePreview && customImagePreview.src && !customImagePreview.src.includes('placeholder')) {
            appState.products[linkIndex].image_url = customImagePreview.src;
        }
        
        saveToStorage();
        renderProducts();
        updatePreview();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('linkFormModal'));
        modal.hide();
        
        showToast('¡Enlace actualizado correctamente!', 'success');
        
        // Resetear el formulario para futuras creaciones
        resetLinkForm();
    }
}

function updateExistingProduct() {
    if (!productFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    if (!productFormData.price || parseFloat(productFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }
    
    // Encontrar y actualizar el producto
    const productIndex = appState.products.findIndex(p => p.id === productFormData.id);
    if (productIndex !== -1) {
        const updatedProduct = createProductFromForm();
        updatedProduct.id = productFormData.id; // Mantener el ID original
        updatedProduct.created_at = appState.products[productIndex].created_at; // Mantener fecha de creación
        updatedProduct.updated_at = new Date().toISOString();
        
        appState.products[productIndex] = updatedProduct;
        
        saveToStorage();
        renderProducts();
        updatePreview();
        
        closeProductFormOverlay();
        showToast('¡Producto actualizado correctamente!', 'success');
        
        // Resetear botón para futuras creaciones
        const createButton = document.getElementById('createProductBtn');
        if (createButton) {
            createButton.innerHTML = '<i class="bi bi-check-circle"></i> Crear Producto';
            createButton.onclick = function() {
                createProduct();
            };
        }
        
        // Resetear título
        document.getElementById('productFormTitle').textContent = 'Crear Producto Digital';
    }
}

function resetLinkForm() {
    // Resetear el formulario de enlaces para futuras creaciones
    document.getElementById('linkFormModalLabel').textContent = 'Crear Nuevo Enlace';
    
    const createButton = document.querySelector('#linkFormModal .btn-primary');
    if (createButton) {
        createButton.textContent = 'Crear Enlace';
        createButton.onclick = function() {
            createLink();
        };
    }
    
    // Limpiar campos
    document.getElementById('linkUrl').value = '';
    document.getElementById('linkTitle').value = '';
    document.getElementById('linkDescription').value = '';
    
    // Resetear preview de imagen
    const customImagePreview = document.getElementById('customImagePreview');
    if (customImagePreview) {
        customImagePreview.src = '';
        customImagePreview.style.display = 'none';
    }
}

function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    appState.products = appState.products.filter(p => p.id !== id);
    
    // Reordenar índices
    appState.products.forEach((product, index) => {
        product.sort_order = index + 1;
    });
    
    saveToStorage();
    renderProducts();
    updatePreview();
    showToast('Producto eliminado correctamente', 'success');
}

function saveProfile() {
    const name = document.getElementById('nameInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const bio = document.getElementById('bioInput').value.trim();
    
    if (!name || !username) {
        showToast('Nombre y usuario son obligatorios', 'error');
        return;
    }
    
    // Actualizar estado
    appState.profile.name = name;
    appState.profile.username = username;
    appState.profile.bio = bio;
    
    // Actualizar interfaz
    updateProfileUI();
    
    saveToStorage();
    updatePreview();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    modal.hide();
    
    showToast('Perfil actualizado correctamente', 'success');
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        appState.profile.avatar_url = e.target.result;
        updateProfileUI();
        saveToStorage();
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function handleLinkImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('La imagen es demasiado grande. Máximo 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('linkImagePreview');
        imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Imagen personalizada" 
                 style="max-width: 100%; max-height: 100px; object-fit: cover; border-radius: 4px;">
        `;
        showToast('¡Imagen subida correctamente!', 'success');
    };
    reader.readAsDataURL(file);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    const messageElement = document.getElementById('successMessage');
    const toastBody = toast.querySelector('.toast-body');
    
    // Actualizar mensaje
    messageElement.textContent = message;
    
    // Cambiar colores según el tipo
    toastBody.className = 'toast-body d-flex align-items-center';
    if (type === 'success') {
        toastBody.classList.add('bg-success', 'text-white');
    } else if (type === 'error') {
        toastBody.classList.add('bg-danger', 'text-white');
    } else if (type === 'info') {
        toastBody.classList.add('bg-info', 'text-white');
    }
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
}

// Funciones de utilidad
function generateId() {
    return Date.now().toString();
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Manejo de errores global
window.addEventListener('error', function(event) {
    console.error('Error global:', event.error);
});

// Prevenir pérdida de datos al cerrar
window.addEventListener('beforeunload', function(e) {
    saveToStorage();
});

function saveAsCourseAsDraft() {
    if (!courseFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    const draftCourse = createCourseFromForm();
    draftCourse.is_active = false;
    
    appState.products.push(draftCourse);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeCourseFormOverlay();
    showToast('¡Borrador de curso guardado correctamente!', 'success');
}

// Funciones adicionales para curso
function addCourseReview() {
    const newReview = {
        id: Date.now(),
        customer_name: '',
        rating: 5,
        comment: ''
    };
    
    courseFormData.reviews.push(newReview);
    renderCourseReviews();
}

function renderCourseReviews() {
    const reviewsList = document.getElementById('courseReviewsList');
    
    if (courseFormData.reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-muted text-center py-3">
                <i class="bi bi-star display-6"></i>
                <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = courseFormData.reviews.map((review, index) => `
        <div class="review-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <input type="text" class="form-control form-control-sm" 
                       placeholder="Nombre del estudiante" 
                       value="${review.customer_name}"
                       onchange="updateCourseReview(${index}, 'customer_name', this.value)">
                <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="removeCourseReview(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <div class="review-stars">
                    ${[1,2,3,4,5].map(star => `
                        <i class="bi bi-star${star <= review.rating ? '-fill' : ''}" 
                           onclick="updateCourseReview(${index}, 'rating', ${star})" 
                           style="cursor: pointer;"></i>
                    `).join('')}
                </div>
            </div>
            <textarea class="form-control form-control-sm" 
                      placeholder="Comentario de la reseña..." 
                      rows="2"
                      onchange="updateCourseReview(${index}, 'comment', this.value)">${review.comment}</textarea>
        </div>
    `).join('');
}

function updateCourseReview(index, field, value) {
    if (courseFormData.reviews[index]) {
        courseFormData.reviews[index][field] = value;
        updatePreviewWithCourse();
    }
}

function removeCourseReview(index) {
    courseFormData.reviews.splice(index, 1);
    renderCourseReviews();
    updatePreviewWithCourse();
}

function generateCourseAIDescription() {
    const title = courseFormData.title || 'curso digital';
    const description = `Este ${title.toLowerCase()} te enseñará todo lo que necesitas saber para alcanzar tus metas. Es la guía ideal si estás buscando:

**Lo que aprenderás:**
- Dominar los conceptos fundamentales
- Aplicar técnicas probadas y efectivas
- Desarrollar habilidades prácticas
- Obtener resultados reales

**Beneficios principales:**
- Acceso de por vida al contenido
- Certificado de finalización
- Soporte directo del instructor
- Actualizaciones gratuitas

**Módulos incluidos:**
- Introducción y fundamentos
- Estrategias avanzadas
- Casos prácticos reales
- Recursos y herramientas

¡Inscríbete ahora y transforma tu futuro!`;

    document.getElementById('courseDescription').value = description;
    courseFormData.description = description;
    updatePreviewWithCourse();
    showToast('¡Descripción generada con IA!', 'success');
}

// ============== FUNCIONES PRINCIPALES PARA CURSO DIGITAL ==============

// Variables globales para curso
let currentCourseTab = 'datos';

function showCourseFormOverlay() {
    // Resetear formulario
    resetCourseForm();
    
    // Mostrar el overlay
    document.getElementById('courseFormOverlay').style.display = 'block';
    
    // Configurar tab inicial
    currentCourseTab = 'datos';
    showCourseTab('datos');
    
    // Configurar event listeners
    setupCourseFormListeners();
    
    // Activar preview inmediatamente
    updatePreviewWithCourse();
}

function closeCourseFormOverlay() {
    document.getElementById('courseFormOverlay').style.display = 'none';
    removeCourseFormListeners();
    
    // Limpiar datos temporales de preview
    localStorage.removeItem('tempCoursePreview');
    
    // Volver al preview normal del perfil
    updatePreview();
}

function resetCourseForm() {
    courseFormData = {
        title: '',
        subtitle: '',
        description: '',
        price: '',
        discount_price: '',
        has_discount: false,
        image_url: '',
        button_text: 'Empezar curso',
        is_active: true,
        reviews: [],
        custom_fields: [
            { id: 'name', label: 'Nombre completo', type: 'text', required: true },
            { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
        ],
        course_content: {
            header_image_url: '',
            title: '',
            description: '',
            modules: [
                { 
                    id: 'm_' + Date.now() + '_1', 
                    title: 'Introducción', 
                    lessons: [
                        { 
                            id: 'l_' + Date.now() + '_1', 
                            title: 'Bienvenida al curso', 
                            description: 'En esta lección te damos la bienvenida y explicamos cómo navegar el curso.', 
                            video_url: '', 
                            attachments: [] 
                        }
                    ] 
                }
            ]
        }
    };
    
    // Limpiar formularios
    document.getElementById('courseTitle').value = '';
    document.getElementById('courseSubtitle').value = '';
    document.getElementById('courseDescription').value = '';
    document.getElementById('coursePrice').value = '';
    document.getElementById('courseDiscountPrice').value = '';
    document.getElementById('courseHasDiscount').checked = false;
    document.getElementById('courseButtonText').value = 'Empezar curso';
    document.getElementById('courseIsActive').checked = true;
    
    // Course content
    document.getElementById('courseContentTitle').value = '';
    document.getElementById('courseContentDescription').value = '';
    
    // Resetear imagen
    document.getElementById('courseImagePreview').innerHTML = `
        <div class="product-image-placeholder">
            <i class="bi bi-mortarboard"></i>
        </div>
    `;
    
    // Resetear imagen header del curso
    document.getElementById('courseHeaderImagePreview').innerHTML = `
        <div class="product-image-placeholder">
            <i class="bi bi-image"></i>
        </div>
    `;
    
    // Resetear contadores
    document.getElementById('courseTitleCounter').textContent = '0';
    document.getElementById('courseSubtitleCounter').textContent = '0';
    
    // Resetear reseñas
    document.getElementById('courseReviewsList').innerHTML = `
        <div class="text-muted text-center py-3">
            <i class="bi bi-star display-6"></i>
            <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
        </div>
    `;
    
    // Renderizar módulos iniciales
    renderCourseModules();
}

function setupCourseFormListeners() {
    // Títulos con actualización en tiempo real
    const titleInput = document.getElementById('courseTitle');
    const subtitleInput = document.getElementById('courseSubtitle');
    const descriptionInput = document.getElementById('courseDescription');
    const priceInput = document.getElementById('coursePrice');
    const discountPriceInput = document.getElementById('courseDiscountPrice');
    const hasDiscountInput = document.getElementById('courseHasDiscount');
    const buttonTextInput = document.getElementById('courseButtonText');
    const isActiveInput = document.getElementById('courseIsActive');
    
    // Course content inputs
    const pageTitleInput = document.getElementById('courseContentTitle');
    const pageDescriptionInput = document.getElementById('courseContentDescription');
    
    // Event listeners para actualización en tiempo real
    titleInput.addEventListener('input', function() {
        courseFormData.title = this.value;
        document.getElementById('courseTitleCounter').textContent = this.value.length;
        updatePreviewWithCourse();
    });
    
    subtitleInput.addEventListener('input', function() {
        courseFormData.subtitle = this.value;
        document.getElementById('courseSubtitleCounter').textContent = this.value.length;
        updatePreviewWithCourse();
    });
    
    descriptionInput.addEventListener('input', function() {
        courseFormData.description = this.value;
        updatePreviewWithCourse();
    });
    
    priceInput.addEventListener('input', function() {
        courseFormData.price = this.value;
        updatePreviewWithCourse();
    });
    
    discountPriceInput.addEventListener('input', function() {
        courseFormData.discount_price = this.value;
        updatePreviewWithCourse();
    });
    
    hasDiscountInput.addEventListener('change', function() {
        courseFormData.has_discount = this.checked;
        document.getElementById('courseDiscountPrice').style.display = this.checked ? 'block' : 'none';
        updatePreviewWithCourse();
    });
    
    buttonTextInput.addEventListener('input', function() {
        courseFormData.button_text = this.value;
        updatePreviewWithCourse();
    });
    
    isActiveInput.addEventListener('change', function() {
        courseFormData.is_active = this.checked;
        updatePreviewWithCourse();
    });
    
    // Course content listeners
    pageTitleInput.addEventListener('input', function() {
        courseFormData.course_content.title = this.value;
        updatePreviewWithCourse();
    });
    
    pageDescriptionInput.addEventListener('input', function() {
        courseFormData.course_content.description = this.value;
        updatePreviewWithCourse();
    });
    
    // Navegación de tabs
    document.querySelectorAll('#courseTabs button').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showCourseTab(tabName);
        });
    });
    
    // Upload de imagen principal
    document.getElementById('courseImageInput').addEventListener('change', handleCourseImageUpload);
    
    // Upload de imagen header
    document.getElementById('courseHeaderImageInput').addEventListener('change', handleCourseHeaderImageUpload);
}

function removeCourseFormListeners() {
    // Remover listeners si es necesario
    const titleInput = document.getElementById('courseTitle');
    const subtitleInput = document.getElementById('courseSubtitle');
    
    if (titleInput) {
        const newTitleInput = titleInput.cloneNode(true);
        titleInput.parentNode.replaceChild(newTitleInput, titleInput);
    }
    
    if (subtitleInput) {
        const newSubtitleInput = subtitleInput.cloneNode(true);
        subtitleInput.parentNode.replaceChild(newSubtitleInput, subtitleInput);
    }
}

function showCourseTab(tabName) {
    currentCourseTab = tabName;
    
    // Actualizar navegación de tabs
    document.querySelectorAll('#courseTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-course-tab`).classList.add('active');
    
    // Mostrar panel correspondiente
    document.querySelectorAll('.course-tab-content-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(`${tabName}-course-panel`).style.display = 'block';
    
    // Actualizar botones de navegación
    updateCourseTabNavigation();
}

function updateCourseTabNavigation() {
    const prevBtn = document.getElementById('prevCourseTabBtn');
    const nextBtn = document.getElementById('nextCourseTabBtn');
    const createBtn = document.getElementById('createCourseBtn');
    
    switch(currentCourseTab) {
        case 'datos':
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'contenido':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'curso':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'opciones':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'none';
            createBtn.style.display = 'block';
            
            // Verificar si estamos en modo edición
            if (courseFormData.id) {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Curso';
                createBtn.onclick = function() {
                    updateExistingCourse();
                };
            } else {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Crear Curso';
                createBtn.onclick = function() {
                    createCourse();
                };
            }
            break;
    }
}

function nextCourseTab() {
    switch(currentCourseTab) {
        case 'datos':
            showCourseTab('contenido');
            break;
        case 'contenido':
            showCourseTab('curso');
            break;
        case 'curso':
            showCourseTab('opciones');
            break;
    }
}

function previousCourseTab() {
    switch(currentCourseTab) {
        case 'contenido':
            showCourseTab('datos');
            break;
        case 'curso':
            showCourseTab('contenido');
            break;
        case 'opciones':
            showCourseTab('curso');
            break;
    }
}

function handleCourseImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        courseFormData.image_url = e.target.result;
        document.getElementById('courseImagePreview').innerHTML = `
            <img src="${e.target.result}" alt="Imagen del curso">
        `;
        updatePreviewWithCourse();
        showToast('¡Imagen subida correctamente!', 'success');
    };
    reader.readAsDataURL(file);
}

function handleCourseHeaderImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        courseFormData.course_content.header_image_url = e.target.result;
        document.getElementById('courseHeaderImagePreview').innerHTML = `
            <img src="${e.target.result}" alt="Imagen header del curso">
        `;
        updatePreviewWithCourse();
        showToast('¡Imagen header subida correctamente!', 'success');
    };
    reader.readAsDataURL(file);
}

// Funciones de módulos y lecciones
function addCourseModule() {
    const newModule = {
        id: 'm_' + Date.now(),
        title: 'Nuevo módulo',
        lessons: []
    };
    
    courseFormData.course_content.modules.push(newModule);
    renderCourseModules();
    updatePreviewWithCourse();
}

function removeCourseModule(moduleId) {
    courseFormData.course_content.modules = courseFormData.course_content.modules.filter(m => m.id !== moduleId);
    renderCourseModules();
    updatePreviewWithCourse();
}

function updateCourseModule(moduleId, field, value) {
    const module = courseFormData.course_content.modules.find(m => m.id === moduleId);
    if (module) {
        module[field] = value;
        updatePreviewWithCourse();
    }
}

function addCourseLesson(moduleId) {
    const module = courseFormData.course_content.modules.find(m => m.id === moduleId);
    if (module) {
        const newLesson = {
            id: 'l_' + Date.now(),
            title: 'Nueva lección',
            description: '',
            video_url: '',
            attachments: []
        };
        
        module.lessons.push(newLesson);
        renderCourseModules();
        updatePreviewWithCourse();
    }
}

function removeCourseLesson(moduleId, lessonId) {
    const module = courseFormData.course_content.modules.find(m => m.id === moduleId);
    if (module) {
        module.lessons = module.lessons.filter(l => l.id !== lessonId);
        renderCourseModules();
        updatePreviewWithCourse();
    }
}

function updateCourseLesson(moduleId, lessonId, field, value) {
    const module = courseFormData.course_content.modules.find(m => m.id === moduleId);
    if (module) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson[field] = value;
            updatePreviewWithCourse();
        }
    }
}

function renderCourseModules() {
    const modulesList = document.getElementById('courseModulesList');
    if (!modulesList) return;
    
    modulesList.innerHTML = courseFormData.course_content.modules.map((module, moduleIndex) => `
        <div class="course-module-item mb-4" data-module-id="${module.id}">
            <div class="course-module-header">
                <div class="d-flex gap-2 align-items-center mb-3">
                    <input type="text" class="form-control fw-semibold" 
                           value="${module.title}" 
                           onchange="updateCourseModule('${module.id}', 'title', this.value)"
                           placeholder="Título del módulo">
                    <button type="button" class="btn btn-sm btn-outline-danger" 
                            onclick="removeCourseModule('${module.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="course-lessons-list" id="lessons-${module.id}">
                ${module.lessons.map((lesson, lessonIndex) => `
                    <div class="course-lesson-item p-3 border rounded mb-2" data-lesson-id="${lesson.id}">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <input type="text" class="form-control form-control-sm fw-semibold" 
                                   value="${lesson.title}" 
                                   onchange="updateCourseLesson('${module.id}', '${lesson.id}', 'title', this.value)"
                                   placeholder="Título de la lección">
                            <button type="button" class="btn btn-sm btn-outline-danger ms-2" 
                                    onclick="removeCourseLesson('${module.id}', '${lesson.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        
                        <textarea class="form-control form-control-sm mb-2" 
                                  rows="2" 
                                  placeholder="Descripción de la lección..."
                                  onchange="updateCourseLesson('${module.id}', '${lesson.id}', 'description', this.value)">${lesson.description}</textarea>
                        
                        <input type="url" class="form-control form-control-sm" 
                               value="${lesson.video_url}" 
                               onchange="updateCourseLesson('${module.id}', '${lesson.id}', 'video_url', this.value)"
                               placeholder="URL del video (YouTube, Vimeo, etc.)">
                    </div>
                `).join('')}
                
                <button type="button" class="btn btn-sm btn-outline-primary" 
                        onclick="addCourseLesson('${module.id}')">
                    <i class="bi bi-plus"></i> Agregar lección
                </button>
            </div>
        </div>
    `).join('');
}

function updatePreviewWithCourse() {
    if (!courseFormData || !courseFormData.title) {
        // Si no hay datos del curso, mostrar preview normal
        updatePreview();
        return;
    }

    // Durante la edición del curso, mostrar la página del curso simulada en el preview
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) {
        console.warn('Preview content element not found');
        return;
    }
    
    const username = appState.profile.username || 'usuario';
    const profileName = appState.profile.name || 'Tu Nombre';
    
    // Crear una versión temporal del curso para preview
    const tempCourse = {
        id: courseFormData.id || 'preview',
        type: 'course',
        title: courseFormData.title || 'Nuevo Curso Digital',
        subtitle: courseFormData.subtitle || '',
        description: courseFormData.description || '',
        price: parseFloat(courseFormData.price) || 0,
        discount_price: courseFormData.has_discount ? (parseFloat(courseFormData.discount_price) || 0) : 0,
        has_discount: courseFormData.has_discount,
        image_url: courseFormData.image_url || '',
        button_text: courseFormData.button_text || 'Empezar curso',
        is_active: courseFormData.is_active !== false,
        reviews: courseFormData.reviews || [],
        custom_fields: courseFormData.custom_fields || [],
        course_content: courseFormData.course_content || {}
    };
    
    // Mostrar la página del curso en lugar del perfil general
    const displayPrice = tempCourse.has_discount && tempCourse.discount_price > 0 
        ? tempCourse.discount_price 
        : tempCourse.price;
    const originalPrice = tempCourse.has_discount && tempCourse.discount_price > 0 
        ? tempCourse.price 
        : null;
    
    // Generar módulos del curso
    const courseLessonsCount = tempCourse.course_content.modules 
        ? tempCourse.course_content.modules.reduce((total, module) => total + (module.lessons ? module.lessons.length : 0), 0)
        : 0;
    
    const courseModulesHTML = tempCourse.course_content.modules ? tempCourse.course_content.modules.map(module => `
        <div style="background: #2a2a2a; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem;">
            <h4 style="color: white; margin-bottom: 0.75rem; font-size: 1rem; font-weight: 600;">${module.title}</h4>
            ${module.lessons ? module.lessons.map((lesson, index) => `
                <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; margin-bottom: 0.5rem; background: #1a1a1a; border-radius: 0.5rem;">
                    <div style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600;">
                        ${index + 1}
                    </div>
                    <div style="flex: 1;">
                        <div style="color: white; font-weight: 500; font-size: 0.9rem;">${lesson.title}</div>
                        ${lesson.description ? `<div style="color: #a0a0a0; font-size: 0.8rem; margin-top: 0.25rem;">${lesson.description}</div>` : ''}
                    </div>
                    <i class="bi bi-play-circle" style="color: #8b5cf6; font-size: 1.2rem;"></i>
                </div>
            `).join('') : ''}
        </div>
    `).join('') : '';
    
    // HTML de la página del curso simulada
    previewContent.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            overflow-y: auto;
        ">
            <!-- Header con botón de regreso -->
            <div style="
                position: sticky;
                top: 0;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid #333;
                padding: 1rem;
                z-index: 10;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #a0a0a0;
                    font-size: 0.95rem;
                    cursor: pointer;
                ">
                    <i class="bi bi-arrow-left"></i>
                    <span>Volver al perfil</span>
                </div>
            </div>

            <!-- Contenido del curso -->
            <div style="padding: 2rem 1.5rem; padding-bottom: 80px;">
                <!-- Imagen del curso -->
                ${tempCourse.image_url ? `
                    <div style="width: 100%; height: 200px; border-radius: 1rem; overflow: hidden; margin-bottom: 2rem; background: #2a2a2a; display: flex; align-items: center; justify-content: center;">
                        <img src="${tempCourse.image_url}" alt="${tempCourse.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                ` : `
                    <div style="width: 100%; height: 200px; border-radius: 1rem; background: #2a2a2a; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; color: #666; font-size: 3rem;">
                        <i class="bi bi-mortarboard"></i>
                    </div>
                `}

                <!-- Información del curso -->
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.2;">
                        ${tempCourse.title}
                    </h1>
                    
                    ${tempCourse.subtitle ? `
                        <p style="font-size: 1.1rem; color: #a0a0a0; margin-bottom: 1rem; line-height: 1.4;">
                            ${tempCourse.subtitle}
                        </p>
                    ` : ''}
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #a0a0a0;">
                            <i class="bi bi-collection"></i>
                            <span style="font-size: 0.9rem;">${tempCourse.course_content.modules ? tempCourse.course_content.modules.length : 0} módulos</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #a0a0a0;">
                            <i class="bi bi-play-circle"></i>
                            <span style="font-size: 0.9rem;">${courseLessonsCount} lecciones</span>
                        </div>
                    </div>
                </div>

                <!-- Precio -->
                ${tempCourse.price > 0 ? `
                    <div style="margin-bottom: 2rem;">
                        <span style="font-size: 2rem; font-weight: 700; color: #10b981;">
                            $${displayPrice}
                        </span>
                        ${originalPrice ? `
                            <span style="font-size: 1.2rem; color: #666; text-decoration: line-through; margin-left: 1rem; vertical-align: top; margin-top: 0.5rem; display: inline-block;">
                                $${originalPrice}
                            </span>
                            <span style="background: #dc2626; color: white; font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 2rem; font-weight: 600; margin-left: 1rem; vertical-align: top; margin-top: 0.75rem; display: inline-block;">
                                -${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                            </span>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Descripción -->
                ${tempCourse.description ? `
                    <div style="line-height: 1.6; color: #d0d0d0; margin-bottom: 2rem; white-space: pre-line;">
                        ${tempCourse.description}
                    </div>
                ` : ''}

                <!-- Contenido del curso -->
                ${courseModulesHTML ? `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="bi bi-collection" style="color: #8b5cf6;"></i>
                            Contenido del curso
                        </h3>
                        ${courseModulesHTML}
                    </div>
                ` : ''}

                <!-- Botón de compra -->
                <div style="
                    background: rgba(26, 26, 26, 0.95);
                    border-top: 1px solid #333;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-top: 2rem;
                ">
                    <button style="
                        width: 100%;
                        background: #8b5cf6;
                        border: none;
                        color: white;
                        font-size: 1rem;
                        font-weight: 600;
                        padding: 0.875rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    " onclick="parent.postMessage({type: 'openPurchaseModal', product: ${JSON.stringify(tempCourse).replace(/"/g, '&quot;')}}, '*')">
                        <i class="bi bi-mortarboard"></i>
                        <span>${tempCourse.button_text || (tempCourse.price > 0 ? `Inscribirse por $${displayPrice}` : 'Empezar Gratis')}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createCourse() {
    if (!courseFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    if (!courseFormData.price || parseFloat(courseFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }
    
    const newCourse = createCourseFromForm();
    
    appState.products.push(newCourse);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeCourseFormOverlay();
    showToast('¡Curso creado correctamente!', 'success');
}

function createCourseFromForm() {
    return {
        id: courseFormData.id || Date.now(),
        type: 'course',
        title: courseFormData.title.trim(),
        subtitle: courseFormData.subtitle.trim(),
        description: courseFormData.description.trim(),
        price: parseFloat(courseFormData.price) || 0,
        discount_price: courseFormData.has_discount ? (parseFloat(courseFormData.discount_price) || 0) : 0,
        has_discount: courseFormData.has_discount,
        image_url: courseFormData.image_url,
        button_text: courseFormData.button_text || 'Empezar curso',
        is_active: courseFormData.is_active,
        reviews: [...courseFormData.reviews],
        custom_fields: [...courseFormData.custom_fields],
        course_content: {
            header_image_url: courseFormData.course_content.header_image_url,
            title: courseFormData.course_content.title,
            description: courseFormData.course_content.description,
            modules: courseFormData.course_content.modules.map(module => ({
                ...module,
                lessons: [...module.lessons]
            }))
        },
        sales: 0,
        sort_order: appState.products.length + 1,
        status: courseFormData.is_active ? 'active' : 'inactive',
        created_at: new Date().toISOString()
    };
}

// ============== FIN FUNCIONES PARA CURSO DIGITAL ==============

// ============== FUNCIONES PRINCIPALES PARA MEMBRESÍA RECURRENTE ==============

// Variables globales para membresía
let currentMembershipTab = 'datos';

function showMembershipFormOverlay() {
    // Resetear formulario
    resetMembershipForm();
    
    // Mostrar el overlay
    document.getElementById('membershipFormOverlay').style.display = 'block';
    
    // Configurar tab inicial
    currentMembershipTab = 'datos';
    showMembershipTab('datos');
    
    // Configurar event listeners
    setupMembershipFormListeners();
    
    // Activar preview inmediatamente
    updatePreviewWithMembership();
}

function closeMembershipFormOverlay() {
    document.getElementById('membershipFormOverlay').style.display = 'none';
    removeMembershipFormListeners();
    
    // Limpiar datos temporales de preview
    localStorage.removeItem('tempMembershipPreview');
    
    // Volver al preview normal del perfil
    updatePreview();
}

function resetMembershipForm() {
    membershipFormData = {
        title: '',
        subtitle: '',
        description: '',
        price: '',
        discount_price: '',
        has_discount: false,
        image_url: '',
        button_text: 'Subscribirse',
        is_active: true,
        reviews: [],
        custom_fields: [
            { id: 'name', label: 'Nombre completo', type: 'text', required: true },
            { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
        ],
        billing_settings: {
            frequency: 'monthly',
            has_end_date: false,
            end_after_months: 12
        }
    };
    
    // Limpiar formularios
    document.getElementById('membershipTitle').value = '';
    document.getElementById('membershipSubtitle').value = '';
    document.getElementById('membershipDescription').value = '';
    document.getElementById('membershipPrice').value = '';
    document.getElementById('membershipDiscountPrice').value = '';
    document.getElementById('membershipHasDiscount').checked = false;
    document.getElementById('membershipButtonText').value = 'Subscribirse';
    document.getElementById('membershipIsActive').checked = true;
    
    // Billing settings
    document.getElementById('membershipFrequency').value = 'monthly';
    document.getElementById('membershipHasEndDate').checked = false;
    document.getElementById('membershipEndAfterMonths').value = '12';
    
    // Resetear imagen
    document.getElementById('membershipImagePreview').innerHTML = `
        <div class="product-image-placeholder">
            <i class="bi bi-crown"></i>
        </div>
    `;
    
    // Resetear contadores
    document.getElementById('membershipTitleCounter').textContent = '0';
    document.getElementById('membershipSubtitleCounter').textContent = '0';
    
    // Resetear reseñas
    document.getElementById('membershipReviewsList').innerHTML = `
        <div class="text-muted text-center py-3">
            <i class="bi bi-star display-6"></i>
            <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
        </div>
    `;
}

function setupMembershipFormListeners() {
    // Títulos con actualización en tiempo real
    const titleInput = document.getElementById('membershipTitle');
    const subtitleInput = document.getElementById('membershipSubtitle');
    const descriptionInput = document.getElementById('membershipDescription');
    const priceInput = document.getElementById('membershipPrice');
    const discountPriceInput = document.getElementById('membershipDiscountPrice');
    const hasDiscountInput = document.getElementById('membershipHasDiscount');
    const buttonTextInput = document.getElementById('membershipButtonText');
    const isActiveInput = document.getElementById('membershipIsActive');
    
    // Billing settings inputs
    const frequencyInput = document.getElementById('membershipFrequency');
    const hasEndDateInput = document.getElementById('membershipHasEndDate');
    const endAfterMonthsInput = document.getElementById('membershipEndAfterMonths');
    
    // Event listeners para actualización en tiempo real
    titleInput.addEventListener('input', function() {
        membershipFormData.title = this.value;
        document.getElementById('membershipTitleCounter').textContent = this.value.length;
        updatePreviewWithMembership();
    });
    
    subtitleInput.addEventListener('input', function() {
        membershipFormData.subtitle = this.value;
        document.getElementById('membershipSubtitleCounter').textContent = this.value.length;
        updatePreviewWithMembership();
    });
    
    descriptionInput.addEventListener('input', function() {
        membershipFormData.description = this.value;
        updatePreviewWithMembership();
    });
    
    priceInput.addEventListener('input', function() {
        membershipFormData.price = this.value;
        updatePreviewWithMembership();
    });
    
    discountPriceInput.addEventListener('input', function() {
        membershipFormData.discount_price = this.value;
        updatePreviewWithMembership();
    });
    
    hasDiscountInput.addEventListener('change', function() {
        membershipFormData.has_discount = this.checked;
        document.getElementById('membershipDiscountPrice').style.display = this.checked ? 'block' : 'none';
        document.getElementById('membershipDiscountPriceGroup').style.display = this.checked ? 'block' : 'none';
        updatePreviewWithMembership();
    });
    
    buttonTextInput.addEventListener('input', function() {
        membershipFormData.button_text = this.value;
        updatePreviewWithMembership();
    });
    
    isActiveInput.addEventListener('change', function() {
        membershipFormData.is_active = this.checked;
        updatePreviewWithMembership();
    });
    
    // Billing settings listeners
    frequencyInput.addEventListener('change', function() {
        membershipFormData.billing_settings.frequency = this.value;
        updatePreviewWithMembership();
    });
    
    hasEndDateInput.addEventListener('change', function() {
        membershipFormData.billing_settings.has_end_date = this.checked;
        document.getElementById('membershipEndAfterMonths').style.display = this.checked ? 'block' : 'none';
        document.getElementById('membershipEndAfterGroup').style.display = this.checked ? 'block' : 'none';
        updatePreviewWithMembership();
    });
    
    endAfterMonthsInput.addEventListener('input', function() {
        membershipFormData.billing_settings.end_after_months = parseInt(this.value) || 12;
        updatePreviewWithMembership();
    });
    
    // Navegación de tabs
    document.querySelectorAll('#membershipTabs button').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showMembershipTab(tabName);
        });
    });
    
    // Upload de imagen principal
    document.getElementById('membershipImageInput').addEventListener('change', handleMembershipImageUpload);
}

function removeMembershipFormListeners() {
    // Remover listeners si es necesario
    const titleInput = document.getElementById('membershipTitle');
    const subtitleInput = document.getElementById('membershipSubtitle');
    
    if (titleInput) {
        const newTitleInput = titleInput.cloneNode(true);
        titleInput.parentNode.replaceChild(newTitleInput, titleInput);
    }
    
    if (subtitleInput) {
        const newSubtitleInput = subtitleInput.cloneNode(true);
        subtitleInput.parentNode.replaceChild(newSubtitleInput, subtitleInput);
    }
}

function showMembershipTab(tabName) {
    currentMembershipTab = tabName;
    
    // Actualizar navegación de tabs
    document.querySelectorAll('#membershipTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-membership-tab`).classList.add('active');
    
    // Mostrar panel correspondiente
    document.querySelectorAll('.membership-tab-content-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(`${tabName}-membership-panel`).style.display = 'block';
    
    // Actualizar botones de navegación
    updateMembershipTabNavigation();
}

function updateMembershipTabNavigation() {
    const prevBtn = document.getElementById('prevMembershipTabBtn');
    const nextBtn = document.getElementById('nextMembershipTabBtn');
    const createBtn = document.getElementById('createMembershipBtn');
    
    switch(currentMembershipTab) {
        case 'datos':
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'contenido':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            createBtn.style.display = 'none';
            break;
        case 'opciones':
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'none';
            createBtn.style.display = 'block';
            
            // Verificar si estamos en modo edición
            if (membershipFormData.id) {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Membresía';
                createBtn.onclick = function() {
                    updateExistingMembership();
                };
            } else {
                createBtn.innerHTML = '<i class="bi bi-check-circle"></i> Crear Membresía';
                createBtn.onclick = function() {
                    createMembership();
                };
            }
            break;
    }
}

function nextMembershipTab() {
    switch(currentMembershipTab) {
        case 'datos':
            showMembershipTab('contenido');
            break;
        case 'contenido':
            showMembershipTab('opciones');
            break;
    }
}

function previousMembershipTab() {
    switch(currentMembershipTab) {
        case 'contenido':
            showMembershipTab('datos');
            break;
        case 'opciones':
            showMembershipTab('contenido');
            break;
    }
}

function handleMembershipImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        membershipFormData.image_url = e.target.result;
        document.getElementById('membershipImagePreview').innerHTML = `
            <img src="${e.target.result}" alt="Imagen de la membresía">
        `;
        updatePreviewWithMembership();
        showToast('¡Imagen subida correctamente!', 'success');
    };
    reader.readAsDataURL(file);
}

function updatePreviewWithMembership() {
    if (!membershipFormData || !membershipFormData.title) {
        // Si no hay datos de membresía, mostrar preview normal
        updatePreview();
        return;
    }

    // Durante la edición de membresía, mostrar la página de membresía simulada en el preview
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) {
        console.warn('Preview content element not found');
        return;
    }
    
    const username = appState.profile.username || 'usuario';
    const profileName = appState.profile.name || 'Tu Nombre';
    
    // Crear una versión temporal de la membresía para preview
    const tempMembership = {
        id: membershipFormData.id || 'preview',
        type: 'membership',
        title: membershipFormData.title || 'Nueva Membresía',
        subtitle: membershipFormData.subtitle || '',
        description: membershipFormData.description || '',
        price: parseFloat(membershipFormData.price) || 0,
        discount_price: membershipFormData.has_discount ? (parseFloat(membershipFormData.discount_price) || 0) : 0,
        has_discount: membershipFormData.has_discount,
        image_url: membershipFormData.image_url || '',
        button_text: membershipFormData.button_text || 'Subscribirse',
        is_active: membershipFormData.is_active !== false,
        reviews: membershipFormData.reviews || [],
        custom_fields: membershipFormData.custom_fields || [],
        billing_settings: membershipFormData.billing_settings || {}
    };
    
    // Mostrar la página de membresía en lugar del perfil general
    const displayPrice = tempMembership.has_discount && tempMembership.discount_price > 0 
        ? tempMembership.discount_price 
        : tempMembership.price;
    const originalPrice = tempMembership.has_discount && tempMembership.discount_price > 0 
        ? tempMembership.price 
        : null;
    
    // Obtener el texto de frecuencia
    const getFrequencyText = (frequency) => {
        const frequencies = {
            'daily': 'diario',
            'weekly': 'semanal', 
            'monthly': 'mensual',
            'quarterly': 'trimestral',
            'semi_annually': 'semestral',
            'annually': 'anual'
        };
        return frequencies[frequency] || 'mensual';
    };
    
    const frequencyText = getFrequencyText(tempMembership.billing_settings.frequency);
    
    // HTML de la página de membresía simulada
    previewContent.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            overflow-y: auto;
        ">
            <!-- Header con botón de regreso -->
            <div style="
                position: sticky;
                top: 0;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid #333;
                padding: 1rem;
                z-index: 10;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #a0a0a0;
                    font-size: 0.95rem;
                    cursor: pointer;
                ">
                    <i class="bi bi-arrow-left"></i>
                    <span>Volver al perfil</span>
                </div>
            </div>

            <!-- Contenido de la membresía -->
            <div style="padding: 2rem 1.5rem; padding-bottom: 80px;">
                <!-- Imagen de la membresía -->
                ${tempMembership.image_url ? `
                    <div style="width: 100%; height: 200px; border-radius: 1rem; overflow: hidden; margin-bottom: 2rem; background: #2a2a2a; display: flex; align-items: center; justify-content: center;">
                        <img src="${tempMembership.image_url}" alt="${tempMembership.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                ` : `
                    <div style="width: 100%; height: 200px; border-radius: 1rem; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; color: white; font-size: 4rem;">
                        <i class="bi bi-crown"></i>
                    </div>
                `}

                <!-- Información de la membresía -->
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.2;">
                        ${tempMembership.title}
                    </h1>
                    
                    ${tempMembership.subtitle ? `
                        <p style="font-size: 1.1rem; color: #a0a0a0; margin-bottom: 1rem; line-height: 1.4;">
                            ${tempMembership.subtitle}
                        </p>
                    ` : ''}
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #a0a0a0;">
                            <i class="bi bi-arrow-repeat"></i>
                            <span style="font-size: 0.9rem;">Facturación ${frequencyText}</span>
                        </div>
                        ${tempMembership.billing_settings.has_end_date ? `
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: #a0a0a0;">
                                <i class="bi bi-calendar-check"></i>
                                <span style="font-size: 0.9rem;">Finaliza en ${tempMembership.billing_settings.end_after_months} meses</span>
                            </div>
                        ` : `
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: #a0a0a0;">
                                <i class="bi bi-infinity"></i>
                                <span style="font-size: 0.9rem;">Sin límite de tiempo</span>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Precio -->
                ${tempMembership.price > 0 ? `
                    <div style="margin-bottom: 2rem;">
                        <span style="font-size: 2rem; font-weight: 700; color: #fbbf24;">
                            $${displayPrice}
                        </span>
                        <span style="color: #a0a0a0; font-size: 1rem; margin-left: 0.5rem;">
                            / ${frequencyText}
                        </span>
                        ${originalPrice ? `
                            <div style="margin-top: 0.5rem;">
                                <span style="font-size: 1.2rem; color: #666; text-decoration: line-through; margin-right: 1rem;">
                                    $${originalPrice} / ${frequencyText}
                                </span>
                                <span style="background: #dc2626; color: white; font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 2rem; font-weight: 600;">
                                    -${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                                </span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Descripción -->
                ${tempMembership.description ? `
                    <div style="line-height: 1.6; color: #d0d0d0; margin-bottom: 2rem; white-space: pre-line;">
                        ${tempMembership.description}
                    </div>
                ` : ''}

                <!-- Beneficios de membresía (simulados) -->
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="bi bi-star-fill" style="color: #fbbf24;"></i>
                        ¿Qué incluye tu membresía?
                    </h3>
                    <div style="space-y: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #2a2a2a; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                            <i class="bi bi-check-circle-fill" style="color: #10b981;"></i>
                            <span>Acceso completo a todo el contenido premium</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #2a2a2a; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                            <i class="bi bi-check-circle-fill" style="color: #10b981;"></i>
                            <span>Comunidad privada exclusiva</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #2a2a2a; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                            <i class="bi bi-check-circle-fill" style="color: #10b981;"></i>
                            <span>Actualizaciones y contenido nuevo cada semana</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #2a2a2a; border-radius: 0.5rem;">
                            <i class="bi bi-check-circle-fill" style="color: #10b981;"></i>
                            <span>Soporte prioritario y mentoría personalizada</span>
                        </div>
                    </div>
                </div>

                <!-- Botón de suscripción -->
                <div style="
                    background: rgba(26, 26, 26, 0.95);
                    border-top: 1px solid #333;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-top: 2rem;
                ">
                    <button style="
                        width: 100%;
                        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                        border: none;
                        color: white;
                        font-size: 1rem;
                        font-weight: 600;
                        padding: 0.875rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    " onclick="parent.postMessage({type: 'openPurchaseModal', product: ${JSON.stringify(tempMembership).replace(/"/g, '&quot;')}}, '*')">
                        <i class="bi bi-crown"></i>
                        <span>${tempMembership.button_text || `Subscribirse por $${displayPrice}/${frequencyText}`}</span>
                    </button>
                    ${tempMembership.billing_settings.has_end_date ? `
                        <p style="text-align: center; color: #a0a0a0; font-size: 0.85rem; margin-top: 0.75rem; margin-bottom: 0;">
                            Se cancelará automáticamente después de ${tempMembership.billing_settings.end_after_months} meses
                        </p>
                    ` : `
                        <p style="text-align: center; color: #a0a0a0; font-size: 0.85rem; margin-top: 0.75rem; margin-bottom: 0;">
                            Cancela en cualquier momento
                        </p>
                    `}
                </div>
            </div>
        </div>
    `;
}

function createMembership() {
    if (!membershipFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    if (!membershipFormData.price || parseFloat(membershipFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }
    
    const newMembership = createMembershipFromForm();
    
    appState.products.push(newMembership);
    saveToStorage();
    renderProducts();
    updatePreview();
    
    closeMembershipFormOverlay();
    showToast('¡Membresía creada correctamente!', 'success');
}

function createMembershipFromForm() {
    return {
        id: membershipFormData.id || Date.now(),
        type: 'membership',
        title: membershipFormData.title.trim(),
        subtitle: membershipFormData.subtitle.trim(),
        description: membershipFormData.description.trim(),
        price: parseFloat(membershipFormData.price) || 0,
        discount_price: membershipFormData.has_discount ? (parseFloat(membershipFormData.discount_price) || 0) : 0,
        has_discount: membershipFormData.has_discount,
        image_url: membershipFormData.image_url,
        button_text: membershipFormData.button_text || 'Subscribirse',
        is_active: membershipFormData.is_active,
        reviews: [...membershipFormData.reviews],
        custom_fields: [...membershipFormData.custom_fields],
        billing_settings: {
            frequency: membershipFormData.billing_settings.frequency,
            has_end_date: membershipFormData.billing_settings.has_end_date,
            end_after_months: membershipFormData.billing_settings.end_after_months
        },
        sales: 0,
        sort_order: appState.products.length + 1,
        status: membershipFormData.is_active ? 'active' : 'inactive',
        created_at: new Date().toISOString()
    };
}

// ============== FUNCIONES DE LIMPIEZA GLOBAL ==============

// Función para cerrar todos los overlays y limpiar el estado
function closeAllOverlays() {
    // Lista de todos los overlays posibles
    const overlayIds = [
        'productFormOverlay',
        'consultationFormOverlay', 
        'courseFormOverlay',
        'membershipFormOverlay',
        'profileOverlay',
        'createModal',
        'productTypeOverlay'
    ];
    
    // Cerrar todos los overlays
    overlayIds.forEach(overlayId => {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.style.display = 'none';
        }
    });
    
    // Limpiar variables globales
    currentProductTab = 'datos';
    currentConsultationTab = 'datos';
    currentCourseTab = 'datos';
    currentMembershipTab = 'datos';
    
    // Restaurar preview normal
    updatePreview();
    
    // Remover clases de modal abierto del body
    document.body.classList.remove('modal-open');
    
    // Limpiar cualquier backdrop modal
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    console.log('Todos los overlays cerrados y estado limpiado');
}

// Función para inicializar el estado limpio al cargar la página
function initializeCleanState() {
    // COMENTADO: Esta función causa problemas con los event listeners
    // closeAllOverlays();
    
    // Agregar event listener para la tecla Escape SOLAMENTE
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllOverlays();
        }
    });
    
    // COMENTADO: Este listener interfiere con los clicks normales
    // // Agregar event listener para clics fuera de los modals
    // document.addEventListener('click', function(e) {
    //     if (e.target.classList.contains('profile-overlay') || e.target.classList.contains('overlay')) {
    //         closeAllOverlays();
    //     }
    // });
}

// ============== FIN FUNCIONES DE LIMPIEZA GLOBAL ==============

// Exportar funciones para uso en Blade (Laravel)
window.MiTienda = {
    showProfileModal,
    showProfileOverlay,
    closeProfileOverlay,
    showCreateModal,
    selectProductType,
    showProductTypeOverlay,
    closeProductTypeOverlay,
    selectDigitalProductType,
    editProduct,
    deleteProduct,
    saveProfile,
    saveOverlayProfile,
    saveLinkProduct,
    getState: () => appState,
    setState: (newState) => {
        appState = { ...appState, ...newState };
        saveToStorage();
        renderProducts();
        updatePreview();
    }
};

// Función de prueba para debug - COMENTADA
/*
window.testOverlay = function() {
    console.log('Test Overlay function called');
    const overlay = document.getElementById('productTypeOverlay');
    if (overlay) {
        console.log('Overlay element found');
        overlay.style.display = 'block';
        console.log('Overlay display set to block');
    } else {
        console.log('ERROR: Overlay element not found');
        alert('ERROR: Overlay element not found');
    }
};
*/

// Inicializar aplicación y estado limpio
console.log('Aplicación Mi Tienda cargada');
console.log('Usando HTML + CSS + JS vanilla (compatible con Laravel Blade + Bootstrap)');
console.log('Estado inicial:', appState);

// Función para copiar el enlace público
function copyPublicLink() {
    const linkInput = document.getElementById('publicLinkInput');
    
    try {
        // Seleccionar el texto
        linkInput.select();
        linkInput.setSelectionRange(0, 99999); // Para dispositivos móviles
        
        // Copiar al portapapeles
        navigator.clipboard.writeText(linkInput.value).then(() => {
            showToast('¡Enlace copiado al portapapeles!', 'success');
            
            // Efecto visual temporal
            linkInput.style.background = '#DEF7EC';
            linkInput.style.borderColor = '#10B981';
            setTimeout(() => {
                linkInput.style.background = '#F9FAFB';
                linkInput.style.borderColor = '#E5E7EB';
            }, 1000);
        }).catch(() => {
            // Fallback para navegadores antiguos
            document.execCommand('copy');
            showToast('¡Enlace copiado!', 'success');
        });
    } catch (err) {
        // Fallback adicional
        showToast('Por favor, selecciona y copia el enlace manualmente', 'info');
    }
}

// Actualizar el enlace público cuando cambie el username
function updatePublicLink() {
    const username = document.getElementById('profileUsername').textContent.replace('@', '');
    const publicLinkInput = document.getElementById('publicLinkInput');
    if (publicLinkInput) {
        publicLinkInput.value = `https://clickmy.link/u/${username}`;
    }
}