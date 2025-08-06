# 🚀 Guía de Integración Laravel - Mi Tienda Builder

## 📋 Descripción General

Este proyecto es un constructor de páginas de perfil tipo "linktree" desarrollado en **HTML, CSS y JavaScript vanilla**, específicamente diseñado para ser integrado con **Laravel Blade + Bootstrap 5**.

### ✨ Características Principales
- ✅ **100% Compatible con Laravel Blade**
- ✅ **Bootstrap 5 integrado**
- ✅ **JavaScript Vanilla** (sin dependencias de React/Vue)
- ✅ **Responsive Design**
- ✅ **Sistema de modales robusto**
- ✅ **LocalStorage para persistencia**
- ✅ **Drag & Drop para reordenar productos**

---

## 📁 Estructura de Archivos para Entregar

### **ARCHIVOS CORE (Obligatorios):**
```
frontend/public/
├── mi-tienda.html           # ⭐ TEMPLATE PRINCIPAL BLADE
├── public-product.html      # ⭐ TEMPLATE PRODUCTO PÚBLICO  
└── js/
    └── mi-tienda.js        # ⭐ LÓGICA PRINCIPAL JAVASCRIPT
```

### **ARCHIVOS OPCIONALES:**
```
frontend/public/
├── index.html              # Redirector simple
└── css/                    
    └── modern-design.css   # CSS adicional (no usado actualmente)
```

---

## 🔄 Proceso de Integración Laravel

### **PASO 1: Conversión a Blade Templates**

#### **1.1. mi-tienda.html → resources/views/mi-tienda.blade.php**
```bash
# Copiar archivo y renombrar
cp frontend/public/mi-tienda.html resources/views/mi-tienda.blade.php
```

#### **1.2. public-product.html → resources/views/public-product.blade.php**
```bash
cp frontend/public/public-product.html resources/views/public-product.blade.php
```

### **PASO 2: Mover Assets**
```bash
# Mover JavaScript
cp frontend/public/js/mi-tienda.js public/js/mi-tienda.js
```

### **PASO 3: Modificar Referencias en Blade**

#### **En mi-tienda.blade.php cambiar:**
```html
<!-- DE: -->
<script src="js/mi-tienda.js"></script>

<!-- A: -->
<script src="{{ asset('js/mi-tienda.js') }}"></script>
```

---

## 🏗️ Estructura HTML/CSS Recomendada

### **Layout Principal (mi-tienda.blade.php):**
```php
@extends('layouts.app')

@section('content')
<div class="container-fluid p-0">
    <!-- TODO EL CONTENIDO DEL HTML ACTUAL -->
    <div class="main-container">
        <div class="left-panel">
            <!-- Panel izquierdo con productos -->
        </div>
        <div class="right-panel">  
            <!-- Panel derecho con preview -->
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/mi-tienda.js') }}"></script>
@endpush
```

---

## 🔗 Integración con Backend Laravel

### **PASO 1: Modelos de Base de Datos**

#### **Modelo User (extender existente):**
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

#### **Modelo Product:**
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

    // Tipos de productos soportados
    const TYPES = [
        'link' => 'Link Externo',
        'digital_product' => 'Producto Digital',
        'consultation' => 'Llamada de Consultoría', 
        'course' => 'Curso Digital',
        'membership' => 'Membresía Recurrente'
    ];
}
```

#### **Modelo SocialLink:**
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

### **PASO 2: Migraciones**
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
    $table->json('form_data')->nullable(); // Para datos específicos de cada tipo
    $table->timestamps();
});
```

### **PASO 3: API Routes**
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

### **PASO 4: Controllers**

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

## ⚡ Modificaciones JavaScript Requeridas

### **CAMBIO 1: Reemplazar localStorage con APIs**

#### **Función getCurrentUser() - MODIFICAR:**
```javascript
// ANTES (localStorage):
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{"username": "tradingsharks"}');
}

// DESPUÉS (API):
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

#### **Función saveProduct() - CREAR NUEVA:**
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
            showToast('Producto guardado exitosamente', 'success');
            return product;
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error al guardar producto', 'danger');
    }
}
```

### **CAMBIO 2: Auth Token Helper**
```javascript
// AGREGAR al inicio de mi-tienda.js:
function getAuthToken() {
    return document.querySelector('meta[name="api-token"]')?.content || 
           localStorage.getItem('auth_token');
}
```

---

## 🔒 Seguridad y Autenticación

### **PASO 1: Middleware en mi-tienda.blade.php**
```php
// En el controller que renderiza la vista:
class MiTiendaController extends Controller {
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

### **PASO 2: CSRF Token en Blade**
```php
<!-- Agregar en <head> de mi-tienda.blade.php: -->
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="api-token" content="{{ auth()->user()->createToken('api')->plainTextToken }}">
<meta name="user-data" content="{{ json_encode(auth()->user()->only(['id', 'name', 'username', 'bio', 'avatar_url'])) }}">
```

---

## 🎨 Personalización y Theming

### **Variables CSS Recomendadas:**
```php
<!-- En mi-tienda.blade.php, agregar después del CSS existente: -->
<style>
:root {
    --primary-color: {{ config('app.theme.primary', '#667eea') }};
    --secondary-color: {{ config('app.theme.secondary', '#764ba2') }};
    --background-color: {{ config('app.theme.background', '#F3F4F6') }};
}
</style>
```

---

## 📱 URL Pública y Routing

### **Route para Perfil Público:**
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

## 🐛 Testing y Debugging

### **Tests Recomendados:**
```php
// tests/Feature/MiTiendaTest.php
class MiTiendaTest extends TestCase {
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

## ⚠️ Consideraciones Importantes

### **1. Compatibilidad de Navegadores:**
- ✅ Chrome 80+
- ✅ Firefox 75+ 
- ✅ Safari 13+
- ✅ Edge 80+

### **2. Dependencias Externas:**
```html
<!-- Ya incluidas en el HTML, verificar que estén disponibles: -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
```

### **3. Performance:**
- El archivo JavaScript es ~5KB minificado
- CSS está embebido en HTML para mejor performance
- LocalStorage se puede reemplazar con API calls

---

## 🚀 Deploy y Configuración

### **Variables de Entorno (.env):**
```env
# URLs para el enlace público
APP_DOMAIN=clickmy.link
PUBLIC_PROFILE_BASE_URL=${APP_DOMAIN}/u

# Configuración de archivos
MAX_AVATAR_SIZE=2048  # KB
ALLOWED_AVATAR_TYPES=jpg,jpeg,png,gif
```

### **Config personalizada:**
```php
// config/mitienda.php
return [
    'domain' => env('APP_DOMAIN', 'localhost'),
    'public_url_base' => env('PUBLIC_PROFILE_BASE_URL', 'localhost/u'),
    'max_products_per_user' => 50,
    'supported_currencies' => ['USD', 'EUR', 'MXN'],
    'product_types' => [
        'link' => 'Link Externo',
        'digital_product' => 'Producto Digital', 
        'consultation' => 'Llamada de Consultoría',
        'course' => 'Curso Digital',
        'membership' => 'Membresía Recurrente'
    ]
];
```

---

## ✅ Checklist Final

### **Antes del Deploy:**
- [ ] Modelos y migraciones creados
- [ ] Controllers implementados  
- [ ] Routes definidas
- [ ] JavaScript modificado para usar APIs
- [ ] CSRF tokens configurados
- [ ] Tests básicos funcionando
- [ ] Variables de entorno configuradas

### **Post-Deploy:**
- [ ] Verificar URLs públicas funcionando
- [ ] Probar creación de productos
- [ ] Verificar drag & drop
- [ ] Validar responsive design
- [ ] Confirmar funcionalidad de modales

---

## 🆘 Soporte y Troubleshooting

### **Problemas Comunes:**

#### **1. Modales no se abren:**
- Verificar que Bootstrap JS esté cargado
- Revisar errores de JavaScript en consola
- Confirmar que IDs de elementos coincidan

#### **2. API calls fallan:**
- Verificar CSRF token
- Confirmar que middleware auth funcione
- Revisar headers de autorización

#### **3. Drag & Drop no funciona:**
- Confirmar que SortableJS esté cargado
- Verificar que elementos tengan clases correctas
- Revisar permisos de reordenamiento

---

Esta guía cubre el 90% del proceso de integración. Para dudas específicas, revisar el código fuente de `mi-tienda.js` donde cada función está documentada con comentarios detallados.