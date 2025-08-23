<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\MiTiendaApiController;
use App\Http\Middleware\VerifyCsrfToken;

Route::middleware(['web','auth'])
    ->withoutMiddleware([VerifyCsrfToken::class])
    ->prefix('user/api/mi-tienda')
    ->group(function(){
        // Existing routes
        Route::get('/ping', [MiTiendaApiController::class,'ping'])->name('user.mitienda.ping');
        Route::get('/state', [MiTiendaApiController::class,'stateGet'])->name('user.mitienda.state');
        Route::get('/inventory', [MiTiendaApiController::class,'inventory'])->name('user.mitienda.inventory');
        Route::post('/state', [MiTiendaApiController::class,'statePost'])->name('user.mitienda.save');
        
        // Dashboard Analytics
        Route::get('/dashboard-stats', [MiTiendaApiController::class,'dashboardStats'])->name('user.mitienda.dashboard.stats');
        
        // Profile Management - NEW ROUTES NEEDED BY FRONTEND
        Route::get('/profile', [MiTiendaApiController::class,'profileGet'])->name('user.mitienda.profile.get');
        Route::post('/profile', [MiTiendaApiController::class,'profilePost'])->name('user.mitienda.profile.post');
        
        // Products CRUD - NEW ROUTES NEEDED BY FRONTEND
        Route::get('/products', [MiTiendaApiController::class,'productsGet'])->name('user.mitienda.products.get');
        Route::post('/products', [MiTiendaApiController::class,'productsPost'])->name('user.mitienda.products.post');
        Route::put('/products', [MiTiendaApiController::class,'productsPut'])->name('user.mitienda.products.put');
        Route::delete('/products', [MiTiendaApiController::class,'productsDelete'])->name('user.mitienda.products.delete');
        
        // Products Reorder - NEW ROUTE NEEDED BY FRONTEND
        Route::post('/products/reorder', [MiTiendaApiController::class,'productsReorder'])->name('user.mitienda.products.reorder');
    });