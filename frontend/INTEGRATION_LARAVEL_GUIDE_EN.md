# 🚀 Laravel Integration Guide - My Store Builder

## 📋 Overview

This project is a "linktree" style profile page builder developed in **HTML, CSS and vanilla JavaScript**, specifically designed to be integrated with **Laravel Blade + Bootstrap 5**.

### ✨ Main Features
- ✅ **100% Compatible with Laravel Blade**
- ✅ **Bootstrap 5 integrated**
- ✅ **Vanilla JavaScript** (no React/Vue dependencies)
- ✅ **Responsive Design**
- ✅ **Robust modal system**
- ✅ **LocalStorage for persistence**
- ✅ **Drag & Drop for product reordering**

---

## 📁 File Structure for Delivery

### **CORE FILES (Required):**
```
frontend/public/
├── mi-tienda.html           # ⭐ MAIN BLADE TEMPLATE
├── public-product.html      # ⭐ PUBLIC PRODUCT TEMPLATE  
└── js/
    └── mi-tienda.js        # ⭐ MAIN JAVASCRIPT LOGIC
```

### **OPTIONAL FILES:**
```
frontend/public/
├── index.html              # Simple redirector
└── css/                    
    └── modern-design.css   # Additional CSS (not currently used)
```

---

## 🔄 Laravel Integration Process

### **STEP 1: Convert to Blade Templates**

#### **1.1. mi-tienda.html → resources/views/mi-tienda.blade.php**
```bash
# Copy file and rename
cp frontend/public/mi-tienda.html resources/views/mi-tienda.blade.php
```

#### **1.2. public-product.html → resources/views/public-product.blade.php**
```bash
cp frontend/public/public-product.html resources/views/public-product.blade.php
```

### **STEP 2: Move Assets**
```bash
# Move JavaScript
cp frontend/public/js/mi-tienda.js public/js/mi-tienda.js
```

### **STEP 3: Modify References in Blade**

#### **In mi-tienda.blade.php change:**
```html
<!-- FROM: -->
<script src="js/mi-tienda.js"></script>

<!-- TO: -->
<script src="{{ asset('js/mi-tienda.js') }}"></script>
```

---

## 🎨 CSS Management and Styling

### **📍 Current State:**
The CSS is **embedded within HTML files** for performance and simplicity reasons.

### **📂 CSS Location:**
```html
<!-- mi-tienda.html -->
<style>
    /* === CSS VARIABLES === */
    :root {
        --primary-color: #0d6efd;
        --success-color: #198754;
        --danger-color: #dc3545;
    }
    
    /* === MAIN LAYOUT === */
    .main-container { display: flex; min-height: 100vh; }
    .left-panel { flex: 0 0 45%; background: white; }
    .right-panel { flex: 0 0 55%; background: #F3F4F6; }
    
    /* ... ~1200 lines of CSS ... */
</style>
```

### **🔄 Integration Options:**

#### **OPTION 1: Keep CSS Embedded (Recommended)**
**✅ Pros:**
- Better performance (fewer HTTP requests)
- Zero configuration
- Everything self-contained

**❌ Cons:**  
- Heavier HTML (~50KB additional)
- CSS not independently cacheable

**Implementation:**
```php
<!-- mi-tienda.blade.php - No changes -->
<style>
    /* All CSS stays here */
</style>
```

#### **OPTION 2: Extract CSS to Separate File**
**✅ Pros:**
- Cleaner HTML
- CSS cacheable separately  
- Reusable in multiple views

**❌ Cons:**
- Additional HTTP request
- Additional Laravel configuration

**Implementation:**
```bash
# 1. Extract CSS
mkdir -p public/css
# Copy content between <style>...</style> to:
public/css/mi-tienda.css
```

```php
<!-- mi-tienda.blade.php -->
@push('styles')
<link href="{{ asset('css/mi-tienda.css') }}" rel="stylesheet">
@endpush
<!-- Remove complete <style> tag -->
```

### **🎨 Customization and Theming**

#### **Main CSS Variables:**
```css
:root {
    --primary-color: #0d6efd;    /* Main buttons */
    --success-color: #198754;    /* Success states */
    --danger-color: #dc3545;     /* Delete buttons */
}

/* Main background */
.right-panel {
    background: #F3F4F6;    /* Custom light gray */
}
```

#### **For Dynamic Theming:**
```php
<!-- Option: Variables from Laravel config -->
<style>
:root {
    --primary-color: {{ config('app.theme.primary', '#0d6efd') }};
    --success-color: {{ config('app.theme.success', '#198754') }};
    --danger-color: {{ config('app.theme.danger', '#dc3545') }};
}
</style>
```

### **📱 Responsiveness**

The CSS includes **complete media queries**:
```css
/* Mobile First approach already implemented */
@media (max-width: 768px) {
    .main-container { flex-direction: column; }
    .left-panel, .right-panel { flex: none; }
    .phone-frame { transform: scale(0.8); }
}

@media (max-width: 576px) {
    .profile-header { padding: 1rem; }
    .products-section { padding: 1rem; }
}
```

---

## 🏗️ Recommended HTML/CSS Structure

### **Main Layout (mi-tienda.blade.php):**
```php
@extends('layouts.app')

@section('content')
<div class="container-fluid p-0">
    <!-- ALL CURRENT HTML CONTENT -->
    <div class="main-container">
        <div class="left-panel">
            <!-- Left panel with products -->
        </div>
        <div class="right-panel">  
            <!-- Right panel with preview -->
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/mi-tienda.js') }}"></script>
@endpush
```

---

## 🔗 Laravel Backend Integration

### **STEP 1: Database Models**

#### **User Model (extend existing):**
```php
// app/Models/User.php
class User extends Authenticatable {
    protected $fillable = [
        'name', 'email', 'username', 'bio', 'avatar_url'
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function socialLinks() {
        return $this->hasMany(SocialLink::class);
    }
}
```

#### **Product Model:**
```php
// app/Models/Product.php
class Product extends Model {
    protected $fillable = [
        'user_id', 'type', 'title', 'subtitle', 'description', 
        'price', 'currency', 'url', 'image_url', 'is_active', 
        'sort_order', 'form_data'
    ];

    protected $casts = [
        'form_data' => 'json',
        'is_active' => 'boolean'
    ];

    // Supported product types
    const TYPES = [
        'link' => 'External Link',
        'digital_product' => 'Digital Product',
        'consultation' => 'Consultation Call', 
        'course' => 'Digital Course',
        'membership' => 'Recurring Membership'
    ];
}
```

#### **SocialLink Model:**
```php
// app/Models/SocialLink.php  
class SocialLink extends Model {
    protected $fillable = [
        'user_id', 'platform', 'url', 'is_active'
    ];

    const PLATFORMS = [
        'tiktok', 'instagram', 'youtube', 'spotify', 
        'discord', 'twitter', 'link'
    ];
}
```

### **STEP 2: Migrations**
```php
// database/migrations/xxxx_create_products_table.php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->enum('type', ['link', 'digital_product', 'consultation', 'course', 'membership']);
    $table->string('title');
    $table->string('subtitle')->nullable();
    $table->text('description')->nullable();
    $table->decimal('price', 10, 2)->nullable();
    $table->string('currency', 3)->default('USD');
    $table->string('url')->nullable();
    $table->string('image_url')->nullable();
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->json('form_data')->nullable(); // For type-specific data
    $table->timestamps();
});
```

### **STEP 3: API Routes**
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    // Profile endpoints
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);

    // Products endpoints  
    Route::apiResource('products', ProductController::class);
    Route::post('/products/reorder', [ProductController::class, 'reorder']);

    // Social Links endpoints
    Route::apiResource('social-links', SocialLinkController::class);
});

// Public routes
Route::get('/u/{username}', [PublicProfileController::class, 'show']);
```

### **STEP 4: Controllers**

#### **ProfileController:**
```php
// app/Http/Controllers/ProfileController.php
class ProfileController extends Controller {
    public function show() {
        return response()->json([
            'profile' => auth()->user()->only(['name', 'username', 'bio', 'avatar_url']),
            'social_links' => auth()->user()->socialLinks()->where('is_active', true)->get()
        ]);
    }

    public function update(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username,' . auth()->id(),
            'bio' => 'nullable|string|max:500'
        ]);

        auth()->user()->update($validated);
        return response()->json(['success' => true]);
    }
}
```

#### **ProductController:**
```php
// app/Http/Controllers/ProductController.php
class ProductController extends Controller {
    public function index() {
        return auth()->user()->products()
            ->orderBy('sort_order')
            ->get();
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'type' => 'required|in:link,digital_product,consultation,course,membership',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'url' => 'nullable|url',
            'form_data' => 'nullable|array'
        ]);

        $product = auth()->user()->products()->create($validated);
        return response()->json($product);
    }

    public function reorder(Request $request) {
        $validated = $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.sort_order' => 'required|integer'
        ]);

        foreach ($validated['products'] as $item) {
            Product::where('id', $item['id'])
                   ->where('user_id', auth()->id())
                   ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['success' => true]);
    }
}
```

---

## ⚡ Required JavaScript Modifications

### **CHANGE 1: Replace localStorage with APIs**

#### **getCurrentUser() function - MODIFY:**
```javascript
// BEFORE (localStorage):
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{"username": "tradingsharks"}');
}

// AFTER (API):
async function getCurrentUser() {
    try {
        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Accept': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return { username: 'tradingsharks' }; // Fallback
    }
}
```

#### **saveProduct() function - CREATE NEW:**
```javascript
async function saveProduct(productData) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            const product = await response.json();
            showToast('Product saved successfully', 'success');
            return product;
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error saving product', 'danger');
    }
}
```

### **CHANGE 2: Auth Token Helper**
```javascript
// ADD at beginning of mi-tienda.js:
function getAuthToken() {
    return document.querySelector('meta[name="api-token"]')?.content || 
           localStorage.getItem('auth_token');
}
```

---

## 🔒 Security and Authentication

### **STEP 1: Middleware in mi-tienda.blade.php**
```php
// In controller that renders the view:
class MyStoreController extends Controller {
    public function __construct() {
        $this->middleware('auth');
    }

    public function index() {
        return view('mi-tienda', [
            'user' => auth()->user(),
            'products' => auth()->user()->products()->orderBy('sort_order')->get(),
            'socialLinks' => auth()->user()->socialLinks()->where('is_active', true)->get()
        ]);
    }
}
```

### **STEP 2: CSRF Token in Blade**
```php
<!-- Add to <head> of mi-tienda.blade.php: -->
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="api-token" content="{{ auth()->user()->createToken('api')->plainTextToken }}">
<meta name="user-data" content="{{ json_encode(auth()->user()->only(['id', 'name', 'username', 'bio', 'avatar_url'])) }}">
```

---

## 📱 Public URL and Routing

### **Route for Public Profile:**
```php
// routes/web.php
Route::get('/u/{username}', [PublicProfileController::class, 'show'])
     ->name('profile.public');
```

### **PublicProfileController:**
```php
class PublicProfileController extends Controller {
    public function show($username) {
        $user = User::where('username', $username)
                   ->with(['products' => fn($q) => $q->where('is_active', true)->orderBy('sort_order')])
                   ->firstOrFail();

        return view('public-product', compact('user'));
    }
}
```

---

## 🐛 Testing and Debugging

### **Recommended Tests:**
```php
// tests/Feature/MyStoreTest.php
class MyStoreTest extends TestCase {
    public function test_authenticated_user_can_access_builder() {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->get('/mi-tienda');
        
        $response->assertStatus(200)
                 ->assertViewIs('mi-tienda');
    }

    public function test_user_can_create_product() {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->postJson('/api/products', [
            'type' => 'digital_product',
            'title' => 'Test Product',
            'price' => 29.99
        ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['title' => 'Test Product']);
    }
}
```

---

## ⚠️ Important Considerations

### **1. Browser Compatibility:**
- ✅ Chrome 80+
- ✅ Firefox 75+ 
- ✅ Safari 13+
- ✅ Edge 80+

### **2. External Dependencies:**
```html
<!-- Already included in HTML, verify they're available: -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
```

### **3. Performance:**
- JavaScript file is ~5KB minified
- CSS is embedded in HTML for better performance
- LocalStorage can be replaced with API calls

---

## 🚀 Deploy and Configuration

### **Environment Variables (.env):**
```env
# URLs for public links
APP_DOMAIN=clickmy.link
PUBLIC_PROFILE_BASE_URL=${APP_DOMAIN}/u

# File configuration
MAX_AVATAR_SIZE=2048  # KB
ALLOWED_AVATAR_TYPES=jpg,jpeg,png,gif
```

### **Custom config:**
```php
// config/mystore.php
return [
    'domain' => env('APP_DOMAIN', 'localhost'),
    'public_url_base' => env('PUBLIC_PROFILE_BASE_URL', 'localhost/u'),
    'max_products_per_user' => 50,
    'supported_currencies' => ['USD', 'EUR', 'MXN'],
    'product_types' => [
        'link' => 'External Link',
        'digital_product' => 'Digital Product', 
        'consultation' => 'Consultation Call',
        'course' => 'Digital Course',
        'membership' => 'Recurring Membership'
    ]
];
```

---

## ✅ Final Checklist

### **Before Deploy:**
- [ ] Models and migrations created
- [ ] Controllers implemented  
- [ ] Routes defined
- [ ] JavaScript modified to use APIs
- [ ] CSRF tokens configured
- [ ] Basic tests working
- [ ] Environment variables configured

### **Post-Deploy:**
- [ ] Verify public URLs working
- [ ] Test product creation
- [ ] Verify drag & drop
- [ ] Validate responsive design
- [ ] Confirm modal functionality

---

## 🆘 Support and Troubleshooting

### **Common Issues:**

#### **1. Modals don't open:**
- Verify Bootstrap JS is loaded
- Check JavaScript errors in console
- Confirm element IDs match

#### **2. API calls fail:**
- Verify CSRF token
- Confirm auth middleware works
- Check authorization headers

#### **3. Drag & Drop doesn't work:**
- Confirm SortableJS is loaded
- Verify elements have correct classes
- Check reordering permissions

---

This guide covers 90% of the integration process. For specific questions, review the source code of `mi-tienda.js` where each function is documented with detailed comments.