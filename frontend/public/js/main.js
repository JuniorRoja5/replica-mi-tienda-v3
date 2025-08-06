// Estado global de la aplicación
let appState = {
  profile: {
    display_name: '',
    bio: '',
    username: '',
    avatar_url: ''
  },
  socialLinks: {
    platform_links: {},
    custom_links: []
  },
  products: []
};

// Variables globales
let currentSection = 'profile';
let customSocialCounter = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  initializeTabs();
  initializeFormEvents();
  initializePreview();
});

function initializeApp() {
  // Cargar datos desde localStorage si existen
  loadFromStorage();
  
  // Actualizar la vista previa inicial
  updatePreview();
  
  // Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.section-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sectionName = this.dataset.section;
      switchSection(sectionName);
    });
  });
}

function switchSection(sectionName) {
  // Actualizar botones
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
  
  // Actualizar contenido
  document.querySelectorAll('.section-content').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(`${sectionName}-section`).classList.add('active');
  
  currentSection = sectionName;
}

function initializeFormEvents() {
  // Avatar upload
  const avatarInput = document.getElementById('avatar-input');
  if (avatarInput) {
    avatarInput.addEventListener('change', handleAvatarUpload);
  }
  
  // Profile fields
  const displayNameInput = document.getElementById('display-name');
  const bioInput = document.getElementById('bio');
  const usernameInput = document.getElementById('username');
  
  if (displayNameInput) {
    displayNameInput.addEventListener('input', handleDisplayNameChange);
  }
  
  if (bioInput) {
    bioInput.addEventListener('input', handleBioChange);
  }
  
  if (usernameInput) {
    usernameInput.addEventListener('input', handleUsernameChange);
  }
  
  // Social links
  initializeSocialLinks();
}

function initializeSocialLinks() {
  const socialInputs = document.querySelectorAll('[data-platform]');
  socialInputs.forEach(input => {
    input.addEventListener('input', function() {
      const platform = this.dataset.platform;
      const value = this.value;
      updateSocialLink(platform, value);
    });
  });
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const avatarImg = document.getElementById('avatar-img');
      const avatarPlaceholder = document.querySelector('.avatar-placeholder');
      
      if (avatarImg && avatarPlaceholder) {
        avatarImg.src = e.target.result;
        avatarImg.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
        
        // Actualizar estado
        appState.profile.avatar_url = e.target.result;
        updatePreview();
        saveToStorage();
      }
    };
    reader.readAsDataURL(file);
  }
}

function handleDisplayNameChange(event) {
  const value = event.target.value;
  const counter = event.target.parentNode.querySelector('.char-counter');
  
  if (counter) {
    counter.textContent = `${value.length}/50`;
  }
  
  appState.profile.display_name = value;
  updatePreview();
  saveToStorage();
}

function handleBioChange(event) {
  const value = event.target.value;
  const counter = event.target.parentNode.querySelector('.char-counter');
  
  if (counter) {
    counter.textContent = `${value.length}/160`;
  }
  
  appState.profile.bio = value;
  updatePreview();
  saveToStorage();
}

function handleUsernameChange(event) {
  const value = event.target.value.replace(/\s/g, ''); // Eliminar espacios
  event.target.value = value;
  
  appState.profile.username = value;
  saveToStorage();
}

function updateSocialLink(platform, value) {
  appState.socialLinks.platform_links[platform] = value;
  updatePreview();
  saveToStorage();
}

function addCustomSocial() {
  const customId = 'custom_' + (++customSocialCounter);
  const customSocialList = document.getElementById('custom-social-list');
  
  const customSocialItem = document.createElement('div');
  customSocialItem.className = 'custom-social-item';
  customSocialItem.dataset.customId = customId;
  
  customSocialItem.innerHTML = `
    <div class="custom-social-header">
      <label class="font-medium">Enlace Personalizado #${customSocialCounter}</label>
      <button class="btn-icon danger" onclick="removeCustomSocial('${customId}')">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div class="custom-social-icon" id="custom-icon-${customId}">
        <i data-lucide="link"></i>
      </div>
      <input type="file" id="custom-icon-input-${customId}" accept="image/*" style="display: none;">
      <button type="button" class="btn-secondary" onclick="document.getElementById('custom-icon-input-${customId}').click()">
        Subir Ícono
      </button>
    </div>
    <div style="margin-bottom: 12px;">
      <label>Nombre de la red</label>
      <input type="text" placeholder="Ej: Mi Blog" onchange="updateCustomSocialField('${customId}', 'name', this.value)">
    </div>
    <div>
      <label>URL</label>
      <input type="url" placeholder="https://..." onchange="updateCustomSocialField('${customId}', 'url', this.value)">
    </div>
  `;
  
  customSocialList.appendChild(customSocialItem);
  
  // Inicializar el upload de icono
  const iconInput = document.getElementById(`custom-icon-input-${customId}`);
  iconInput.addEventListener('change', function(event) {
    handleCustomIconUpload(customId, event);
  });
  
  // Actualizar estado
  appState.socialLinks.custom_links.push({
    id: customId,
    name: '',
    url: '',
    icon_url: ''
  });
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  saveToStorage();
}

function removeCustomSocial(customId) {
  const element = document.querySelector(`[data-custom-id="${customId}"]`);
  if (element) {
    element.remove();
    
    // Actualizar estado
    appState.socialLinks.custom_links = appState.socialLinks.custom_links.filter(
      link => link.id !== customId
    );
    
    updatePreview();
    saveToStorage();
  }
}

function updateCustomSocialField(customId, field, value) {
  const customLink = appState.socialLinks.custom_links.find(link => link.id === customId);
  if (customLink) {
    customLink[field] = value;
    updatePreview();
    saveToStorage();
  }
}

function handleCustomIconUpload(customId, event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const iconElement = document.getElementById(`custom-icon-${customId}`);
      if (iconElement) {
        iconElement.innerHTML = `<img src="${e.target.result}" alt="Custom Icon" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        
        // Actualizar estado
        updateCustomSocialField(customId, 'icon_url', e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }
}

function saveProfile() {
  showNotification('Perfil guardado correctamente', 'success');
  saveToStorage();
}

function saveSocials() {
  showNotification('Enlaces guardados correctamente', 'success');
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('miTiendaData', JSON.stringify(appState));
}

function loadFromStorage() {
  const savedData = localStorage.getItem('miTiendaData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      appState = { ...appState, ...parsedData };
      
      // Restaurar campos del formulario
      restoreFormFields();
      restoreSocialFields();
      restoreCustomSocials();
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  }
}

function restoreFormFields() {
  const displayNameInput = document.getElementById('display-name');
  const bioInput = document.getElementById('bio');
  const usernameInput = document.getElementById('username');
  
  if (displayNameInput && appState.profile.display_name) {
    displayNameInput.value = appState.profile.display_name;
    displayNameInput.dispatchEvent(new Event('input'));
  }
  
  if (bioInput && appState.profile.bio) {
    bioInput.value = appState.profile.bio;
    bioInput.dispatchEvent(new Event('input'));
  }
  
  if (usernameInput && appState.profile.username) {
    usernameInput.value = appState.profile.username;
  }
  
  // Restaurar avatar
  if (appState.profile.avatar_url) {
    const avatarImg = document.getElementById('avatar-img');
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');
    
    if (avatarImg && avatarPlaceholder) {
      avatarImg.src = appState.profile.avatar_url;
      avatarImg.style.display = 'block';
      avatarPlaceholder.style.display = 'none';
    }
  }
}

function restoreSocialFields() {
  const socialInputs = document.querySelectorAll('[data-platform]');
  socialInputs.forEach(input => {
    const platform = input.dataset.platform;
    if (appState.socialLinks.platform_links[platform]) {
      input.value = appState.socialLinks.platform_links[platform];
    }
  });
}

function restoreCustomSocials() {
  appState.socialLinks.custom_links.forEach(customLink => {
    customSocialCounter = Math.max(customSocialCounter, parseInt(customLink.id.replace('custom_', '')));
    addRestoredCustomSocial(customLink);
  });
}

function addRestoredCustomSocial(customLink) {
  const customSocialList = document.getElementById('custom-social-list');
  
  const customSocialItem = document.createElement('div');
  customSocialItem.className = 'custom-social-item';
  customSocialItem.dataset.customId = customLink.id;
  
  const linkNumber = customLink.id.replace('custom_', '');
  
  customSocialItem.innerHTML = `
    <div class="custom-social-header">
      <label class="font-medium">Enlace Personalizado #${linkNumber}</label>
      <button class="btn-icon danger" onclick="removeCustomSocial('${customLink.id}')">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div class="custom-social-icon" id="custom-icon-${customLink.id}">
        ${customLink.icon_url ? 
          `<img src="${customLink.icon_url}" alt="Custom Icon" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
          '<i data-lucide="link"></i>'
        }
      </div>
      <input type="file" id="custom-icon-input-${customLink.id}" accept="image/*" style="display: none;">
      <button type="button" class="btn-secondary" onclick="document.getElementById('custom-icon-input-${customLink.id}').click()">
        Subir Ícono
      </button>
    </div>
    <div style="margin-bottom: 12px;">
      <label>Nombre de la red</label>
      <input type="text" value="${customLink.name}" placeholder="Ej: Mi Blog" onchange="updateCustomSocialField('${customLink.id}', 'name', this.value)">
    </div>
    <div>
      <label>URL</label>
      <input type="url" value="${customLink.url}" placeholder="https://..." onchange="updateCustomSocialField('${customLink.id}', 'url', this.value)">
    </div>
  `;
  
  customSocialList.appendChild(customSocialItem);
  
  // Inicializar el upload de icono
  const iconInput = document.getElementById(`custom-icon-input-${customLink.id}`);
  iconInput.addEventListener('change', function(event) {
    handleCustomIconUpload(customLink.id, event);
  });
  
  // Reinicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Estilos inline para la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10B981' : '#3B82F6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Reinicializar iconos para la notificación
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Mostrar animación
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 100);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Funciones utilitarias
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

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

// Manejar errores globales
window.addEventListener('error', function(event) {
  console.error('Error global:', event.error);
});

// Manejar cierre de modales con Escape
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
    }
  }
});

// Exportar funciones globales para uso en HTML
window.appFunctions = {
  saveProfile,
  saveSocials,
  addCustomSocial,
  removeCustomSocial,
  updateCustomSocialField,
  showNotification
};