        // MI TIENDA ROUTES - INTEGRATED WITH SIDEBAR
        Route::get('mi-tienda', [\App\Http\Controllers\User\MiTiendaController::class, 'index'])->name('mitienda');
        Route::get('mi-tienda/dashboard', [\App\Http\Controllers\User\MiTiendaController::class, 'dashboard'])->name('mitienda.dashboard');
        Route::get('mi-tienda/ingresos', [\App\Http\Controllers\User\MiTiendaController::class, 'ingresos'])->name('mitienda.ingresos');
        Route::get('mi-tienda/diseno', [\App\Http\Controllers\User\MiTiendaController::class, 'diseno'])->name('mitienda.diseno');
        Route::get('mi-tienda/customers', [\App\Http\Controllers\User\MiTiendaController::class, 'customers'])->name('mitienda.customers');
        Route::get('mi-tienda/statistics', [\App\Http\Controllers\User\MiTiendaController::class, 'statistics'])->name('mitienda.statistics');

        // MI TIENDA API ROUTES - BACKEND INTEGRATION
        Route::prefix('api/mi-tienda')->group(function () {
            Route::get('ping', [MiTiendaApiController::class, 'ping'])->name('mitienda.ping');
            Route::get('state', [MiTiendaApiController::class, 'stateGet'])->name('mitienda.state.get');
            Route::post('state', [MiTiendaApiController::class, 'statePost'])->name('mitienda.state.post');
            Route::get('inventory', [MiTiendaApiController::class, 'inventory'])->name('mitienda.inventory');
        });