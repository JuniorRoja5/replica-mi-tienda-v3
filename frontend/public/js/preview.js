// Funciones para actualizar la vista previa en tiempo real

function initializePreview() {
  // Cargar vista previa inicial
  updatePreview();
  
  // Observer para cambios en el DOM que necesiten actualizar la vista previa
  const profileSection = document.getElementById('profile-section');
  const socialSection = document.getElementById('social-section');
  
  if (profileSection) {
    const observer = new MutationObserver(debounce(updatePreview, 300));
    observer.observe(profileSection, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }
  
  if (socialSection) {
    const observer = new MutationObserver(debounce(updatePreview, 300));
    observer.observe(socialSection, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }
}

function updatePreview() {
  updatePreviewProfile();
  updatePreviewSocial();
  updatePreviewProducts();
}

function updatePreviewProfile() {
  const previewAvatar = document.getElementById('preview-avatar');
  const previewName = document.getElementById('preview-name');
  const previewBio = document.getElementById('preview-bio');
  
  // Avatar
  if (previewAvatar) {
    if (appState.profile.avatar_url) {
      previewAvatar.innerHTML = `<img src="${appState.profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      previewAvatar.innerHTML = '<span>👤</span>';
    }
  }
  
  // Nombre
  if (previewName) {
    previewName.textContent = appState.profile.display_name || 'Tu Nombre';
  }
  
  // Bio
  if (previewBio) {
    previewBio.textContent = appState.profile.bio || 'Tu bio aquí...';
  }
}

function updatePreviewSocial() {
  const previewSocial = document.getElementById('preview-social');
  if (!previewSocial) return;
  
  previewSocial.innerHTML = '';
  
  // Plataformas predefinidas
  const platformIcons = {
    instagram: { icon: 'instagram', color: '#E4405F' },
    tiktok: { icon: 'music', color: '#000000' },
    facebook: { icon: 'facebook', color: '#1877F2' },
    twitter: { icon: 'twitter', color: '#1DA1F2' },
    youtube: { icon: 'youtube', color: '#FF0000' },
    linkedin: { icon: 'linkedin', color: '#0A66C2' }
  };
  
  // Mostrar enlaces de plataformas que tienen URL
  Object.keys(appState.socialLinks.platform_links).forEach(platform => {
    const url = appState.socialLinks.platform_links[platform];
    if (url && url.trim()) {
      const platformConfig = platformIcons[platform];
      if (platformConfig) {
        const socialIcon = document.createElement('a');
        socialIcon.className = 'preview-social-icon';
        socialIcon.href = url;
        socialIcon.target = '_blank';
        socialIcon.style.backgroundColor = platformConfig.color;
        socialIcon.innerHTML = `<i data-lucide="${platformConfig.icon}"></i>`;
        previewSocial.appendChild(socialIcon);
      }
    }
  });
  
  // Enlaces personalizados
  appState.socialLinks.custom_links.forEach(customLink => {
    if (customLink.url && customLink.url.trim()) {
      const socialIcon = document.createElement('a');
      socialIcon.className = 'preview-social-icon';
      socialIcon.href = customLink.url;
      socialIcon.target = '_blank';
      socialIcon.title = customLink.name;
      
      if (customLink.icon_url) {
        socialIcon.innerHTML = `<img src="${customLink.icon_url}" alt="${customLink.name}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;">`;
      } else {
        socialIcon.innerHTML = '<i data-lucide="link"></i>';
      }
      
      previewSocial.appendChild(socialIcon);
    }
  });
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function updatePreviewProducts() {
  const previewProducts = document.getElementById('preview-products');
  if (!previewProducts) return;
  
  if (appState.products.length === 0) {
    previewProducts.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: #6B7280;">
        <i data-lucide="package" style="font-size: 32px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
        <p style="font-size: 0.875rem; margin: 0;">No hay productos disponibles</p>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    return;
  }
  
  previewProducts.innerHTML = '';
  
  // Mostrar productos ordenados
  const sortedProducts = [...appState.products].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  
  sortedProducts.forEach(product => {
    const productElement = createPreviewProduct(product);
    previewProducts.appendChild(productElement);
  });
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function createPreviewProduct(product) {
  const element = document.createElement('div');
  element.className = 'preview-product';
  
  // Iconos por tipo de producto
  const productTypeIcons = {
    email_capture: 'mail',
    digital_product: 'package',
    consultation: 'phone',
    course: 'graduation-cap',
    membership: 'crown'
  };
  
  const icon = productTypeIcons[product.type] || 'package';
  
  // Calcular precio a mostrar
  let priceDisplay = '';
  if (product.type !== 'email_capture') {
    if (product.has_discount && product.discount_price > 0) {
      priceDisplay = `
        <div class="preview-product-price">
          <span style="text-decoration: line-through; font-size: 0.75rem; opacity: 0.7;">$${product.price.toFixed(2)}</span>
          <span>$${product.discount_price.toFixed(2)}</span>
        </div>
      `;
    } else {
      priceDisplay = `<div class="preview-product-price">$${product.price.toFixed(2)}</div>`;
    }
  }
  
  element.innerHTML = `
    <div class="preview-product-content">
      <div class="preview-product-image">
        ${product.image_url ? 
          `<img src="${product.image_url}" alt="${product.title}">` :
          `<i data-lucide="${icon}"></i>`
        }
      </div>
      <div class="preview-product-info">
        <h4>${truncateText(product.title, 25)}</h4>
        ${product.subtitle ? `<p>${truncateText(product.subtitle, 40)}</p>` : ''}
      </div>
      ${priceDisplay}
    </div>
  `;
  
  return element;
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Funciones para diferentes tipos de vista previa
function previewConsultation(product) {
  return `
    <div class="preview-product-meta">
      <span style="font-size: 0.75rem; color: #9CA3AF;">
        <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
        ${product.consultation_config?.duration || 60} min
      </span>
    </div>
  `;
}

function previewCourse(product) {
  const moduleCount = product.course_config?.modules?.length || 0;
  return `
    <div class="preview-product-meta">
      <span style="font-size: 0.75rem; color: #9CA3AF;">
        <i data-lucide="book-open" style="width: 12px; height: 12px;"></i>
        ${moduleCount} módulos
      </span>
    </div>
  `;
}

function previewMembership(product) {
  const frequency = product.membership_config?.billing_frequency || 'monthly';
  const frequencyLabels = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    semi_annually: 'Semestral',
    annually: 'Anual'
  };
  
  return `
    <div class="preview-product-meta">
      <span style="font-size: 0.75rem; color: #9CA3AF;">
        <i data-lucide="refresh-cw" style="width: 12px; height: 12px;"></i>
        ${frequencyLabels[frequency]}
      </span>
    </div>
  `;
}

// Función para simular interacciones en la vista previa
function initializePreviewInteractions() {
  const previewContent = document.getElementById('preview-content');
  
  if (previewContent) {
    // Agregar eventos de hover para productos
    previewContent.addEventListener('mouseover', function(event) {
      if (event.target.closest('.preview-product')) {
        const product = event.target.closest('.preview-product');
        product.style.transform = 'translateY(-2px)';
      }
    });
    
    previewContent.addEventListener('mouseout', function(event) {
      if (event.target.closest('.preview-product')) {
        const product = event.target.closest('.preview-product');
        product.style.transform = 'translateY(0)';
      }
    });
    
    // Agregar eventos de click para simular interacciones
    previewContent.addEventListener('click', function(event) {
      if (event.target.closest('.preview-product')) {
        const product = event.target.closest('.preview-product');
        
        // Efecto de click
        product.style.transform = 'scale(0.98)';
        setTimeout(() => {
          product.style.transform = 'translateY(0)';
        }, 150);
        
        // Mostrar notificación simulada
        showPreviewNotification('¡Producto seleccionado en la vista previa!');
      }
    });
  }
}

function showPreviewNotification(message) {
  // Crear notificación dentro del mockup del teléfono
  const phoneScreen = document.querySelector('.phone-screen');
  if (!phoneScreen) return;
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
  `;
  notification.textContent = message;
  
  phoneScreen.appendChild(notification);
  
  // Mostrar animación
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);
  
  // Remover después de 2 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

// Función para actualizar el tema de la vista previa
function updatePreviewTheme(theme = 'dark') {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;
  
  const themes = {
    dark: {
      background: '#111827',
      textPrimary: '#FFFFFF',
      textSecondary: '#D1D5DB',
      cardBackground: '#1F2937',
      cardBorder: '#374151'
    },
    light: {
      background: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      cardBackground: '#F9FAFB',
      cardBorder: '#E5E7EB'
    }
  };
  
  const themeColors = themes[theme];
  
  // Aplicar colores del tema
  const phoneScreen = document.querySelector('.phone-screen');
  if (phoneScreen) {
    phoneScreen.style.backgroundColor = themeColors.background;
  }
  
  // Actualizar colores de texto
  const nameElement = document.getElementById('preview-name');
  const bioElement = document.getElementById('preview-bio');
  
  if (nameElement) nameElement.style.color = themeColors.textPrimary;
  if (bioElement) bioElement.style.color = themeColors.textSecondary;
  
  // Actualizar productos
  const products = document.querySelectorAll('.preview-product');
  products.forEach(product => {
    product.style.backgroundColor = themeColors.cardBackground;
    
    const title = product.querySelector('h4');
    const subtitle = product.querySelector('p');
    
    if (title) title.style.color = themeColors.textPrimary;
    if (subtitle) subtitle.style.color = themeColors.textSecondary;
  });
}

// Función para animar la entrada de elementos en la vista previa
function animatePreviewElements() {
  const elements = document.querySelectorAll('.preview-product');
  
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.4s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Función para modo de vista previa a pantalla completa
function toggleFullscreenPreview() {
  const rightPanel = document.querySelector('.right-panel');
  if (!rightPanel) return;
  
  rightPanel.classList.toggle('fullscreen-preview');
  
  // Agregar estilos CSS para pantalla completa si no existen
  if (!document.getElementById('fullscreen-preview-styles')) {
    const style = document.createElement('style');
    style.id = 'fullscreen-preview-styles';
    style.textContent = `
      .right-panel.fullscreen-preview {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        max-width: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .right-panel.fullscreen-preview .phone-frame {
        width: 350px;
        height: 700px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Actualizar contenido cuando esté en pantalla completa
  if (rightPanel.classList.contains('fullscreen-preview')) {
    setTimeout(updatePreview, 100);
  }
}

// Función para capturar screenshot de la vista previa
function capturePreviewScreenshot() {
  const phoneScreen = document.querySelector('.phone-screen');
  if (!phoneScreen) return;
  
  // Usar html2canvas si está disponible (se podría agregar como dependencia)
  showNotification('Función de captura de pantalla disponible con html2canvas', 'info');
}

// Función para compartir la vista previa
function sharePreview() {
  const shareData = {
    title: appState.profile.display_name || 'Mi Tienda Digital',
    text: appState.profile.bio || 'Visita mi tienda digital',
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Shared successfully'))
      .catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copiar al portapapeles
    navigator.clipboard.writeText(window.location.href)
      .then(() => showNotification('URL copiada al portapapeles', 'success'))
      .catch(() => showNotification('Error al copiar URL', 'error'));
  }
}

// Función para alternar entre diferentes orientaciones del teléfono
function togglePhoneOrientation() {
  const phoneFrame = document.querySelector('.phone-frame');
  if (!phoneFrame) return;
  
  phoneFrame.classList.toggle('landscape');
  
  // Agregar estilos para orientación horizontal si no existen
  if (!document.getElementById('phone-orientation-styles')) {
    const style = document.createElement('style');
    style.id = 'phone-orientation-styles';
    style.textContent = `
      .phone-frame.landscape {
        width: 640px;
        height: 320px;
      }
      
      .phone-frame.landscape .phone-screen {
        flex-direction: row;
      }
      
      .phone-frame.landscape .phone-notch {
        top: 50%;
        left: 8px;
        transform: translateY(-50%);
        width: 4px;
        height: 120px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Actualizar vista previa después del cambio
  setTimeout(updatePreview, 200);
}

// Inicializar interacciones de vista previa
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initializePreviewInteractions();
    animatePreviewElements();
  }, 500);
});

// Exportar funciones para uso global
window.previewFunctions = {
  updatePreview,
  updatePreviewProfile,
  updatePreviewSocial,
  updatePreviewProducts,
  updatePreviewTheme,
  toggleFullscreenPreview,
  capturePreviewScreenshot,
  sharePreview,
  togglePhoneOrientation
};

// Hacer funciones disponibles globalmente
Object.assign(window, window.previewFunctions);