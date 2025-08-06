// Variables globales para productos
let currentProductType = null;
let currentProductStep = 1;
let editingProductId = null;
let productFormData = {};
let sortableInstance = null;

// Configuraciones específicas por tipo de producto
const PRODUCT_CONFIGS = {
  email_capture: {
    steps: ['Datos', 'Configuración'],
    hasFile: false,
    requiresPrice: false
  },
  digital_product: {
    steps: ['Datos', 'Contenido'],
    hasFile: true,
    requiresPrice: true
  },
  consultation: {
    steps: ['Datos', 'Contenido', 'Disponibilidad'],
    hasFile: false,
    requiresPrice: true
  },
  course: {
    steps: ['Datos', 'Contenido', 'Curso'],
    hasFile: false,
    requiresPrice: true
  },
  membership: {
    steps: ['Datos', 'Contenido', 'Membresía'],
    hasFile: false,
    requiresPrice: true
  }
};

// Placeholders por tipo de producto
const PRODUCT_PLACEHOLDERS = {
  consultation: {
    title: 'Agenda una llamada personalizada conmigo',
    subtitle: 'Reserva una sesión privada de coaching 1 a 1',
    description: 'Esta sesión de coaching personalizada está diseñada para ayudarle a desbloquear su máximo potencial. Durante 60 minutos trabajaremos juntos en sus objetivos personales o profesionales y definiremos una hoja de ruta clara para alcanzarlos.'
  },
  course: {
    title: 'Curso Completo de Marketing Digital',
    subtitle: 'Un curso completo que te enseñará todo lo que necesitas saber',
    description: 'Este curso le enseñará todo lo que necesita saber para alcanzar sus metas. Es la guía ideal si usted está buscando:\n- Alcanzar sus sueños\n- Encontrar propósito en su trabajo\n- Mejorar sus finanzas\n- Ser más feliz'
  },
  membership: {
    title: 'Membresía Exclusiva Premium',
    subtitle: 'Acceso completo a contenido exclusivo y comunidad privada',
    description: 'Únete a nuestra comunidad exclusiva y obtén acceso a contenido premium, eventos privados y mucho más.'
  },
  digital_product: {
    title: 'Guía Completa de Marketing Digital',
    subtitle: 'Un subtítulo breve y atractivo que describa el valor de tu producto',
    description: 'Este template le enseñará todo lo que necesita saber para alcanzar sus metas. Es la guía ideal si usted está buscando:\n- Alcanzar sus sueños\n- Encontrar propósito en su trabajo\n- Mejorar sus finanzas\n- Ser más feliz'
  },
  email_capture: {
    title: 'Suscríbete a mi Newsletter',
    subtitle: 'Recibe contenido exclusivo y tips directamente en tu email',
    description: 'Únete a nuestra comunidad y recibe consejos exclusivos, actualizaciones y contenido premium directamente en tu bandeja de entrada.'
  }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  initializeProducts();
  initializeProductForm();
  loadProducts();
});

function initializeProducts() {
  // Inicializar drag and drop para productos
  const productsList = document.getElementById('products-list');
  if (productsList && typeof Sortable !== 'undefined') {
    sortableInstance = Sortable.create(productsList, {
      animation: 150,
      handle: '.product-drag-handle',
      onEnd: function(evt) {
        // Reordenar productos en el estado
        const item = appState.products.splice(evt.oldIndex, 1)[0];
        appState.products.splice(evt.newIndex, 0, item);
        
        // Actualizar índices
        appState.products.forEach((product, index) => {
          product.sort_order = index;
        });
        
        saveToStorage();
        updatePreview();
      }
    });
  }
}

function initializeProductForm() {
  // Event listeners para el formulario de productos
  const productImageInput = document.getElementById('product-image-input');
  if (productImageInput) {
    productImageInput.addEventListener('change', handleProductImageUpload);
  }
  
  const productFileInput = document.getElementById('product-file-input');
  if (productFileInput) {
    productFileInput.addEventListener('change', handleProductFileUpload);
  }
  
  // Form fields
  const titleInput = document.getElementById('product-title');
  const subtitleInput = document.getElementById('product-subtitle');
  const descriptionInput = document.getElementById('product-description');
  const priceInput = document.getElementById('product-price');
  const discountCheckbox = document.getElementById('has-discount');
  const discountPriceInput = document.getElementById('discount-price');
  
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      updateCharCounter(this, 50);
      productFormData.title = this.value;
    });
  }
  
  if (subtitleInput) {
    subtitleInput.addEventListener('input', function() {
      updateCharCounter(this, 100);
      productFormData.subtitle = this.value;
    });
  }
  
  if (descriptionInput) {
    descriptionInput.addEventListener('input', function() {
      productFormData.description = this.value;
    });
  }
  
  if (priceInput) {
    priceInput.addEventListener('input', function() {
      productFormData.price = parseFloat(this.value) || 0;
    });
  }
  
  if (discountCheckbox) {
    discountCheckbox.addEventListener('change', function() {
      const discountInput = document.getElementById('discount-price');
      if (discountInput) {
        discountInput.style.display = this.checked ? 'block' : 'none';
      }
      productFormData.has_discount = this.checked;
    });
  }
  
  if (discountPriceInput) {
    discountPriceInput.addEventListener('input', function() {
      productFormData.discount_price = parseFloat(this.value) || 0;
    });
  }
}

function updateCharCounter(input, maxLength) {
  const counter = input.parentNode.querySelector('.char-counter');
  if (counter) {
    counter.textContent = `${input.value.length}/${maxLength}`;
  }
}

function openProductCreator() {
  const modal = document.getElementById('product-type-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function selectProductType(type) {
  currentProductType = type;
  currentProductStep = 1;
  editingProductId = null;
  
  // Cerrar modal de selección
  closeModal('product-type-modal');
  
  // Resetear form data
  productFormData = {
    type: type,
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    has_discount: false,
    discount_price: 0,
    image_url: '',
    file_url: '',
    button_text: 'Comprar ahora',
    is_active: true
  };
  
  // Abrir formulario
  openProductForm();
}

function openProductForm() {
  const modal = document.getElementById('product-form-modal');
  const title = document.getElementById('product-form-title');
  
  if (modal && title) {
    title.textContent = editingProductId ? 'Editar Producto' : 'Agregar Producto';
    modal.classList.add('active');
    
    setupProductSteps();
    showStep(1);
    fillFormWithPlaceholders();
  }
}

function setupProductSteps() {
  const config = PRODUCT_CONFIGS[currentProductType];
  if (!config) return;
  
  const stepsHeader = document.querySelector('.steps-header');
  if (stepsHeader) {
    stepsHeader.innerHTML = '';
    
    config.steps.forEach((stepName, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = `step ${index === 0 ? 'active' : ''}`;
      stepElement.dataset.step = index + 1;
      stepElement.textContent = `${index + 1}. ${stepName}`;
      stepsHeader.appendChild(stepElement);
    });
  }
  
  // Mostrar/ocultar sección de archivo según el tipo
  const fileUploadSection = document.getElementById('file-upload-section');
  if (fileUploadSection) {
    fileUploadSection.style.display = config.hasFile ? 'block' : 'none';
  }
}

function fillFormWithPlaceholders() {
  const placeholders = PRODUCT_PLACEHOLDERS[currentProductType];
  if (!placeholders) return;
  
  const titleInput = document.getElementById('product-title');
  const subtitleInput = document.getElementById('product-subtitle');
  const descriptionInput = document.getElementById('product-description');
  
  if (titleInput) titleInput.placeholder = placeholders.title;
  if (subtitleInput) subtitleInput.placeholder = placeholders.subtitle;
  if (descriptionInput) descriptionInput.placeholder = placeholders.description;
}

function nextStep() {
  const config = PRODUCT_CONFIGS[currentProductType];
  if (!config) return;
  
  if (currentProductStep < config.steps.length) {
    currentProductStep++;
    showStep(currentProductStep);
  }
}

function previousStep() {
  if (currentProductStep > 1) {
    currentProductStep--;
    showStep(currentProductStep);
  }
}

function showStep(step) {
  // Actualizar indicadores de pasos
  document.querySelectorAll('.step').forEach((stepEl, index) => {
    stepEl.classList.toggle('active', index + 1 === step);
  });
  
  // Mostrar contenido del paso
  document.querySelectorAll('.form-step').forEach((stepEl, index) => {
    stepEl.classList.toggle('active', index + 1 === step);
  });
  
  // Configurar contenido específico del paso 3
  if (step === 3) {
    setupSpecificConfig();
  }
  
  // Actualizar botones
  const config = PRODUCT_CONFIGS[currentProductType];
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');
  const saveBtn = document.getElementById('save-product-btn');
  
  if (prevBtn) {
    prevBtn.style.display = step > 1 ? 'block' : 'none';
  }
  
  if (nextBtn && saveBtn && config) {
    const isLastStep = step >= config.steps.length;
    nextBtn.style.display = isLastStep ? 'none' : 'block';
    saveBtn.style.display = isLastStep ? 'block' : 'none';
  }
}

function setupSpecificConfig() {
  const specificConfig = document.getElementById('specific-config');
  if (!specificConfig) return;
  
  switch (currentProductType) {
    case 'consultation':
      specificConfig.innerHTML = generateConsultationConfig();
      break;
    case 'course':
      specificConfig.innerHTML = generateCourseConfig();
      break;
    case 'membership':
      specificConfig.innerHTML = generateMembershipConfig();
      break;
    default:
      specificConfig.innerHTML = generateOptionsConfig();
  }
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function generateConsultationConfig() {
  return `
    <h4>Configuración de Disponibilidad</h4>
    <p class="step-description">Define cuándo y cómo tus clientes pueden agendar una llamada contigo.</p>
    
    <div class="form-group">
      <label>Método de llamada</label>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="call_method" value="google_meet" checked>
          <i data-lucide="video"></i>
          Google Meet (Automático)
        </label>
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="call_method" value="zoom">
          <i data-lucide="video"></i>
          Zoom (Automático)
        </label>
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="call_method" value="custom">
          <i data-lucide="link"></i>
          Enlace personalizado
        </label>
      </div>
      <input type="url" id="custom-call-link" placeholder="https://tu-enlace.com/llamada" style="margin-top: 12px; display: none;">
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div class="form-group">
        <label for="consultation-duration">Duración (minutos)</label>
        <input type="number" id="consultation-duration" min="15" max="240" value="60">
      </div>
      
      <div class="form-group">
        <label for="consultation-timezone">Zona horaria</label>
        <select id="consultation-timezone">
          <option value="America/New_York">Este (Nueva York)</option>
          <option value="America/Chicago">Central (Chicago)</option>
          <option value="America/Denver">Montaña (Denver)</option>
          <option value="America/Los_Angeles">Pacífico (Los Ángeles)</option>
          <option value="Europe/Madrid">Madrid</option>
          <option value="Europe/London">Londres</option>
        </select>
      </div>
    </div>
    
    <div class="form-group">
      <label for="booking-notice">Antelación mínima</label>
      <select id="booking-notice">
        <option value="0">Sin antelación</option>
        <option value="1">1 hora</option>
        <option value="3">3 horas</option>
        <option value="6">6 horas</option>
        <option value="12" selected>12 horas</option>
        <option value="24">24 horas</option>
      </select>
    </div>
  `;
}

function generateCourseConfig() {
  return `
    <h4>Estructura del Curso</h4>
    <p class="step-description">Organiza el contenido de tu curso en módulos y lecciones.</p>
    
    <div class="form-group">
      <label for="course-title">Título del Curso</label>
      <input type="text" id="course-title" placeholder="Domine el arte del trading desde cero">
    </div>
    
    <div class="form-group">
      <label for="course-description">Descripción del Curso</label>
      <textarea id="course-description" rows="4" placeholder="En este curso aprenderá paso a paso los fundamentos, estrategias y herramientas necesarias..."></textarea>
    </div>
    
    <div class="form-group">
      <label>Módulos del Curso</label>
      <div id="course-modules">
        <div class="course-module" data-module="1">
          <div style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
            <i data-lucide="grip-vertical" style="color: var(--text-light); cursor: grab;"></i>
            <span style="font-weight: 600;">Módulo 1:</span>
            <input type="text" placeholder="Introducción" style="flex: 1; border: none; background: transparent; outline: none;">
            <button type="button" class="btn-icon" onclick="removeModule(1)">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="btn-secondary" onclick="addModule()">
        <i data-lucide="plus"></i>
        Añadir Módulo
      </button>
    </div>
  `;
}

function generateMembershipConfig() {
  return `
    <h4>Configuración de Membresía</h4>
    <p class="step-description">Configura la frecuencia de facturación y duración de la membresía.</p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div class="form-group">
        <label for="billing-frequency">Frecuencia de Cobro</label>
        <select id="billing-frequency">
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly" selected>Mensual</option>
          <option value="quarterly">Trimestral</option>
          <option value="semi_annually">Semestral</option>
          <option value="annually">Anual</option>
        </select>
      </div>
      
      <div class="form-group">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="has-end-date">
          Finalizar después de:
        </label>
        <input type="number" id="end-months" placeholder="12" min="1" max="24" style="margin-top: 8px; display: none;">
        <span style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; display: none;" id="months-label">meses</span>
      </div>
    </div>
    
    <div class="form-group">
      <label>Beneficios de la Membresía</label>
      <div id="membership-benefits">
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 8px;">
          <i data-lucide="check" style="color: var(--success-color);"></i>
          <input type="text" placeholder="Acceso a contenido exclusivo" style="flex: 1; border: none; background: transparent; outline: none;">
          <button type="button" class="btn-icon" onclick="removeBenefit(this)">
            <i data-lucide="x"></i>
          </button>
        </div>
      </div>
      <button type="button" class="btn-secondary" onclick="addBenefit()">
        <i data-lucide="plus"></i>
        Añadir Beneficio
      </button>
    </div>
  `;
}

function generateOptionsConfig() {
  return `
    <h4>Opciones Adicionales</h4>
    <p class="step-description">Configuraciones adicionales para tu producto.</p>
    
    <div class="form-group">
      <label style="display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" id="is-active" checked>
        Producto activo
      </label>
      <p class="form-hint">Los productos inactivos no se mostrarán en tu tienda</p>
    </div>
    
    <div class="form-group">
      <label for="product-category">Categoría</label>
      <select id="product-category">
        <option value="digital-product">Producto Digital</option>
        <option value="ebook">E-book</option>
        <option value="template">Template</option>
        <option value="preset">Preset</option>
        <option value="other">Otro</option>
      </select>
    </div>
  `;
}

function addModule() {
  const modulesContainer = document.getElementById('course-modules');
  if (!modulesContainer) return;
  
  const moduleCount = modulesContainer.children.length + 1;
  const moduleElement = document.createElement('div');
  moduleElement.className = 'course-module';
  moduleElement.dataset.module = moduleCount;
  
  moduleElement.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
      <i data-lucide="grip-vertical" style="color: var(--text-light); cursor: grab;"></i>
      <span style="font-weight: 600;">Módulo ${moduleCount}:</span>
      <input type="text" placeholder="Título del módulo" style="flex: 1; border: none; background: transparent; outline: none;">
      <button type="button" class="btn-icon" onclick="removeModule(${moduleCount})">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `;
  
  modulesContainer.appendChild(moduleElement);
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function removeModule(moduleId) {
  const moduleElement = document.querySelector(`[data-module="${moduleId}"]`);
  if (moduleElement && document.querySelectorAll('.course-module').length > 1) {
    moduleElement.remove();
  }
}

function addBenefit() {
  const benefitsContainer = document.getElementById('membership-benefits');
  if (!benefitsContainer) return;
  
  const benefitElement = document.createElement('div');
  benefitElement.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 8px;';
  
  benefitElement.innerHTML = `
    <i data-lucide="check" style="color: var(--success-color);"></i>
    <input type="text" placeholder="Describe un beneficio" style="flex: 1; border: none; background: transparent; outline: none;">
    <button type="button" class="btn-icon" onclick="removeBenefit(this)">
      <i data-lucide="x"></i>
    </button>
  `;
  
  benefitsContainer.appendChild(benefitElement);
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function removeBenefit(button) {
  const benefitElement = button.parentElement;
  if (benefitElement && document.querySelectorAll('#membership-benefits > div').length > 1) {
    benefitElement.remove();
  }
}

function handleProductImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('product-image-preview');
      if (preview) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Product preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        productFormData.image_url = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

function handleProductFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const fileArea = document.querySelector('.file-upload-area');
    if (fileArea) {
      fileArea.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
          <i data-lucide="file" style="color: var(--success-color);"></i>
          <div>
            <p style="margin: 0; color: var(--success-color); font-weight: 500;">Archivo subido correctamente</p>
            <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">${file.name}</p>
          </div>
        </div>
      `;
      
      productFormData.file_url = file.name; // En un sistema real, sería la URL del archivo subido
      
      // Reinicializar iconos
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }
}

function saveProduct() {
  // Validar campos requeridos
  if (!validateProductForm()) {
    return;
  }
  
  // Crear objeto del producto
  const product = {
    id: editingProductId || generateId(),
    type: currentProductType,
    title: productFormData.title || document.getElementById('product-title').value,
    subtitle: productFormData.subtitle || document.getElementById('product-subtitle').value,
    description: productFormData.description || document.getElementById('product-description').value,
    price: productFormData.price || parseFloat(document.getElementById('product-price').value) || 0,
    has_discount: productFormData.has_discount || document.getElementById('has-discount').checked,
    discount_price: productFormData.discount_price || parseFloat(document.getElementById('discount-price').value) || 0,
    image_url: productFormData.image_url || '',
    file_url: productFormData.file_url || '',
    button_text: document.getElementById('button-text').value || 'Comprar ahora',
    is_active: document.getElementById('is-active') ? document.getElementById('is-active').checked : true,
    created_at: editingProductId ? null : new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sort_order: editingProductId ? null : appState.products.length
  };
  
  // Agregar configuración específica según el tipo
  if (currentProductType === 'consultation') {
    product.consultation_config = getConsultationConfig();
  } else if (currentProductType === 'course') {
    product.course_config = getCourseConfig();
  } else if (currentProductType === 'membership') {
    product.membership_config = getMembershipConfig();
  }
  
  // Guardar en el estado
  if (editingProductId) {
    // Actualizar producto existente
    const index = appState.products.findIndex(p => p.id === editingProductId);
    if (index !== -1) {
      appState.products[index] = { ...appState.products[index], ...product };
    }
  } else {
    // Agregar nuevo producto
    appState.products.push(product);
  }
  
  // Guardar en storage y actualizar vista
  saveToStorage();
  loadProducts();
  updatePreview();
  
  // Cerrar modal
  closeProductForm();
  
  // Mostrar notificación
  showNotification(
    editingProductId ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
    'success'
  );
}

function validateProductForm() {
  const title = document.getElementById('product-title').value.trim();
  const price = document.getElementById('product-price').value;
  
  if (!title) {
    showNotification('El título del producto es requerido', 'error');
    return false;
  }
  
  const config = PRODUCT_CONFIGS[currentProductType];
  if (config && config.requiresPrice && (!price || parseFloat(price) <= 0)) {
    showNotification('El precio debe ser mayor a 0', 'error');
    return false;
  }
  
  return true;
}

function getConsultationConfig() {
  const callMethod = document.querySelector('input[name="call_method"]:checked').value;
  return {
    call_method: callMethod,
    custom_call_link: callMethod === 'custom' ? document.getElementById('custom-call-link').value : '',
    duration: parseInt(document.getElementById('consultation-duration').value) || 60,
    timezone: document.getElementById('consultation-timezone').value,
    notice_period: parseInt(document.getElementById('booking-notice').value) || 12
  };
}

function getCourseConfig() {
  const modules = [];
  document.querySelectorAll('.course-module').forEach((module, index) => {
    const input = module.querySelector('input[type="text"]');
    if (input && input.value.trim()) {
      modules.push({
        id: index + 1,
        title: input.value.trim(),
        lessons: []
      });
    }
  });
  
  return {
    title: document.getElementById('course-title').value || '',
    description: document.getElementById('course-description').value || '',
    modules: modules
  };
}

function getMembershipConfig() {
  const benefits = [];
  document.querySelectorAll('#membership-benefits input[type="text"]').forEach(input => {
    if (input.value.trim()) {
      benefits.push(input.value.trim());
    }
  });
  
  const hasEndDate = document.getElementById('has-end-date').checked;
  return {
    billing_frequency: document.getElementById('billing-frequency').value,
    has_end_date: hasEndDate,
    end_after_months: hasEndDate ? parseInt(document.getElementById('end-months').value) || 12 : null,
    benefits: benefits
  };
}

function loadProducts() {
  const productsList = document.getElementById('products-list');
  if (!productsList) return;
  
  if (appState.products.length === 0) {
    productsList.innerHTML = `
      <div style="text-align: center; padding: 48px 24px; color: var(--text-secondary);">
        <i data-lucide="package" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
        <p>No tienes productos aún</p>
        <p style="font-size: 0.875rem;">Agrega tu primer producto para empezar a vender</p>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    return;
  }
  
  productsList.innerHTML = '';
  
  appState.products
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .forEach(product => {
      const productElement = createProductElement(product);
      productsList.appendChild(productElement);
    });
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function createProductElement(product) {
  const element = document.createElement('div');
  element.className = 'product-item';
  element.dataset.productId = product.id;
  
  const productTypeLabels = {
    email_capture: 'Email',
    digital_product: 'Digital',
    consultation: 'Consultoría',
    course: 'Curso',
    membership: 'Membresía'
  };
  
  const displayPrice = product.has_discount && product.discount_price > 0 
    ? `$${product.discount_price.toFixed(2)}` 
    : `$${product.price.toFixed(2)}`;
  
  element.innerHTML = `
    <div class="product-drag-handle">
      <i data-lucide="grip-vertical"></i>
    </div>
    <div class="product-image">
      ${product.image_url ? 
        `<img src="${product.image_url}" alt="${product.title}">` :
        `<i data-lucide="package"></i>`
      }
    </div>
    <div class="product-info">
      <div class="product-title">${product.title}</div>
      <div class="product-subtitle">${product.subtitle || productTypeLabels[product.type] || ''}</div>
    </div>
    <div class="product-price">${displayPrice}</div>
    <div class="product-actions">
      <button class="btn-icon" onclick="editProduct('${product.id}')" title="Editar">
        <i data-lucide="edit"></i>
      </button>
      <button class="btn-icon danger" onclick="deleteProduct('${product.id}')" title="Eliminar">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `;
  
  return element;
}

function editProduct(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  
  editingProductId = productId;
  currentProductType = product.type;
  currentProductStep = 1;
  
  // Llenar formulario con datos existentes
  productFormData = { ...product };
  
  openProductForm();
  
  // Llenar campos
  setTimeout(() => {
    fillFormWithProductData(product);
  }, 100);
}

function fillFormWithProductData(product) {
  // Datos básicos
  const titleInput = document.getElementById('product-title');
  const subtitleInput = document.getElementById('product-subtitle');
  const descriptionInput = document.getElementById('product-description');
  const priceInput = document.getElementById('product-price');
  const discountCheckbox = document.getElementById('has-discount');
  const discountPriceInput = document.getElementById('discount-price');
  const buttonTextInput = document.getElementById('button-text');
  
  if (titleInput) titleInput.value = product.title || '';
  if (subtitleInput) subtitleInput.value = product.subtitle || '';
  if (descriptionInput) descriptionInput.value = product.description || '';
  if (priceInput) priceInput.value = product.price || 0;
  if (buttonTextInput) buttonTextInput.value = product.button_text || 'Comprar ahora';
  
  if (discountCheckbox) {
    discountCheckbox.checked = product.has_discount || false;
    if (discountPriceInput) {
      discountPriceInput.style.display = product.has_discount ? 'block' : 'none';
      discountPriceInput.value = product.discount_price || 0;
    }
  }
  
  // Imagen del producto
  if (product.image_url) {
    const preview = document.getElementById('product-image-preview');
    if (preview) {
      preview.innerHTML = `<img src="${product.image_url}" alt="Product preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    }
  }
  
  // Actualizar contadores de caracteres
  if (titleInput) updateCharCounter(titleInput, 50);
  if (subtitleInput) updateCharCounter(subtitleInput, 100);
}

function deleteProduct(productId) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    appState.products = appState.products.filter(p => p.id !== productId);
    
    // Reordenar índices
    appState.products.forEach((product, index) => {
      product.sort_order = index;
    });
    
    saveToStorage();
    loadProducts();
    updatePreview();
    
    showNotification('Producto eliminado correctamente', 'success');
  }
}

function closeProductForm() {
  const modal = document.getElementById('product-form-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  
  // Resetear variables
  currentProductType = null;
  currentProductStep = 1;
  editingProductId = null;
  productFormData = {};
  
  // Limpiar formulario
  resetProductForm();
}

function resetProductForm() {
  // Limpiar campos
  const form = document.getElementById('product-form');
  if (form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = input.defaultChecked;
      } else {
        input.value = '';
      }
    });
  }
  
  // Resetear preview de imagen
  const imagePreview = document.getElementById('product-image-preview');
  if (imagePreview) {
    imagePreview.innerHTML = '<i data-lucide="package"></i>';
  }
  
  // Resetear área de archivo
  const fileArea = document.querySelector('.file-upload-area');
  if (fileArea) {
    fileArea.innerHTML = `
      <i data-lucide="upload"></i>
      <p>Sube el archivo que recibirán tus clientes</p>
      <button type="button" class="btn-secondary">Seleccionar Archivo</button>
    `;
  }
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Event listeners para configuration específica
document.addEventListener('change', function(event) {
  if (event.target.name === 'call_method') {
    const customLinkInput = document.getElementById('custom-call-link');
    if (customLinkInput) {
      customLinkInput.style.display = event.target.value === 'custom' ? 'block' : 'none';
    }
  }
  
  if (event.target.id === 'has-end-date') {
    const endMonthsInput = document.getElementById('end-months');
    const monthsLabel = document.getElementById('months-label');
    
    if (endMonthsInput && monthsLabel) {
      const display = event.target.checked ? 'block' : 'none';
      endMonthsInput.style.display = display;
      monthsLabel.style.display = display;
    }
  }
});

// Exportar funciones para uso global
window.productFunctions = {
  openProductCreator,
  selectProductType,
  nextStep,
  previousStep,
  saveProduct,
  editProduct,
  deleteProduct,
  closeProductForm,
  closeModal,
  addModule,
  removeModule,
  addBenefit,
  removeBenefit
};

// Hacer funciones disponibles globalmente
Object.assign(window, window.productFunctions);