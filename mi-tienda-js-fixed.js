// NUEVO ENFOQUE: Leer datos de autenticación desde URL parameters
// Reemplaza setupLaravelAuthListener() con esto:

function setupLaravelAuthFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('csrf') && urlParams.has('user_id')) {
        laravelAuth = {
            csrfToken: urlParams.get('csrf'),
            userId: parseInt(urlParams.get('user_id')),
            userName: decodeURIComponent(urlParams.get('user_name') || ''),
            userEmail: decodeURIComponent(urlParams.get('user_email') || ''),
            authenticated: true
        };
        
        console.log('✅ Laravel authentication data loaded from URL:', laravelAuth);
        
        // Cargar datos desde API
        loadFromAPI();
        return true;
    }
    
    console.warn('❌ No Laravel auth data in URL, falling back to localStorage');
    loadFromStorage();
    return false;
}

// En el DOMContentLoaded, reemplaza setupLaravelAuthListener() con:
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mi Tienda v2.0 - Inicializando aplicación...');
    
    // CAMBIO PRINCIPAL: Usar URL parameters en lugar de postMessage
    setupLaravelAuthFromURL();
    
    // Resto del código igual...
    initializeApp();
    updatePreview();
    initializeDragAndDrop();
    setupEventListeners();
    initializeDesignIntegration();
    
    console.log('Mi Tienda v2.0 - Aplicación inicializada correctamente');
});