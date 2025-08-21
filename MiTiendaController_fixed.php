<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MiTiendaController extends Controller
{
    private function buildSettings()
    {
        // Simular configuración básica - ajustar según tu implementación real
        return (object) [
            'site_name' => config('app.name', 'Mi Tienda'),
            'site_logo' => asset('img/logo.png'),
        ];
    }

    public function index()
    {
        $settings = $this->buildSettings();
        $pageTitle = 'Mi Tienda Builder';
        $htmlFile = 'mi-tienda.html';
        
        return view('user.pages.mi-tienda.container', compact('settings', 'pageTitle', 'htmlFile'));
    }

    public function dashboard()
    {
        $settings = $this->buildSettings();
        $pageTitle = 'Dashboard';
        $htmlFile = 'dashboard.html';
        
        return view('user.pages.mi-tienda.container', compact('settings', 'pageTitle', 'htmlFile'));
    }

    public function ingresos()
    {
        $settings = $this->buildSettings();
        $pageTitle = 'Ingresos';
        $htmlFile = 'ingresos.html';
        
        return view('user.pages.mi-tienda.container', compact('settings', 'pageTitle', 'htmlFile'));
    }

    public function diseno()
    {
        $settings = $this->buildSettings();
        $pageTitle = 'Diseño';
        $htmlFile = 'diseno.html';
        
        return view('user.pages.mi-tienda.container', compact('settings', 'pageTitle', 'htmlFile'));
    }

    public function customers()
    {
        $settings = $this->buildSettings();
        $pageTitle = 'Clientes';
        $htmlFile = 'customers.html';
        
        return view('user.pages.mi-tienda.container', compact('settings', 'pageTitle', 'htmlFile'));
    }

    public function statistics()
    {
        $settings = $this->buildSettings();
        $pageTitle = 'Estadísticas';
        $htmlFile = 'statistics.html';
        
        return view('user.pages.mi-tienda.container', compact('settings', 'pageTitle', 'htmlFile'));
    }
}