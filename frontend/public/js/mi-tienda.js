// Estado global de la aplicación
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

// Inicialización
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
        localStorage.setItem('miTiendaData', JSON.stringify(appState));
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

function updateProfileUI() {
    document.getElementById('profileName').textContent = appState.profile.name;
    document.getElementById('profileUsername').textContent = '@' + appState.profile.username;
    document.getElementById('profileBio').textContent = appState.profile.bio;
    
    if (appState.profile.avatar_url) {
        const avatarElement = document.getElementById('profileAvatar');
        avatarElement.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }
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
        membership: 'Membresía'
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
                    <div class="preview-product">
                        <div class="preview-product-content">
                            <div class="preview-product-icon ${product.type}">
                                ${product.image_url && product.type === 'link' ? 
                                    `<img src="${product.image_url}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 0.5rem;">` :
                                    `<i class="bi bi-${getProductIcon(product.type)}"></i>`
                                }
                            </div>
                            <div class="preview-product-info">
                                <h4>${truncateText(product.title, 35)}</h4>
                                ${product.description && product.type !== 'link' ? `<p>${truncateText(product.description, 50)}</p>` : ''}
                            </div>
                            ${product.type !== 'link' && product.price > 0 ? `
                                <div class="preview-product-price">$${product.price}</div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    previewContent.innerHTML = previewHeader + previewProducts;
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
    
    // Configurar listeners para actualización en tiempo real
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
    
    // Nombre - actualización en tiempo real
    const handleNameChange = function() {
        appState.profile.name = this.value;
        updateProfileUI();
        updatePreview();
    };
    
    // Username - actualización en tiempo real
    const handleUsernameChange = function() {
        appState.profile.username = this.value;
        updateProfileUI();
        updatePreview();
    };
    
    // Bio - actualización en tiempo real
    const handleBioChange = function() {
        appState.profile.bio = this.value;
        bioCounter.textContent = this.value.length;
        updateProfileUI();
        updatePreview();
    };
    
    // Avatar - actualización en tiempo real
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
    
    // Redes sociales - actualización en tiempo real
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
    
    // Guardar referencias para poder removerlos después
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

// Estado para el formulario de producto
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

function selectDigitalProductType(productType) {
    // Cerrar la vista superpuesta de selección de tipo
    closeProductTypeOverlay();
    
    // Mostrar el formulario específico según el tipo
    if (productType === 'digital_product') {
        showProductFormOverlay();
    } else {
        // Para otros tipos, mostrar mensaje temporal
        const typeNames = {
            consultation: 'Llamada de Consultoría',
            course: 'Curso Digital',
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
}

function closeProductFormOverlay() {
    document.getElementById('productFormOverlay').style.display = 'none';
    removeProductFormListeners();
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
    // Crear preview temporal del producto
    const tempProduct = {
        id: 'preview',
        type: 'product',
        title: productFormData.title || 'Nuevo Producto Digital',
        description: productFormData.description || 'Descripción del producto...',
        price: parseFloat(productFormData.price) || 0,
        discount_price: productFormData.has_discount ? (parseFloat(productFormData.discount_price) || 0) : 0,
        has_discount: productFormData.has_discount,
        image_url: productFormData.image_url,
        status: productFormData.is_active ? 'active' : 'inactive',
        sales: 0,
        sort_order: appState.products.length + 1
    };
    
    // Añadir temporalmente a los productos para el preview
    const tempProducts = [...appState.products, tempProduct];
    const originalProducts = appState.products;
    appState.products = tempProducts;
    
    // Actualizar preview
    updatePreview();
    
    // Restaurar productos originales
    appState.products = originalProducts;
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

function editProduct(id) {
    const product = appState.products.find(p => p.id === id);
    if (!product) return;
    
    console.log('Editando producto:', product);
    // Funcionalidad de edición pendiente
    showToast('Funcionalidad de edición próximamente', 'info');
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

console.log('Mi Tienda v2.1 - Listo para Laravel Blade + Bootstrap');
console.log('Estado inicial:', appState);