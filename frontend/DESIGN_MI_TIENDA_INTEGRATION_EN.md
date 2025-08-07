# Design-Mi Tienda Integration Guide

## Overview

This document explains the interaction between the **Design Customizer** (`diseno.html`) and **Mi Tienda** (`mi-tienda.html`) pages, providing technical details for Laravel backend integration.

## Current Implementation Status

### ✅ What's Already Implemented

1. **Design Customizer (`diseno.html`)**
   - Complete theme selector with 16 predefined themes
   - Real-time color and font customization
   - Live preview with phone mockup
   - Save functionality ready for Laravel backend
   - Integration helpers and postMessage functionality

2. **Mi Tienda (`mi-tienda.html`)**
   - Complete store builder interface
   - Product management functionality  
   - Real-time iframe preview
   - Ready to receive design updates

### ⚠️ What Needs Integration

1. **Communication Bridge** - PostMessage or direct function calls
2. **Style Application** - Dynamic CSS injection in Mi Tienda
3. **State Synchronization** - Keep both pages in sync
4. **Laravel Backend** - Save/load design settings

---

## Technical Architecture

### Data Flow

```
┌─────────────────┐    Design Changes    ┌──────────────────┐
│                 │ ─────────────────────▶ │                  │
│ Design Page     │                       │ Mi Tienda Page   │
│ (diseno.html)   │ ◀───── Confirmation ──│ (mi-tienda.html) │
│                 │                       │                  │
└─────────────────┘                       └──────────────────┘
        │                                          │
        │ Save Settings                            │ Apply Styles
        ▼                                          ▼
┌─────────────────┐                       ┌──────────────────┐
│ Laravel Backend │                       │ Public Profile   │
│ (Database)      │                       │ (Iframe Preview) │
└─────────────────┘                       └──────────────────┘
```

### Design Settings Structure

```javascript
const designSettings = {
    theme_id: "dark",
    theme_name: "Tema Oscuro",
    background: "#000000",
    background_type: "solid", // "solid" | "gradient"
    text_color: "#FFFFFF",
    text_secondary_color: "#A0A0A0",
    font_family: "Inter",
    button_color: "rgba(255, 255, 255, 0.1)",
    button_font_color: "#FFFFFF",
    button_hover_color: "rgba(255, 255, 255, 0.15)"
};
```

---

## Integration Methods

### Method 1: PostMessage Communication (Recommended)

**Use Case:** When Design and Mi Tienda are in separate pages/iframes

#### In Design Page (`diseno.js`)

```javascript
// Function to send design changes to Mi Tienda
function applyDesignToMiTienda(designSettings) {
    // Method 1: Direct iframe communication
    const miTiendaIframe = document.getElementById('mi-tienda-iframe');
    if (miTiendaIframe) {
        const message = {
            type: 'DESIGN_UPDATE',
            settings: designSettings,
            timestamp: Date.now()
        };
        miTiendaIframe.contentWindow.postMessage(message, '*');
    }
    
    // Method 2: Parent window communication
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'DESIGN_UPDATE',
            settings: designSettings
        }, '*');
    }
    
    // Method 3: Local storage for persistence
    localStorage.setItem('design_settings', JSON.stringify(designSettings));
}

// Call this function whenever design changes
function handleDesignChange(newDesignSettings) {
    editableCreator.design_settings = newDesignSettings;
    updatePreview();
    applyDesignToMiTienda(newDesignSettings); // Real-time sync
}
```

#### In Mi Tienda Page (`mi-tienda.js`)

```javascript
// Listener for design updates
window.addEventListener('message', function(event) {
    if (event.data.type === 'DESIGN_UPDATE') {
        const designSettings = event.data.settings;
        applyDesignSettings(designSettings);
        console.log('Design updated from Design Customizer:', designSettings);
    }
});

// Function to apply design settings to Mi Tienda
function applyDesignSettings(settings) {
    // Update CSS custom properties
    document.documentElement.style.setProperty('--primary-bg', settings.background);
    document.documentElement.style.setProperty('--text-color', settings.text_color);
    document.documentElement.style.setProperty('--text-secondary', settings.text_secondary_color);
    document.documentElement.style.setProperty('--button-bg', settings.button_color);
    document.documentElement.style.setProperty('--button-text', settings.button_font_color);
    document.documentElement.style.setProperty('--font-family', settings.font_family);
    
    // Update iframe preview
    updateProfileUI();
    
    // Store for persistence
    localStorage.setItem('applied_design_settings', JSON.stringify(settings));
}

// Load design settings on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedSettings = localStorage.getItem('applied_design_settings');
    if (savedSettings) {
        applyDesignSettings(JSON.parse(savedSettings));
    }
});
```

### Method 2: Direct Function Calls (Same Page)

**Use Case:** When both components are on the same page

```javascript
// Global design state manager
window.DesignManager = {
    currentSettings: null,
    listeners: [],
    
    updateDesign: function(settings) {
        this.currentSettings = settings;
        this.listeners.forEach(callback => callback(settings));
    },
    
    subscribe: function(callback) {
        this.listeners.push(callback);
    }
};

// In Design component
function handleDesignChange(newSettings) {
    window.DesignManager.updateDesign(newSettings);
}

// In Mi Tienda component  
window.DesignManager.subscribe(function(settings) {
    applyDesignSettings(settings);
});
```

---

## Laravel Backend Integration

### Database Schema

```php
// Migration: add_design_settings_to_creators_table
Schema::table('creators', function (Blueprint $table) {
    $table->json('design_settings')->nullable();
});
```

### Controller Methods

```php
// CreatorController.php
public function updateDesignSettings(Request $request, $creatorId)
{
    $request->validate([
        'design_settings' => 'required|array',
        'design_settings.theme_id' => 'required|string',
        'design_settings.background' => 'required|string',
        'design_settings.text_color' => 'required|string',
        // ... other validation rules
    ]);
    
    $creator = Creator::findOrFail($creatorId);
    $creator->design_settings = $request->design_settings;
    $creator->save();
    
    return response()->json([
        'success' => true,
        'message' => 'Design settings updated successfully',
        'data' => $creator->design_settings
    ]);
}

public function getDesignSettings($creatorId)
{
    $creator = Creator::findOrFail($creatorId);
    
    return response()->json([
        'success' => true,
        'data' => $creator->design_settings ?? $this->getDefaultDesignSettings()
    ]);
}

private function getDefaultDesignSettings()
{
    return [
        'theme_id' => 'dark',
        'theme_name' => 'Tema Oscuro',
        'background' => '#000000',
        'background_type' => 'solid',
        'text_color' => '#FFFFFF',
        'text_secondary_color' => '#A0A0A0',
        'font_family' => 'Inter',
        'button_color' => 'rgba(255, 255, 255, 0.1)',
        'button_font_color' => '#FFFFFF',
        'button_hover_color' => 'rgba(255, 255, 255, 0.15)'
    ];
}
```

### API Routes

```php
// routes/web.php or routes/api.php
Route::middleware(['auth'])->group(function () {
    Route::get('/creators/{creator}/design-settings', [CreatorController::class, 'getDesignSettings']);
    Route::put('/creators/{creator}/design-settings', [CreatorController::class, 'updateDesignSettings']);
});
```

### Blade Template Integration

```php
// design.blade.php
@extends('layouts.app')

@section('content')
<div id="designApp">
    <!-- Include the diseno.html content here -->
    @include('partials.design-customizer')
</div>

<script>
// Initialize with Laravel data
window.initialDesignSettings = @json($creator->design_settings ?? []);
window.creatorId = {{ $creator->id }};

// Override the Laravel helper with actual endpoints
window.Diseno.LaravelHelper.makeRequest = async function(endpoint, options = {}) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    return await fetch(endpoint, {
        ...options,
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        }
    }).then(response => response.json());
};
</script>
@endsection
```

---

## CSS Integration

### Dynamic CSS Variables Approach

```css
/* In Mi Tienda CSS */
:root {
    --primary-bg: #000000;
    --text-color: #FFFFFF;
    --text-secondary: #A0A0A0;
    --button-bg: rgba(255, 255, 255, 0.1);
    --button-text: #FFFFFF;
    --font-family: 'Inter';
}

.profile-container {
    background: var(--primary-bg);
    color: var(--text-color);
    font-family: var(--font-family);
}

.product-button {
    background: var(--button-bg);
    color: var(--button-text);
}

.secondary-text {
    color: var(--text-secondary);
}
```

### Dynamic Style Injection

```javascript
function injectCustomStyles(designSettings) {
    // Remove existing custom styles
    const existingStyle = document.getElementById('dynamic-design-styles');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Create new style element
    const style = document.createElement('style');
    style.id = 'dynamic-design-styles';
    style.textContent = `
        .profile-preview {
            background: ${designSettings.background} !important;
            color: ${designSettings.text_color} !important;
            font-family: ${designSettings.font_family} !important;
        }
        
        .product-item {
            background: ${designSettings.button_color} !important;
            color: ${designSettings.button_font_color} !important;
        }
        
        .product-item:hover {
            background: ${designSettings.button_hover_color} !important;
        }
        
        .secondary-text {
            color: ${designSettings.text_secondary_color} !important;
        }
    `;
    
    document.head.appendChild(style);
}
```

---

## Testing Integration

### Test Scenarios

1. **Real-time Updates**
   ```javascript
   // Test that changes in Design page immediately reflect in Mi Tienda
   function testRealtimeSync() {
       // Change color in Design page
       handleColorChange('text_color', '#ff0000');
       
       // Verify Mi Tienda updated
       setTimeout(() => {
           const textColor = getComputedStyle(document.documentElement)
               .getPropertyValue('--text-color');
           console.assert(textColor === '#ff0000', 'Real-time sync failed');
       }, 100);
   }
   ```

2. **Persistence Test**
   ```javascript
   // Test that settings persist across page reloads
   function testPersistence() {
       const testSettings = { theme_id: 'light', text_color: '#000000' };
       
       // Save settings
       localStorage.setItem('design_settings', JSON.stringify(testSettings));
       
       // Reload and verify
       location.reload();
       
       setTimeout(() => {
           const loaded = JSON.parse(localStorage.getItem('design_settings'));
           console.assert(loaded.theme_id === 'light', 'Persistence failed');
       }, 1000);
   }
   ```

3. **Laravel API Test**
   ```javascript
   // Test Laravel backend integration
   async function testLaravelAPI() {
       const testSettings = { theme_id: 'dark', background: '#000000' };
       
       try {
           const response = await fetch('/api/creators/123/design-settings', {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   'X-CSRF-TOKEN': document.querySelector('[name="csrf-token"]').content
               },
               body: JSON.stringify({ design_settings: testSettings })
           });
           
           const result = await response.json();
           console.assert(result.success === true, 'Laravel API integration failed');
       } catch (error) {
           console.error('API test failed:', error);
       }
   }
   ```

---

## Troubleshooting

### Common Issues

1. **PostMessage not working**
   - Check iframe `src` domain matches
   - Verify `targetOrigin` parameter in postMessage
   - Ensure listeners are set up before sending messages

2. **Styles not applying**
   - Check CSS specificity conflicts
   - Verify CSS custom properties are supported
   - Use `!important` for dynamic styles if needed

3. **Settings not persisting**
   - Verify Laravel CSRF token is included
   - Check database column type allows JSON storage
   - Ensure proper JSON serialization

### Debug Tools

```javascript
// Debug helper for integration testing
window.DesignDebugger = {
    logMessages: true,
    logStyleChanges: true,
    
    interceptPostMessage: function() {
        const originalPostMessage = window.postMessage;
        window.postMessage = function(message, targetOrigin) {
            if (this.logMessages) {
                console.log('PostMessage sent:', message, 'to:', targetOrigin);
            }
            return originalPostMessage.call(this, message, targetOrigin);
        }.bind(this);
    },
    
    watchStyleChanges: function() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (this.logStyleChanges) {
                        console.log('Style changed on:', mutation.target, 'to:', mutation.target.style.cssText);
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ['style']
        });
    }
};
```

---

## Implementation Checklist

### For Frontend Developer

- [ ] Add postMessage listener to Mi Tienda page
- [ ] Implement `applyDesignSettings()` function in Mi Tienda
- [ ] Set up CSS custom properties for dynamic styling
- [ ] Test real-time communication between pages
- [ ] Implement localStorage backup for settings
- [ ] Add error handling for message communication

### For Laravel Developer

- [ ] Create database migration for design_settings column
- [ ] Implement API endpoints for saving/loading settings
- [ ] Add validation rules for design settings
- [ ] Create Blade templates with CSRF token integration
- [ ] Set up proper authentication middleware
- [ ] Test API endpoints with frontend integration
- [ ] Implement proper error responses and logging

### For Integration Testing

- [ ] Test postMessage communication
- [ ] Verify CSS changes apply correctly
- [ ] Test persistence across page reloads
- [ ] Check Laravel API integration
- [ ] Test responsive behavior on mobile
- [ ] Verify all 16 themes work correctly
- [ ] Test error scenarios and fallbacks

---

## Conclusion

The Design-Mi Tienda integration is **architecturally prepared** and requires primarily:

1. **PostMessage listeners** in Mi Tienda
2. **CSS variable implementation** for dynamic styling  
3. **Laravel API integration** for persistence
4. **Testing and debugging** of the communication flow

The foundation is solid, and integration should be straightforward following this technical specification.