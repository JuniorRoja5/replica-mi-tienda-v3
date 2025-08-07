/**
 * Design Customizer JavaScript
 * Handles theme customization, color changes, and real-time preview
 * Based on Design.jsx and DesignCustomizer.jsx from React implementation
 * Compatible with Laravel Blade integration
 */

// Global state management
let currentCreator = null;
let allProducts = [];
let editableCreator = null;
let isLoading = true;
let isSaving = false;
let showPreview = false;
let changesSaved = false;

// Theme state
let currentThemeIndex = 0;

// DOM elements
const loadingState = document.getElementById('loadingState');
const desktopLayout = document.getElementById('desktopLayout');
const mobileLayout = document.getElementById('mobileLayout');
const mobilePreviewModal = document.getElementById('mobilePreviewModal');

// Predefined themes (replicated from React themes.jsx)
const PREDEFINED_THEMES = [
    {
        id: "dark",
        name: "Tema Oscuro",
        description: "Moderno y elegante",
        preview: "#000000",
        colors: {
            background: "#000000",
            gradient: "linear-gradient(135deg, #000000 0%, #2D2D2D 100%)",
            text_color: "#FFFFFF",
            text_secondary_color: "#A0A0A0",
            button_color: "rgba(255, 255, 255, 0.1)",
            button_font_color: "#FFFFFF",
            button_hover_color: "rgba(255, 255, 255, 0.15)",
        },
        fonts: ["Inter", "Roboto", "Poppins"]
    },
    {
        id: "light",
        name: "Tema Claro",
        description: "Limpio y profesional",
        preview: "#F8FAFC",
        colors: {
            background: "#F8FAFC",
            gradient: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
            text_color: "#1F2937",
            text_secondary_color: "#6B7280",
            button_color: "rgba(0, 0, 0, 0.05)",
            button_font_color: "#1F2937",
            button_hover_color: "rgba(0, 0, 0, 0.1)",
        },
        fonts: ["Inter", "Open Sans", "Lato"]
    },
    {
        id: "cuarzo_rosa",
        name: "Cuarzo Rosa",
        description: "Elegante y sofisticado",
        preview: "linear-gradient(135deg, #F5EDE7 0%, #FAF6F4 100%)",
        colors: {
            background: "#F5EDE7",
            gradient: "linear-gradient(135deg, #F5EDE7 0%, #E8D5CC 100%)",
            text_color: "#4E4039",
            text_secondary_color: "#6B5B52",
            button_color: "#CFAF9E",
            button_font_color: "#4E4039",
            button_hover_color: "#C5A394",
        },
        fonts: ["Inter", "Poppins", "Montserrat"]
    },
    {
        id: "desert_titanium",
        name: "Desert Titanium",
        description: "Elegante y sofisticado",
        preview: "linear-gradient(135deg, #F5F1EC 0%, #EFEAE4 100%)",
        colors: {
            background: "#F5F1EC",
            gradient: "linear-gradient(135deg, #F5F1EC 0%, #DCC7B0 100%)",
            text_color: "#3C3C3C",
            text_secondary_color: "#6B5B5B",
            button_color: "#D3BBA3",
            button_font_color: "#3C3C3C",
            button_hover_color: "#C9AE95",
        },
        fonts: ["Inter", "SF Pro Display", "Helvetica Neue"]
    },
    {
        id: "titanio_natural",
        name: "Titanio Natural",
        description: "Minimalista y tecnológico",
        preview: "linear-gradient(135deg, #F2F2F2 0%, #EDEDED 100%)",
        colors: {
            background: "#F2F2F2",
            gradient: "linear-gradient(135deg, #F2F2F2 0%, #CCCCCC 100%)",
            text_color: "#2D2D2D",
            text_secondary_color: "#5A5A5A",
            button_color: "#B5B5B5",
            button_font_color: "#2D2D2D",
            button_hover_color: "#AFAFAF",
        },
        fonts: ["SF Pro Display", "Helvetica Neue", "Inter"]
    },
    {
        id: "purple_elegant",
        name: "Tema Púrpura Elegante",
        description: "Sofisticado y vibrante",
        preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        colors: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            gradient: "linear-gradient(135deg, #1a1a2e 0%, #0f051d 100%)",
            text_color: "#E0E7FF",
            text_secondary_color: "#A5B4FC",
            button_color: "rgba(224, 231, 255, 0.1)",
            button_font_color: "#E0E7FF",
            button_hover_color: "rgba(224, 231, 255, 0.15)",
        },
        fonts: ["Inter", "Poppins", "Roboto"]
    },
    {
        id: "blue_night",
        name: "Noche Azul Profundo",
        description: "Elegante y corporativo",
        preview: "#0C1445",
        colors: {
            background: "#0C1445",
            gradient: "linear-gradient(135deg, #0C1445 0%, #051025 100%)",
            text_color: "#E0E7FF",
            text_secondary_color: "#A5B4FC",
            button_color: "rgba(224, 231, 255, 0.1)",
            button_font_color: "#E0E7FF",
            button_hover_color: "rgba(224, 231, 255, 0.15)",
        },
        fonts: ["Lato", "Inter", "Source Sans Pro"]
    },
    {
        id: "sand",
        name: "Arena Suave",
        description: "Cálido y minimalista",
        preview: "#F7F3E9",
        colors: {
            background: "#F7F3E9",
            gradient: "linear-gradient(135deg, #F7F3E9 0%, #EFDCC7 100%)",
            text_color: "#433A3F",
            text_secondary_color: "#695F64",
            button_color: "rgba(67, 58, 63, 0.08)",
            button_font_color: "#433A3F",
            button_hover_color: "rgba(67, 58, 63, 0.12)",
        },
        fonts: ["Quicksand", "Montserrat", "Inter"]
    },
    {
        id: "neon",
        name: "Neón Moderno",
        description: "Vibrante y atrevido",
        preview: "#1A1A2E",
        colors: {
            background: "#1A1A2E",
            gradient: "linear-gradient(135deg, #1A1A2E 0%, #0A0A1A 100%)",
            text_color: "#E0FFFF",
            text_secondary_color: "#AFEEEE",
            button_color: "rgba(224, 255, 255, 0.1)",
            button_font_color: "#E0FFFF",
            button_hover_color: "rgba(224, 255, 255, 0.15)",
        },
        fonts: ["Poppins", "Roboto Mono", "Inter"]
    },
    {
        id: "azul_marino",
        name: "Azul Marino",
        description: "Intenso y profesional",
        preview: "#1A3E8B",
        colors: {
            background: "#1A3E8B",
            gradient: "linear-gradient(135deg, #1A3E8B 0%, #0D2759 100%)",
            text_color: "#FFFFFF",
            text_secondary_color: "#A9C4E8",
            button_color: "#4A90E2",
            button_font_color: "#FFFFFF",
            button_hover_color: "#5A99E5",
        },
        fonts: ["Lato", "Inter", "Source Sans Pro"]
    },
    {
        id: "amarillo_polito",
        name: "Amarillo Polito",
        description: "Cálido y amigable",
        preview: "#FDE68A",
        colors: {
            background: "#FDE68A",
            gradient: "linear-gradient(135deg, #FDE68A 0%, #F4C430 100%)",
            text_color: "#5A4215",
            text_secondary_color: "#856321",
            button_color: "#F6C453",
            button_font_color: "#5A4215",
            button_hover_color: "#F7CA66",
        },
        fonts: ["Quicksand", "Montserrat", "Inter"]
    },
    {
        id: "titanio_esmeralda",
        name: "Titanio Esmeralda",
        description: "Fresco y natural",
        preview: "#D7E7DC",
        colors: {
            background: "#D7E7DC",
            gradient: "linear-gradient(135deg, #D7E7DC 0%, #B0D4BE 100%)",
            text_color: "#333333",
            text_secondary_color: "#555555",
            button_color: "#2E7D60",
            button_font_color: "#333333",
            button_hover_color: "#3E8D70",
        },
        fonts: ["Inter", "Poppins", "Montserrat"]
    },
    {
        id: "bora_purpura",
        name: "Bora Púrpura",
        description: "Delicado y moderno",
        preview: "#E2D5F5",
        colors: {
            background: "#E2D5F5",
            gradient: "linear-gradient(135deg, #E2D5F5 0%, #CAAEE0 100%)",
            text_color: "#3E3E3E",
            text_secondary_color: "#5E5E5E",
            button_color: "#8A63D2",
            button_font_color: "#3E3E3E",
            button_hover_color: "#9A73E2",
        },
        fonts: ["Poppins", "Quicksand", "Nunito"]
    },
    {
        id: "grafito",
        name: "Grafito",
        description: "Sobrio y elegante",
        preview: "#1F1F1F",
        colors: {
            background: "#1F1F1F",
            gradient: "linear-gradient(135deg, #1F1F1F 0%, #0A0A0A 100%)",
            text_color: "#FFFFFF",
            text_secondary_color: "#B3B3B3",
            button_color: "#B3B3B3",
            button_font_color: "#FFFFFF",
            button_hover_color: "#C3C3C3",
        },
        fonts: ["Inter", "Roboto", "Poppins"]
    },
    {
        id: "mandarina_soft",
        name: "Mandarina Soft",
        description: "Vibrante y suave",
        preview: "#FCA88D",
        colors: {
            background: "#FCA88D",
            gradient: "linear-gradient(135deg, #FCA88D 0%, #F56B3B 100%)",
            text_color: "#FFFFFF",
            text_secondary_color: "#FFE5D9",
            button_color: "#F87455",
            button_font_color: "#FFFFFF",
            button_hover_color: "#F98465",
        },
        fonts: ["Poppins", "Quicksand", "Nunito"]
    },
    {
        id: "titanio_cielo",
        name: "Titanio Cielo",
        description: "Limpio y tecnológico",
        preview: "#E6EAEE",
        colors: {
            background: "#E6EAEE",
            gradient: "linear-gradient(135deg, #E6EAEE 0%, #C4D4E0 100%)",
            text_color: "#333333",
            text_secondary_color: "#555555",
            button_color: "#BFD4E7",
            button_font_color: "#333333",
            button_hover_color: "#CFDAE9",
        },
        fonts: ["SF Pro Display", "Helvetica Neue", "Inter"]
    }
];

/**
 * Initialize the design customizer
 * Main entry point for the application
 */
async function initializeDiseno() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Set up event listeners
    setupEventListeners();
    
    // Show loading state
    showLoadingState();
    
    // Load design data
    await loadDesignData();
    
    // Hide loading state and show content
    hideLoadingState();
    
    console.log('Design customizer initialized successfully');
}

/**
 * Set up all event listeners
 * Handles all user interactions on the page
 */
function setupEventListeners() {
    // Theme navigation
    const prevThemeBtn = document.getElementById('prevThemeBtn');
    const nextThemeBtn = document.getElementById('nextThemeBtn');
    
    if (prevThemeBtn) {
        prevThemeBtn.addEventListener('click', handlePrevTheme);
    }
    if (nextThemeBtn) {
        nextThemeBtn.addEventListener('click', handleNextTheme);
    }
    
    // Background type selection
    const solidOption = document.getElementById('solidBackgroundOption');
    const gradientOption = document.getElementById('gradientBackgroundOption');
    
    if (solidOption) {
        solidOption.addEventListener('click', () => handleBackgroundTypeChange('solid'));
    }
    if (gradientOption) {
        gradientOption.addEventListener('click', () => handleBackgroundTypeChange('gradient'));
    }
    
    // Color pickers
    const backgroundColorInput = document.getElementById('backgroundColorInput');
    const textColorInput = document.getElementById('textColorInput');
    
    if (backgroundColorInput) {
        backgroundColorInput.addEventListener('input', (e) => handleColorChange('background', e.target.value));
        backgroundColorInput.addEventListener('change', (e) => handleColorChange('background', e.target.value));
    }
    if (textColorInput) {
        textColorInput.addEventListener('input', (e) => handleColorChange('text_color', e.target.value));
        textColorInput.addEventListener('change', (e) => handleColorChange('text_color', e.target.value));
    }
    
    // Font selector
    const fontSelectorTrigger = document.getElementById('fontSelectorTrigger');
    if (fontSelectorTrigger) {
        fontSelectorTrigger.addEventListener('click', toggleFontDropdown);
        fontSelectorTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFontDropdown();
            }
        });
    }
    
    // Save buttons
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const mobileSaveChangesBtn = document.getElementById('mobileSaveChangesBtn');
    
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', handleSaveChanges);
    }
    if (mobileSaveChangesBtn) {
        mobileSaveChangesBtn.addEventListener('click', handleSaveChanges);
    }
    
    // Mobile preview
    const mobilePreviewBtn = document.getElementById('mobilePreviewBtn');
    const closeMobilePreview = document.getElementById('closeMobilePreview');
    
    if (mobilePreviewBtn) {
        mobilePreviewBtn.addEventListener('click', handleShowMobilePreview);
    }
    if (closeMobilePreview) {
        closeMobilePreview.addEventListener('click', handleCloseMobilePreview);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const fontSelector = document.getElementById('fontSelectorDropdown');
        const fontTrigger = document.getElementById('fontSelectorTrigger');
        
        if (fontSelector && !fontSelector.contains(e.target) && !fontTrigger.contains(e.target)) {
            fontSelector.classList.remove('show');
        }
    });
    
    // Close mobile preview when clicking backdrop
    if (mobilePreviewModal) {
        mobilePreviewModal.addEventListener('click', (e) => {
            if (e.target === mobilePreviewModal) {
                handleCloseMobilePreview();
            }
        });
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    if (loadingState) {
        loadingState.style.display = 'block';
    }
    if (desktopLayout) {
        desktopLayout.style.display = 'none';
    }
    if (mobileLayout) {
        mobileLayout.style.display = 'none';
    }
    isLoading = true;
}

/**
 * Hide loading state and show content
 */
function hideLoadingState() {
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    if (desktopLayout) {
        desktopLayout.style.display = '';  // Let CSS handle responsive behavior
    }
    if (mobileLayout) {
        mobileLayout.style.display = '';  // Let CSS handle responsive behavior
    }
    isLoading = false;
}

/**
 * Load design data
 * Simulates the loadData function from React Design.jsx
 */
async function loadDesignData() {
    try {
        // Simulate API calls with realistic data
        await simulateDataLoading();
        
        // Initialize UI
        initializeDesignUI();
        
        // Update preview
        updatePreview();
        
    } catch (error) {
        console.error('Error loading design data:', error);
        // In production, show error message to user
    }
}

/**
 * Simulate data loading with realistic delays
 * Replicates the loadData function from React Design.jsx
 */
async function simulateDataLoading() {
    // Simulate getting current creator (User.me() + Creator.filter())
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock creator data
    currentCreator = {
        id: 'creator_123',
        username: 'mi_usuario',
        display_name: 'Ana María',
        bio: 'Creadora de contenido digital',
        design_settings: null // Will be set to default theme
    };
    
    // Initialize with dark theme (as per React implementation)
    const darkTheme = PREDEFINED_THEMES.find(t => t.id === 'dark');
    const initialDesignSettings = {
        theme_id: darkTheme.id,
        theme_name: darkTheme.name,
        background: darkTheme.colors.background,
        background_type: 'solid',
        text_color: darkTheme.colors.text_color,
        text_secondary_color: darkTheme.colors.text_secondary_color,
        font_family: darkTheme.fonts[0],
        button_color: darkTheme.colors.button_color,
        button_font_color: darkTheme.colors.button_font_color,
        button_hover_color: darkTheme.colors.button_hover_color,
    };
    
    editableCreator = {
        ...currentCreator,
        design_settings: { ...initialDesignSettings, ...(currentCreator.design_settings || {}) }
    };
    
    // Mock products data
    await new Promise(resolve => setTimeout(resolve, 300));
    
    allProducts = [
        {
            id: 'prod_1',
            title: 'Curso de Marketing Digital',
            creator_id: currentCreator.id,
            type: 'course',
            price: 99.99,
            is_active: true,
            sort_order: 1
        },
        {
            id: 'prod_2',
            title: 'Consultoría 1:1',
            creator_id: currentCreator.id,
            type: 'call',
            price: 149.99,
            is_active: true,
            sort_order: 2
        },
        {
            id: 'prod_3',
            title: 'Membresía Premium',
            creator_id: currentCreator.id,
            type: 'membership',
            price: 29.99,
            is_active: true,
            sort_order: 3
        }
    ];
    
    // Sort products by sort_order
    allProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

/**
 * Initialize design UI components
 */
function initializeDesignUI() {
    // Set current theme index
    currentThemeIndex = PREDEFINED_THEMES.findIndex(t => 
        t.id === (editableCreator.design_settings?.theme_id || 'dark')
    );
    if (currentThemeIndex === -1) currentThemeIndex = 0;
    
    // Initialize theme preview
    updateThemePreview();
    
    // Initialize theme indicators
    initializeThemeIndicators();
    
    // Initialize background type selector
    updateBackgroundTypeSelector();
    
    // Initialize color pickers
    updateColorPickers();
    
    // Initialize font selector
    initializeFontSelector();
    
    // Copy mobile customizer content
    copyToMobileCustomizer();
}

/**
 * Update theme preview display
 * Replicates the theme carousel from React DesignCustomizer.jsx
 */
function updateThemePreview() {
    const themePreview = document.getElementById('themePreview');
    if (!themePreview) return;
    
    const currentTheme = PREDEFINED_THEMES[currentThemeIndex];
    
    // Determine if theme is light-colored for border styling
    const isLightTheme = ['light', 'sand', 'cuarzo_rosa', 'desert_titanium', 'titanio_natural', 'titanio_cielo', 'titanio_esmeralda', 'bora_purpura', 'amarillo_polito'].includes(currentTheme.id);
    
    themePreview.innerHTML = `
        <div class="theme-preview-phone ${isLightTheme ? 'light-theme' : ''}">
            <div class="theme-preview-content" style="background: ${currentTheme.preview}; font-family: ${currentTheme.fonts[0]};">
                <!-- Simulated avatar -->
                <div class="theme-preview-avatar" style="background-color: ${currentTheme.colors.text_color};"></div>
                <!-- Simulated content bars -->
                <div class="theme-preview-bar" style="background-color: ${currentTheme.colors.text_color};"></div>
                <div class="theme-preview-bar-small" style="background-color: ${currentTheme.colors.text_color};"></div>
                <!-- Simulated buttons -->
                <div style="margin-top: auto;">
                    <div class="theme-preview-button" style="background-color: ${currentTheme.colors.button_color || 'rgba(255, 255, 255, 0.1)'};"></div>
                    <div class="theme-preview-button" style="background-color: ${currentTheme.colors.button_color || 'rgba(255, 255, 255, 0.1)'};"></div>
                </div>
            </div>
            <div class="theme-check-badge">
                <i data-lucide="check" style="width: 16px; height: 16px; color: white;"></i>
            </div>
        </div>
        <div class="theme-info">
            <h3 class="theme-info-name">${currentTheme.name}</h3>
            <p class="theme-info-description">${currentTheme.description}</p>
        </div>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Initialize theme indicators
 */
function initializeThemeIndicators() {
    const themeIndicators = document.getElementById('themeIndicators');
    if (!themeIndicators) return;
    
    themeIndicators.innerHTML = PREDEFINED_THEMES.map((theme, index) => `
        <button 
            class="theme-indicator ${index === currentThemeIndex ? 'active' : ''}" 
            onclick="handleThemeIndicatorClick(${index})"
        ></button>
    `).join('');
}

/**
 * Update background type selector
 */
function updateBackgroundTypeSelector() {
    const backgroundType = editableCreator.design_settings?.background_type || 'solid';
    const currentTheme = PREDEFINED_THEMES[currentThemeIndex];
    
    // Update radio buttons
    const solidRadio = document.querySelector('#solidBackgroundOption .background-option-radio');
    const gradientRadio = document.querySelector('#gradientBackgroundOption .background-option-radio');
    
    if (solidRadio) {
        solidRadio.classList.toggle('selected', backgroundType === 'solid');
    }
    if (gradientRadio) {
        gradientRadio.classList.toggle('selected', backgroundType === 'gradient');
    }
    
    // Update preview boxes
    const solidPreview = document.getElementById('solidPreview');
    const gradientPreview = document.getElementById('gradientPreview');
    
    if (solidPreview) {
        solidPreview.style.background = currentTheme.colors.background;
    }
    if (gradientPreview) {
        gradientPreview.style.background = currentTheme.colors.gradient;
    }
}

/**
 * Update color picker values
 */
function updateColorPickers() {
    const settings = editableCreator.design_settings;
    
    // Background color
    const backgroundColorInput = document.getElementById('backgroundColorInput');
    const backgroundColorPreview = document.getElementById('backgroundColorPreview');
    
    if (backgroundColorInput && backgroundColorPreview && settings) {
        const bgColor = settings.background;
        const isGradient = bgColor && bgColor.includes('gradient');
        
        if (!isGradient) {
            backgroundColorInput.value = bgColor || '#000000';
            backgroundColorInput.type = 'color';
        } else {
            backgroundColorInput.value = bgColor || '';
            backgroundColorInput.type = 'text';
            backgroundColorInput.placeholder = 'CSS Gradient';
        }
        
        backgroundColorPreview.style.background = bgColor;
    }
    
    // Text color
    const textColorInput = document.getElementById('textColorInput');
    const textColorPreview = document.getElementById('textColorPreview');
    
    if (textColorInput && textColorPreview && settings) {
        const textColor = settings.text_color || '#FFFFFF';
        textColorInput.value = textColor;
        textColorPreview.style.background = textColor;
    }
}

/**
 * Initialize font selector
 */
function initializeFontSelector() {
    const currentTheme = PREDEFINED_THEMES[currentThemeIndex];
    const currentFont = editableCreator.design_settings?.font_family || currentTheme.fonts[0];
    
    // Update trigger text
    const fontSelectorValue = document.getElementById('fontSelectorValue');
    if (fontSelectorValue) {
        fontSelectorValue.textContent = currentFont;
        fontSelectorValue.style.fontFamily = currentFont;
    }
    
    // Populate dropdown
    const fontSelectorDropdown = document.getElementById('fontSelectorDropdown');
    if (fontSelectorDropdown) {
        fontSelectorDropdown.innerHTML = currentTheme.fonts.map(font => `
            <div class="font-option" onclick="handleFontChange('${font}')" style="font-family: ${font};">
                ${font}
            </div>
        `).join('');
    }
}

/**
 * Copy design customizer content to mobile layout
 */
function copyToMobileCustomizer() {
    const desktopCustomizer = document.getElementById('designCustomizer');
    const mobileCustomizer = document.getElementById('mobileDesignCustomizer');
    
    if (desktopCustomizer && mobileCustomizer) {
        mobileCustomizer.innerHTML = desktopCustomizer.innerHTML;
        
        // Re-initialize Lucide icons for mobile
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Re-setup mobile-specific event listeners
        setupMobileEventListeners();
    }
}

/**
 * Set up mobile-specific event listeners
 */
function setupMobileEventListeners() {
    // This function would set up event listeners for the mobile version
    // For brevity, we'll assume the same handlers work for both desktop and mobile
    // In a full implementation, you might want separate handlers
}

/**
 * Update live preview
 * This is where the real-time preview magic happens
 */
function updatePreview() {
    updateDesktopPreview();
    updateMobilePreview();
}

/**
 * Update desktop preview
 */
function updateDesktopPreview() {
    const previewIframe = document.getElementById('previewIframe');
    if (!previewIframe || !editableCreator) return;
    
    const settings = editableCreator.design_settings;
    
    // Create preview HTML content that matches Mi Tienda structure
    const previewHTML = createPreviewHTML(settings);
    
    previewIframe.innerHTML = previewHTML;
}

/**
 * Update mobile preview
 */
function updateMobilePreview() {
    const mobilePreviewIframe = document.getElementById('mobilePreviewIframe');
    if (!mobilePreviewIframe || !editableCreator) return;
    
    const settings = editableCreator.design_settings;
    
    // Create preview HTML content that matches Mi Tienda structure
    const previewHTML = createPreviewHTML(settings, true);
    
    mobilePreviewIframe.innerHTML = previewHTML;
}

/**
 * Create preview HTML content
 * This replicates the ProfileView component from React
 */
function createPreviewHTML(settings, isMobilePreview = false) {
    const containerStyle = `
        background: ${settings.background};
        font-family: ${settings.font_family};
        color: ${settings.text_color};
        min-height: 100%;
        padding: ${isMobilePreview ? '1rem' : '2rem 1rem'};
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    return `
        <div style="${containerStyle}">
            <!-- Profile Header -->
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="
                    width: 80px; 
                    height: 80px; 
                    background: ${settings.text_color}; 
                    opacity: 0.1;
                    border-radius: 50%; 
                    margin: 0 auto 1rem;
                "></div>
                <h1 style="
                    color: ${settings.text_color}; 
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    margin: 0 0 0.5rem 0;
                ">${editableCreator.display_name}</h1>
                <p style="
                    color: ${settings.text_secondary_color}; 
                    margin: 0;
                    font-size: 0.875rem;
                ">${editableCreator.bio || 'Creador de contenido digital'}</p>
            </div>
            
            <!-- Products List -->
            <div style="width: 100%; max-width: 280px;">
                ${allProducts.slice(0, 3).map(product => `
                    <div style="
                        background: ${settings.button_color}; 
                        color: ${settings.button_font_color};
                        padding: 1rem; 
                        border-radius: 0.75rem; 
                        margin-bottom: 0.75rem;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border: none;
                    " onmouseover="this.style.background='${settings.button_hover_color}'" 
                       onmouseout="this.style.background='${settings.button_color}'">
                        <div style="
                            font-weight: 600; 
                            margin-bottom: 0.25rem;
                            font-size: 0.875rem;
                        ">${product.title}</div>
                        <div style="
                            font-size: 0.75rem; 
                            opacity: 0.8;
                        ">$${product.price}</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Footer info -->
            <div style="
                margin-top: 2rem; 
                text-align: center;
                opacity: 0.6;
            ">
                <p style="
                    color: ${settings.text_secondary_color}; 
                    font-size: 0.75rem; 
                    margin: 0;
                ">Vista previa en tiempo real</p>
            </div>
        </div>
    `;
}

/**
 * Event Handlers
 */

/**
 * Handle theme navigation - previous
 */
function handlePrevTheme() {
    currentThemeIndex = currentThemeIndex === 0 ? PREDEFINED_THEMES.length - 1 : currentThemeIndex - 1;
    handleThemeSelect(PREDEFINED_THEMES[currentThemeIndex]);
}

/**
 * Handle theme navigation - next  
 */
function handleNextTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % PREDEFINED_THEMES.length;
    handleThemeSelect(PREDEFINED_THEMES[currentThemeIndex]);
}

/**
 * Handle theme indicator click
 */
function handleThemeIndicatorClick(index) {
    currentThemeIndex = index;
    handleThemeSelect(PREDEFINED_THEMES[index]);
}

/**
 * Handle theme selection
 * Replicates the handleThemeSelect function from React DesignCustomizer.jsx
 */
function handleThemeSelect(theme) {
    const newDesignSettings = {
        theme_id: theme.id,
        theme_name: theme.name,
        background: theme.colors.background,
        background_type: 'solid', // Default to solid when a new theme is selected
        text_color: theme.colors.text_color,
        text_secondary_color: theme.colors.text_secondary_color,
        font_family: theme.fonts[0],
        button_color: theme.colors.button_color,
        button_font_color: theme.colors.button_font_color,
        button_hover_color: theme.colors.button_hover_color,
    };
    
    handleDesignChange(newDesignSettings);
    
    // Update UI components
    updateThemePreview();
    initializeThemeIndicators();
    updateBackgroundTypeSelector();
    updateColorPickers();
    initializeFontSelector();
    
    // Copy to mobile
    copyToMobileCustomizer();
}

/**
 * Handle background type change
 * Replicates the handleBackgroundTypeChange function from React DesignCustomizer.jsx
 */
function handleBackgroundTypeChange(type) {
    const currentTheme = PREDEFINED_THEMES[currentThemeIndex];
    const newBackground = type === 'gradient' ? currentTheme.colors.gradient : currentTheme.colors.background;
    
    const newDesignSettings = {
        ...editableCreator.design_settings,
        background_type: type,
        background: newBackground,
    };
    
    handleDesignChange(newDesignSettings);
    
    // Update UI
    updateBackgroundTypeSelector();
    updateColorPickers();
    copyToMobileCustomizer();
}

/**
 * Handle color change
 * Replicates the handleColorChange function from React DesignCustomizer.jsx
 */
function handleColorChange(colorType, color) {
    const newDesignSettings = {
        ...editableCreator.design_settings,
        [colorType]: color,
        // If the background color is changed, set its type to 'solid'
        background_type: colorType === 'background' ? 'solid' : editableCreator.design_settings.background_type,
    };
    
    handleDesignChange(newDesignSettings);
    
    // Update UI
    if (colorType === 'background') {
        updateBackgroundTypeSelector();
    }
    copyToMobileCustomizer();
}

/**
 * Handle font change
 * Replicates the handleFontChange function from React DesignCustomizer.jsx
 */
function handleFontChange(font) {
    const newDesignSettings = {
        ...editableCreator.design_settings,
        font_family: font,
    };
    
    handleDesignChange(newDesignSettings);
    
    // Update font selector
    const fontSelectorValue = document.getElementById('fontSelectorValue');
    if (fontSelectorValue) {
        fontSelectorValue.textContent = font;
        fontSelectorValue.style.fontFamily = font;
    }
    
    // Close dropdown
    const fontSelectorDropdown = document.getElementById('fontSelectorDropdown');
    if (fontSelectorDropdown) {
        fontSelectorDropdown.classList.remove('show');
    }
    
    copyToMobileCustomizer();
}

/**
 * Handle design change
 * This is the main function that updates the design state and triggers preview updates
 * Replicates the handleDesignChange function from React Design.jsx
 */
function handleDesignChange(newDesignSettings) {
    editableCreator = {
        ...editableCreator,
        design_settings: newDesignSettings
    };
    
    changesSaved = false;
    
    // Update preview in real-time
    updatePreview();
    
    console.log('Design changed:', newDesignSettings);
}

/**
 * Handle save changes
 * Replicates the handleSaveChanges function from React Design.jsx
 */
async function handleSaveChanges() {
    if (!editableCreator || isSaving) return;
    
    isSaving = true;
    updateSaveButton(true);
    
    try {
        // Simulate API call to save design settings
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In Laravel implementation, this would be:
        // await LaravelHelper.makeRequest(`/api/creators/${currentCreator.id}`, {
        //     method: 'PUT',
        //     body: JSON.stringify({ design_settings: editableCreator.design_settings })
        // });
        
        currentCreator = { ...editableCreator };
        changesSaved = true;
        
        updateSaveButton(false, true);
        
        // Reset success state after 3 seconds
        setTimeout(() => {
            changesSaved = false;
            updateSaveButton(false, false);
        }, 3000);
        
        console.log('Design settings saved successfully');
        
    } catch (error) {
        console.error('Error saving design changes:', error);
        // In production, show error message to user
    } finally {
        isSaving = false;
    }
}

/**
 * Update save button state
 */
function updateSaveButton(loading, success = false) {
    const buttons = [
        { btn: document.getElementById('saveChangesBtn'), text: document.getElementById('saveBtnText') },
        { btn: document.getElementById('mobileSaveChangesBtn'), text: document.getElementById('mobileSaveBtnText') }
    ];
    
    const messages = [
        document.getElementById('saveSuccessMessage'),
        document.getElementById('mobileSaveSuccessMessage')
    ];
    
    buttons.forEach(({ btn, text }) => {
        if (!btn || !text) return;
        
        if (loading) {
            btn.disabled = true;
            btn.innerHTML = `
                <div class="save-spinner"></div>
                <span>Guardando...</span>
            `;
        } else if (success) {
            btn.classList.remove('primary');
            btn.classList.add('success');
            btn.innerHTML = `
                <i data-lucide="check" style="width: 20px; height: 20px;"></i>
                <span>¡Cambios Guardados!</span>
            `;
        } else {
            btn.disabled = false;
            btn.classList.remove('success');
            btn.classList.add('primary');
            btn.innerHTML = `
                <i data-lucide="save" style="width: 20px; height: 20px;"></i>
                <span>Guardar Tema</span>
            `;
        }
    });
    
    messages.forEach(message => {
        if (message) {
            message.style.display = success ? 'block' : 'none';
        }
    });
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Toggle font dropdown
 */
function toggleFontDropdown() {
    const dropdown = document.getElementById('fontSelectorDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

/**
 * Handle mobile preview show
 */
function handleShowMobilePreview() {
    if (mobilePreviewModal) {
        mobilePreviewModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Update mobile preview content
        updateMobilePreview();
    }
}

/**
 * Handle mobile preview close
 */
function handleCloseMobilePreview() {
    if (mobilePreviewModal) {
        mobilePreviewModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Laravel integration helpers
 */
const DisenoLaravelHelper = {
    /**
     * Load real data from Laravel backend
     */
    loadRealData: async function() {
        try {
            const [creator, products] = await Promise.all([
                this.makeRequest('/api/creator'),
                this.makeRequest('/api/products')
            ]);
            
            currentCreator = creator;
            allProducts = products;
            
            // Initialize editable creator
            const darkTheme = PREDEFINED_THEMES.find(t => t.id === 'dark');
            const initialDesignSettings = {
                theme_id: darkTheme.id,
                theme_name: darkTheme.name,
                background: darkTheme.colors.background,
                background_type: 'solid',
                text_color: darkTheme.colors.text_color,
                text_secondary_color: darkTheme.colors.text_secondary_color,
                font_family: darkTheme.fonts[0],
                button_color: darkTheme.colors.button_color,
                button_font_color: darkTheme.colors.button_font_color,
                button_hover_color: darkTheme.colors.button_hover_color,
            };
            
            editableCreator = {
                ...currentCreator,
                design_settings: { ...initialDesignSettings, ...(currentCreator.design_settings || {}) }
            };
            
            return true;
        } catch (error) {
            console.error('Failed to load real data:', error);
            return false;
        }
    },
    
    /**
     * Save design settings to Laravel backend
     */
    saveDesignSettings: async function(designSettings) {
        try {
            const response = await this.makeRequest(`/api/creators/${currentCreator.id}`, {
                method: 'PUT',
                body: JSON.stringify({ design_settings: designSettings })
            });
            
            return response;
        } catch (error) {
            console.error('Failed to save design settings:', error);
            throw error;
        }
    },
    
    /**
     * Make API request to Laravel backend
     */
    makeRequest: async function(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'X-CSRF-TOKEN': this.getCsrfToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: { ...defaultOptions.headers, ...options.headers }
        };
        
        const response = await fetch(endpoint, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    },
    
    /**
     * Get CSRF token for Laravel
     */
    getCsrfToken: function() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    }
};

/**
 * Navigation helpers
 */
const DisenoNavigation = {
    /**
     * Navigate to Mi Tienda
     */
    goToMiTienda: function() {
        window.location.href = 'mi-tienda.html';
    },
    
    /**
     * Navigate to Dashboard
     */
    goToDashboard: function() {
        window.location.href = 'dashboard.html';
    }
};

/**
 * Mi Tienda Integration
 * Functions to integrate design changes with the Mi Tienda preview
 */
const MiTiendaIntegration = {
    /**
     * Apply design settings to Mi Tienda iframe
     * This function would be called to update the Mi Tienda iframe with new design settings
     */
    applyDesignToMiTienda: function(designSettings) {
        // In the actual integration, this would communicate with the Mi Tienda iframe
        // to apply the new design settings in real-time
        
        // Example implementation:
        const miTiendaIframe = parent.document.getElementById('mi-tienda-iframe');
        if (miTiendaIframe) {
            const message = {
                type: 'DESIGN_UPDATE',
                settings: designSettings
            };
            miTiendaIframe.contentWindow.postMessage(message, '*');
        }
        
        console.log('Applied design to Mi Tienda:', designSettings);
    },
    
    /**
     * Get current design settings
     */
    getCurrentDesignSettings: function() {
        return editableCreator?.design_settings || null;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDiseno);

// Export for Laravel integration
if (typeof window !== 'undefined') {
    window.Diseno = {
        LaravelHelper: DisenoLaravelHelper,
        Navigation: DisenoNavigation,
        MiTiendaIntegration: MiTiendaIntegration,
        init: initializeDiseno,
        loadData: loadDesignData,
        saveChanges: handleSaveChanges
    };
}

// Global functions for HTML onclick handlers
window.handleThemeIndicatorClick = handleThemeIndicatorClick;
window.handleFontChange = handleFontChange;