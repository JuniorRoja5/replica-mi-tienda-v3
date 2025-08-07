/**
 * Dashboard Home JavaScript
 * Handles landing page functionality and user interactions
 * Compatible with Laravel Blade integration
 */

// Global state
let isLoading = false;

// DOM Elements
const headerStartBtn = document.getElementById('headerStartBtn');
const heroCreateStoreBtn = document.getElementById('heroCreateStoreBtn');
const heroDemoBtn = document.getElementById('heroDemoBtn');
const ctaCreateStoreBtn = document.getElementById('ctaCreateStoreBtn');

/**
 * Initialize the application
 */
function initializeDashboardHome() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Set up event listeners
    setupEventListeners();
    
    // Set up scroll animations
    setupScrollAnimations();
    
    console.log('Dashboard Home initialized successfully');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Get started buttons
    if (headerStartBtn) {
        headerStartBtn.addEventListener('click', handleGetStarted);
    }
    
    if (heroCreateStoreBtn) {
        heroCreateStoreBtn.addEventListener('click', handleGetStarted);
    }
    
    if (ctaCreateStoreBtn) {
        ctaCreateStoreBtn.addEventListener('click', handleGetStarted);
    }
    
    // Demo button
    if (heroDemoBtn) {
        heroDemoBtn.addEventListener('click', handleViewDemo);
    }
}

/**
 * Handle get started button clicks
 * This simulates the User.login() functionality from React
 */
async function handleGetStarted(event) {
    if (isLoading) return;
    
    const button = event.target.closest('button');
    if (!button) return;
    
    try {
        setLoadingState(button, true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For now, redirect to Mi Tienda
        // In Laravel implementation, this would handle authentication
        window.location.href = 'mi-tienda.html';
        
    } catch (error) {
        console.error('Error during get started process:', error);
        
        // Show error message (in production, use proper toast/notification system)
        alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
        
    } finally {
        setLoadingState(button, false);
    }
}

/**
 * Handle view demo button click
 */
function handleViewDemo(event) {
    // For now, just scroll to features section
    // In real implementation, this could open a modal with video/demo
    const featuresSection = document.querySelector('.features-grid').closest('.section');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Set loading state for buttons
 */
function setLoadingState(button, loading) {
    isLoading = loading;
    
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (loading) {
        button.classList.add('btn-loading');
        button.disabled = true;
        
        if (btnText) btnText.textContent = 'Cargando...';
        if (spinner) spinner.style.display = 'inline-block';
        
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
        
        if (spinner) spinner.style.display = 'none';
        
        // Restore original text based on button ID
        if (btnText) {
            switch (button.id) {
                case 'headerStartBtn':
                    btnText.textContent = 'Comenzar Gratis';
                    break;
                case 'heroCreateStoreBtn':
                    btnText.textContent = 'Crear Mi Tienda Gratis';
                    break;
                case 'ctaCreateStoreBtn':
                    btnText.textContent = 'Crear Mi Tienda Ahora';
                    break;
                default:
                    btnText.textContent = 'Comenzar';
            }
        }
    }
}

/**
 * Set up scroll animations
 * Replaces Framer Motion animations with vanilla JS
 */
function setupScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    // Animate stats on scroll
    animateStatsOnScroll();
}

/**
 * Animate statistics numbers when they come into view
 */
function animateStatsOnScroll() {
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

/**
 * Animate stat numbers with counting effect
 */
function animateStatNumbers() {
    const statItems = [
        { element: document.querySelectorAll('.stat-number')[0], target: '10K+', duration: 2000 },
        { element: document.querySelectorAll('.stat-number')[1], target: '$2M+', duration: 2500 },
        { element: document.querySelectorAll('.stat-number')[2], target: '50K+', duration: 2200 },
        { element: document.querySelectorAll('.stat-number')[3], target: '99.9%', duration: 1800 }
    ];
    
    statItems.forEach((stat, index) => {
        if (!stat.element) return;
        
        setTimeout(() => {
            animateNumber(stat.element, stat.target, stat.duration);
        }, index * 200);
    });
}

/**
 * Animate individual number
 */
function animateNumber(element, target, duration) {
    const isPercentage = target.includes('%');
    const isDollar = target.includes('$');
    const isK = target.includes('K');
    const isM = target.includes('M');
    
    let numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
    
    if (isK) numericTarget *= 1000;
    if (isM) numericTarget *= 1000000;
    
    let current = 0;
    const increment = numericTarget / (duration / 50);
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericTarget) {
            current = numericTarget;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        // Format display value
        if (isK && current >= 1000) {
            displayValue = Math.floor(current / 1000) + 'K+';
        } else if (isM && current >= 1000000) {
            displayValue = Math.floor(current / 1000000) + 'M+';
        } else if (isDollar) {
            displayValue = '$' + (Math.floor(current / 1000000)) + 'M+';
        } else if (isPercentage) {
            displayValue = (current / 10).toFixed(1) + '%';
        }
        
        element.textContent = displayValue;
    }, 50);
}

/**
 * Smooth scroll to element
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Handle responsive behavior
 */
function handleResponsive() {
    const isMobile = window.innerWidth < 768;
    
    // Adjust animations for mobile
    if (isMobile) {
        document.documentElement.style.setProperty('--animation-duration', '0.4s');
    } else {
        document.documentElement.style.setProperty('--animation-duration', '0.6s');
    }
}

/**
 * Navigation helpers (for Laravel integration)
 */
const NavigationHelper = {
    /**
     * Navigate to Mi Tienda page
     */
    goToMiTienda: function() {
        window.location.href = 'mi-tienda.html';
    },
    
    /**
     * Navigate to Dashboard
     */
    goToDashboard: function() {
        window.location.href = 'dashboard.html';
    },
    
    /**
     * Navigate to specific section
     */
    goToSection: function(sectionId) {
        scrollToElement(sectionId);
    }
};

/**
 * Laravel integration helpers
 */
const LaravelHelper = {
    /**
     * Get CSRF token (for Laravel integration)
     */
    getCsrfToken: function() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    },
    
    /**
     * Make authenticated request (for Laravel integration)
     */
    makeAuthenticatedRequest: async function(url, options = {}) {
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
        
        try {
            const response = await fetch(url, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    },
    
    /**
     * Handle Laravel authentication
     */
    handleAuth: async function() {
        try {
            // In Laravel implementation, this would redirect to authentication route
            // For now, simulate the login process
            await this.makeAuthenticatedRequest('/auth/login', {
                method: 'POST'
            });
            
            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            return false;
        }
    }
};

/**
 * Utility functions
 */
const Utils = {
    /**
     * Debounce function
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Check if element is in viewport
     */
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', initializeDashboardHome);
window.addEventListener('resize', Utils.debounce(handleResponsive, 250));

// Performance optimization
window.addEventListener('load', () => {
    // Mark page as fully loaded for performance tracking
    console.log('Dashboard Home fully loaded');
});

// Export for Laravel Blade integration
if (typeof window !== 'undefined') {
    window.DashboardHome = {
        NavigationHelper,
        LaravelHelper,
        Utils,
        init: initializeDashboardHome
    };
}