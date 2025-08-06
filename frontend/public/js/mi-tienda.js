// Estado global de la aplicación
let appState = {
    profile: {
        name: 'Trading Sharks',
        username: 'tradingsharks',
        bio: 'Aquí le cambia la vida 🔥📈',
        avatar_url: '',
        social_links: {
            tiktok: '',
            spotify: '',
            instagram: '',
            youtube: '',
            link: '',
            discord: '',
            twitter: ''
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
            sort_order: 1
        },
        {
            id: 2,
            type: 'digital_product',
            title: 'Guía completa para invertir en video',
            description: 'Guía completa de la A a la Z para aprender a invertir y lograr la libertad financiera',
            url: '',
            price: 49.99,
            image_url: '',
            status: 'active',
            sales: 0,
            sort_order: 2
        },
        {
            id: 3,
            type: 'digital_product',
            title: 'Guía completa para invertir',
            description: 'Guía paso a paso de la A a la Z de cómo invertir y ganar interés compuesto',
            url: '',
            price: 149,
            image_url: '',
            status: 'active',
            sales: 3,
            sort_order: 3
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
    console.log('Mi Tienda - Aplicación inicializada');
    renderProducts();
}

function loadFromStorage() {
    const savedData = localStorage.getItem('miTiendaData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appState = { ...appState, ...parsedData };
            
            // Actualizar interfaz con datos guardados
            document.getElementById('profileName').textContent = appState.profile.name;
            document.getElementById('profileUsername').textContent = '@' + appState.profile.username;
            document.getElementById('profileBio').textContent = appState.profile.bio;
            
            if (appState.profile.avatar_url) {
                const avatarElement = document.getElementById('profileAvatar');
                avatarElement.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
            
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

function setupEventListeners() {
    // Bio counter
    const bioInput = document.getElementById('bioInput');
    const bioCounter = document.getElementById('bioCounter');
    
    if (bioInput && bioCounter) {
        bioInput.addEventListener('input', function() {
            bioCounter.textContent = this.value.length;
        });
    }

    // Title counter
    const titleInput = document.getElementById('productTitle');
    const titleCounter = document.getElementById('titleCounter');
    
    if (titleInput && titleCounter) {
        titleInput.addEventListener('input', function() {
            titleCounter.textContent = this.value.length;
        });
    }
    
    // Image preview
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', handleImagePreview);
    }
    
    // Avatar preview
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
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
                // Actualizar orden en el estado
                const productId = parseInt(evt.item.dataset.id);
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
                showToast('¡Orden actualizado correctamente!', 'success');
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
        digital_product: 'box-seam',
        consultation: 'telephone',
        course: 'mortarboard',
        membership: 'crown'
    };
    return icons[type] || 'box-seam';
}

function getProductTypeLabel(type) {
    const labels = {
        link: 'Link',
        digital_product: 'Producto',
        consultation: 'Consultoría',
        course: 'Curso',
        membership: 'Membresía'
    };
    return labels[type] || 'Producto';
}

function updatePreview() {
    // Actualizar información del perfil
    document.getElementById('previewName').textContent = appState.profile.name;
    document.getElementById('previewBio').textContent = appState.profile.bio;
    
    // Actualizar avatar en vista previa
    const previewAvatar = document.getElementById('previewAvatar');
    if (appState.profile.avatar_url) {
        previewAvatar.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar">`;
    } else {
        previewAvatar.innerHTML = '👤';
    }
    
    // Actualizar productos en vista previa
    const previewProducts = document.getElementById('previewProducts');
    if (!previewProducts) return;
    
    if (appState.products.length === 0) {
        previewProducts.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: #666;">
                <i class="bi bi-box" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }
    
    const sortedProducts = [...appState.products].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    previewProducts.innerHTML = sortedProducts.map(product => `
        <div class="preview-product">
            <div class="preview-product-content">
                <div class="preview-product-icon ${product.type}">
                    <i class="bi bi-${getProductIcon(product.type)}"></i>
                </div>
                <div class="preview-product-info">
                    <h4>${truncateText(product.title, 35)}</h4>
                    ${product.description ? `<p>${truncateText(product.description, 50)}</p>` : ''}
                </div>
                ${product.type !== 'link' && product.price > 0 ? `
                    <div class="preview-product-price">$${product.price}</div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Funciones para modales
function showProfileModal() {
    // Llenar el formulario con los datos actuales
    document.getElementById('nameInput').value = appState.profile.name;
    document.getElementById('usernameInput').value = appState.profile.username;
    document.getElementById('bioInput').value = appState.profile.bio;
    
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function showCreateModal() {
    isEditing = false;
    editingId = null;
    
    // Resetear modal
    document.getElementById('modalTitle').textContent = '¿Qué quieres crear?';
    document.getElementById('typeSelector').style.display = 'block';
    document.getElementById('productForm').style.display = 'none';
    document.getElementById('saveBtn').style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('productFormElement').reset();
    document.getElementById('imagePreview').innerHTML = '<i class="bi bi-image text-muted" style="font-size: 3rem;"></i>';
    
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
}

function selectType(type) {
    document.getElementById('productType').value = type;
    
    // Ocultar selector y mostrar formulario
    document.getElementById('typeSelector').style.display = 'none';
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('saveBtn').style.display = 'inline-block';
    
    // Actualizar título del modal
    const typeLabels = {
        link: 'Crear Enlace Externo',
        digital_product: 'Crear Producto Digital',
        consultation: 'Crear Consultoría',
        course: 'Crear Curso Digital'
    };
    document.getElementById('modalTitle').textContent = typeLabels[type] || 'Crear Producto';
    
    // Mostrar/ocultar campos según el tipo
    const urlField = document.getElementById('urlField');
    const priceField = document.getElementById('priceField');
    const fileField = document.getElementById('fileField');
    
    if (type === 'link') {
        urlField.style.display = 'block';
        priceField.style.display = 'none';
        fileField.style.display = 'none';
    } else {
        urlField.style.display = 'none';
        priceField.style.display = 'block';
        fileField.style.display = 'block';
    }
    
    // Establecer placeholders según el tipo
    const placeholders = {
        link: {
            title: 'Ej: Mi canal de YouTube',
            description: 'Descripción del enlace (opcional)'
        },
        digital_product: {
            title: 'Ej: Guía de Marketing Digital',
            description: 'Descripción detallada del producto'
        },
        consultation: {
            title: 'Ej: Consultoría Personalizada 1 a 1',
            description: 'Descripción de la sesión de consultoría'
        },
        course: {
            title: 'Ej: Curso Completo de Trading',
            description: 'Descripción del curso y lo que aprenderán'
        }
    };
    
    if (placeholders[type]) {
        document.getElementById('productTitle').placeholder = placeholders[type].title;
        document.getElementById('productDescription').placeholder = placeholders[type].description;
    }
}

function editProduct(id) {
    const product = appState.products.find(p => p.id === id);
    if (!product) return;
    
    isEditing = true;
    editingId = id;
    
    // Configurar modal para edición
    selectType(product.type);
    
    // Llenar formulario con datos del producto
    document.getElementById('productId').value = product.id;
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productUrl').value = product.url || '';
    document.getElementById('productPrice').value = product.price || '';
    
    // Actualizar preview de imagen si existe
    if (product.image_url) {
        document.getElementById('imagePreview').innerHTML = `
            <img src="${product.image_url}" alt="Preview" style="max-width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px;">
        `;
    }
    
    // Actualizar título del modal
    document.getElementById('modalTitle').textContent = `Editar ${getProductTypeLabel(product.type)}`;
    
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
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
    // Obtener datos del formulario
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
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileUsername').textContent = '@' + username;
    document.getElementById('profileBio').textContent = bio;
    
    saveToStorage();
    updatePreview();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    modal.hide();
    
    showToast('Perfil actualizado correctamente', 'success');
}

function saveProduct() {
    const form = document.getElementById('productFormElement');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const type = document.getElementById('productType').value;
    const title = document.getElementById('productTitle').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const url = document.getElementById('productUrl').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    
    if (!title) {
        showToast('El título es obligatorio', 'error');
        return;
    }
    
    if (type === 'link' && !url) {
        showToast('La URL es obligatoria para los enlaces', 'error');
        return;
    }
    
    const productData = {
        type,
        title,
        description,
        url,
        price,
        image_url: '', // Se actualizaría con la imagen subida
        status: 'active',
        sales: 0
    };
    
    if (isEditing && editingId) {
        // Actualizar producto existente
        const index = appState.products.findIndex(p => p.id === editingId);
        if (index !== -1) {
            appState.products[index] = { ...appState.products[index], ...productData };
        }
        showToast('Producto actualizado correctamente', 'success');
    } else {
        // Crear nuevo producto
        const newProduct = {
            id: Date.now(), // Usar timestamp como ID único
            sort_order: appState.products.length + 1,
            ...productData
        };
        
        appState.products.push(newProduct);
        showToast('Producto creado correctamente', 'success');
    }
    
    saveToStorage();
    renderProducts();
    updatePreview();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createModal'));
    modal.hide();
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('imagePreview').innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px;">
        `;
    };
    reader.readAsDataURL(file);
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        appState.profile.avatar_url = e.target.result;
        
        // Actualizar avatar en la interfaz
        const avatarElement = document.getElementById('profileAvatar');
        avatarElement.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        
        saveToStorage();
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const messageId = type === 'success' ? 'successMessage' : 'errorMessage';
    
    document.getElementById(messageId).textContent = message;
    
    const toast = new bootstrap.Toast(document.getElementById(toastId), {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
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

// Event listeners para cards de tipo de producto
document.addEventListener('click', function(e) {
    if (e.target.closest('.product-type-card')) {
        // Efecto visual para la selección
        document.querySelectorAll('.product-type-card').forEach(card => {
            card.style.transform = 'scale(1)';
        });
        
        const selectedCard = e.target.closest('.product-type-card');
        selectedCard.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            selectedCard.style.transform = 'scale(1)';
        }, 150);
    }
});

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
    showCreateModal,
    editProduct,
    deleteProduct,
    saveProfile,
    saveProduct,
    selectType,
    getState: () => appState,
    setState: (newState) => {
        appState = { ...appState, ...newState };
        saveToStorage();
        renderProducts();
        updatePreview();
    }
};

console.log('Mi Tienda v2.0 - Listo para Laravel Blade + Bootstrap');