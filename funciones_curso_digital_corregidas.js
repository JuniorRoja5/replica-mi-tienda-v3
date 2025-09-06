// ============== FUNCIONES CURSO DIGITAL - VERSIÓN CORREGIDA SEGÚN DOCUMENTACIÓN ==============

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

    // Reset reviews
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
    // Titles with real-time update
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

    // Event listeners for real-time update
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

    // Tab navigation
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

    // Update tab navigation
    document.querySelectorAll('#courseTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-course-tab`).classList.add('active');

    // Mostrar panel correspondiente
    document.querySelectorAll('.course-tab-content-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(`${tabName}-course-panel`).style.display = 'block';

    // Update navigation buttons
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

            // Check if we are in edit mode
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

// ✅ FIX 3: UPLOAD CENTRALIZADO - Cambiar de Base64 a uploadImageToServer()
async function handleCourseImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }

    // ✅ USAR uploadImageToServer EN LUGAR DE Base64
    try {
        const imageUrl = await uploadImageToServer(file);
        courseFormData.image_url = imageUrl;
        document.getElementById('courseImagePreview').innerHTML = `
            <img src="${imageUrl}" alt="Imagen del curso">
        `;
        updatePreviewWithCourse();
        showToast('¡Imagen subida correctamente!', 'success');
    } catch (error) {
        console.error('Error al subir imagen:', error);
        // Error ya mostrado por uploadImageToServer
    }
}

// ✅ FIX 3: UPLOAD CENTRALIZADO - Cambiar de Base64 a uploadImageToServer()
async function handleCourseHeaderImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }

    // ✅ USAR uploadImageToServer EN LUGAR DE Base64
    try {
        const imageUrl = await uploadImageToServer(file);
        courseFormData.course_content.header_image_url = imageUrl;
        document.getElementById('courseHeaderImagePreview').innerHTML = `
            <img src="${imageUrl}" alt="Imagen header del curso">
        `;
        updatePreviewWithCourse();
        showToast('¡Imagen header subida correctamente!', 'success');
    } catch (error) {
        console.error('Error al subir imagen header:', error);
        // Error ya mostrado por uploadImageToServer
    }
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

    if (currentCourseTab === 'datos') {
        showCardPreview(courseFormData, 'course');
        return;
    }

    // Durante la edición del curso, mostrar la página del curso simulada en el preview
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) {
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

    // HTML for simulated course page
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

// ✅ FIX 2: CAMPOS META - Mover campos a nivel raíz del payload
async function createCourse() {
    if (!courseFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }

    if (!courseFormData.price || parseFloat(courseFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }

    // Asegurar que el curso esté activo al crear
    courseFormData.is_active = true;

    // Si estamos autenticados con Laravel, guardar en API
    if (laravelAuth.authenticated) {
        try {
            // ✅ PREPARAR DATOS CON CAMPOS A NIVEL RAÍZ
            const productData = {
                type: 'course',
                title: courseFormData.title.trim(),
                subtitle: courseFormData.subtitle.trim() || null,
                description: courseFormData.description.trim() || null,
                price: parseFloat(courseFormData.price) || 0,
                discount_price: courseFormData.has_discount ? (parseFloat(courseFormData.discount_price) || 0) : null,
                currency: 'USD',
                image_url: courseFormData.image_url || null,
                button_text: courseFormData.button_text || 'Empezar curso',
                is_active: true,
                // ✅ MOVIDOS A NIVEL RAÍZ (igual que Consultoría)
                reviews: courseFormData.reviews || [],
                custom_fields: courseFormData.custom_fields || [],
                course_content: courseFormData.course_content || {},
                meta: {
                    has_discount: courseFormData.has_discount
                }
            };

            const response = await fetch('/user/api/mi-tienda/products', {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (result.success) {
                // Recargar productos desde API para sincronizar
                await loadProductsFromAPI();
                renderProducts();
                updatePreview();

                closeCourseFormOverlay();
                showToast('¡Curso creado correctamente!', 'success');
                return;
            } else {
                showToast('Error al guardar: ' + (result.message || 'Error desconocido'), 'error');
            }
        } catch (error) {
            showToast('Error de conexión al guardar curso', 'error');
        }
    }

    // Fallback: usar localStorage si API falla
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

// ✅ FIX 1: DATA HYDRATION - Función editCourse corregida con patrón dual de lectura
function editCourse(product) {
    // ✅ PATRÓN DUAL DE LECTURA: nivel raíz primero, meta como fallback
    courseFormData = {
        id: product.id,
        title: product.title || '',
        subtitle: product.subtitle || product.meta?.subtitle || '',
        description: product.description || '',
        price: product.price || '',
        discount_price: product.discount_price || product.meta?.discount_price || '',
        has_discount: product.has_discount || product.meta?.has_discount || false,
        image_url: product.image_url || '',
        button_text: product.button_text || product.meta?.button_text || 'Empezar curso',
        is_active: product.is_active !== false,
        reviews: [...(product.reviews || product.meta?.reviews || [])],
        custom_fields: [...(product.custom_fields || product.meta?.custom_fields || [
            { id: 'name', label: 'Nombre completo', type: 'text', required: true },
            { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
        ])],
        course_content: {...(product.course_content || product.meta?.course_content || {
            header_image_url: '',
            title: product.title || '',
            description: product.description || '',
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
        })}
    };

    // ✅ POBLAR CAMPOS HTML (CRÍTICO PARA FUNCIONALIDAD)
    document.getElementById('courseTitle').value = courseFormData.title;
    document.getElementById('courseSubtitle').value = courseFormData.subtitle;
    document.getElementById('courseDescription').value = courseFormData.description;
    document.getElementById('coursePrice').value = courseFormData.price;
    document.getElementById('courseDiscountPrice').value = courseFormData.discount_price;
    document.getElementById('courseHasDiscount').checked = courseFormData.has_discount;
    document.getElementById('courseButtonText').value = courseFormData.button_text;
    document.getElementById('courseIsActive').checked = courseFormData.is_active;
    
    // Course content
    document.getElementById('courseContentTitle').value = courseFormData.course_content.title;
    document.getElementById('courseContentDescription').value = courseFormData.course_content.description;
    
    // Actualizar contadores de caracteres
    document.getElementById('courseTitleCounter').textContent = courseFormData.title.length;
    document.getElementById('courseSubtitleCounter').textContent = courseFormData.subtitle.length;
    
    // Mostrar imagen si existe
    if (courseFormData.image_url) {
        // Asegurar que la URL de la imagen sea absoluta
        let imageUrl = courseFormData.image_url;
        if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
            imageUrl = 'https://clickmy.link' + imageUrl;
        }
        
        document.getElementById('courseImagePreview').innerHTML = `
            <img src="${imageUrl}" alt="Imagen del curso">
        `;
    }
    
    // Mostrar imagen header si existe
    if (courseFormData.course_content.header_image_url) {
        let headerImageUrl = courseFormData.course_content.header_image_url;
        if (headerImageUrl.startsWith('/') && !headerImageUrl.startsWith('//')) {
            headerImageUrl = 'https://clickmy.link' + headerImageUrl;
        }
        
        document.getElementById('courseHeaderImagePreview').innerHTML = `
            <img src="${headerImageUrl}" alt="Imagen header del curso">
        `;
    }
    
    // Manejar campos de descuento
    const discountFields = document.getElementById('courseDiscountFields');
    if (discountFields) {
        discountFields.style.display = courseFormData.has_discount ? 'block' : 'none';
    }
    
    // ✅ RENDERIZAR ARRAYS COMPLEJOS
    renderCourseReviews();
    generateCourseCustomFields();
    renderCourseModules();

    // Mostrar el overlay de edición
    document.getElementById('courseFormOverlay').style.display = 'block';
    document.getElementById('courseFormTitle').textContent = 'Editar Curso Digital';

    // Configurar tab inicial
    currentCourseTab = 'datos';
    showCourseTab('datos');

    // Configurar event listeners
    setupCourseFormListeners();

    // Activar preview inmediatamente con los datos existentes
    updatePreviewWithCourse();
}

// ✅ FIX 2: CAMPOS META - updateExistingCourse corregida con campos a nivel raíz
async function updateExistingCourse() {
    if (!courseFormData.title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }

    if (!courseFormData.price || parseFloat(courseFormData.price) <= 0) {
        showToast('El precio debe ser mayor a 0', 'error');
        return;
    }

    // Si estamos autenticados con Laravel, actualizar en API
    if (laravelAuth.authenticated) {
        try {
            // ✅ PREPARAR DATOS CON CAMPOS A NIVEL RAÍZ
            const productData = {
                id: courseFormData.id,
                type: 'course',
                title: courseFormData.title.trim(),
                subtitle: courseFormData.subtitle.trim() || null,
                description: courseFormData.description.trim() || null,
                price: parseFloat(courseFormData.price) || 0,
                discount_price: courseFormData.has_discount ? (parseFloat(courseFormData.discount_price) || 0) : null,
                currency: 'USD',
                image_url: courseFormData.image_url || null,
                button_text: courseFormData.button_text || 'Empezar curso',
                is_active: courseFormData.is_active !== false,
                // ✅ MOVIDOS A NIVEL RAÍZ (igual que Consultoría)
                reviews: courseFormData.reviews || [],
                custom_fields: courseFormData.custom_fields || [],
                course_content: courseFormData.course_content || {},
                meta: {
                    has_discount: courseFormData.has_discount
                }
            };

            const response = await fetch('/user/api/mi-tienda/products', {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            
            if (result.success) {
                // Recargar productos desde API para sincronizar
                await loadProductsFromAPI();
                renderProducts();
                updatePreview();

                closeCourseFormOverlay();
                showToast('¡Curso actualizado correctamente!', 'success');
                return;
            } else {
                showToast('Error al actualizar: ' + (result.message || 'Error desconocido'), 'error');
            }
        } catch (error) {
            showToast('Error de conexión al actualizar curso', 'error');
        }
    }

    // Fallback: usar localStorage si API falla
    const courseIndex = appState.products.findIndex(p => p.id === courseFormData.id);
    if (courseIndex !== -1) {
        const updatedCourse = createCourseFromForm();
        updatedCourse.id = courseFormData.id;
        updatedCourse.created_at = appState.products[courseIndex].created_at;
        updatedCourse.updated_at = new Date().toISOString();

        appState.products[courseIndex] = updatedCourse;

        saveToStorage();
        renderProducts();
        updatePreview();

        closeCourseFormOverlay();
        showToast('¡Curso actualizado correctamente!', 'success');
    }
}

// ✅ FUNCIONES AUXILIARES NECESARIAS (Si no existen ya en el código base)

// Función para renderizar reviews de curso (similar a consultoría)
function renderCourseReviews() {
    const reviewsList = document.getElementById('courseReviewsList');
    if (!reviewsList) return;

    if (courseFormData.reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-muted text-center py-3">
                <i class="bi bi-star display-6"></i>
                <p>No hay reseñas aún. Agrega algunas para aumentar la confianza.</p>
            </div>
        `;
        return;
    }

    reviewsList.innerHTML = courseFormData.reviews.map(review => `
        <div class="review-item p-3 border rounded mb-2" data-review-id="${review.id}">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="fw-semibold">${review.customer_name}</div>
                <button type="button" class="btn btn-sm btn-outline-danger"
                        onclick="removeCourseReview('${review.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <div class="text-muted">${review.comment}</div>
        </div>
    `).join('');
}

// Función para generar campos personalizados de curso (similar a consultoría)
function generateCourseCustomFields() {
    const customFieldsList = document.getElementById('courseCustomFieldsList');
    if (!customFieldsList) return;

    customFieldsList.innerHTML = courseFormData.custom_fields.map(field => `
        <div class="custom-field-item p-3 border rounded mb-2" data-field-id="${field.id}">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <input type="text" class="form-control form-control-sm fw-semibold"
                       value="${field.label}"
                       onchange="updateCourseCustomField('${field.id}', 'label', this.value)"
                       placeholder="Etiqueta del campo">
                <button type="button" class="btn btn-sm btn-outline-danger ms-2"
                        onclick="removeCourseCustomField('${field.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-6">
                    <select class="form-select form-select-sm"
                            onchange="updateCourseCustomField('${field.id}', 'type', this.value)">
                        <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
                        <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                        <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>Teléfono</option>
                        <option value="number" ${field.type === 'number' ? 'selected' : ''}>Número</option>
                    </select>
                </div>
                <div class="col-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                               ${field.required ? 'checked' : ''}
                               onchange="updateCourseCustomField('${field.id}', 'required', this.checked)">
                        <label class="form-check-label">Obligatorio</label>
                    </div>
                </div>
            </div>
        </div>
    `).join('') + `
        <button type="button" class="btn btn-sm btn-outline-primary"
                onclick="addCourseCustomField()">
            <i class="bi bi-plus"></i> Agregar campo
        </button>
    `;
}

// Funciones auxiliares para manejar custom fields
function addCourseCustomField() {
    courseFormData.custom_fields.push({
        id: Date.now(),
        label: 'Nuevo campo',
        type: 'text',
        required: false
    });
    generateCourseCustomFields();
    updatePreviewWithCourse();
}

function removeCourseCustomField(fieldId) {
    courseFormData.custom_fields = courseFormData.custom_fields.filter(f => f.id != fieldId);
    generateCourseCustomFields();
    updatePreviewWithCourse();
}

function updateCourseCustomField(fieldId, property, value) {
    const field = courseFormData.custom_fields.find(f => f.id == fieldId);
    if (field) {
        field[property] = value;
        updatePreviewWithCourse();
    }
}

// Funciones auxiliares para manejar reviews
function addCourseReview() {
    courseFormData.reviews.push({
        id: Date.now(),
        customer_name: 'Cliente Ejemplo',
        rating: 5,
        comment: 'Excelente curso, muy recomendado.'
    });
    renderCourseReviews();
    updatePreviewWithCourse();
}

function removeCourseReview(reviewId) {
    courseFormData.reviews = courseFormData.reviews.filter(r => r.id != reviewId);
    renderCourseReviews();
    updatePreviewWithCourse();
}

// ============== FIN FUNCIONES CURSO DIGITAL CORREGIDAS ==============