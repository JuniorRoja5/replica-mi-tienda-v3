// FRAGMENT TO REPLACE IN mi-tienda.js
// Replace the setupLaravelAuthListener function with this setupLaravelAuthFromURL function

// Global functions need to be declared before DOMContentLoaded
function setupLaravelAuthFromURL() {
    // Get authentication data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    const csrfToken = urlParams.get('csrf');
    const userId = urlParams.get('user_id');
    const userName = urlParams.get('user_name');
    const userEmail = urlParams.get('user_email');
    
    if (csrfToken && userId) {
        laravelAuth = {
            csrfToken: csrfToken,
            userId: parseInt(userId),
            userName: decodeURIComponent(userName || ''),
            userEmail: decodeURIComponent(userEmail || ''),
            authenticated: true
        };

        console.log('✅ Laravel authentication data loaded from URL:', laravelAuth);

        // Now load data from API instead of localStorage
        loadFromAPI();
    } else {
        console.warn('No Laravel authentication data found in URL parameters');
        console.log('Available URL params:', Object.fromEntries(urlParams));
        // Fallback to localStorage
        loadFromStorage();
    }
}

// ALSO REPLACE THE DOMContentLoaded EVENT LISTENER:
// Replace setupLaravelAuthListener() with setupLaravelAuthFromURL()

// Initialization - Wait for DOM and setup everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('My Store application loaded');
    console.log('Using HTML + CSS + JS vanilla (compatible with Laravel Blade + Bootstrap)');
    console.log('Initial state:', appState);
    
    // Setup Laravel authentication from URL parameters
    setupLaravelAuthFromURL();

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
    
    console.log('Mi Tienda v2.0 - Aplicación inicializada');
});